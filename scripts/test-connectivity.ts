
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const STRIPE_SECRET_KEY = 'sk_test_51SpZPXACe2Va9qy32Hlo75pGWbz2YndBs7EggpulrFeNvbpHicsjVYOM5VbzxkqV1etnd7qLrricK3UPaX2xDOwv001eA7T9vi';
const PRICE_ID = 'price_1StCX6ACe2Va9qy3flfwE5SQ'; // Pro Monthly

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
});

async function testCheckout() {
    console.log('--- Testing Checkout Creation ---');
    try {
        // 1. Get a customer (or create one)
        const customers = await stripe.customers.list({ limit: 1 });
        let customerId = customers.data[0]?.id;

        if (!customerId) {
            console.log('Creating test customer...');
            const c = await stripe.customers.create({ email: 'test_script@example.com' });
            customerId = c.id;
        }
        console.log('Using Customer:', customerId);

        // 2. Create Session
        console.log('Creating Session with Price:', PRICE_ID);
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        console.log('✅ Checkout Session Created!');
        console.log('URL:', session.url);

    } catch (error) {
        console.error('❌ Checkout Failed:', error);
    }
}

testCheckout();
