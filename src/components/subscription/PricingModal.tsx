'use client';

import React, { useState } from 'react';
import { Check, X, Sparkles, Zap, Building2, Loader2 } from 'lucide-react';
import { PLANS, type SubscriptionPlan, type BillingPeriod } from '@/lib/stripe/plans';
import * as Dialog from '@radix-ui/react-dialog';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan?: SubscriptionPlan;
}

export const PricingModal = ({ isOpen, onClose, currentPlan = 'free' }: PricingModalProps) => {
    const billingPeriod = 'monthly';
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleUpgrade = async (plan: 'pro') => {
        setLoadingPlan(plan);

        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, period: billingPeriod }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Checkout Failed: ${error.message || 'Unknown error'}`);
            setLoadingPlan(null);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-6xl outline-none animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 p-10 relative max-h-[90vh] overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                        <div className="text-center mb-12 relative z-10">
                            <Dialog.Title className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                                Unlock Your Full Potential
                            </Dialog.Title>
                            <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
                                Choose the plan that fits your needs. Upgrade anytime to access premium features.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
                            {/* Free Plan */}
                            <PlanCard
                                plan="free"
                                planConfig={PLANS.free}
                                currentPlan={currentPlan}
                                billingPeriod={billingPeriod}
                                icon={<Sparkles className="w-6 h-6 text-slate-400" />}
                                onSelect={() => { }}
                                isLoading={false}
                            />

                            {/* Pro Plan */}
                            <PlanCard
                                plan="pro"
                                planConfig={PLANS.pro}
                                currentPlan={currentPlan}
                                billingPeriod={billingPeriod}
                                isPopular
                                icon={<Zap className="w-6 h-6 text-indigo-100" />}
                                onSelect={() => handleUpgrade('pro')}
                                isLoading={loadingPlan === 'pro'}
                            />


                        </div>

                        <div className="mt-10 text-center relative z-10">
                            <p className="text-xs text-slate-400 font-medium">
                                Secure payment powered by Stripe.
                                <button onClick={onClose} className="ml-2 text-indigo-500 hover:text-indigo-600 font-bold hover:underline">
                                    Maybe later
                                </button>
                            </p>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

interface PlanCardProps {
    plan: SubscriptionPlan;
    planConfig: typeof PLANS[SubscriptionPlan];
    currentPlan: SubscriptionPlan;
    billingPeriod: BillingPeriod;
    isPopular?: boolean;
    icon: React.ReactNode;
    onSelect: () => void;
    isLoading: boolean;
}

const PlanCard = ({ plan, planConfig, currentPlan, billingPeriod, isPopular, icon, onSelect, isLoading }: PlanCardProps) => {
    const isCurrent = currentPlan === plan;
    const price = billingPeriod === 'monthly' ? planConfig.price.monthly : planConfig.price.yearly;
    const displayPrice = billingPeriod === 'yearly' ? Math.round(price / 12) : price;

    return (
        <div className={`relative p-8 rounded-xl border transition-all duration-300 flex flex-col h-full ${isPopular
            ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-200 transform scale-[1.03]'
            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1'
            }`}>
            {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-lg whitespace-nowrap">
                    Most Popular
                </div>
            )}

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${isPopular ? 'bg-white/10' : 'bg-slate-50'
                }`}>
                {icon}
            </div>

            <div className={`mb-2 font-bold text-xs uppercase tracking-wider ${isPopular ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                {planConfig.name}
            </div>

            <div className="flex items-baseline gap-1 mb-5">
                <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-slate-900'
                    }`}>
                    €{displayPrice}
                </span>
                <span className={`text-sm font-medium ${isPopular ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                    /mo
                </span>
            </div>

            {billingPeriod === 'yearly' && price > 0 && (
                <p className={`text-xs mb-4 font-bold ${isPopular ? 'text-indigo-200' : 'text-slate-500'
                    }`}>
                    Billed €{price}/year
                </p>
            )}

            <div className="flex-1 space-y-3 mb-8">
                {planConfig.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isPopular ? 'bg-indigo-500' : 'bg-green-100'
                            }`}>
                            <Check className={`w-3 h-3 ${isPopular ? 'text-white' : 'text-green-600'
                                }`} />
                        </div>
                        <span className={`text-sm font-medium leading-tight ${isPopular ? 'text-indigo-50' : 'text-slate-600'
                            }`}>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={onSelect}
                disabled={isCurrent || isLoading || plan === 'free'}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${isCurrent
                    ? (isPopular ? 'bg-indigo-700 text-indigo-300 cursor-default' : 'bg-slate-100 text-slate-400 cursor-default')
                    : plan === 'free'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : isPopular
                            ? 'bg-white text-indigo-600 hover:bg-slate-50 shadow-md'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-indigo-200'
                    }`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting...</span>
                    </>
                ) : isCurrent ? (
                    'Current Plan'
                ) : plan === 'free' ? (
                    'Free Forever'
                ) : (
                    'Upgrade Now'
                )}
            </button>
        </div>
    );
};
