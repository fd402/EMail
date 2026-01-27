"use client";

import { Mail, Send, Code, Zap } from 'lucide-react';

const INTEGRATIONS = [
    { name: 'Mailchimp', icon: Mail },
    { name: 'Klaviyo', icon: Send },
    { name: 'HubSpot', icon: Zap },
    { name: 'Outlook', icon: Mail },
    { name: 'Gmail', icon: Mail },
    { name: 'HTML Export', icon: Code },
];

export const LandingIntegrations = () => {
    return (
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
                    Works seamlessly with your favorite tools
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {INTEGRATIONS.map((tool) => (
                        <div key={tool.name} className="flex items-center gap-2 group cursor-default">
                            <tool.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{tool.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
