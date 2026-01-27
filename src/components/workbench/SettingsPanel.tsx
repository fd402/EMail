'use client';

import { useEmailStore } from '@/store/useEmailStore';
import { scrapeProduct } from '@/app/actions/scrape-product';
import { useState } from 'react';
import { Upload, Trash2, Wand2, Sparkles, Loader2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

export const SettingsPanel = () => {
    const { blocks, selectedBlockId, updateBlock, settings, updateSettings, applyTheme } = useEmailStore();
    const selectedBlock = blocks.find(b => b.id === selectedBlockId);
    const [isFetching, setIsFetching] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [showAIMenu, setShowAIMenu] = useState(false);

    if (!selectedBlock) {
        return (
            <div className="w-[400px] bg-white border-l border-[#E0E0E0] h-full overflow-y-auto shadow-[-1px_0_3px_rgba(0,0,0,0.08)] font-sans">
                <div className="p-6 border-b border-[#E0E0E0]">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Settings</h2>
                    <div className="h-0.5 w-10 bg-[#0A66C2] rounded-full"></div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Paper Background */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block ml-1">Paper</label>
                        <div className="p-5 bg-gray-50/50 rounded-[1.75rem] shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-white"
                                    style={{ backgroundColor: settings.backgroundColor }}
                                />
                                <input
                                    type="text"
                                    value={settings.backgroundColor}
                                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                />
                            </div>
                            <input
                                type="color"
                                className="w-full h-12 rounded-xl cursor-pointer border-0 p-0"
                                value={settings.backgroundColor || '#ffffff'}
                                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Workbench Background */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block ml-1">Workbench</label>
                        <div className="p-5 bg-gray-50/50 rounded-[1.75rem] shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-white"
                                    style={{ backgroundColor: settings.workbenchColor }}
                                />
                                <input
                                    type="text"
                                    value={settings.workbenchColor}
                                    onChange={(e) => updateSettings({ workbenchColor: e.target.value })}
                                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                />
                            </div>
                            <input
                                type="color"
                                className="w-full h-12 rounded-xl cursor-pointer border-0 p-0"
                                value={settings.workbenchColor || '#F4F2EE'}
                                onChange={(e) => updateSettings({ workbenchColor: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Smart Themes */}
                    <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <label className="text-sm font-bold text-indigo-500 uppercase tracking-wider block">Smart Themes</label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: 'Modern', color: '#6366f1', font: 'Inter' },
                                { name: 'Elegant', color: '#d4af37', font: 'Georgia' },
                                { name: 'Bold', color: '#000000', font: 'Oswald' },
                                { name: 'Playful', color: '#ff4757', font: 'Comic Sans MS' }
                            ].map((theme) => (
                                <button
                                    key={theme.name}
                                    onClick={() => applyTheme(theme.name)}
                                    className="group relative overflow-hidden rounded-2xl p-4 text-left border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all active:scale-95 bg-white"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-3xl -mr-4 -mt-4 group-hover:to-indigo-50 transition-colors"></div>
                                    <div className="relative z-10">
                                        <div className="w-8 h-8 rounded-full mb-3 shadow-sm border border-black/5 flex items-center justify-center" style={{ backgroundColor: theme.color }}>
                                            <span className="text-[10px] text-white font-bold opacity-50">Aa</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">{theme.name}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">{theme.font}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        );
    }

    const handleChange = (key: string, value: any, isStyle = false) => {
        if (isStyle) {
            updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, [key]: value } });
        } else {
            updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, [key]: value } });
        }
    };

    const handleFetchProduct = async (url: string) => {
        if (!url) return;

        console.log('Fetching product data for:', url);
        setIsFetching(true);

        try {
            const data = await scrapeProduct(url);
            console.log('Scrape result:', data);

            if ('error' in data) {
                alert(`Error: ${data.error}`);
            } else {
                if (data.image) handleChange('image', data.image);
                if (data.title) handleChange('title', data.title);
                if (data.price) handleChange('price', data.price);
                if (data.currency) handleChange('currency', data.currency);
                if (data.originalPrice) handleChange('originalPrice', data.originalPrice);
                handleChange('btnUrl', url);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
            alert('An unexpected error occurred while fetching.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleAIAction = async (action: string) => {
        if (!selectedBlock.content.text) return;

        setIsAILoading(true);
        setShowAIMenu(false);
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: selectedBlock.content.text, action })
            });
            const data = await response.json();
            if (data.result) {
                handleChange('text', data.result);
            } else if (data.error) {
                alert(data.error);
            }
        } catch (error) {
            console.error('AI Error:', error);
            alert('AI action failed. Please try again.');
        } finally {
            setIsAILoading(false);
        }
    };

    return (
        <div className="w-[420px] bg-white border-l border-slate-200 flex flex-col h-full z-20 shadow-[-10px_0_50px_rgba(0,0,0,0.02)]">
            <div className="p-8 border-b border-slate-100 flex flex-col gap-1 bg-slate-50/30">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1">Configuration</span>
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{selectedBlock.type}</h2>
                    <div className="px-2.5 py-1 rounded-full bg-slate-200/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        ID: {selectedBlock.id.slice(0, 4)}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">

                {selectedBlock.type === 'text' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Copywriting</label>

                            <div className="relative group">

                                <div className={`bg-white p-1 rounded-[2.5rem] shadow-premium ring-1 ring-slate-200/60 focus-within:ring-indigo-500/20 focus-within:ring-8 transition-all duration-500 ${isAILoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <textarea
                                        className="w-full bg-slate-50/20 border-none rounded-[2.2rem] p-8 pb-14 text-[15px] leading-relaxed text-slate-700 outline-none h-56 resize-none focus:bg-white transition-all placeholder:text-slate-300 font-medium custom-scrollbar"
                                        value={selectedBlock.content.text || ''}
                                        onChange={(e) => handleChange('text', e.target.value)}
                                        placeholder="Write something amazing..."
                                    />
                                </div>

                                {/* Integrated AI Action Button */}
                                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowAIMenu(!showAIMenu)}
                                            disabled={isAILoading || !selectedBlock.content.text}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${isAILoading
                                                ? 'bg-slate-100 text-slate-400 translate-y-2'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200 ring-4 ring-indigo-500/10'
                                                }`}
                                        >
                                            {isAILoading ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <Sparkles size={12} />
                                            )}
                                            {isAILoading ? 'Magic Working...' : 'AI Writer'}
                                        </button>

                                        {showAIMenu && (
                                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-premium border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl bg-white/95">
                                                <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 mb-2 text-center">Select Action</div>

                                                <button
                                                    onClick={() => handleAIAction('grammar')}
                                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                        <Sparkles size={14} className="text-indigo-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Fix Grammar</div>
                                                        <div className="text-[9px] text-slate-400 leading-relaxed">Correct spelling & grammar errors</div>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => handleAIAction('shorter')}
                                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                        <Sparkles size={14} className="text-indigo-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Shorter</div>
                                                        <div className="text-[9px] text-slate-400 leading-relaxed">Condense while keeping the message</div>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => handleAIAction('longer')}
                                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                        <Sparkles size={14} className="text-indigo-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Longer</div>
                                                        <div className="text-[9px] text-slate-400 leading-relaxed">Expand with more details & examples</div>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => handleAIAction('friendlier')}
                                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                        <Sparkles size={14} className="text-indigo-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Friendlier</div>
                                                        <div className="text-[9px] text-slate-400 leading-relaxed">Rewrite in a warm, welcoming tone</div>
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isAILoading && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-[2.5rem] overflow-hidden">
                                        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100/50 space-y-8">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200"></div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">Typography & Layout</h4>
                            </div>

                            {/* Font Family */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-3">Font Family</label>
                                <select
                                    className="w-full bg-slate-50 border-transparent rounded-[1.2rem] px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedBlock.content.fontFamily || 'Arial'}
                                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                                >
                                    <option value="Arial">Arial (Default)</option>
                                    <option value="Inter">Inter</option>
                                    <option value="Helvetica">Helvetica</option>
                                    <option value="'Geist Sans', sans-serif">Geist</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="'Courier New', monospace">Courier New</option>
                                </select>
                            </div>

                            {/* Font Size */}
                            <div>
                                <div className="flex justify-between items-center mb-3 ml-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Font Size</label>
                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{parseInt(selectedBlock.styles.fontSize || '16')}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="12"
                                    max="80"
                                    step="1"
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    value={parseInt(selectedBlock.styles.fontSize || '16')}
                                    onChange={(e) => handleChange('fontSize', `${e.target.value}px`, true)}
                                />
                            </div>

                            {/* Text Color */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-3">Text Color</label>
                                <div className="flex gap-3">
                                    <div
                                        className="w-12 h-12 rounded-2xl shadow-inner border-2 border-slate-50 relative overflow-hidden"
                                        style={{ backgroundColor: selectedBlock.styles.color || '#1e293b' }}
                                    >
                                        <input
                                            type="color"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            value={selectedBlock.styles.color || '#1e293b'}
                                            onChange={(e) => handleChange('color', e.target.value, true)}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:bg-white transition-all shadow-sm"
                                        value={selectedBlock.styles.color || '#1e293b'}
                                        onChange={(e) => handleChange('color', e.target.value, true)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Typography</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-50 border-transparent rounded-[1.2rem] px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                        value={selectedBlock.content.fontWeight || '400'}
                                        onChange={(e) => handleChange('fontWeight', e.target.value, true)}
                                    >
                                        <option value="300">Light</option>
                                        <option value="400">Regular</option>
                                        <option value="600">Semi Bold</option>
                                        <option value="700">Bold</option>
                                        <option value="900">Black</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex bg-slate-50 p-1 rounded-[1.2rem] border border-slate-100/50">
                                    {[
                                        { value: 'left', icon: AlignLeft },
                                        { value: 'center', icon: AlignCenter },
                                        { value: 'right', icon: AlignRight },
                                        { value: 'justify', icon: AlignJustify }
                                    ].map((align) => (
                                        <button
                                            key={align.value}
                                            onClick={() => handleChange('textAlign', align.value, true)}
                                            className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all ${selectedBlock.styles.textAlign === align.value || (!selectedBlock.styles.textAlign && align.value === 'left')
                                                ? 'bg-white text-indigo-500 shadow-sm ring-1 ring-black/5'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                                                }`}
                                        >
                                            <align.icon size={16} strokeWidth={2.5} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-3">Line Height</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="3"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm"
                                        value={parseFloat(selectedBlock.styles.lineHeight || '1.5')}
                                        onChange={(e) => handleChange('lineHeight', e.target.value, true)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2 mb-3">Padding (Y)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm"
                                        value={parseInt((selectedBlock.styles.padding || '20px').split(' ')[0])}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleChange('padding', `${val}px 40px`, true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'image' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Image Source</label>
                            {selectedBlock.content.src?.startsWith('data:') ? (
                                <div className="relative group">
                                    <div className="h-40 w-full relative rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-gray-50 flex items-center justify-center">
                                        <img
                                            src={selectedBlock.content.src}
                                            alt="Preview"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => handleChange('src', '')}
                                                className="bg-white text-red-500 hover:text-red-600 hover:scale-110 p-3 rounded-2xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                                title="Remove Image"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 text-center font-medium">Uploaded Image</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                        value={selectedBlock.content.src || ''}
                                        onChange={(e) => handleChange('src', e.target.value)}
                                        placeholder="https://example.com/image.png"
                                    />
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        handleChange('src', reader.result);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <button className="w-full text-sm bg-[#E7F3FF] hover:bg-blue-100 text-[#0A66C2] font-bold rounded-2xl py-4 transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-dashed border-[#0A66C2] border-opacity-200 hover:border-[#0A66C2] border-opacity-300">
                                            <Upload size={18} strokeWidth={2.5} />
                                            <span>Upload Image</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Alt Text</label>
                            <input
                                type="text"
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                value={selectedBlock.content.alt || ''}
                                onChange={(e) => handleChange('alt', e.target.value)}
                                placeholder="Image description"
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'button' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Button Text</label>
                            <input
                                type="text"
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                value={selectedBlock.content.text || ''}
                                onChange={(e) => handleChange('text', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1 mb-3">Typography</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 border-transparent rounded-[1.2rem] px-5 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedBlock.styles.fontFamily || 'Arial'}
                                    onChange={(e) => handleChange('fontFamily', e.target.value, true)}
                                >
                                    <option value="Arial">Arial</option>
                                    <option value="'Inter', sans-serif">Inter</option>
                                    <option value="'Geist Sans', sans-serif">Geist</option>
                                    <option value="'Courier New', monospace">Courier New</option>
                                    <option value="'Times New Roman', serif">Times New Roman</option>
                                    <option value="Georgia, serif">Georgia</option>
                                    <option value="Verdana, sans-serif">Verdana</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Button URL</label>
                            <input
                                type="text"
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                value={selectedBlock.content.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                            />
                        </div>

                        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Background</label>
                                <div className="flex gap-3">
                                    <div
                                        className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                        style={{ backgroundColor: selectedBlock.styles.backgroundColor || '#6366f1' }}
                                    />
                                    <input
                                        type="color"
                                        className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                        value={selectedBlock.styles.backgroundColor || '#6366f1'}
                                        onChange={(e) => handleChange('backgroundColor', e.target.value, true)}
                                    />
                                    <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                        {selectedBlock.styles.backgroundColor || '#6366f1'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Rounding</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    className="w-full accent-[#0A66C2] h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                    value={parseInt(selectedBlock.styles.borderRadius || '12px')}
                                    onChange={(e) => handleChange('borderRadius', `${e.target.value}px`, true)}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Text Color</label>
                                <div className="flex gap-3">
                                    <div
                                        className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                        style={{ backgroundColor: selectedBlock.styles.color || '#ffffff' }}
                                    />
                                    <input
                                        type="color"
                                        className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                        value={selectedBlock.styles.color || '#ffffff'}
                                        onChange={(e) => handleChange('color', e.target.value, true)}
                                    />
                                    <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                        {selectedBlock.styles.color || '#ffffff'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'divider' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Dicke (px)</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                value={selectedBlock.content.thickness || 1}
                                onChange={(e) => handleChange('thickness', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Farbe</label>
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-white"
                                    style={{ backgroundColor: selectedBlock.content.color }}
                                />
                                <input
                                    type="text"
                                    value={selectedBlock.content.color || '#E0E0E0'}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    className="flex-1 bg-white border-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                />
                            </div>
                            <input
                                type="color"
                                className="w-full h-12 rounded-xl cursor-pointer border-0 p-0"
                                value={selectedBlock.content.color || '#E0E0E0'}
                                onChange={(e) => handleChange('color', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Stil</label>
                            <select
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                value={selectedBlock.content.style || 'solid'}
                                onChange={(e) => handleChange('style', e.target.value)}
                            >
                                <option value="solid">Durchgängig</option>
                                <option value="dashed">Gestrichelt</option>
                                <option value="dotted">Gepunktet</option>
                            </select>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'social' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Style</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all appearance-none"
                                    value={selectedBlock.content.variant || 'color'}
                                    onChange={(e) => handleChange('variant', e.target.value)}
                                >
                                    <option value="color">Brand Colors</option>
                                    <option value="bw">Dark / Minimal</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-3">Networks</label>
                            {['facebook', 'instagram', 'linkedin', 'x'].map((network) => (
                                <div key={network} className="mb-3 p-1 bg-white rounded-2xl shadow-sm transition-all hover:shadow-md">
                                    <div className="flex items-center gap-3 p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedBlock.content.networks?.[network] || false}
                                            onChange={(e) => {
                                                const newNetworks = { ...selectedBlock.content.networks, [network]: e.target.checked };
                                                handleChange('networks', newNetworks);
                                            }}
                                            className="w-5 h-5 rounded-md border-gray-300 text-[#0A66C2] focus:ring-blue-200"
                                        />
                                        <span className="text-sm font-bold capitalize text-gray-700">{network}</span>
                                    </div>
                                    {selectedBlock.content.networks?.[network] && (
                                        <div className="px-3 pb-3">
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-gray-600 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                                placeholder={`https://${network}.com/...`}
                                                value={selectedBlock.content.urls?.[network] || ''}
                                                onChange={(e) => {
                                                    const newUrls = { ...selectedBlock.content.urls, [network]: e.target.value };
                                                    handleChange('urls', newUrls);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'video' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Video URL (YouTube)</label>
                            <input
                                type="text"
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                placeholder="https://youtube.com/watch?v=..."
                                value={selectedBlock.content.url}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    handleChange('url', url);
                                    const match = url.match(/[?&]v=([^&]+)/);
                                    if (match && match[1]) {
                                        handleChange('thumbnail', `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`);
                                    }
                                }}
                            />
                            <p className="text-[10px] text-gray-400 mt-2 ml-2 font-medium">Auto-generates thumbnail from YouTube.</p>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Thumbnail</label>
                            <input
                                type="text"
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                value={selectedBlock.content.thumbnail}
                                onChange={(e) => handleChange('thumbnail', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'html' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">HTML Code</label>
                            <textarea
                                className="w-full bg-white border-none rounded-3xl p-5 text-xs font-mono shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all h-64 resize-none leading-relaxed text-gray-600"
                                value={selectedBlock.content.html}
                                onChange={(e) => handleChange('html', e.target.value)}
                                placeholder="<div>...</div>"
                            />
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'menu' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Separator</label>
                            <input
                                type="text"
                                className="w-20 bg-white border-none rounded-2xl px-4 py-3 text-sm font-bold text-center text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none"
                                value={selectedBlock.content.separator}
                                onChange={(e) => handleChange('separator', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-3">Menu Items</label>
                            <div className="space-y-3">
                                {selectedBlock.content.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-2 p-2 bg-white rounded-2xl shadow-sm items-center">
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(e) => {
                                                const newItems = [...selectedBlock.content.items];
                                                newItems[i].text = e.target.value;
                                                handleChange('items', newItems);
                                            }}
                                            className="w-1/3 bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none"
                                            placeholder="Label"
                                        />
                                        <input
                                            type="text"
                                            value={item.url}
                                            onChange={(e) => {
                                                const newItems = [...selectedBlock.content.items];
                                                newItems[i].url = e.target.value;
                                                handleChange('items', newItems);
                                            }}
                                            className="flex-1 bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-mono text-gray-500 focus:ring-2 focus:ring-[#E7F3FF] outline-none"
                                            placeholder="URL"
                                        />
                                        <button
                                            onClick={() => {
                                                const newItems = selectedBlock.content.items.filter((_: any, idx: number) => idx !== i);
                                                handleChange('items', newItems);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >×</button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newItems = [...(selectedBlock.content.items || []), { text: 'Link', url: '#' }];
                                        handleChange('items', newItems);
                                    }}
                                    className="w-full py-4 text-xs font-bold border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl hover:border-[#0A66C2] border-opacity-300 hover:text-[#0A66C2] hover:bg-[#E7F3FF] transition-all"
                                >
                                    + Add Link
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Link Color</label>
                            <div className="flex gap-3">
                                <div
                                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                    style={{ backgroundColor: selectedBlock.styles.color }}
                                />
                                <input
                                    type="color"
                                    className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                    value={selectedBlock.styles.color}
                                    onChange={(e) => handleChange('color', e.target.value, true)}
                                />
                                <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                    {selectedBlock.styles.color}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedBlock.type === 'product-card' && (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Product URL</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-white border-2 border-transparent focus:border-[#0A66C2] border-opacity-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 shadow-sm outline-none transition-all"
                                    placeholder="https://store.com/product..."
                                    disabled={isFetching}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleFetchProduct(e.currentTarget.value);
                                        }
                                    }}
                                />
                                <button
                                    className="bg-[#E7F3FF]0 hover:bg-pink-600 text-white font-bold text-xs px-5 rounded-2xl shadow-lg shadow-orange-200/50 transition-all disabled:opacity-50 disabled:shadow-none"
                                    disabled={isFetching}
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        handleFetchProduct(input.value);
                                    }}
                                >
                                    {isFetching ? '...' : 'Fetch'}
                                </button>
                            </div>
                            <p className="text-[10px] text-orange-500 font-bold ml-2"> ✨ Auto-Fill: Updates Image, Title, Price & Link.</p>
                        </div>

                        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider opacity-20">Details</h4>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Image</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-gray-600 focus:ring-2 focus:ring-[#E7F3FF] outline-none"
                                    value={selectedBlock.content.image}
                                    onChange={(e) => handleChange('image', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-gray-600 focus:ring-2 focus:ring-[#E7F3FF] outline-none"
                                    value={selectedBlock.content.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="w-20">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Curr</label>
                                    <select
                                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-xs font-bold text-gray-700 outline-none"
                                        value={selectedBlock.content.currency || '€'}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                    >
                                        <option value="€">€</option>
                                        <option value="$">$</option>
                                        <option value="£">£</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Price</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-gray-600 focus:ring-2 focus:ring-[#E7F3FF] outline-none"
                                        value={selectedBlock.content.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {
                    selectedBlock.type === 'nps' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Scale Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all appearance-none"
                                        value={selectedBlock.content.variant}
                                        onChange={(e) => handleChange('variant', e.target.value)}
                                    >
                                        <option value="numbers">0 - 10 Numbers (NPS)</option>
                                        <option value="stars">1 - 5 Stars</option>
                                        <option value="smileys">1 - 5 Smileys</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Feedback URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                    value={selectedBlock.content.baseUrl}
                                    onChange={(e) => handleChange('baseUrl', e.target.value)}
                                    placeholder="https://example.com/feedback"
                                />
                                <p className="text-[10px] text-gray-400 mt-2 ml-2 font-medium">We will append <code className="bg-[#E7F3FF] px-2 py-1 rounded text-[#0A66C2] font-mono">?score=X</code> to this URL.</p>
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'countdown' && (
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Timer Settings</label>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Days</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm font-bold text-center text-gray-700 outline-none"
                                            value={selectedBlock.content.days}
                                            onChange={(e) => handleChange('days', e.target.value)}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Hours</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm font-bold text-center text-gray-700 outline-none"
                                            value={selectedBlock.content.hours}
                                            onChange={(e) => handleChange('hours', e.target.value)}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Mins</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm font-bold text-center text-gray-700 outline-none"
                                            value={selectedBlock.content.minutes}
                                            onChange={(e) => handleChange('minutes', e.target.value)}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Secs</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm font-bold text-center text-gray-700 outline-none"
                                            value={selectedBlock.content.seconds}
                                            onChange={(e) => handleChange('seconds', e.target.value)}
                                            maxLength={2}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Colors</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Background</label>
                                        <div className="flex gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                                style={{ backgroundColor: selectedBlock.content.backgroundColor }}
                                            />
                                            <input
                                                type="color"
                                                className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                                value={selectedBlock.content.backgroundColor}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                            />
                                            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                                {selectedBlock.content.backgroundColor}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Numbers</label>
                                        <div className="flex gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                                style={{ backgroundColor: selectedBlock.content.numberColor }}
                                            />
                                            <input
                                                type="color"
                                                className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                                value={selectedBlock.content.numberColor}
                                                onChange={(e) => handleChange('numberColor', e.target.value)}
                                            />
                                            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                                {selectedBlock.content.numberColor}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Labels</label>
                                        <div className="flex gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                                style={{ backgroundColor: selectedBlock.content.labelColor }}
                                            />
                                            <input
                                                type="color"
                                                className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                                value={selectedBlock.content.labelColor}
                                                onChange={(e) => handleChange('labelColor', e.target.value)}
                                            />
                                            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                                {selectedBlock.content.labelColor}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'qr' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">QR Content</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                    value={selectedBlock.content.value}
                                    onChange={(e) => handleChange('value', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Size</label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="300"
                                        step="10"
                                        className="w-full accent-[#0A66C2] h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                        value={selectedBlock.content.size}
                                        onChange={(e) => handleChange('size', parseInt(e.target.value))}
                                    />
                                    <div className="text-right text-[10px] font-bold text-gray-300 mt-1">{selectedBlock.content.size}px</div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Color</label>
                                    <div className="flex gap-3">
                                        <div
                                            className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                            style={{ backgroundColor: selectedBlock.content.color }}
                                        />
                                        <input
                                            type="color"
                                            className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                            value={selectedBlock.content.color}
                                            onChange={(e) => handleChange('color', e.target.value)}
                                        />
                                        <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                            {selectedBlock.content.color}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'table' && (
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedBlock.content.striped || false}
                                        onChange={(e) => handleChange('striped', e.target.checked)}
                                        className="rounded border-gray-300 text-[#0A66C2] focus:ring-pink-500"
                                    />
                                    <label className="text-sm font-bold text-gray-700">Striped Rows</label>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Text Color</label>
                                    <div className="flex gap-3">
                                        <div
                                            className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                            style={{ backgroundColor: selectedBlock.content.textColor || '#374151' }}
                                        />
                                        <input
                                            type="color"
                                            className="flex-1 h-12 p-0 border-0 rounded-2xl overflow-hidden cursor-pointer"
                                            value={selectedBlock.content.textColor || '#374151'}
                                            onChange={(e) => handleChange('textColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-3">Row Items</label>
                                <div className="space-y-3">
                                    {selectedBlock.content.rows?.map((row: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-[1.5rem] shadow-sm space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={row.label}
                                                    onChange={(e) => {
                                                        const newRows = [...selectedBlock.content.rows];
                                                        newRows[i].label = e.target.value;
                                                        handleChange('rows', newRows);
                                                    }}
                                                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                                    placeholder="Label"
                                                />
                                                <input
                                                    type="text"
                                                    value={row.value}
                                                    onChange={(e) => {
                                                        const newRows = [...selectedBlock.content.rows];
                                                        newRows[i].value = e.target.value;
                                                        handleChange('rows', newRows);
                                                    }}
                                                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                                    placeholder="Value"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newRows = selectedBlock.content.rows.filter((_: any, idx: number) => idx !== i);
                                                    handleChange('rows', newRows);
                                                }}
                                                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                                            >Remove Row</button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newRows = [...(selectedBlock.content.rows || []), { label: 'Item', value: 'Value' }];
                                            handleChange('rows', newRows);
                                        }}
                                        className="w-full py-3 text-xs font-bold border-2 border-dashed border-[#0A66C2] border-opacity-200 text-[#0A66C2] rounded-2xl hover:border-[#0A66C2] border-opacity-400 hover:bg-[#E7F3FF] transition-all"
                                    >
                                        + Add Row
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'image-text' && (
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Layout</h4>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Column Ratio</label>
                                    <select
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all mb-3"
                                        value={selectedBlock.content.layout}
                                        onChange={(e) => handleChange('layout', e.target.value)}
                                    >
                                        <option value="50-50">50% / 50%</option>
                                        <option value="30-70">30% (Image) / 70% (Text)</option>
                                        <option value="70-30">70% (Image) / 30% (Text)</option>
                                    </select>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedBlock.content.isReversed || false}
                                            onChange={(e) => handleChange('isReversed', e.target.checked)}
                                            className="rounded border-gray-300 text-[#0A66C2] focus:ring-pink-500"
                                        />
                                        <label className="text-sm font-bold text-gray-700">Swap Position (Text Left)</label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Image</h4>
                                {selectedBlock.content.image?.startsWith('data:') ? (
                                    <div className="relative group">
                                        <div className="h-32 w-full relative rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={selectedBlock.content.image}
                                                alt="Preview"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleChange('image', '')}
                                                    className="bg-white text-red-500 hover:text-red-700 p-2 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2 text-center">Uploaded Image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                            value={selectedBlock.content.image}
                                            onChange={(e) => handleChange('image', e.target.value)}
                                            placeholder="https://example.com/image.png"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            handleChange('image', reader.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <button className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-2xl py-3 px-4 transition-colors flex items-center justify-center gap-2">
                                                <Upload size={14} />
                                                <span>Upload Image</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className={`bg-white p-1 rounded-2xl shadow-premium ring-1 ring-slate-200/60 focus-within:ring-indigo-500/20 focus-within:ring-4 transition-all duration-500 ${isAILoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <textarea
                                            className="w-full bg-slate-50/20 border-none rounded-xl p-6 pb-14 text-sm leading-relaxed text-slate-700 outline-none h-48 resize-none focus:bg-white transition-all placeholder:text-slate-300 font-medium custom-scrollbar"
                                            value={selectedBlock.content.text || ''}
                                            onChange={(e) => handleChange('text', e.target.value)}
                                            placeholder="Write something amazing..."
                                        />
                                    </div>

                                    {/* Integrated AI Action Button */}
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowAIMenu(!showAIMenu)}
                                                disabled={isAILoading || !selectedBlock.content.text}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${isAILoading
                                                    ? 'bg-slate-100 text-slate-400 translate-y-1'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200 ring-2 ring-indigo-500/10'
                                                    }`}
                                            >
                                                {isAILoading ? (
                                                    <Loader2 size={10} className="animate-spin" />
                                                ) : (
                                                    <Sparkles size={10} />
                                                )}
                                                {isAILoading ? 'Magic...' : 'AI Writer'}
                                            </button>

                                            {showAIMenu && (
                                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-premium border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl bg-white/95">
                                                    <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 mb-2 text-center">Select Action</div>

                                                    <button
                                                        onClick={() => handleAIAction('grammar')}
                                                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                                    >
                                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                            <Sparkles size={14} className="text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Fix Grammar</div>
                                                            <div className="text-[9px] text-slate-400 leading-relaxed">Correct spelling & grammar errors</div>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => handleAIAction('shorter')}
                                                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                                    >
                                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                            <Sparkles size={14} className="text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Shorter</div>
                                                            <div className="text-[9px] text-slate-400 leading-relaxed">Condense while keeping the message</div>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => handleAIAction('longer')}
                                                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                                    >
                                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                            <Sparkles size={14} className="text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Longer</div>
                                                            <div className="text-[9px] text-slate-400 leading-relaxed">Expand with more details & examples</div>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => handleAIAction('friendlier')}
                                                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item"
                                                    >
                                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                                            <Sparkles size={14} className="text-indigo-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Friendlier</div>
                                                            <div className="text-[9px] text-slate-400 leading-relaxed">Rewrite in a warm, welcoming tone</div>
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isAILoading && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-2xl overflow-hidden">
                                            <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Text Styling</h4>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Font Family</label>
                                    <select
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                        value={selectedBlock.content.fontFamily || 'Arial'}
                                        onChange={(e) => handleChange('fontFamily', e.target.value)}
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Inter">Inter</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Comic Sans MS">Comic Sans MS</option>
                                    </select>
                                </div>

                                <div>

                                    <div className="flex bg-slate-50 p-1 rounded-[1.2rem] border border-slate-100/50">
                                        {[
                                            { value: 'left', icon: AlignLeft },
                                            { value: 'center', icon: AlignCenter },
                                            { value: 'right', icon: AlignRight },
                                            { value: 'justify', icon: AlignJustify }
                                        ].map((align) => (
                                            <button
                                                key={align.value}
                                                onClick={() => handleChange('textAlign', align.value, true)}
                                                className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all ${selectedBlock.styles.textAlign === align.value || (!selectedBlock.styles.textAlign && align.value === 'left')
                                                    ? 'bg-white text-indigo-500 shadow-sm ring-1 ring-black/5'
                                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                                                    }`}
                                            >
                                                <align.icon size={16} strokeWidth={2.5} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedBlock.content.fontWeight === 'bold' || false}
                                            onChange={(e) => handleChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                                            className="rounded border-gray-300 text-[#0A66C2] focus:ring-pink-500"
                                        />
                                        <label className="text-sm font-bold text-gray-700">Bold</label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedBlock.content.fontStyle === 'italic' || false}
                                            onChange={(e) => handleChange('fontStyle', e.target.checked ? 'italic' : 'normal')}
                                            className="rounded border-gray-300 text-[#0A66C2] focus:ring-pink-500"
                                        />
                                        <label className="text-sm font-bold text-gray-700">Italic</label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Button (Optional)</h4>
                                    {selectedBlock.content.button && (
                                        <button
                                            onClick={() => handleChange('button', null)}
                                            className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {selectedBlock.content.button ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Label</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                                value={selectedBlock.content.button.text}
                                                onChange={(e) => handleChange('button', { ...selectedBlock.content.button, text: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">URL</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                                value={selectedBlock.content.button.url}
                                                onChange={(e) => handleChange('button', { ...selectedBlock.content.button, url: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Background Color</label>
                                            <div className="flex gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                                    style={{ backgroundColor: selectedBlock.content.button.backgroundColor }}
                                                />
                                                <input
                                                    type="color"
                                                    className="flex-1 h-12 p-0 border-0 rounded-2xl overflow-hidden cursor-pointer"
                                                    value={selectedBlock.content.button.backgroundColor}
                                                    onChange={(e) => handleChange('button', { ...selectedBlock.content.button, backgroundColor: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Text Color</label>
                                            <div className="flex gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                                    style={{ backgroundColor: selectedBlock.content.button.color }}
                                                />
                                                <input
                                                    type="color"
                                                    className="flex-1 h-12 p-0 border-0 rounded-2xl overflow-hidden cursor-pointer"
                                                    value={selectedBlock.content.button.color}
                                                    onChange={(e) => handleChange('button', { ...selectedBlock.content.button, color: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleChange('button', {
                                            text: 'Learn More',
                                            url: '#',
                                            backgroundColor: '#000000',
                                            color: '#ffffff',
                                            borderRadius: '4px'
                                        })}
                                        className="w-full py-3 text-xs font-bold border-2 border-dashed border-[#0A66C2] border-opacity-200 text-[#0A66C2] rounded-2xl hover:border-[#0A66C2] border-opacity-400 hover:bg-[#E7F3FF] transition-all"
                                    >
                                        + Add Button
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                {
                    selectedBlock.type === 'event' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Event Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                    value={selectedBlock.content.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Date & Time</label>
                                <div className="flex gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Day</label>
                                        <input
                                            type="text"
                                            className="w-16 bg-gray-50 border-none rounded-xl px-3 py-3 text-sm font-bold text-center text-gray-700 outline-none"
                                            value={selectedBlock.content.day}
                                            onChange={(e) => handleChange('day', e.target.value)}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Month</label>
                                        <input
                                            type="text"
                                            className="w-20 bg-gray-50 border-none rounded-xl px-3 py-3 text-sm font-bold text-center text-gray-700 outline-none"
                                            value={selectedBlock.content.month}
                                            onChange={(e) => handleChange('month', e.target.value)}
                                            maxLength={3}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-300 uppercase block ml-1">Time</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none"
                                            value={selectedBlock.content.time}
                                            onChange={(e) => handleChange('time', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Calendar Link</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                    value={selectedBlock.content.accessUrl}
                                    onChange={(e) => handleChange('accessUrl', e.target.value)}
                                    placeholder="https://calendar.google.com/..."
                                />
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Color</label>
                                    <div className="flex gap-3">
                                        <div
                                            className="w-12 h-12 rounded-2xl shadow-inner border-2 border-gray-50"
                                            style={{ backgroundColor: selectedBlock.content.itemColor }}
                                        />
                                        <input
                                            type="color"
                                            className="flex-1 h-12 rounded-xl cursor-pointer border-0 p-0 opacity-0 absolute w-12"
                                            value={selectedBlock.content.itemColor}
                                            onChange={(e) => handleChange('itemColor', e.target.value)}
                                        />
                                        <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl font-mono text-xs font-bold text-gray-600">
                                            {selectedBlock.content.itemColor}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'alert' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Type</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all appearance-none"
                                        value={selectedBlock.content.variant}
                                        onChange={(e) => handleChange('variant', e.target.value)}
                                    >
                                        <option value="info">Info (Blue)</option>
                                        <option value="success">Success (Green)</option>
                                        <option value="warning">Warning (Yellow)</option>
                                        <option value="tip">Tip (Gray)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Content</label>
                                <textarea
                                    className="w-full bg-white border-none rounded-3xl p-5 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all h-32 resize-none"
                                    value={selectedBlock.content.text}
                                    onChange={(e) => handleChange('text', e.target.value)}
                                />
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'code' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Code Snippet</label>
                                <textarea
                                    className="w-full bg-gray-900 text-green-400 border-none rounded-3xl p-6 text-xs font-mono shadow-sm outline-none h-64 resize-none leading-relaxed"
                                    value={selectedBlock.content.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'pros-cons' && (
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm">
                                <label className="text-xs font-bold text-green-600 uppercase tracking-wider block ml-1 mb-3">✅ Pros</label>
                                <div className="space-y-2">
                                    {selectedBlock.content.pros?.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                value={item}
                                                onChange={(e) => {
                                                    const newPros = [...selectedBlock.content.pros];
                                                    newPros[i] = e.target.value;
                                                    handleChange('pros', newPros);
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newPros = selectedBlock.content.pros.filter((_: any, idx: number) => idx !== i);
                                                    handleChange('pros', newPros);
                                                }}
                                                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xl"
                                            >×</button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleChange('pros', [...(selectedBlock.content.pros || []), 'New Pro'])}
                                        className="w-full py-3 text-xs font-bold border-2 border-dashed border-green-200 text-green-600 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all"
                                    >
                                        + Add Pro
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm">
                                <label className="text-xs font-bold text-red-600 uppercase tracking-wider block ml-1 mb-3">❌ Cons</label>
                                <div className="space-y-2">
                                    {selectedBlock.content.cons?.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                                                value={item}
                                                onChange={(e) => {
                                                    const newCons = [...selectedBlock.content.cons];
                                                    newCons[i] = e.target.value;
                                                    handleChange('cons', newCons);
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newCons = selectedBlock.content.cons.filter((_: any, idx: number) => idx !== i);
                                                    handleChange('cons', newCons);
                                                }}
                                                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xl"
                                            >×</button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleChange('cons', [...(selectedBlock.content.cons || []), 'New Con'])}
                                        className="w-full py-3 text-xs font-bold border-2 border-dashed border-red-200 text-red-600 rounded-2xl hover:border-red-400 hover:bg-red-50 transition-all"
                                    >
                                        + Add Con
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    selectedBlock.type === 'audio' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                    value={selectedBlock.content.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-3">Cover Image</label>
                                {selectedBlock.content.cover?.startsWith('data:') ? (
                                    <div className="relative group mb-4">
                                        <div className="h-24 w-24 relative rounded-md border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={selectedBlock.content.cover}
                                                alt="Cover"
                                                className="max-h-full max-w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleChange('cover', '')}
                                                    className="bg-white text-red-500 hover:text-red-700 p-1.5 rounded-full shadow-sm"
                                                    title="Remove Cover"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1">Uploaded Cover</p>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm border p-2 mb-2"
                                            value={selectedBlock.content.cover}
                                            onChange={(e) => handleChange('cover', e.target.value)}
                                            placeholder="https://example.com/cover.jpg"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            handleChange('cover', reader.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <button className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-2xl py-3 px-4 transition-colors flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                                <span>Upload Cover</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                        value={selectedBlock.content.duration}
                                        onChange={(e) => handleChange('duration', e.target.value)}
                                        placeholder="12:30"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Progress %</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E7F3FF] outline-none transition-all"
                                        value={selectedBlock.content.progress}
                                        onChange={(e) => handleChange('progress', e.target.value)}
                                        min={0}
                                        max={100}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block ml-1 mb-2">Audio Link</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-[#E7F3FF] outline-none transition-all"
                                    value={selectedBlock.content.url}
                                    onChange={(e) => handleChange('url', e.target.value)}
                                    placeholder="https://spotify.com/..."
                                />
                            </div>
                        </div>
                    )
                }



            </div > {/* Close content div */}
        </div >
    );
};
