'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle, Trash2, RotateCcw, ArrowRight } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    icon?: 'delete' | 'reset' | 'warning';
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    icon = 'warning'
}: ConfirmDialogProps) => {

    const getIcon = () => {
        switch (icon) {
            case 'delete': return <Trash2 className="w-8 h-8 text-rose-500" />;
            case 'reset': return <RotateCcw className="w-8 h-8 text-amber-500" />;
            default: return <AlertTriangle className="w-8 h-8 text-amber-500" />;
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'danger': return 'bg-rose-500 hover:bg-rose-600 shadow-rose-200';
            case 'warning': return 'bg-amber-500 hover:bg-amber-600 shadow-amber-200';
            default: return 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200';
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[200] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[201] w-full max-w-md outline-none animate-in zoom-in-95 duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-10 flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${variant === 'danger' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                            {getIcon()}
                        </div>

                        <Dialog.Title className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                            {title}
                        </Dialog.Title>

                        <Dialog.Description className="text-sm font-bold text-slate-500 mb-10 leading-relaxed">
                            {description}
                        </Dialog.Description>

                        <div className="grid grid-cols-1 gap-3 w-full">
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`w-full py-4 rounded-2xl text-white text-sm font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${getVariantClasses()}`}
                            >
                                <span>{confirmText}</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 text-sm font-black text-slate-400 hover:text-slate-900 transition-all"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
