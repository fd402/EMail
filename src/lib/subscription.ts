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
            '3 Project Saves',
            '3 Basic Templates',
            'Basic Email Blocks',
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
            'Unlimited Project Saves',
            'All 20+ Premium Templates',
            'Everything in Free',
            'AI Magic Generator (unlimited)',
            'Remove Branding'
        ],
        allowedBlocks: [...BASIC_BLOCKS, ...PREMIUM_BLOCKS]
    },
    agency: {
        id: 'agency',
        name: 'Agency',
        price: '99 €',
        description: 'For power users and teams',
        features: [
            'Everything in Pro',
            'Unlimited Team Members',
            'Custom Domain',
        ],
        allowedBlocks: [...BASIC_BLOCKS, ...PREMIUM_BLOCKS]
    },
};

export const canUseBlock = (plan: SubscriptionPlan, blockType: BlockType): boolean => {
    // Pro and Agency have all blocks
    if (plan === 'pro' || plan === 'agency') return true;

    // Free plan check
    return PLANS.free.allowedBlocks.includes(blockType);
};
