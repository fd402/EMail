'use client';

import React from 'react';
import { Block } from '@/store/useEmailStore';
import { Layout, Image as ImageIcon, Type, MousePointer2, Percent, List, Calendar, Table, Code as CodeIcon, AlertCircle, Zap } from 'lucide-react';

const MiniBlock = ({ block }: { block: Block }) => {
    // Simplify styles for preview
    const containerStyle: React.CSSProperties = {
        ...block.styles,
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden'
    };

    // Remove specific properties for wrapper-based blocks to prevent double-wrapping issues
    const wrapperBlocks = ['button', 'image', 'video', 'product-card', 'table', 'image-text', 'event', 'audio', 'alert', 'code', 'pros-cons', 'divider', 'nps', 'countdown', 'social'];
    if (wrapperBlocks.includes(block.type)) {
        delete (containerStyle as any).backgroundColor;
        delete (containerStyle as any).border;
        delete (containerStyle as any).borderRadius;
    }

    return (
        <div style={containerStyle} className="min-w-0">
            {block.type === 'text' && (
                <div
                    dangerouslySetInnerHTML={{ __html: block.content.text }}
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        fontFamily: block.content.fontFamily || 'Arial',
                        fontWeight: block.content.fontWeight || 'normal',
                        fontStyle: block.content.fontStyle || 'normal',
                        fontSize: block.styles.fontSize || '16px'
                    }}
                />
            )}

            {block.type === 'button' && (
                <div style={{ textAlign: block.styles.textAlign as any, padding: '12px 0' }}>
                    <div
                        style={{
                            display: 'inline-block',
                            backgroundColor: block.styles.backgroundColor || '#6366f1',
                            color: block.styles.color || '#ffffff',
                            borderRadius: block.styles.borderRadius || '12px',
                            padding: '10px 24px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            lineHeight: '1.2',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {block.content.text}
                    </div>
                </div>
            )}

            {block.type === 'image' && (
                <div style={{ padding: '12px 0', textAlign: block.styles.textAlign as any }}>
                    <img
                        src={block.content.src || 'https://placehold.co/600x200'}
                        alt="Preview"
                        style={{
                            width: block.styles.width || '100%',
                            height: 'auto',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: block.styles.borderRadius || '12px'
                        }}
                    />
                </div>
            )}

            {block.type === 'divider' && (
                <div style={{ padding: '24px 0' }}>
                    <hr style={{
                        border: 'none',
                        borderTop: `${block.content.thickness || 1}px ${block.content.style || 'solid'} ${block.content.color || '#E2E8F0'}`,
                        margin: 0
                    }} />
                </div>
            )}

            {/* High-end Logic for Complex Blocks (Represented as Wireframe components) */}
            {['social', 'video', 'menu', 'product-card', 'nps', 'countdown', 'qr', 'table', 'image-text', 'event', 'audio', 'alert', 'code', 'pros-cons'].includes(block.type) && (
                <div className="my-4 p-6 flex flex-col items-center justify-center bg-slate-100/30 border-2 border-dashed border-slate-200/50 rounded-[1.5rem] gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                        {block.type === 'social' && <Zap size={18} />}
                        {block.type === 'video' && <Layout size={18} />}
                        {block.type === 'product-card' && <Table size={18} />}
                        {block.type === 'image-text' && <ImageIcon size={18} />}
                        {block.type === 'event' && <Calendar size={18} />}
                        {block.type === 'table' && <Table size={18} />}
                        {block.type === 'code' && <CodeIcon size={18} />}
                        {block.type === 'alert' && <AlertCircle size={18} />}
                        {!['social', 'video', 'product-card', 'image-text', 'event', 'table', 'code', 'alert'].includes(block.type) && <Zap size={18} />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.type}</span>
                </div>
            )}
        </div>
    );
};

export const MiniTemplatePreview = ({ blocks, backgroundColor }: { blocks: Block[], backgroundColor?: string }) => {
    return (
        <div className="w-full relative shadow-inner overflow-hidden" style={{ backgroundColor: backgroundColor || '#ffffff', padding: '1px' }}>
            <div className="flex flex-col">
                {blocks.map(block => (
                    <MiniBlock key={block.id} block={block} />
                ))}
            </div>

            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.02)]" />
        </div>
    );
};
