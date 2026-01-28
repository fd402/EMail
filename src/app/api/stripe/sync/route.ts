import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('session_id');

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. If Session ID is provided, verify purely based on that session
        if (sessionId) {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            // SECURITY: Ensure this session belongs to the requesting user
            if (session.metadata?.user_id !== user.id) {
                return NextResponse.json({ error: 'Invalid session user' }, { status: 403 });
            }

            if (session.status === 'complete' || session.payment_status === 'paid') {
                const subscriptionId = session.subscription as string;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // Update Profile
                await supabase.from('profiles').update({
                    stripe_subscription_id: subscription.id,
                    stripe_customer_id: subscription.customer as string,
                    subscription_status: subscription.status,
                    subscription_plan: session.metadata?.plan || 'pro',
                    subscription_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                }).eq('id', user.id);

                return NextResponse.json({
                    success: true,
                    plan: session.metadata?.plan || 'pro',
                    status: subscription.status
                });
            }
        }

        // 3. Fallback: Sync from Stripe Customer ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (profile?.stripe_customer_id) {
            const subscriptions = await stripe.subscriptions.list({
                customer: profile.stripe_customer_id,
                status: 'active',
                limit: 1,
            });

            if (subscriptions.data.length > 0) {
                const sub = subscriptions.data[0];

                // Determine plan from price ID
                let plan = 'pro';

                const priceId = sub.items.data[0].price.id;

                if (priceId === process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID ||
                    priceId === process.env.STRIPE_AGENCY_YEARLY_PRICE_ID) {
                    plan = 'agency';
                }

                await supabase.from('profiles').update({
                    stripe_subscription_id: sub.id,
                    subscription_status: sub.status,
                    subscription_plan: plan,
                    subscription_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                }).eq('id', user.id);

                return NextResponse.json({ success: true, plan, status: sub.status });
            }
        }

        return NextResponse.json({ success: false, message: 'No active subscription found' });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
