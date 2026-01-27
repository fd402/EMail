"use client";

const TEMPLATES = [
    {
        name: "SaaS Welcome",
        color: "bg-indigo-100",
        category: "Onboarding"
    },
    {
        name: "Monthly Newsletter",
        color: "bg-emerald-100",
        category: "Newsletter"
    },
    {
        name: "E-Commerce Sale",
        color: "bg-rose-100",
        category: "Marketing"
    },
    {
        name: "Event Invite",
        color: "bg-amber-100",
        category: "Transactional"
    }
];

export const LandingTemplatePreview = () => {
    return (
        <section className="py-24 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-6">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Inspiration</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Start with a stunning template</h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16">
                    Don't start from scratch. Choose from our gallery of battle-tested email layouts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEMPLATES.map((template) => (
                        <div key={template.name} className="group cursor-pointer">
                            <div className={`aspect-[3/4] rounded-3xl ${template.color} mb-6 relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl shadow-sm border border-slate-200/50`}>
                                {/* Abstract wireframe representation of email */}
                                <div className="absolute top-4 left-4 right-4 h-4 bg-white/50 rounded-full w-1/2" />
                                <div className="absolute top-12 left-4 right-4 h-32 bg-white/40 rounded-xl" />
                                <div className="absolute top-48 left-4 right-4 h-2 bg-white/30 rounded-full w-3/4" />
                                <div className="absolute top-56 left-4 right-4 h-2 bg-white/30 rounded-full" />
                                <div className="absolute top-64 left-4 right-4 h-2 bg-white/30 rounded-full" />

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                            <p className="text-sm text-slate-400 font-medium">{template.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
