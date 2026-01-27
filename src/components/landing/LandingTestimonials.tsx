"use client";

import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: "Sarah Miller",
        role: "Marketing Director",
        quote: "Plainly saved us hours of coding time. We can now launch campaigns in minutes instead of days.",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
    },
    {
        name: "David Chen",
        role: "Agency Owner",
        quote: "The best email editor we've used. My clients are blown away by how good the templates look on mobile.",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
    },
    {
        name: "Alex Johnson",
        role: "Frontend Developer",
        quote: "Finally, an editor that produces clean code. No more nested tables nightmare. Highly recommended.",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
    }
];

export const LandingTestimonials = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Loved by Teams</h2>
                    <p className="text-xl text-slate-500">Join thousands of creators who build improved emails.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border border-slate-100">
                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-lg text-slate-700 leading-relaxed font-medium mb-8">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                                <div>
                                    <div className="font-bold text-slate-900">{t.name}</div>
                                    <div className="text-sm text-slate-500 font-medium">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
