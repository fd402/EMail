'use client';

import React, { useState, useMemo } from 'react';
import { EMAIL_TEMPLATES, EmailTemplate } from '@/lib/templates';
import { useEmailStore } from '@/store/useEmailStore';
import { X, Search, Sparkles, Layout, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { MiniTemplatePreview } from './MiniTemplatePreview';
import clsx from 'clsx';

interface TemplateGalleryProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose }) => {
    const { loadTemplate, blocks } = useEmailStore();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = useMemo(() => {
        const cats = Array.from(new Set(EMAIL_TEMPLATES.map(t => t.category)));
        return ['All', ...cats];
    }, []);

    const filteredTemplates = useMemo(() => {
        return EMAIL_TEMPLATES.filter(t => {
            const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
            const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const handleTemplateClick = (template: EmailTemplate) => {
        if (blocks.length > 0) {
            setSelectedTemplate(template);
            setShowConfirmation(true);
        } else {
            loadTemplate(template.blocks, { backgroundColor: template.backgroundColor });
            onClose();
        }
    };

    const confirmLoadTemplate = () => {
        if (selectedTemplate) {
            loadTemplate(selectedTemplate.blocks, { backgroundColor: selectedTemplate.backgroundColor });
            setShowConfirmation(false);
            setSelectedTemplate(null);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
            {/* Immersive Glass Background */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[32px] transition-all duration-700"
                onClick={onClose}
            />

            {/* Main Stage */}
            <div className="relative w-full max-w-[1400px] h-[90vh] bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row shadow-indigo-500/10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out">

                {/* Sidebar - Category Navigation */}
                <div className="w-[300px] border-r border-slate-200/50 bg-white/40 flex flex-col p-8 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Sparkles size={16} fill="white" />
                            </div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none">Inspiration</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Explore the<br />Library</h2>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a style..."
                            className="w-full bg-white/50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Categories List */}
                    <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-4 block">Categories</span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
                                    activeCategory === cat
                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200 translate-x-1"
                                        : "hover:bg-indigo-50 text-slate-500 hover:text-indigo-600"
                                )}
                            >
                                <div className={clsx(
                                    "w-2 h-2 rounded-full transition-all",
                                    activeCategory === cat ? "bg-white scale-125 shadow-[0_0_10px_white]" : "bg-slate-300"
                                )} />
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-indigo-500" fill="currentColor" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Pro Tip</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                            Every template is fully customizable. Start with a vibe and make it yours.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col relative bg-slate-50/30 overflow-hidden">
                    {/* Top Action Bar */}
                    <div className="p-8 flex items-center justify-between border-b border-slate-200/50">
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1.5 rounded-full bg-slate-200/60 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {filteredTemplates.length} Styles found
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="group p-4 bg-white hover:bg-rose-500 text-slate-400 hover:text-white rounded-[1.5rem] shadow-premium border border-slate-100 transition-all duration-500 hover:rotate-90"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Grid Container */}
                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
                            {filteredTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateClick(template)}
                                    className="group relative flex flex-col items-center text-left transition-all duration-500 perspective-1000"
                                >
                                    {/* Preview Card */}
                                    <div className="relative w-full aspect-[4/5] bg-white rounded-[3.5rem] shadow-premium border border-slate-100 overflow-hidden group-hover:shadow-2xl group-hover:shadow-indigo-500/20 transition-all duration-700 group-hover:-translate-y-4">

                                        {/* Premium Live Preview */}
                                        <div className="absolute inset-0 bg-slate-100/50">
                                            <div className="w-[600px] absolute top-10 left-1/2 -translate-x-1/2 origin-top scale-[0.4] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[0.44] group-hover:translate-y-2">
                                                <MiniTemplatePreview
                                                    blocks={template.blocks}
                                                    backgroundColor={template.backgroundColor || '#ffffff'}
                                                />
                                            </div>
                                        </div>

                                        {/* Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {/* Hover Interaction - "Use Template" Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                                            <div className="bg-white px-8 py-4 rounded-[1.75rem] shadow-2xl flex items-center gap-3 scale-90 group-hover:scale-100 transition-transform duration-500">
                                                <span className="text-sm font-black text-slate-900">Use this Design</span>
                                                <ArrowRight size={18} className="text-indigo-500" />
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-8 left-8">
                                            <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-indigo-500 uppercase tracking-[0.15em] shadow-premium border border-indigo-50">
                                                {template.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meta Info Below Card */}
                                    <div className="mt-8 px-4 w-full">
                                        <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-500 transition-colors">
                                            {template.name}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                            {template.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {filteredTemplates.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                <div className="p-8 bg-slate-100 rounded-[2.5rem] mb-6">
                                    <Layout size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-400">No styles found for "{searchQuery}"</h3>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                    className="mt-4 text-sm font-black text-indigo-500 hover:text-indigo-600"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xl" onClick={() => setShowConfirmation(false)} />
                    <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 border border-white/40 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-indigo-500 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200 rotate-6 hover:rotate-0 transition-transform duration-500">
                            <Layout size={40} fill="white" />
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Switch to<br />New Design?</h3>

                        <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed px-4">
                            Selecting "<span className="text-indigo-600 font-black">{selectedTemplate?.name}</span>" will replace your current workspace. Ready for the new look?
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={confirmLoadTemplate}
                                className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-[1.5rem] text-[13px] font-black transition-all shadow-lg shadow-indigo-200 active:scale-95 group flex items-center justify-center gap-2"
                            >
                                <span>Load Template</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setSelectedTemplate(null);
                                }}
                                className="w-full py-5 text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all"
                            >
                                Back to Gallery
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
