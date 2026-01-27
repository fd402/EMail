import Link from 'next/link';
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react';
import { PLANS } from '@/lib/subscription';

export const LandingPricing = () => {
    return (
        <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Simple, transparent pricing</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Start for free, upgrade when you need more power. No credit card required to start.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <PricingCard
                        plan={PLANS.free}
                        icon={<Sparkles className="w-6 h-6 text-slate-400" />}
                        buttonValue="Start Designing"
                        href="/editor"
                    />

                    {/* Pro Plan */}
                    <PricingCard
                        plan={PLANS.pro}
                        isPopular
                        icon={<Zap className="w-6 h-6 text-indigo-100" />}
                        buttonValue="Get Pro"
                        href="/editor"
                    />

                    {/* Agency Plan */}
                    <PricingCard
                        plan={PLANS.agency}
                        icon={<Building2 className="w-6 h-6 text-purple-500" />}
                        buttonValue="Contact Sales"
                        href="/editor"
                    />
                </div>
            </div>
        </section>
    );
};

const PricingCard = ({ plan, isPopular, icon, buttonValue, href }: any) => {
    return (
        <div className={`relative p-10 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 ${isPopular
            ? 'bg-indigo-600 shadow-2xl shadow-indigo-200 transform md:-translate-y-4'
            : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2'
            }`}>
            {isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-xs font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${isPopular ? 'bg-white/10' : 'bg-slate-50'
                }`}>
                {icon}
            </div>

            <div className={`mb-2 font-bold text-sm uppercase tracking-wider ${isPopular ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                {plan.name}
            </div>

            <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black ${isPopular ? 'text-white' : 'text-slate-900'
                    }`}>
                    {plan.price}
                </span>
                <span className={`text-base font-medium ${isPopular ? 'text-indigo-200' : 'text-slate-400'
                    }`}>/mo</span>
            </div>

            <p className={`text-base mb-10 font-medium leading-relaxed ${isPopular ? 'text-indigo-100' : 'text-slate-500'
                }`}>
                {plan.description}
            </p>

            <div className="flex-1 space-y-5 mb-10">
                {plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isPopular ? 'bg-indigo-500' : 'bg-green-100'
                            }`}>
                            <Check className={`w-3.5 h-3.5 ${isPopular ? 'text-white' : 'text-green-600'
                                }`} />
                        </div>
                        <span className={`text-sm font-bold ${isPopular ? 'text-indigo-50' : 'text-slate-600'
                            }`}>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            <Link
                href={href}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${isPopular
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
                    }`}
            >
                {buttonValue}
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
};
