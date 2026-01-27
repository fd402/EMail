'use client';

import { useEffect } from 'react';
import { useEmailStore } from '@/store/useEmailStore';

export const useKeyboardShortcuts = () => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifierKey = isMac ? event.metaKey : event.ctrlKey;

            // Undo: Cmd/Ctrl + Z (without Shift)
            if (modifierKey && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                useEmailStore.getState().undo();
                return;
            }

            // Redo: Cmd/Ctrl + Shift + Z (Mac) or Cmd/Ctrl + Y (Windows)
            if (
                (modifierKey && event.key === 'z' && event.shiftKey) ||
                (modifierKey && event.key === 'y')
            ) {
                event.preventDefault();
                useEmailStore.getState().redo();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};
