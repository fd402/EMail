import { stripe } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function sync() {
    console.log('Syncing subscriptions...');

    // 1. Get all profiles with a stripe_customer_id
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .not('stripe_customer_id', 'is', null);

    if (!profiles) return console.log('No profiles found');

    for (const profile of profiles) {
        console.log(`Checking user ${profile.id}...`);

        try {
            const customer = await stripe.customers.retrieve(profile.stripe_customer_id, {
                expand: ['subscriptions']
            });

            if (customer.deleted) continue;

            const subscription = customer.subscriptions?.data[0];

            if (subscription) {
                // Map price ID to plan name
                const priceId = subscription.items.data[0].price.id;
                let plan = 'free';
                if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_PRO_YEARLY_PRICE_ID) plan = 'pro';
                if (priceId === process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_AGENCY_YEARLY_PRICE_ID) plan = 'agency';

                console.log(`-> Found active subscription: ${plan} (${subscription.status})`);

                await supabase.from('profiles').update({
                    subscription_plan: plan,
                    subscription_status: subscription.status,
                    stripe_subscription_id: subscription.id
                }).eq('id', profile.id);
            } else {
                console.log('-> No active subscription found. Resetting to free.');
                await supabase.from('profiles').update({
                    subscription_plan: 'free',
                    subscription_status: null,
                    stripe_subscription_id: null
                }).eq('id', profile.id);
            }
        } catch (err) {
            console.error('Error syncing user:', err);
        }
    }
    console.log('Done!');
}

sync();
