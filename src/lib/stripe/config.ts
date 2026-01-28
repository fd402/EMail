import Stripe from 'stripe';

// Prevent build errors if key is missing during static generation
// The key is still required for runtime functionality
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});
