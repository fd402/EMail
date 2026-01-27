import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { getPriceId } from '@/lib/stripe/plans';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        console.log('[Checkout] Starting checkout process...');

        // DEBUG: Check if cookies are present
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll().map(c => c.name);
        console.log('[Checkout] Cookies received:', allCookies);

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Checkout] Auth error:', authError);
            console.error('[Checkout] User is null. Session missing?');
            return NextResponse.json({ error: 'Unauthorized - Please log in again' }, { status: 401 });
        }
        console.log('[Checkout] User authenticated:', user.id);

        const { plan, period } = await req.json() as {
            plan: 'pro' | 'agency';
            period: 'monthly' | 'yearly'
        };

        if (!plan || !period) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, subscription_plan')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            console.log('[Checkout] Creating new Stripe customer...');
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_user_id: user.id },
            });
            customerId = customer.id;

            // SAFE SAVE: If profile exists, use UPDATE (safest). If not, UPSERT.
            if (profile) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ stripe_customer_id: customerId })
                    .eq('id', user.id);
                if (updateError) console.error('[Checkout] Update Customer ID failed:', updateError);
            } else {
                const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        stripe_customer_id: customerId,
                        email: user.email,
                        updated_at: new Date().toISOString()
                    });
                if (upsertError) console.error('[Checkout] Upsert Profile failed:', upsertError);
            }
        } else {
            console.log('[Checkout] Found existing Customer:', customerId);
        }

        // PREVENT DOUBLE SUBSCRIPTIONS:
        // If user already has a paid plan (not 'free'), send them to Customer Portal to upgrade/change plan
        if (profile?.subscription_plan && profile.subscription_plan !== 'free') {
            console.log('[Checkout] User has existing paid plan:', profile.subscription_plan);
            console.log('[Checkout] Redirecting to Customer Portal for upgrade/management...');

            const portalSession = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/editor`,
            });

            return NextResponse.json({ url: portalSession.url });
        }

        // Get the price ID for the selected plan and period
        const priceId = getPriceId(plan, period);

        if (!priceId) {
            console.error('[Checkout] Invalid price ID for plan:', plan, period);
            return NextResponse.json({ error: 'Invalid plan or period' }, { status: 400 });
        }

        // Create Stripe Checkout Session
        console.log('[Checkout] Creating transaction session...');
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/editor?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/editor`,
            metadata: {
                user_id: user.id,
                plan,
                period,
            },
        });
        console.log('[Checkout] Session created:', session.id);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[Checkout] CRITICAL ERROR:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
