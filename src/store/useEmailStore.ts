import { create } from 'zustand';
import { SubscriptionPlan, canUseBlock } from '@/lib/subscription';

export type BlockType = 'text' | 'image' | 'button' | 'divider' | 'row' | 'social' | 'video' | 'html' | 'menu' | 'product-card' | 'nps' | 'countdown' | 'qr' | 'table' | 'image-text' | 'event' | 'alert' | 'code' | 'pros-cons' | 'audio';

export interface Block {
    id: string;
    type: BlockType;
    content: Record<string, any>;
    styles: Record<string, any>;
}

// Snapshot of state for undo/redo
interface StateSnapshot {
    blocks: Block[];
    settings: {
        backgroundColor: string;
        workbenchColor: string;
        containerWidth?: string;
    };
}

interface EmailStore {
    blocks: Block[];
    selectedBlockId: string | null;

    // Undo/Redo history
    past: StateSnapshot[];
    future: StateSnapshot[];

    addBlock: (block: Block) => void;
    updateBlock: (id: string, updates: Partial<Block>) => void;
    removeBlock: (id: string) => void;
    selectBlock: (id: string | null) => void;
    moveBlock: (fromIndex: number, toIndex: number) => void;
    setBlocks: (blocks: Block[]) => void;

    settings: {
        backgroundColor: string;
        workbenchColor: string;
        containerWidth?: string;
    };
    updateSettings: (settings: Partial<{ backgroundColor: string; workbenchColor: string; containerWidth?: string }>) => void;

    loadTemplate: (blocks: Block[], settings?: { backgroundColor?: string }) => void;
    applyTheme: (themeName: string) => void;
    clearAllBlocks: () => void;

    // Undo/Redo actions
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Subscription
    subscription: SubscriptionPlan;
    setSubscription: (plan: SubscriptionPlan) => void;
    checkBlockAccess: (type: BlockType) => boolean;
}

// Premium initial data
const INITIAL_BLOCKS: Block[] = [
    {
        id: 'hero-header',
        type: 'text',
        content: { text: 'Design with Purpose.' },
        styles: {
            padding: '60px 40px 10px',
            textAlign: 'left',
            fontSize: '56px',
            fontWeight: '900',
            color: '#1e293b',
            lineHeight: '1.1',
            letterSpacing: '-2px'
        }
    },
    {
        id: 'hero-image',
        type: 'image',
        content: { src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', alt: 'Modern Workspace' },
        styles: { padding: '20px 40px', width: '100%', borderRadius: '32px' }
    },
    {
        id: 'hero-subheader',
        type: 'text',
        content: { text: 'Stop sending generic emails. Plainly gives you the tools to build high-converting, professional designs in seconds.' },
        styles: {
            padding: '10px 40px 40px',
            textAlign: 'left',
            fontSize: '18px',
            color: '#64748b',
            lineHeight: '1.6',
            fontWeight: '400'
        }
    },
    {
        id: 'hero-button',
        type: 'button',
        content: { text: 'Start Building Now', url: '#' },
        styles: {
            backgroundColor: '#6366f1',
            color: '#ffffff',
            padding: '16px 40px',
            borderRadius: '16px',
            textAlign: 'center',
            fontFamily: 'Arial',
            fontWeight: '900',
            fontSize: '18px'
        }
    }
];

const MAX_HISTORY = 50;

// Helper to create a snapshot of current state
const createSnapshot = (state: EmailStore): StateSnapshot => ({
    blocks: JSON.parse(JSON.stringify(state.blocks)),
    settings: JSON.parse(JSON.stringify(state.settings)),
});

// Helper to record state before mutation
const recordHistory = (set: any) => (mutator: (state: EmailStore) => Partial<EmailStore>) => {
    set((state: EmailStore) => {
        const snapshot = createSnapshot(state);
        const updates = mutator(state);

        return {
            ...updates,
            past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
            future: [], // Clear future on new action
        };
    });
};

// ... (previous code)

// --- Smart Themes ---
type ThemeName = 'Modern' | 'Elegant' | 'Bold' | 'Playful';

interface Theme {
    name: ThemeName;
    settings: {
        backgroundColor: string;
    };
    styles: {
        fontFamily: string;
        button: {
            backgroundColor: string;
            color: string;
            borderRadius: string;
            fontFamily: string;
            fontWeight?: string;
        };
        text: {
            color: string;
            fontFamily: string;
        };
    };
}

const THEMES: Record<ThemeName, Theme> = {
    Modern: {
        name: 'Modern',
        settings: { backgroundColor: '#ffffff' },
        styles: {
            fontFamily: 'Inter, sans-serif',
            button: { backgroundColor: '#6366f1', color: '#ffffff', borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
            text: { color: '#1e293b', fontFamily: 'Inter, sans-serif' }
        }
    },
    Elegant: {
        name: 'Elegant',
        settings: { backgroundColor: '#FDFCF8' },
        styles: {
            fontFamily: 'Georgia, serif',
            button: { backgroundColor: '#1c1917', color: '#d4af37', borderRadius: '2px', fontFamily: 'Georgia, serif' },
            text: { color: '#292524', fontFamily: 'Georgia, serif' }
        }
    },
    Bold: {
        name: 'Bold',
        settings: { backgroundColor: '#ffffff' },
        styles: {
            fontFamily: 'Oswald, sans-serif',
            button: { backgroundColor: '#000000', color: '#ffffff', borderRadius: '0px', fontFamily: 'Oswald, sans-serif', fontWeight: '900' },
            text: { color: '#000000', fontFamily: 'Oswald, sans-serif' }
        }
    },
    Playful: {
        name: 'Playful',
        settings: { backgroundColor: '#FFF0F5' },
        styles: {
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            button: { backgroundColor: '#ff4757', color: '#ffffff', borderRadius: '50px', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' },
            text: { color: '#2f3542', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }
        }
    }
};

export const useEmailStore = create<EmailStore>((set, get) => ({
    blocks: INITIAL_BLOCKS,
    selectedBlockId: null,
    past: [],
    future: [],
    settings: {
        backgroundColor: '#ffffff',
        workbenchColor: '#f8fafc',
        containerWidth: '600px',
    },

    applyTheme: (themeName: string) => recordHistory(set)((state) => {
        const theme = THEMES[themeName as ThemeName];
        if (!theme) return {};

        const newBlocks = state.blocks.map(block => {
            const updates: any = { styles: { ...block.styles } };

            // Update Text Fonts
            if (['text', 'image-text', 'list', 'pros-cons'].includes(block.type)) {
                updates.styles.fontFamily = theme.styles.text.fontFamily;
                updates.styles.color = theme.styles.text.color;
            }

            // Update Buttons
            if (block.type === 'button') {
                updates.styles.backgroundColor = theme.styles.button.backgroundColor;
                updates.styles.color = theme.styles.button.color;
                updates.styles.borderRadius = theme.styles.button.borderRadius;
                updates.styles.fontFamily = theme.styles.button.fontFamily;
                if (theme.styles.button.fontWeight) updates.styles.fontWeight = theme.styles.button.fontWeight;
            }

            // Update nested buttons (like in Product Card, Event)
            if (block.content.button || block.content.btnText) {
                // For complex blocks we might need deep merges, but for now we trust `styles` or specific content overrides
                // This acts as a high-level style application
            }

            return { ...block, ...updates };
        });

        return {
            settings: { ...state.settings, backgroundColor: theme.settings.backgroundColor },
            blocks: newBlocks
        };
    }),

    addBlock: (block) => recordHistory(set)((state) => ({
        blocks: [...state.blocks, block]
    })),

    updateBlock: (id, updates) => recordHistory(set)((state) => ({
        blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),

    removeBlock: (id) => recordHistory(set)((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
    })),

    selectBlock: (id) => set({ selectedBlockId: id }), // Don't record selection in history

    moveBlock: (fromIndex, toIndex) => recordHistory(set)((state) => {
        const newBlocks = [...state.blocks];
        const [moved] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, moved);
        return { blocks: newBlocks };
    }),

    setBlocks: (blocks) => recordHistory(set)(() => ({ blocks })),

    updateSettings: (newSettings) => recordHistory(set)((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),

    loadTemplate: (blocks, settings) => recordHistory(set)((state) => ({
        blocks,
        settings: {
            ...state.settings,
            backgroundColor: settings?.backgroundColor || '#ffffff'
        }
    })),

    clearAllBlocks: () => recordHistory(set)(() => ({ blocks: [] })),

    // Undo/Redo implementation
    undo: () => {
        const state = get();
        if (state.past.length === 0) return;

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);
        const currentSnapshot = createSnapshot(state);

        set({
            ...previous,
            past: newPast,
            future: [currentSnapshot, ...state.future].slice(0, MAX_HISTORY),
            selectedBlockId: state.selectedBlockId, // Preserve selection
        });
    },

    redo: () => {
        const state = get();
        if (state.future.length === 0) return;

        const next = state.future[0];
        const newFuture = state.future.slice(1);
        const currentSnapshot = createSnapshot(state);

        set({
            ...next,
            past: [...state.past, currentSnapshot].slice(-MAX_HISTORY),
            future: newFuture,
            selectedBlockId: state.selectedBlockId, // Preserve selection
        });
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,

    // --- Subscription System ---
    subscription: 'free' as SubscriptionPlan, // Default to free

    setSubscription: (plan: SubscriptionPlan) => set({ subscription: plan }),

    checkBlockAccess: (type: BlockType): boolean => {
        const { subscription } = get();
        return canUseBlock(subscription, type);
    }
}));
