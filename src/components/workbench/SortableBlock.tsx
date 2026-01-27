import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { useEmailStore } from '@/store/useEmailStore';

interface SortableBlockProps {
    id: string;
    children: React.ReactNode;
}

export const SortableBlock = ({ id, children }: SortableBlockProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const { selectedBlockId, selectBlock } = useEmailStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "relative group mb-4 transition-all duration-300 rounded-xl", // Increased margin and rounded corners
                selectedBlockId === id
                    ? "ring-4 ring-indigo-500/10 border border-indigo-500 shadow-premium z-10"
                    : "hover:ring-4 hover:ring-indigo-500/5 border border-transparent hover:border-indigo-500/20",
                isDragging && "opacity-50 scale-[0.98]"
            )}
            onClick={(e) => {
                e.stopPropagation();
                selectBlock(id);
            }}
        >
            {/* Drag Handle - Visible on Hover or Selection */}
            <div
                {...attributes}
                {...listeners}
                className={clsx(
                    "absolute -left-10 top-0 p-2 rounded-xl cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-slate-100",
                    selectedBlockId === id ? "opacity-100 translate-x-1" : "opacity-0 group-hover:opacity-100"
                )}
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {children}
        </div>
    );
};
