import React, { useState, useEffect } from 'react';
import { Block, useEmailStore } from '@/store/useEmailStore';
import { Resizable } from 're-resizable';
import { Trash2, Star, Frown, Meh, Smile, Laugh, Angry, Plus, Sparkles, Loader2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

export const CanvasBlock = ({ block }: { block: Block }) => {
    const { updateBlock, removeBlock, selectBlock, selectedBlockId } = useEmailStore();
    const [showAIMenu, setShowAIMenu] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);

    // Close AI menu when switching to a different block
    useEffect(() => {
        if (selectedBlockId !== block.id) {
            setShowAIMenu(false);
        }
    }, [selectedBlockId, block.id]);

    const handleAIAction = async (action: string) => {
        if (!block.content.text) return;

        setIsAILoading(true);
        setShowAIMenu(false);
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: block.content.text, action })
            });
            const data = await response.json();
            if (data.result) {
                updateBlock(block.id, {
                    content: { ...block.content, text: data.result }
                });
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

    // For buttons, we don't want the container to have the background color
    const containerStyle: Record<string, any> = { ...block.styles };
    // Button: Needs padding for spacing, but NO background/border (that belongs to the button itself)
    if (block.type === 'button') {
        delete containerStyle.backgroundColor;
        delete containerStyle.border;
        delete containerStyle.borderRadius;
        delete containerStyle.width;
        delete containerStyle.height;
        // Optimization: Keep padding!
    }
    // Other blocks: handle sizing internally or via children, need full width container, usually strip all container styles
    else if (['image', 'social', 'video', 'menu', 'product-card', 'nps', 'countdown', 'qr', 'table', 'image-text', 'event', 'audio', 'pros-cons', 'alert', 'code', 'divider'].includes(block.type)) {
        delete containerStyle.backgroundColor;
        delete containerStyle.border;
        delete containerStyle.borderRadius;
        delete containerStyle.width;
        delete containerStyle.height;
        delete containerStyle.padding;
    }

    const { setNodeRef, isOver } = useDroppable({
        id: `drop-zone-${block.id}`,
        // Only valid target if button doesn't exist yet
        disabled: !!block.content.button
    });

    return (
        <div
            style={containerStyle}
            className="relative group"
            onClick={(e) => {
                e.stopPropagation();
                selectBlock(block.id);
            }}
        >
            <div className="absolute -top-4 -right-4 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2">
                {(block.type === 'text' || block.type === 'image-text') && (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAIMenu(!showAIMenu);
                            }}
                            disabled={isAILoading || !block.content.text}
                            className={`bg-white w-8 h-8 flex items-center justify-center rounded-2xl shadow-premium border transition-all duration-200 ${isAILoading
                                ? 'text-slate-300 border-slate-100'
                                : 'text-indigo-500 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200'
                                }`}
                            title="AI Writer"
                        >
                            {isAILoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        </button>

                        {showAIMenu && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-premium border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 mb-2 text-center">AI Writer</div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAIAction('grammar'); }}
                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                        <Sparkles size={14} className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Fix Grammar</div>
                                        <div className="text-[9px] text-slate-400 leading-relaxed">Correct spelling & grammar</div>
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAIAction('shorter'); }}
                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                        <Sparkles size={14} className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Shorter</div>
                                        <div className="text-[9px] text-slate-400 leading-relaxed">Condense the message</div>
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAIAction('longer'); }}
                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item mb-1"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                        <Sparkles size={14} className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Longer</div>
                                        <div className="text-[9px] text-slate-400 leading-relaxed">Expand with details</div>
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAIAction('friendlier'); }}
                                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50 rounded-2xl transition-all group/item"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5">
                                        <Sparkles size={14} className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-bold text-slate-700 group-hover/item:text-indigo-600 mb-0.5">Make it Friendlier</div>
                                        <div className="text-[9px] text-slate-400 leading-relaxed">Warm, welcoming tone</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                    }}
                    className="bg-white text-slate-400 hover:text-rose-500 w-8 h-8 flex items-center justify-center rounded-2xl shadow-premium border border-slate-100 hover:border-rose-100 hover:bg-rose-50/50 transition-all duration-200"
                    title="Delete Block"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {block.type === 'text' && (
                <div
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                        fontFamily: block.content.fontFamily || block.styles.fontFamily || 'Arial',
                        fontSize: block.styles.fontSize || '16px',
                        fontWeight: block.styles.fontWeight || '400',
                        color: block.styles.color || '#1e293b',
                        lineHeight: block.styles.lineHeight || '1.5',
                        textAlign: (block.styles.textAlign as any) || 'left',
                        letterSpacing: block.styles.letterSpacing,
                        fontStyle: block.content.fontStyle || block.styles.fontStyle || 'normal'
                    }}
                >
                    {block.content.text}
                </div>
            )}

            {/* ... other block types ... */}

            {block.type === 'button' && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: block.styles.textAlign === 'left' ? 'flex-start' :
                            block.styles.textAlign === 'right' ? 'flex-end' : 'center',
                        alignItems: 'center', // Prevent full height stretch
                        width: '100%'
                    }}
                >
                    <Resizable
                        size={{
                            width: block.styles.width || 'auto',
                            height: block.styles.height || 'auto'
                        }}
                        minWidth={100}
                        minHeight={40}
                        maxWidth="100%"
                        onResizeStop={(e, direction, ref, d) => {
                            updateBlock(block.id, {
                                styles: {
                                    ...block.styles,
                                    width: ref.style.width,
                                    height: ref.style.height,
                                }
                            });
                        }}
                        style={{
                            width: block.styles.width || 'auto',
                            height: block.styles.height || 'auto',
                            maxWidth: '100%',
                        }}
                        handleStyles={{
                            topLeft: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', left: '-5px', top: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                            topRight: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', right: '-5px', top: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                            bottomLeft: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', left: '-5px', bottom: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                            bottomRight: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', right: '-5px', bottom: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                        }}
                        handleClasses={{
                            topLeft: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            topRight: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            bottomLeft: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            bottomRight: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            left: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            right: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            top: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            bottom: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        }}
                        enable={{
                            top: false, right: true, bottom: true, left: true,
                            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
                        }}
                        className="relative group"
                    >
                        <div
                            className="flex items-center justify-center w-full h-full pointer-events-none"
                            style={{
                                backgroundColor: block.styles.backgroundColor,
                                color: block.styles.color,
                                fontFamily: block.styles.fontFamily || 'Arial, sans-serif',
                                fontWeight: block.styles.fontWeight || 'bold',
                                textDecoration: 'none',
                                borderRadius: block.styles.borderRadius || '12px',
                                whiteSpace: 'normal',
                                wordBreak: 'normal',
                                overflowWrap: 'break-word',
                                textAlign: 'center',
                                lineHeight: '1.2',
                                padding: '12px 24px',
                                width: '100%',
                                height: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            {block.content.text}
                        </div>
                    </Resizable>
                </div>
            )}

            {block.type === 'image' && (
                <Resizable
                    lockAspectRatio={false} // We let DOM handle ratio via height: auto
                    size={{
                        width: block.styles.width || '100%',
                        height: 'auto'
                    }}
                    maxWidth="100%"
                    onResizeStop={(e, direction, ref, d) => {
                        updateBlock(block.id, {
                            styles: {
                                ...block.styles,
                                width: ref.style.width,
                                height: 'auto', // Force auto height
                            }
                        });
                    }}
                    handleStyles={{
                        topLeft: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', left: '-5px', top: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                        topRight: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', right: '-5px', top: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                        bottomLeft: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', left: '-5px', bottom: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                        bottomRight: { width: '10px', height: '10px', background: 'white', border: '2px solid #6366f1', borderRadius: '4px', right: '-5px', bottom: '-5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                    }}
                    handleClasses={{
                        topLeft: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        topRight: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        bottomLeft: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        bottomRight: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        left: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        right: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        top: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                        bottom: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                    }}
                    enable={{
                        top: false, right: true, bottom: false, left: true,
                        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
                    }}
                    className="relative group inline-block"
                >
                    <img
                        src={block.content.src || 'https://placehold.co/600x200/f3f4f6/9ca3af?text=Image'}
                        alt="Placeholder"
                        className="w-full h-auto"
                    />
                </Resizable>
            )}

            {block.type === 'social' && (
                <div className="inline-flex gap-3 items-center justify-center p-2">
                    {/* Real Icons for Editor */}
                    {block.content.networks?.facebook && (
                        <img
                            src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/facebook@2x.png'}
                            alt="Facebook"
                            className="w-8 h-8 pointer-events-none"
                        />
                    )}
                    {block.content.networks?.instagram && (
                        <img
                            src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/instagram@2x.png'}
                            alt="Instagram"
                            className="w-8 h-8 pointer-events-none"
                        />
                    )}
                    {block.content.networks?.linkedin && (
                        <img
                            src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/linkedin@2x.png'}
                            alt="LinkedIn"
                            className="w-8 h-8 pointer-events-none"
                        />
                    )}
                    {block.content.networks?.x && (
                        <img
                            src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/twitter@2x.png'}
                            alt="X"
                            className="w-8 h-8 pointer-events-none"
                        />
                    )}
                </div>
            )}

            {block.type === 'video' && (
                <div className="relative group inline-block max-w-full bg-white p-2.5 border border-slate-100 rounded-2xl shadow-premium">
                    <img
                        src={block.content.thumbnail}
                        alt="Video Thumbnail"
                        className="w-full h-auto max-w-[600px] rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-premium active:scale-95 transition-transform">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-indigo-600 border-b-[10px] border-b-transparent ml-1"></div>
                        </div>
                    </div>
                </div>
            )}

            {block.type === 'html' && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded text-xs font-mono text-gray-500 text-center">
                    {'</> HTML Snippet'}
                </div>
            )}

            {block.type === 'menu' && (
                <div className="inline-flex flex-wrap gap-4 items-center justify-center p-2">
                    {block.content.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center">
                            <span className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer" style={{ color: block.styles.color }}>
                                {item.text}
                            </span>
                            {i < block.content.items.length - 1 && (
                                <span className="ml-4 text-gray-300">{block.content.separator}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {block.type === 'product-card' && (
                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden max-w-[300px] inline-block shadow-sm text-center">
                    <div className="relative">
                        <img src={block.content.image || 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Product'} className="w-full h-48 object-cover" />
                        {block.content.badge && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                {block.content.badgeText}
                            </span>
                        )}
                    </div>
                    <div className="p-4 bg-white">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{block.content.title}</h3>
                        <div className="text-sm text-gray-500 mb-3">
                            {block.content.originalPrice ? (
                                <>
                                    <span className="line-through mr-2 text-gray-400">{block.content.originalPrice} {block.content.currency}</span>
                                    <span className="font-bold" style={{ color: block.content.priceColor || '#000' }}>{block.content.price} {block.content.currency}</span>
                                </>
                            ) : (
                                <span className="font-bold" style={{ color: block.content.priceColor || '#000' }}>{block.content.price} {block.content.currency}</span>
                            )}
                        </div>
                        <button className="bg-blue-600 text-white text-xs py-2 px-4 rounded w-full hover:bg-blue-700 transition-colors">
                            {block.content.btnText}
                        </button>
                    </div>
                </div>
            )}

            {block.type === 'nps' && (
                <div className="inline-flex gap-2 p-2 items-center justify-center w-full flex-wrap">
                    {(!block.content.variant || block.content.variant === 'numbers') && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <div key={n} className="w-8 h-8 border border-gray-200 flex items-center justify-center rounded hover:bg-gray-50 text-xs font-medium text-gray-600 cursor-pointer transition-colors">
                            {n}
                        </div>
                    ))}
                    {block.content.variant === 'stars' && (
                        <div className="flex flex-row-reverse gap-1 justify-end">
                            {[5, 4, 3, 2, 1].map(n => (
                                <div key={n} className="cursor-pointer text-gray-300 hover:text-yellow-400 peer peer-hover:text-yellow-400 transition-colors p-1">
                                    <Star size={32} fill="currentColor" stroke="none" className="drop-shadow-sm" />
                                </div>
                            ))}
                        </div>
                    )}

                    {block.content.variant === 'smileys' && (
                        <>
                            <div className="p-2 text-red-500 cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100" title="Very Unhappy"><Angry size={32} /></div>
                            <div className="p-2 text-orange-500 cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100" title="Unhappy"><Frown size={32} /></div>
                            <div className="p-2 text-yellow-500 cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100" title="Neutral"><Meh size={32} /></div>
                            <div className="p-2 text-lime-500 cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100" title="Happy"><Smile size={32} /></div>
                            <div className="p-2 text-green-600 cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100" title="Very Happy"><Laugh size={32} /></div>
                        </>
                    )}
                </div>
            )}

            {block.type === 'countdown' && (
                <div className="inline-block w-full max-w-[400px]">
                    <div className="flex justify-center gap-4 p-4 rounded-lg" style={{ backgroundColor: block.content.backgroundColor || '#f3f4f6' }}>
                        <div className="text-center">
                            <div className="text-2xl font-bold font-mono" style={{ color: block.content.numberColor || '#1f2937' }}>{block.content.days || '00'}</div>
                            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: block.content.labelColor || '#6b7280' }}>Days</div>
                        </div>
                        <div className="text-2xl font-bold font-mono self-start mt-[-2px]" style={{ color: block.content.labelColor || '#9ca3af' }}>:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold font-mono" style={{ color: block.content.numberColor || '#1f2937' }}>{block.content.hours || '00'}</div>
                            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: block.content.labelColor || '#6b7280' }}>Hours</div>
                        </div>
                        <div className="text-2xl font-bold font-mono self-start mt-[-2px]" style={{ color: block.content.labelColor || '#9ca3af' }}>:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold font-mono" style={{ color: block.content.numberColor || '#1f2937' }}>{block.content.minutes || '00'}</div>
                            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: block.content.labelColor || '#6b7280' }}>Mins</div>
                        </div>
                        <div className="text-2xl font-bold font-mono self-start mt-[-2px]" style={{ color: block.content.labelColor || '#9ca3af' }}>:</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold font-mono" style={{ color: block.content.numberColor || '#1f2937' }}>{block.content.seconds || '00'}</div>
                            <div className="text-xs uppercase tracking-wider mt-1" style={{ color: block.content.labelColor || '#6b7280' }}>Secs</div>
                        </div>
                    </div>
                </div>
            )}

            {block.type === 'qr' && (
                <div className="inline-block p-2 bg-white rounded border border-gray-100" style={{ width: 'fit-content' }}>
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=${block.content.size}x${block.content.size}&data=${encodeURIComponent(block.content.value)}&color=${block.content.color.replace('#', '')}`}
                        alt="QR Code"
                        style={{ width: `${block.content.size}px`, height: `${block.content.size}px`, maxWidth: 'none' }}
                        draggable={false}
                    />
                </div>
            )}

            {block.type === 'table' && (
                <div className="w-full inline-block">
                    <table className="w-full text-sm border-collapse table-fixed">
                        <tbody>
                            {block.content.rows?.map((row: any, i: number) => {
                                const colCount = block.content.hasThirdColumn ? 3 : 2;
                                const width = `${100 / colCount}%`;
                                return (
                                    <tr key={i} style={{ backgroundColor: block.content.striped && i % 2 === 1 ? '#f9fafb' : 'transparent' }}>
                                        <td
                                            className={`p-2 border-b border-gray-100 align-top break-words ${block.content.boldFirstColumn !== false ? 'font-bold' : ''}`}
                                            style={{ color: block.content.textColor, width }}
                                        >
                                            {row.label}
                                        </td>
                                        <td className="p-2 border-b border-gray-100 text-right align-top break-words" style={{ color: block.content.textColor, width }}>
                                            {row.value}
                                        </td>
                                        {block.content.hasThirdColumn && (
                                            <td className="p-2 border-b border-gray-100 text-right text-gray-500 text-xs align-top break-all" style={{ color: block.content.textColor, opacity: 0.7, width }}>
                                                {row.col3 || ''}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {block.type === 'image-text' && (
                <div className={`flex flex-col md:flex-row w-full gap-4 ${block.content.isReversed ? 'md:flex-row-reverse' : ''}`} style={{ backgroundColor: block.content.backgroundColor }}>
                    {/* Image Column */}
                    <div style={{ flex: block.content.layout === '30-70' ? (block.content.isReversed ? 1.4 : 0.6) : block.content.layout === '70-30' ? (block.content.isReversed ? 0.6 : 1.4) : 1 }}>
                        <img
                            src={block.content.image || 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Media'}
                            alt="Media"
                            className="w-full h-full object-cover rounded bg-gray-100"
                            style={{ minHeight: '150px' }}
                        />
                    </div>

                    {/* Text Column */}
                    <div className="flex flex-col justify-center text-left p-2" style={{ flex: 1 }}>
                        <div
                            className="prose prose-sm max-w-none"
                            style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: block.content.fontFamily || block.styles.fontFamily || 'Arial',
                                fontSize: block.styles.fontSize || '16px',
                                fontWeight: block.styles.fontWeight || '400',
                                color: block.styles.color || '#475569',
                                lineHeight: block.styles.lineHeight || '1.6',
                                textAlign: (block.styles.textAlign as any) || 'left',
                                fontStyle: block.content.fontStyle || block.styles.fontStyle || 'normal'
                            }}
                        >
                            {block.content.text}
                        </div>

                        {/* Nested Drop Zone for Button */}
                        <div className="mt-4">
                            {block.content.button ? (
                                <a
                                    href={block.content.button.url}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: block.content.button.backgroundColor,
                                        color: block.content.button.color,
                                        padding: '10px 20px',
                                        borderRadius: block.content.button.borderRadius || '4px',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: 500
                                    }}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {block.content.button.text}
                                </a>
                            ) : (
                                <div
                                    ref={setNodeRef}
                                    className={`border-2 border-dashed rounded p-4 text-center text-xs transition-colors ${isOver ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400'}`}
                                >
                                    {isOver ? (
                                        <div className="flex flex-col items-center">
                                            <Plus size={16} className="mb-1" />
                                            <span>Drop Button Here</span>
                                        </div>
                                    ) : (
                                        <span>Drag Button Here</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {block.type === 'event' && (
                <div className="inline-flex w-full bg-white rounded-lg border border-gray-100 overflow-hidden max-w-[400px] text-left">
                    <div className="w-24 text-white flex flex-col items-center justify-center p-4" style={{ backgroundColor: block.content.itemColor }}>
                        <span className="text-3xl font-bold leading-none">{block.content.day}</span>
                        <span className="text-xs font-bold uppercase mt-1 opacity-90">{block.content.month}</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{block.content.title}</h4>
                        <div className="text-xs text-gray-500 mb-2">{block.content.time}</div>
                        <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded self-start font-medium transition-colors">
                            {block.content.btnText}
                        </button>
                    </div>
                </div>
            )}

            {block.type === 'alert' && (
                <div className={`p-4 rounded-lg flex gap-3 text-left w-full items-start ${block.content.variant === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                    block.content.variant === 'success' ? 'bg-green-50 text-green-800' :
                        block.content.variant === 'tip' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-50 text-blue-800'
                    }`}>
                    <div className="text-lg leading-none mt-0.5">
                        {block.content.variant === 'warning' ? '⚠️' :
                            block.content.variant === 'success' ? '✅' :
                                block.content.variant === 'tip' ? '🔥' :
                                    'ℹ️'}
                    </div>
                    <div className="text-sm font-medium">{block.content.text}</div>
                </div>
            )}

            {block.type === 'code' && (
                <div className="w-full text-left bg-[#1e1e1e] rounded-lg p-4 overflow-hidden shadow-sm">
                    <div className="flex gap-1.5 mb-3 border-b border-white/10 pb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <pre className="text-xs font-mono text-white leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {block.content.code}
                    </pre>
                </div>
            )}

            {block.type === 'pros-cons' && (
                <div className="grid grid-cols-2 gap-4 w-full text-left">
                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                        <h4 className="flex items-center gap-2 font-bold text-green-700 mb-3 text-sm">
                            <span className="bg-green-100 p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                            Pros
                        </h4>
                        <ul className="space-y-2">
                            {block.content.pros?.map((item: string, i: number) => (
                                <li key={i} className="flex gap-2 text-sm text-gray-700">
                                    <span className="text-green-500">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                        <h4 className="flex items-center gap-2 font-bold text-red-700 mb-3 text-sm">
                            <span className="bg-red-100 p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</span>
                            Cons
                        </h4>
                        <ul className="space-y-2">
                            {block.content.cons?.map((item: string, i: number) => (
                                <li key={i} className="flex gap-2 text-sm text-gray-700">
                                    <span className="text-red-500">✕</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {block.type === 'audio' && (
                <div className="inline-flex w-full items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-[450px] text-left">
                    <img
                        src={block.content.cover}
                        alt="Cover"
                        className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Podcast</div>
                        <div className="font-bold text-gray-900 text-sm truncate mb-2">{block.content.title}</div>

                        {/* Fake Progress Bar */}
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" style={{ width: `${block.content.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium font-mono">
                            <span>12:40</span>
                            <span> {block.content.duration}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M12.5 6.70096C13.8333 7.47076 13.8333 9.39526 12.5 10.1651L3.5 15.3612C2.16667 16.131 0.5 15.1688 0.5 13.6293L0.5 3.23671C0.5 1.69723 2.16667 0.734976 3.5 1.50478L12.5 6.70096Z" /></svg>
                    </div>
                </div>
            )}

            {block.type === 'divider' && (
                <div className="w-full py-6 px-2 border-2 border-transparent hover:border-slate-100 hover:bg-slate-50/50 rounded-xl transition-all duration-300">
                    <hr
                        style={{
                            border: 'none',
                            borderTop: `${block.content.thickness || 1}px ${block.content.style || 'solid'} ${block.content.color || '#E2E8F0'}`,
                            margin: 0
                        }}
                    />
                </div>
            )}
        </div >
    );
};
