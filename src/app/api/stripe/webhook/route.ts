import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use service role for bypassing RLS in webhooks
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentSucceeded(invoice);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;

    if (!userId || !session.subscription) return;

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await supabaseAdmin
        .from('profiles')
        .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_plan: plan,
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', userId);
}

import { STRIPE_PRICE_IDS } from '@/lib/stripe/plans';

function getPlanFromPriceId(priceId: string): 'pro' | 'agency' | 'free' {
    if (priceId === STRIPE_PRICE_IDS.pro_monthly || priceId === STRIPE_PRICE_IDS.pro_yearly) return 'pro';
    if (priceId === STRIPE_PRICE_IDS.agency_monthly || priceId === STRIPE_PRICE_IDS.agency_yearly) return 'agency';
    return 'free';
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Get the price ID from the first subscription item
    const priceId = subscription.items.data[0]?.price.id;

    if (!priceId) {
        console.error('Webhook: No price ID found in subscription items');
        return;
    }

    const plan = getPlanFromPriceId(priceId);
    console.log(`Webhook: Subscription updated. Customer: ${customerId}, New Plan: ${plan}, Status: ${subscription.status}`);

    // Find user by customer ID
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('Webhook: No profile found for customer:', customerId);
        return;
    }

    await supabaseAdmin
        .from('profiles')
        .update({
            subscription_status: subscription.status,
            subscription_plan: plan,
            subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', profile.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) return;

    // Downgrade to free
    await supabaseAdmin
        .from('profiles')
        .update({
            subscription_status: 'canceled',
            subscription_plan: 'free',
            subscription_period_end: null,
        })
        .eq('id', profile.id);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Optional: Send confirmation email or update payment history
    console.log('Payment succeeded for invoice:', invoice.id);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    // Optional: Send payment failed notification
    console.log('Payment failed for invoice:', invoice.id);
}
