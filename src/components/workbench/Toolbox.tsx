
import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Image, Square, Columns, LucideIcon, Share2, Play, Code, Menu as MenuIcon, ShoppingBag, Smile, Timer, QrCode, Table2, LayoutTemplate, Minus, Search, Layers, Camera, Loader2 } from 'lucide-react';
import { PricingModal } from '../subscription/PricingModal';

// --- Types ---
interface UnsplashImage {
    id: string;
    urls: { small: string; regular: string };
    alt_description: string;
    user: { name: string; links: { html: string } };
}

// --- Tools Data ---
const TOOLS = [
    { id: 'text', label: 'Text', icon: Type, description: 'Füge formatierten Text zu deiner E-Mail hinzu' },
    { id: 'image', label: 'Image', icon: Image, description: 'Füge Bilder von einer URL ein' },
    { id: 'button', label: 'Button', icon: Square, description: 'Erstelle anklickbare Call-to-Action Buttons' },
    { id: 'divider', label: 'Trenner', icon: Minus, description: 'Trenne Elemente mit einer horizontalen Linie' },
    { id: 'row', label: 'Row', icon: Columns, description: 'Erstelle mehrspaltige Layouts' },
    { id: 'social', label: 'Social', icon: Share2, description: 'Füge Social Media Icons hinzu' },
    { id: 'html', label: 'HTML', icon: Code, description: 'Füge eigenen HTML-Code ein' },
    { id: 'menu', label: 'Menu', icon: MenuIcon, description: 'Erstelle ein Navigationsmenü' },
    { id: 'nps', label: 'NPS', icon: Smile, description: 'Erstelle Net Promoter Score Umfragen' },
    { id: 'countdown', label: 'Timer', icon: Timer, description: 'Füge einen Countdown-Timer hinzu' },
    { id: 'qr', label: 'QR', icon: QrCode, description: 'Generiere QR-Codes' },
    { id: 'table', label: 'Table', icon: Table2, description: 'Füge strukturierte Tabellen ein' },
    { id: 'image-text', label: 'Media', icon: LayoutTemplate, description: 'Kombiniere Bilder mit Text' },
    { id: 'event', label: 'Event', icon: Timer, description: 'Zeige Event-Details mit Datum an' },
    { id: 'alert', label: 'Alert', icon: Smile, description: 'Erstelle Info-, Warn- oder Erfolgs-Hinweise' },
    { id: 'code', label: 'Code', icon: Code, description: 'Zeige Code-Schnipsel mit Syntax-Highlighting' },
    { id: 'pros-cons', label: 'Pros/Cons', icon: Table2, description: 'Erstelle Vor- und Nachteile Listen' },
    { id: 'audio', label: 'Audio', icon: Play, description: 'Füge Audio-Player für Podcasts ein' },
];

// --- Components ---

import { Lock } from 'lucide-react';
import { useEmailStore } from '@/store/useEmailStore';
import { canUseBlock } from '@/lib/subscription';

const DraggableTool = ({ tool, onHover, isLocked, onLockedClick }: { tool: any, onHover: (tool: any, rect: DOMRect | null) => void, isLocked: boolean, onLockedClick: () => void }) => {
    const toolRef = useRef<HTMLDivElement>(null);
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `toolbox-${tool.id}`,
        data: {
            type: tool.id,
            isToolboxItem: true
        },
        disabled: isLocked // Disable dragging if locked
    });

    const handleMouseEnter = () => {
        if (toolRef.current) {
            const rect = toolRef.current.getBoundingClientRect();
            onHover(tool, rect);
        }
    };

    const handleMouseLeave = () => {
        onHover(tool, null);
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                (toolRef as any).current = node;
            }}
            {...listeners}
            {...attributes}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={isLocked ? onLockedClick : undefined}
            className={`relative flex items-center gap-3 p-3 bg-white border border-slate-200/60 rounded-xl shadow-subtle transition-all duration-200 group
                ${isLocked
                    ? 'cursor-pointer opacity-70 grayscale hover:grayscale-0 hover:border-amber-400 hover:shadow-amber-100 hover:bg-amber-50/10'
                    : 'cursor-grab hover:shadow-hover hover:border-indigo-500/50 hover:bg-slate-50 active:scale-[0.98]'
                }
                ${isDragging ? 'opacity-50 ring-2 ring-indigo-500 ring-offset-2 scale-95' : ''}
            `}
        >
            <div className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 shadow-sm border
                ${isLocked
                    ? 'bg-slate-50 text-slate-400 border-slate-100'
                    : 'bg-slate-50 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 border-slate-100 group-hover:border-indigo-100'
                }
            `}>
                <tool.icon className="w-4 h-4" />
            </div>
            <span className={`text-[13px] font-bold tracking-tight truncate flex-1 ${isLocked ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-900'}`}>
                {tool.label}
            </span>

            {isLocked && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500">
                    <Lock className="w-3.5 h-3.5" />
                </div>
            )}
        </div>
    );
};

const DraggablePhoto = ({ image }: { image: UnsplashImage }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `photo-${image.id}`,
        data: {
            type: 'image', // Creates an 'Image' block
            isToolboxItem: true,
            payload: {
                src: image.urls.regular,
                alt: image.alt_description || 'Unsplash Image'
            }
        }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-grab group ${isDragging ? 'opacity-50 ring-2 ring-indigo-500' : ''}`}
        >
            <img
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm text-[8px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                by {image.user.name}
            </div>
        </div>
    );
}

export const Toolbox = () => {
    const { subscription } = useEmailStore();
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<'elements' | 'photos'>('elements');
    const [tooltip, setTooltip] = useState<{ tool: any, top: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Photos State
    const [photos, setPhotos] = useState<UnsplashImage[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [photoQuery, setPhotoQuery] = useState('office'); // Default query

    // Debounce Photo Search
    useEffect(() => {
        if (activeTab === 'photos') {
            const timer = setTimeout(() => {
                fetchPhotos(photoQuery);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [photoQuery, activeTab]);

    const fetchPhotos = async (query: string) => {
        if (!query) return;
        setLoadingPhotos(true);
        try {
            const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.results) {
                setPhotos(data.results);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPhotos(false);
        }
    };

    const filteredTools = TOOLS.filter(tool =>
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleHover = (tool: any, rect: DOMRect | null) => {
        if (rect && tool.description) {
            setTooltip({
                tool,
                top: rect.top + rect.height / 2
            });
        } else {
            setTooltip(null);
        }
    };

    return (
        <div className="w-[200px] bg-white border-r border-slate-200 pb-8 flex flex-col h-full z-20 shadow-[1px_0_10px_rgba(0,0,0,0.02)] relative">
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />

            {/* Tabs Header */}
            <div className="p-4 pb-2">
                <div className="flex bg-slate-100/80 p-1 rounded-xl mb-4 border border-slate-200">
                    <button
                        onClick={() => setActiveTab('elements')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'elements'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Layers size={14} />
                        Elements
                    </button>
                    <button
                        onClick={() => setActiveTab('photos')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'photos'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Camera size={14} />
                        Photos
                    </button>
                </div>

                <div className="flex flex-col gap-1 px-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">
                        {activeTab === 'elements' ? 'Build' : 'Library'}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        {activeTab === 'elements' ? 'Toolbox' : 'Unsplash'}
                    </h2>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 pb-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 sm:text-xs font-medium shadow-sm"
                        placeholder={activeTab === 'elements' ? "Search components..." : "Search photos..."}
                        value={activeTab === 'elements' ? searchQuery : photoQuery}
                        onChange={(e) => activeTab === 'elements' ? setSearchQuery(e.target.value) : setPhotoQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-4 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar pb-8">

                {activeTab === 'elements' && (
                    filteredTools.length > 0 ? (
                        filteredTools.map((tool) => {
                            // Check if block is allowed
                            const isLocked = !canUseBlock(subscription, tool.id as any);

                            return (
                                <DraggableTool
                                    key={tool.id}
                                    tool={tool}
                                    onHover={handleHover}
                                    isLocked={isLocked}
                                    onLockedClick={() => setIsPricingOpen(true)}
                                />
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                            <p className="text-xs text-slate-500 font-medium">No tools found</p>
                        </div>
                    )
                )}

                {activeTab === 'photos' && (
                    <>
                        {loadingPhotos ? (
                            <div className="py-8 flex justify-center">
                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {photos.map((photo) => (
                                    <DraggablePhoto key={photo.id} image={photo} />
                                ))}
                            </div>
                        )}
                        {!loadingPhotos && photos.length === 0 && (
                            <div className="text-center py-8 text-xs text-slate-400">
                                No images found
                            </div>
                        )}
                        <div className="text-[9px] text-center text-slate-300 pt-4 pb-2">
                            Photos by Unsplash
                        </div>
                    </>
                )}
            </div>

            {/* Tooltip for Elements */}
            {tooltip && activeTab === 'elements' && (
                <div
                    className="fixed left-[210px] z-50 pointer-events-none transition-all duration-150"
                    style={{
                        top: `${tooltip.top}px`,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-elevated border border-white/10 max-w-[260px] animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            <div className="text-xs font-black uppercase tracking-widest text-indigo-300">{tooltip.tool.label}</div>
                        </div>
                        <div className="text-[13px] text-slate-300 leading-relaxed font-medium tracking-tight font-sans italic">{tooltip.tool.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
