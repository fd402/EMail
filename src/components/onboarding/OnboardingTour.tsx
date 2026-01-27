'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { X, Sparkles, LayoutTemplate, Share2, CheckCircle2, ChevronRight } from 'lucide-react';

interface OnboardingTourProps {
    onComplete?: () => void;
}

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('has_seen_onboarding')
                .eq('id', user.id)
                .single();

            // Auto-heal: If profile is missing (and we have a user), create it!
            if (!profile) {
                // Determine display name from metadata or email
                const displayName = user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email?.split('@')[0] ||
                    'User';

                await supabase.from('profiles').upsert({
                    id: user.id,
                    email: user.email,
                    display_name: displayName,
                    avatar_url: user.user_metadata?.avatar_url,
                    has_seen_onboarding: false // Force false so they see the tour
                });

                // Show tour after creating profile
                setIsOpen(true);
            }
            // Normal case: Profile exists, check flag
            else if (!profile.has_seen_onboarding) {
                setIsOpen(true);
            }

            setLoading(false);
        };

        checkStatus();
    }, []);

    const handleComplete = async () => {
        setIsOpen(false);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('profiles')
                .update({ has_seen_onboarding: true })
                .eq('id', user.id);
        }
        if (onComplete) onComplete();
    };

    if (loading || !isOpen) return null;

    const steps = [
        {
            id: 'welcome',
            title: 'Welcome to Plainly',
            description: 'The fastest way to build beautiful, responsive emails. Let\'s get you up to speed in 30 seconds.',
            icon: <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200">P</div>,
            color: 'bg-indigo-500'
        },
        {
            id: 'magic',
            title: 'AI Magic Generator',
            description: 'Stuck on ideas? Just tell our AI what you need, and it will generate a complete email layout, copy, and images for you instantly.',
            icon: <Sparkles className="w-16 h-16 text-indigo-600" />,
            color: 'bg-indigo-500'
        },
        {
            id: 'templates',
            title: 'Premium Templates',
            description: 'Start with one of our professionally designed templates. Fully customizable and tested across all major email clients.',
            icon: <LayoutTemplate className="w-16 h-16 text-purple-600" />,
            color: 'bg-purple-500'
        },
        {
            id: 'export',
            title: 'Export Anywhere',
            description: 'Copy your email as HTML or visual content with one click. Works perfectly with Gmail, Outlook, HubSpot, and Mailchimp.',
            icon: <Share2 className="w-16 h-16 text-pink-600" />,
            color: 'bg-pink-500'
        }
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden m-4"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="p-10 pt-14 text-center flex flex-col items-center min-h-[420px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col items-center"
                        >
                            <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] shadow-sm border border-slate-100">
                                {steps[currentStep].icon}
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                                {steps[currentStep].title}
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                                {steps[currentStep].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-10 w-full flex items-center justify-between">
                        {/* Skip Button */}
                        <button
                            onClick={handleComplete}
                            className="text-slate-400 hover:text-slate-600 text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Skip Tour
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={nextStep}
                            className="group flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-200 active:scale-95"
                        >
                            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                            {currentStep === steps.length - 1 ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};
