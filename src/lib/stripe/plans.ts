export type SubscriptionPlan = 'free' | 'pro' | 'agency';
export type BillingPeriod = 'monthly' | 'yearly';

export interface PlanConfig {
    name: string;
    price: {
        monthly: number;
        yearly: number;
    };
    features: string[];
    limits: {
        aiGenerations: number | 'unlimited';
        teamMembers: number;
        templates: number | 'unlimited';
        removeBranding: boolean;
    };
}

export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
    free: {
        name: 'Free',
        price: {
            monthly: 0,
            yearly: 0,
        },
        features: [
            '3 Project Saves',
            '3 Basic Templates',
            'Basic Email Blocks',
            'Community support',
        ],
        limits: {
            aiGenerations: 0,
            teamMembers: 1,
            templates: 'unlimited',
            removeBranding: false,
        },
    },
    pro: {
        name: 'Pro',
        price: {
            monthly: 25,
            yearly: 250, // Save 2 months
        },
        features: [
            'Unlimited Project Saves',
            'All 20+ Premium Templates',
            'Everything in Free',
            'AI Magic Generator (unlimited)',
            'Remove branding',
        ],
        limits: {
            aiGenerations: 'unlimited',
            teamMembers: 1,
            templates: 'unlimited',
            removeBranding: true,
        },
    },
    agency: {
        name: 'Agency',
        price: {
            monthly: 99,
            yearly: 990,
        },
        features: [
            'Everything in Pro',
            'Unlimited Team Members',
            'Custom Domain',
        ],
        limits: {
            aiGenerations: 'unlimited',
            teamMembers: 10,
            templates: 'unlimited',
            removeBranding: true,
        },
    },
};

// These will be populated after creating products in Stripe
export const STRIPE_PRICE_IDS = {
    pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    agency_monthly: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID || '',
    agency_yearly: process.env.STRIPE_AGENCY_YEARLY_PRICE_ID || '',
};

export function getPriceId(plan: 'pro' | 'agency', period: BillingPeriod): string {
    const key = `${plan}_${period}` as keyof typeof STRIPE_PRICE_IDS;
    return STRIPE_PRICE_IDS[key];
}

export function canAccessFeature(
    userPlan: SubscriptionPlan,
    feature: keyof PlanConfig['limits']
): boolean {
    const limits = PLANS[userPlan].limits;
    const featureValue = limits[feature];

    if (typeof featureValue === 'boolean') {
        return featureValue;
    }

    if (typeof featureValue === 'number') {
        return featureValue > 0;
    }

    return featureValue === 'unlimited';
}
