
import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
    Type, Image, Square, Columns, Share2, Code,
    Menu as MenuIcon, Timer, QrCode, Table2,
    LayoutTemplate, Minus, Search, Camera,
    Loader2, Star, Music, Terminal, Calendar,
    AlertTriangle, ListChecks, Plus, Settings, Wand2, X,
    Image as ImageIcon
} from 'lucide-react';
import { PricingModal } from '../subscription/PricingModal';
import { Lock } from 'lucide-react';
import { useEmailStore } from '@/store/useEmailStore';
import { canUseBlock } from '@/lib/subscription';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface UnsplashImage {
    id: string;
    urls: { small: string; regular: string };
    alt_description: string;
    user: { name: string; links: { html: string } };
}

// --- Tools Data ---
const TOOLS = [
    { id: 'text', label: 'Text', icon: Type, description: 'Füge formatierten Text zu deiner E-Mail hinzu', category: 'basis' },
    { id: 'image', label: 'Image', icon: ImageIcon, description: 'Füge Bilder von einer URL ein', category: 'basis' },
    { id: 'button', label: 'Button', icon: Square, description: 'Erstelle anklickbare Call-to-Action Buttons', category: 'basis' },
    { id: 'row', label: 'Columns', icon: Columns, description: 'Erstelle mehrspaltige Layouts', category: 'layout' },
    { id: 'divider', label: 'Divider', icon: Minus, description: 'Trenne Elemente mit einer horizontalen Linie', category: 'layout' },
    { id: 'social', label: 'Social', icon: Share2, description: 'Füge Social Media Icons hinzu', category: 'media' },
    { id: 'audio', label: 'Audio', icon: Music, description: 'Füge Audio-Player für Podcasts ein', category: 'media' },
    { id: 'image-text', label: 'Media + Text', icon: LayoutTemplate, description: 'Kombiniere Bilder mit Text', category: 'media' },
    { id: 'html', label: 'HTML', icon: Code, description: 'Füge eigenen HTML-Code ein', category: 'advanced' },
    { id: 'code', label: 'Code Snippet', icon: Terminal, description: 'Zeige Code-Schnipsel mit Syntax-Highlighting', category: 'advanced' },
    { id: 'menu', label: 'Nav Menu', icon: MenuIcon, description: 'Erstelle ein Navigationsmenü', category: 'advanced' },
    { id: 'table', label: 'Grid Table', icon: Table2, description: 'Füge strukturierte Tabellen ein', category: 'advanced' },
    { id: 'nps', label: 'Survey (NPS)', icon: Star, description: 'Erstelle Net Promoter Score Umfragen', category: 'growth' },
    { id: 'countdown', label: 'Countdown', icon: Timer, description: 'Füge einen Countdown-Timer hinzu', category: 'growth' },
    { id: 'qr', label: 'QR Code', icon: QrCode, description: 'Generiere QR-Codes', category: 'growth' },
    { id: 'event', label: 'Event Card', icon: Calendar, description: 'Zeige Event-Details mit Datum an', category: 'growth' },
    { id: 'alert', label: 'Alert Box', icon: AlertTriangle, description: 'Erstelle Info-, Warn- oder Erfolgs-Hinweise', category: 'growth' },
    { id: 'pros-cons', label: 'Pros & Cons', icon: ListChecks, description: 'Erstelle Vor- und Nachteile Listen', category: 'growth' },
];

const CATEGORIES = [
    { id: 'basis', label: 'Basics' },
    { id: 'layout', label: 'Layout' },
    { id: 'media', label: 'Media' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'growth', label: 'Growth' },
];

// --- Components ---

const DraggableTool = ({ tool, isLocked, onLockedClick, onHover }: any) => {
    const toolRef = useRef<HTMLDivElement>(null);
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `toolbox-${tool.id}`,
        data: { type: tool.id, isToolboxItem: true },
        disabled: isLocked
    });

    return (
        <div
            ref={(node) => { setNodeRef(node); (toolRef as any).current = node; }}
            {...listeners}
            {...attributes}
            onMouseEnter={() => { if (toolRef.current) onHover(tool, toolRef.current.getBoundingClientRect()); }}
            onMouseLeave={() => onHover(null, null)}
            onClick={isLocked ? onLockedClick : undefined}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group
                ${isLocked ? 'opacity-40 grayscale' : 'cursor-grab hover:bg-slate-50 hover:shadow-sm active:scale-95'}
                ${isDragging ? 'opacity-20 scale-95' : ''}
            `}
        >
            <tool.icon className={`w-6 h-6 ${isLocked ? 'text-slate-300' : 'text-slate-500 group-hover:text-indigo-600'} group-hover:scale-110 transition-all`} strokeWidth={1.8} />
            {isLocked && <Lock className="absolute top-1.5 right-1.5 w-2.5 h-2.5 text-amber-500" />}
        </div>
    );
};

const DraggablePhoto = ({ image }: { image: UnsplashImage }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `photo-${image.id}`,
        data: {
            type: 'image',
            isToolboxItem: true,
            payload: { src: image.urls.regular, alt: image.alt_description || 'Unsplash Image' }
        }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-grab group transition-all duration-200 border border-slate-100 shadow-sm
                ${isDragging ? 'opacity-20 scale-90' : 'hover:shadow-md hover:scale-[1.02]'}
            `}
        >
            <img src={image.urls.small} alt={image.alt_description} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
    );
};

export const Toolbox = () => {
    const { subscription } = useEmailStore();
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [tooltip, setTooltip] = useState<{ tool: any, rect: DOMRect } | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const libraryRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    // Photos State
    const [photos, setPhotos] = useState<UnsplashImage[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [photoQuery, setPhotoQuery] = useState('office');

    const fetchPhotos = async (query: string) => {
        if (!query) return;
        setLoadingPhotos(true);
        try {
            const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.results) setPhotos(data.results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPhotos(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isLibraryOpen &&
                libraryRef.current &&
                !libraryRef.current.contains(event.target as Node) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target as Node)
            ) {
                setIsLibraryOpen(false);
            }
        };

        if (isLibraryOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLibraryOpen]);

    useEffect(() => {
        if (isLibraryOpen && photos.length === 0) fetchPhotos(photoQuery);
    }, [isLibraryOpen]);

    return (
        <div className="flex relative h-full z-20 select-none">
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />

            {/* --- MAIN ICON RAIL (68px) --- */}
            <div className="w-[68px] bg-white border-r border-slate-200 flex flex-col items-center py-6 h-full shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">

                {/* Logo/Add Tool */}
                <div className="mb-8">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105">
                        <Plus size={22} strokeWidth={3} />
                    </div>
                </div>

                {/* Library Toggle (Photos) */}
                <button
                    ref={toggleButtonRef}
                    onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                    className={`w-12 h-12 mb-6 rounded-xl flex items-center justify-center transition-all 
                        ${isLibraryOpen ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                    <Camera size={24} />
                    {isLibraryOpen && <div className="absolute right-0 w-1 h-6 bg-indigo-600 rounded-l-full" />}
                </button>

                {/* Tool Icons */}
                <div className="flex-1 w-full overflow-y-auto no-scrollbar px-2 space-y-1">
                    {CATEGORIES.map((category, idx) => {
                        const tools = TOOLS.filter(t => t.category === category.id);
                        return (
                            <div key={category.id} className="flex flex-col items-center gap-1">
                                {idx > 0 && <div className="w-8 h-[1px] bg-slate-100 my-1.5" />}
                                {tools.map(tool => (
                                    <DraggableTool
                                        key={tool.id}
                                        tool={tool}
                                        onHover={(t: any, r: any) => setTooltip(r ? { tool: t, rect: r } : null)}
                                        isLocked={!canUseBlock(subscription, tool.id as any)}
                                        onLockedClick={() => setIsPricingOpen(true)}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-4 items-center">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors pb-2">
                        <Settings size={24} />
                    </button>
                </div>
            </div>

            {/* --- SLIDE-OUT ASSET LIBRARY --- */}
            <AnimatePresence>
                {isLibraryOpen && (
                    <motion.div
                        ref={libraryRef}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -250, opacity: 0 }}
                        className="absolute left-[68px] top-0 bottom-0 w-[300px] bg-white border-r border-slate-200 shadow-[20px_0_50px_rgba(0,0,0,0.05)] z-[-1] flex flex-col"
                    >
                        <header className="p-6 pb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Photos</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Powered by Unsplash</p>
                            </div>
                            <button onClick={() => setIsLibraryOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="px-6 pb-4">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Search creative photos..."
                                    value={photoQuery}
                                    onChange={(e) => setPhotoQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchPhotos(photoQuery)}
                                />
                                {loadingPhotos && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 pb-12 custom-scrollbar">
                            {loadingPhotos ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center animate-pulse">
                                        <Loader2 className="w-6 h-6 text-indigo-200 animate-spin" />
                                    </div>
                                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Searching...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {photos.map(photo => (
                                        <DraggablePhoto key={photo.id} image={photo} />
                                    ))}
                                </div>
                            )}

                            {photos.length === 0 && !loadingPhotos && (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100 border-dashed">
                                        <Search size={24} className="text-slate-200" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">Try searching for something else</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tooltip for Rails */}
            {tooltip && !isLibraryOpen && (
                <div
                    className="fixed left-[76px] z-[110] animate-in fade-in slide-in-from-left-2 duration-150 pointer-events-none"
                    style={{ top: `${tooltip.rect.top + tooltip.rect.height / 2}px`, transform: 'translateY(-50%)' }}
                >
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-2xl border border-slate-700 flex flex-col gap-0.5 min-w-[140px]">
                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{tooltip.tool.category}</div>
                        <div className="text-sm font-bold truncate">{tooltip.tool.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight pr-2">{tooltip.tool.description}</div>
                    </div>
                    <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-700" />
                </div>
            )}
        </div>
    );
};
