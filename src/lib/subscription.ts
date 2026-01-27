import { BlockType } from '@/store/useEmailStore';

export type SubscriptionPlan = 'free' | 'pro' | 'agency';

export interface PlanFeature {
    id: string;
    description: string;
    included: boolean;
}

export interface PlanDetails {
    id: SubscriptionPlan;
    name: string;
    price: string;
    description: string;
    features: string[];
    allowedBlocks: BlockType[];
}

// Basic blocks allowed for everyone
export const BASIC_BLOCKS: BlockType[] = ['text', 'image', 'button', 'divider', 'row', 'social'];

// Premium blocks locked on Free
export const PREMIUM_BLOCKS: BlockType[] = [
    'video', 'html', 'menu', 'product-card', 'nps',
    'countdown', 'qr', 'table', 'image-text',
    'event', 'alert', 'code', 'pros-cons', 'audio'
];

export const PLANS: Record<SubscriptionPlan, PlanDetails> = {
    free: {
        id: 'free',
        name: 'Free',
        price: '0 €',
        description: 'Perfect for getting started',
        features: [
            'Basic Email Blocks',
            '3 Exports / Month',
            'Community Support'
        ],
        allowedBlocks: BASIC_BLOCKS
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: '19 €',
        description: 'For growing creators',
        features: [
            'All Premium Blocks (Video, Countdown, etc.)',
            'Unlimited Exports',
            'Priority Support',
            'Remove Branding'
        ],
        allowedBlocks: [...BASIC_BLOCKS, ...PREMIUM_BLOCKS]
    },
    agency: {
        id: 'agency',
        name: 'Agency',
        price: '49 €',
        description: 'For teams and agencies',
        features: [
            'Everything in Pro',
            'White Labeling',
            'Team Management',
            'Custom Domains'
        ],
        allowedBlocks: [...BASIC_BLOCKS, ...PREMIUM_BLOCKS]
    }
};

export const canUseBlock = (plan: SubscriptionPlan, blockType: BlockType): boolean => {
    // Agency and Pro have all blocks
    if (plan === 'agency' || plan === 'pro') return true;

    // Free plan check
    return PLANS.free.allowedBlocks.includes(blockType);
};
