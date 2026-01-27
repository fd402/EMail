import React from 'react';
import { useEmailStore } from '@/store/useEmailStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';
import { Plus } from 'lucide-react';
import { CanvasBlock } from './CanvasBlock';

export const Canvas = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const { blocks, moveBlock, selectBlock, settings } = useEmailStore();
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable',
    });

    return (
        <div
            className="flex-1 h-full overflow-y-auto overflow-x-hidden flex justify-center p-12 transition-colors duration-200"
            style={{ backgroundColor: settings.workbenchColor || 'transparent' }} // Let the grid show through if transparent
            onClick={() => selectBlock(null)}
        >
            <div
                ref={setNodeRef}
                className={`shadow-premium rounded-2xl p-10 transition-all duration-300 border border-white/40 backdrop-blur-[2px] ${isDarkMode ? 'dark-mode-simulator' : ''}`}
                style={{
                    backgroundColor: isDarkMode ? '#1e293b' : settings.backgroundColor,
                    color: isDarkMode ? '#ffffff' : 'inherit',
                    width: settings.containerWidth || '600px',
                    minHeight: 'fit-content'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {blocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 group hover:border-indigo-300 hover:bg-slate-50 transition-all duration-300">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Plus className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">Drag & Drop components to build</p>
                    </div>
                ) : (
                    <SortableContext
                        items={blocks}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-2">
                            {blocks.map((block) => (
                                <SortableBlock key={block.id} id={block.id}>
                                    <CanvasBlock block={block} />
                                </SortableBlock>
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
};
