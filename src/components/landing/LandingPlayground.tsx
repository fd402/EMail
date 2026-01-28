'use client';

import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

const THEMES = [
    {
        id: 'modern',
        name: 'Modern',
        color: '#6366f1',
        font: 'Inter, sans-serif',
        bg: '#ffffff',
        buttonRadius: '12px',
        textColor: '#1e293b'
    },
    {
        id: 'elegant',
        name: 'Elegant',
        color: '#d4af37',
        font: 'Georgia, serif',
        bg: '#fdfcf8',
        buttonRadius: '2px',
        textColor: '#292524'
    },
    {
        id: 'brutalist',
        name: 'Brutalist',
        color: '#000000',
        font: 'Oswald, sans-serif',
        bg: '#fff1f2',
        buttonRadius: '0px',
        textColor: '#000000'
    },
    {
        id: 'playful',
        name: 'Playful',
        color: '#ff4757',
        font: '"Comic Sans MS", cursive',
        bg: '#fff0f5',
        buttonRadius: '50px',
        textColor: '#2f3542'
    }
];

export const LandingPlayground = () => {
    const [theme, setTheme] = useState(THEMES[0]);

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                        <Sparkles size={12} />
                        TRY IT YOURSELF
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        One content. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                            Infinite possibilities.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        Click a theme below to see how Plainly instantly transforms your email design.
                    </p>
                </div>

                {/* Interactive Area */}
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

                    {/* Controls */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4 relative">


                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group ${theme.id === t.id
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full shadow-sm border border-black/5 flex items-center justify-center transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: t.color }}
                                        >
                                            <span className="text-[10px] text-white font-bold opacity-75">Aa</span>
                                        </div>
                                        <div>
                                            <div className={`font-bold text-sm ${theme.id === t.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                {t.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono">
                                                {t.font.split(',')[0].replace(/"/g, '')}
                                            </div>
                                        </div>
                                    </div>
                                    {theme.id === t.id && (
                                        <div className="bg-indigo-600 rounded-full p-1 text-white shadow-sm">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Live Preview */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 transform blur-3xl -z-10 rounded-[3rem]"></div>

                        <div
                            className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/50 transition-all duration-500 ease-in-out transform"
                            style={{ backgroundColor: theme.bg }}
                        >
                            {/* Browser Header */}
                            <div className="h-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="mx-auto w-32 h-5 bg-white rounded-md shadow-sm text-[10px] flex items-center justify-center text-slate-400 font-medium">
                                        preview.html
                                    </div>
                                </div>
                            </div>

                            {/* Email Content */}
                            <div
                                className="p-8 md:p-12 transition-all duration-500 min-h-[500px] flex flex-col justify-center text-center"
                                style={{
                                    fontFamily: theme.font,
                                    color: theme.textColor
                                }}
                            >
                                <div className="max-w-md mx-auto space-y-8 animate-in zoom-in duration-300" key={theme.id}> {/* Key forces re-render/anim */}

                                    <h1
                                        className="text-4xl md:text-5xl leading-tight"
                                        style={{ fontWeight: theme.id === 'brutalist' ? '900' : 'bold' }}
                                    >
                                        Design with Purpose.
                                    </h1>

                                    <p className="text-lg opacity-80 leading-relaxed">
                                        Stop sending generic emails. Plainly gives you the tools to build high-converting designs in seconds.
                                    </p>

                                    <button
                                        className="px-8 py-4 text-lg transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                        style={{
                                            backgroundColor: theme.color,
                                            color: '#ffffff',
                                            borderRadius: theme.buttonRadius,
                                            fontWeight: 'bold',
                                            fontFamily: theme.font
                                        }}
                                    >
                                        Start Building Free
                                    </button>

                                    <div className="pt-8 border-t border-black/5 opacity-60 text-sm">
                                        <div className="flex justify-center gap-4 mb-4">
                                            <span>Twitter</span>
                                            <span>LinkedIn</span>
                                            <span>Instagram</span>
                                        </div>
                                        <p>© 2026 Plainly Inc.</p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
