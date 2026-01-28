'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2, FolderOpen, Clock, Mail, Loader2, Search } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { getProjects, deleteProject } from '@/app/actions/projects';
import { useEmailStore } from '@/store/useEmailStore';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface ProjectHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectHistory = ({ isOpen, onClose }: ProjectHistoryProps) => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { loadProject, isDirty } = useEmailStore();
    const [confirmLoad, setConfirmLoad] = useState<any | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    const handleLoad = (project: any) => {
        if (isDirty) {
            setConfirmLoad(project);
        } else {
            loadProject(project);
            onClose();
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setConfirmDelete(id);
    };

    const actualDelete = async (id: string) => {
        try {
            await deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Dialog.Root open={isOpen} onOpenChange={onClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-4xl outline-none animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[80vh]">

                            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <Dialog.Title className="text-xl font-black text-slate-900 tracking-tight">
                                        My Emails
                                    </Dialog.Title>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        History & Saved Designs
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="p-6 bg-slate-50/50 flex-1 overflow-y-auto">
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search your emails..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading history...</span>
                                    </div>
                                ) : filteredProjects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                onClick={() => handleLoad(project)}
                                                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                                        <Mail size={20} />
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDelete(e, project.id)}
                                                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 text-slate-300 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <h4 className="font-bold text-slate-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                                    {project.name}
                                                </h4>

                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                    <Clock size={12} />
                                                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="text-slate-300">{(project.content.blocks?.length || 0)} blocks</span>
                                                </div>

                                                <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FolderOpen size={24} className="text-slate-200" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-1">No emails found</h3>
                                        <p className="text-xs text-slate-400 max-w-[200px] mx-auto">
                                            {searchQuery ? "Try a different search term" : "Start designing and save your first email!"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <ConfirmDialog
                isOpen={!!confirmLoad}
                onClose={() => setConfirmLoad(null)}
                onConfirm={() => {
                    loadProject(confirmLoad);
                    onClose();
                }}
                title="Discard Design?"
                description={`You have unsaved changes. Loading "${confirmLoad?.name}" will permanently lose your current progress.`}
                confirmText="Discard & Load"
                cancelText="Keep Editing"
                variant="warning"
                icon="warning"
            />

            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => actualDelete(confirmDelete!)}
                title="Delete Email?"
                description="Are you sure you want to delete this email? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="No, Keep it"
                variant="danger"
                icon="delete"
            />
        </>
    );
};
