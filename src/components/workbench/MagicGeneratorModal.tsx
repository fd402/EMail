
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEmailStore } from '@/store/useEmailStore';
import { Sparkles, Loader2, X } from 'lucide-react';

interface MagicGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MagicGeneratorModal = ({ isOpen, onClose }: MagicGeneratorModalProps) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setBlocks, subscription } = useEmailStore();
    const [mounted, setMounted] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Check access when modal opens or subscription changes
            if (subscription === 'free') {
                setShowUpgrade(true);
            } else {
                setShowUpgrade(false);
            }
        }
    }, [subscription, isOpen]);

    if (!isOpen || !mounted) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: prompt,
                    action: 'generate-template'
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            // Expecting result to be a JSON string of blocks
            let blocks = [];
            try {
                // OpenAI might return markdown code blocks e.g. ```json ... ```
                const cleanJson = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
                blocks = JSON.parse(cleanJson);
            } catch (e) {
                console.error("Failed to parse AI response", e);
                setError("Failed to parse generated template. Please try again.");
                return;
            }

            if (Array.isArray(blocks) && blocks.length > 0) {
                setBlocks(blocks);
                onClose();
            } else {
                setError("AI returned an invalid structure.");
            }

        } catch (err) {
            setError("Something went wrong. Please check your API key.");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-premium border border-white/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                        <Sparkles className="w-24 h-24 text-white rotate-12" />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Magic Layouts</h2>
                        <p className="text-indigo-100 font-medium text-sm max-w-xs mx-auto leading-relaxed">
                            Describe the email you want, and our AI will build the entire structure for you instantly.
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Feature Limiting Check */}
                    {true ? ( // We will replace checkBlockAccess with real check from store later, or pass subscription here
                        // For now let's use the hook from store
                        <MagicContent
                            prompt={prompt}
                            setPrompt={setPrompt}
                            handleGenerate={handleGenerate}
                            loading={loading}
                            error={error}
                            onClose={onClose}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Feature</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                                Upgrade to Pro to unlock AI Magic Layouts and generate emails in seconds.
                            </p>
                            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all">
                                Upgrade to Pro
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// Extracted content component to keep file clean
const MagicContent = ({ prompt, setPrompt, handleGenerate, loading, error, onClose }: any) => (
    <>
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">What should we build?</label>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A promotional email for a Summer Sale with a hero image, 3 product highlights, and a call to action..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all font-medium text-sm"
                autoFocus
            />
        </div>

        {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span> {error}
            </div>
        )}

        <div className="pt-2">
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Layout...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Template</span>
                    </>
                )}
            </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium">
            Powered by OpenAI • Generates editable blocks
        </p>
    </>
);
