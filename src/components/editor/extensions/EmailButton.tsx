import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useRef, useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';

export const EmailButton = Node.create({
    name: 'emailButton',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            text: {
                default: 'Click me',
            },
            url: {
                default: '',
            },
            alignment: {
                default: 'center',
            },
            variant: {
                default: 'primary',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'a[data-type="email-button"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['a', mergeAttributes(HTMLAttributes, { 'data-type': 'email-button' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmailButtonComponent);
    },
});

const EmailButtonComponent = (props: any) => {
    const { node, updateAttributes, deleteNode } = props;
    const [showSettings, setShowSettings] = useState(false);

    const { text, url, alignment, variant } = node.attrs;

    const alignments = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    };

    const variants = {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-200 text-gray-800',
    };

    return (
        <NodeViewWrapper className={`flex w-full ${alignments[alignment as keyof typeof alignments] || 'justify-center'} relative group`}>
            <div className="relative">
                <a
                    href={url}
                    onClick={(e) => e.preventDefault()}
                    className={`inline-block px-6 py-3 rounded-md font-medium no-underline ${variants[variant as keyof typeof variants] || variants.primary}`}
                >
                    {text}
                </a>

                {/* Hover Controls */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white shadow-lg border rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Settings"
                    >
                        <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => updateAttributes({ alignment: 'left' })}
                        className={`p-1 hover:bg-gray-100 rounded ${alignment === 'left' ? 'text-blue-500' : 'text-gray-600'}`}
                    >
                        L
                    </button>
                    <button
                        onClick={() => updateAttributes({ alignment: 'center' })}
                        className={`p-1 hover:bg-gray-100 rounded ${alignment === 'center' ? 'text-blue-500' : 'text-gray-600'}`}
                    >
                        C
                    </button>
                    <button
                        onClick={() => updateAttributes({ alignment: 'right' })}
                        className={`p-1 hover:bg-gray-100 rounded ${alignment === 'right' ? 'text-blue-500' : 'text-gray-600'}`}
                    >
                        R
                    </button>
                    <button
                        onClick={deleteNode}
                        className="p-1 hover:bg-red-50 rounded"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>

                {/* Settings Popover */}
                {showSettings && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white shadow-xl border rounded-lg p-3 z-20 w-64 text-left">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => updateAttributes({ text: e.target.value })}
                                    className="w-full text-sm border rounded px-2 py-1 outline-none ring-offset-0 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => updateAttributes({ url: e.target.value })}
                                    className="w-full text-sm border rounded px-2 py-1 outline-none ring-offset-0 focus:ring-1 focus:ring-blue-500"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Variant</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateAttributes({ variant: 'primary' })}
                                        className={`flex-1 text-xs py-1 rounded border ${variant === 'primary' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white text-gray-600'}`}
                                    >
                                        Primary
                                    </button>
                                    <button
                                        onClick={() => updateAttributes({ variant: 'secondary' })}
                                        className={`flex-1 text-xs py-1 rounded border ${variant === 'secondary' ? 'bg-gray-100 border-gray-400 text-gray-800' : 'bg-white text-gray-600'}`}
                                    >
                                        Secondary
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-right">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};
