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
            'Unlimited templates',
            'Basic blocks',
            'Export to HTML',
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
            monthly: 19,
            yearly: 190, // Save 2 months
        },
        features: [
            'Everything in Free',
            'AI Magic Generator (unlimited)',
            'Remove branding',
            'Priority support',
            'Advanced blocks',
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
            monthly: 49,
            yearly: 490, // Save 2 months
        },
        features: [
            'Everything in Pro',
            'Team collaboration (5 seats)',
            'Custom branding',
            'API access',
            'White-label option',
            'Dedicated support',
        ],
        limits: {
            aiGenerations: 'unlimited',
            teamMembers: 5,
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
