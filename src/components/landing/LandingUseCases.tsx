"use client";

import { Briefcase, Users, Code2 } from 'lucide-react';

const USE_CASES = [
    {
        id: 'marketing',
        icon: Users,
        title: "Marketing Teams",
        headline: "Launch campaigns faster",
        description: "Stop waiting for developers. Build, test, and export emails yourself in minutes, not days. Ensure brand consistency across every campaign.",
        color: "text-indigo-600",
        hover: "hover:border-indigo-200 hover:shadow-indigo-500/5"
    },
    {
        id: 'agencies',
        icon: Briefcase,
        title: "Agencies & Freelancers",
        headline: "Scale your production",
        description: "Manage multiple clients with ease. Create custom templates, lock branding, and deliver high-quality HTML emails without the overhead.",
        color: "text-pink-600",
        hover: "hover:border-pink-200 hover:shadow-pink-500/5"
    },
    {
        id: 'developers',
        icon: Code2,
        title: "Developers",
        headline: "Stop coding tables",
        description: "Focus on your app, not email HTML quirks. Export clean, responsive code that works everywhere, or use our API to generate emails programmatically.",
        color: "text-blue-600",
        hover: "hover:border-blue-200 hover:shadow-blue-500/5"
    }
];

export const LandingUseCases = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {USE_CASES.map((useCase) => (
                        <div
                            key={useCase.id}
                            className={`group p-8 rounded-2xl border border-transparent bg-slate-50/50 transition-all duration-300 ${useCase.hover}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                                <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                            </div>

                            <div className="mb-2 font-bold text-xs uppercase tracking-wider text-slate-400">
                                {useCase.title}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-black transition-colors">
                                {useCase.headline}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                {useCase.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
