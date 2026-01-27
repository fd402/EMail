"use client";

import { Wand2, Layout, Smartphone, Share, ArrowRight } from 'lucide-react';

const FEATURES = [
    {
        id: 'ai',
        icon: Wand2,
        title: "AI Assistant",
        description: "Generate copy and layouts instantly. Let our AI write compelling headers and body text.",
        iconColor: "text-indigo-600",
        bgHover: "hover:border-indigo-200 hover:shadow-indigo-500/5",
    },
    {
        id: 'builder',
        icon: Layout,
        title: "Visual Builder",
        description: "Drag blocks, resize, and style. The most intuitive canvas you've ever used.",
        iconColor: "text-pink-600",
        bgHover: "hover:border-pink-200 hover:shadow-pink-500/5",
    },
    {
        id: 'mobile',
        icon: Smartphone,
        title: "Mobile View",
        description: "Switch views instantly to ensure your email looks perfect on every device.",
        iconColor: "text-blue-600",
        bgHover: "hover:border-blue-200 hover:shadow-blue-500/5",
    },
    {
        id: 'export',
        icon: Share,
        title: "Clean Export",
        description: "Download production-ready HTML code compatible with all major email platforms.",
        iconColor: "text-emerald-600",
        bgHover: "hover:border-emerald-200 hover:shadow-emerald-500/5",
    }
];

export const LandingFeatureTabs = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.id}
                            className={`group flex items-start gap-6 p-6 rounded-2xl transition-all duration-300 border border-transparent hover:bg-slate-50/50 ${feature.bgHover}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm border border-slate-100`}>
                                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-black transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-base text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
