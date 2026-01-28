import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Code, Copy, Smartphone, LayoutTemplate, ChevronDown, Settings, LogOut, User, Undo2, Redo2, Sparkles, Moon, Sun, MessageSquare, Share2, Download, Loader2, Plus } from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { useEmailStore } from '@/store/useEmailStore';
import { renderEmail } from '@/lib/renderEmail';
import { TemplateGallery } from './TemplateGallery';
import { MagicGeneratorModal } from './MagicGeneratorModal';
import { PricingModal } from '../subscription/PricingModal';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/supabase-auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { saveProject, getProjects, deleteProject } from '@/app/actions/projects';
import { getSubscriptionStatus, incrementMonthlyExport } from '@/app/actions/subscription';
import { ProjectHistory } from './ProjectHistory';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface HeaderProps {
    viewMode: 'editor' | 'preview';
    setViewMode: (mode: 'editor' | 'preview') => void;
    onOpenTemplates: () => void;
    isDarkMode?: boolean;
    setIsDarkMode?: (isDark: boolean) => void;
}

export const Header = ({ viewMode, setViewMode, onOpenTemplates, isDarkMode, setIsDarkMode }: HeaderProps) => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const { data: session } = useSession();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isMagicOpen, setIsMagicOpen] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const {
        blocks,
        settings,
        undo,
        redo,
        canUndo,
        canRedo,
        subscription,
        projectId,
        projectName,
        isDirty,
        setProjectInfo,
        loadProject,
        resetProject,
        setDirty
    } = useEmailStore();
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    useEffect(() => {
        const supabase = createClient();

        // Get initial session
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                // Clear state if explicitly signed out
                setUser(null);
                // Optional: Trigger hard cleanup if needed, but usually redundant here
            } else if (event === 'TOKEN_REFRESHED') {
                // Good state
                setUser(session?.user ?? null);
            } else {
                setUser(session?.user ?? null);
            }
        });

        // Defensive: Check for 'Invalid Refresh Token' proactively
        supabase.auth.getUser().then(({ data, error }) => {
            if (error && error.message.includes('Refresh Token')) {
                console.warn("Stale session detected. Cleaning up.");
                nextAuthSignOut({ redirect: false });
                supabase.auth.signOut().then(() => {
                    localStorage.clear();
                    window.location.href = '/';
                });
            } else {
                setUser(data.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleCopyHtml = async () => {
        const html = await renderEmail(blocks, settings);
        navigator.clipboard.writeText(html);
        alert('Raw HTML code copied! (For developers)');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const content = { blocks, settings };
            const result = await saveProject(projectId, projectName, content);
            setProjectInfo(result.id, result.name);
            setDirty(false); // Reset dirty flag
            alert('Project saved successfully!');
        } catch (error: any) {
            console.error('Save error:', error);
            if (error.message === 'LIMIT_REACHED') {
                setIsPricingOpen(true);
            } else {
                alert('Failed to save project: ' + error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyVisual = async () => {
        try {
            const html = await renderEmail(blocks, settings);
            const blobHtml = new Blob([html], { type: 'text/html' });
            const blobText = new Blob([html], { type: 'text/plain' });
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': blobHtml,
                    'text/plain': blobText,
                }),
            ]);
            alert('Email copied! Now paste it directly into Gmail or Outlook (Cmd+V).');
        } catch (err) {
            console.error(err);
            alert('Failed to copy. Please use Chrome or Edge.');
        }
    };

    const handleExport = async (type: 'visual' | 'code' | 'file') => {
        // Increment usage
        const result = await incrementMonthlyExport();
        if (result.error === 'LIMIT_REACHED') {
            setIsPricingOpen(true);
            return false;
        }

        if (result.success && result.count !== undefined) {
            useEmailStore.getState().setUsage(result.count);
        }

        if (type === 'visual') handleCopyVisual();
        if (type === 'code') handleCopyHtml();
        if (type === 'file') {
            const html = await renderEmail(blocks, settings);
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName || 'plainly-email'}-${Date.now()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        return true;
    };

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-subtle z-50">
            {/* Left: Brand */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                        P
                    </div>
                    <span className="font-black text-slate-900 text-lg leading-none tracking-tight">Plainly</span>
                </Link>

                <div className="h-8 w-px bg-slate-200"></div>

                {/* Project Name Editor */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (isDirty) {
                                setShowResetConfirm(true);
                            } else {
                                resetProject();
                            }
                        }}
                        className="p-2 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors group/new"
                        title="New Design"
                    >
                        <Plus size={18} className="group-hover/new:rotate-90 transition-transform duration-300" />
                    </button>


                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectInfo(projectId, e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-1 focus:ring-indigo-100 rounded-lg px-2 py-1 w-48 truncate"
                        placeholder="Project Name..."
                    />
                    {isSaving && (
                        <Loader2 size={14} className="text-indigo-500 animate-spin" />
                    )}
                </div>
            </div>


            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 whitespace-nowrap ml-8"
                >
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    <span>{projectId ? 'Save' : 'Save Design'}</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                {/* Editor/Preview Toggle */}
                <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/50">
                    <button
                        onClick={undo}
                        disabled={!canUndo()}
                        className="p-1.5 hover:bg-white disabled:opacity-30 text-slate-500 hover:text-indigo-600 rounded-md transition-all disabled:hover:bg-transparent"
                        title={`Undo (${isMac ? '⌘Z' : 'Ctrl+Z'})`}
                    >
                        <Undo2 size={16} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo()}
                        className="p-1.5 hover:bg-white disabled:opacity-30 text-slate-500 hover:text-indigo-600 rounded-md transition-all disabled:hover:bg-transparent"
                        title={`Redo (${isMac ? '⌘Y' : 'Ctrl+Y'})`}
                    >
                        <Redo2 size={16} />
                    </button>

                    <div className="w-px h-4 bg-slate-200 mx-1 my-auto"></div>

                    <button
                        onClick={() => setViewMode('editor')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'editor'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        Preview
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button
                    onClick={() => setIsMagicOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Magic</span>
                </button>

                <button
                    onClick={onOpenTemplates}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200/60 shadow-sm active:scale-95"
                >
                    <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                    <span>Templates</span>
                </button>



                {/* Export Dropdown */}
                <div className="relative" onMouseLeave={() => setIsExportOpen(false)}>
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Export</span>
                        <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExportOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                <div className="text-xs font-bold text-slate-900">Export Options</div>
                            </div>

                            <button
                                onClick={() => {
                                    handleExport('visual');
                                    setIsExportOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                            >
                                <Copy className="w-4 h-4 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900">Copy for Mail Apps</div>
                                    <div className="text-[10px] text-slate-500">Gmail, Outlook, Apple Mail</div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    handleExport('code');
                                    setIsExportOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                            >
                                <Code className="w-4 h-4 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900">Copy HTML Code</div>
                                    <div className="text-[10px] text-slate-500">For developers & tools</div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    handleExport('file');
                                    setIsExportOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors text-left"
                            >
                                <Download className="w-4 h-4 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900">Download HTML File</div>
                                    <div className="text-[10px] text-slate-500">Save as .html</div>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Click outside listener */}
                    {isExportOpen && (
                        <div className="fixed inset-0 z-[40]" onClick={() => setIsExportOpen(false)} />
                    )}
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                {/* Profile */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer group pl-2"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-sm group-hover:shadow-md transition-shadow">
                            <img
                                src={user?.user_metadata?.avatar_url || session?.user?.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.user_metadata?.display_name || session?.user?.name || user?.email || 'User'}`}
                                alt="Profile"
                                className="w-full h-full rounded-full bg-white object-cover border-2 border-white"
                            />
                        </div>
                        <div className="flex flex-col hidden sm:flex">
                            <span className="text-xs font-bold text-slate-700 leading-none group-hover:text-indigo-600 transition-colors">
                                {user?.user_metadata?.display_name || session?.user?.name || user?.email?.split('@')[0] || session?.user?.email?.split('@')[0] || 'User'}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 leading-none mt-0.5 capitalize">{subscription.toLowerCase()} Plan</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                <div className="text-xs font-bold text-slate-900">Signed in as</div>
                                <div className="text-xs text-slate-500 truncate">{user?.email || session?.user?.email || 'Not logged in'}</div>
                            </div>

                            <button
                                onClick={() => {
                                    if (isDirty) {
                                        setShowResetConfirm(true);
                                    } else {
                                        resetProject();
                                    }
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                            >
                                <Plus size={18} className="text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900">New Design</div>
                                    <div className="text-[10px] text-slate-500 text-left -mt-0.5">Start fresh</div>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setIsHistoryOpen(true);
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <LayoutTemplate size={18} className="text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900">My Emails</div>
                                    <div className="text-[10px] text-slate-500 text-left -mt-0.5">Project history</div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    onOpenTemplates();
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors md:hidden"
                            >
                                <Copy size={18} className="text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900">Templates</div>
                                    <div className="text-[10px] text-slate-500 text-left -mt-0.5">Gallery & Layouts</div>
                                </div>
                            </button>

                            {setIsDarkMode && (
                                <button
                                    onClick={() => {
                                        setIsDarkMode(!isDarkMode);
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-slate-400" />}
                                    <div>
                                        <div className="font-bold text-slate-900">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</div>
                                        <div className="text-[10px] text-slate-500 text-left -mt-0.5">Toggle preview theme</div>
                                    </div>
                                </button>
                            )}

                            <div className="h-px bg-slate-100 my-1"></div>

                            <button
                                onClick={() => {
                                    setShowSettings(true);
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <Settings size={18} className="text-slate-400" />
                                <span>Settings</span>
                            </button>
                            {/* Mobile Upgrade Option */}
                            <button
                                onClick={() => {
                                    setIsPricingOpen(true);
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                                <Sparkles size={16} />
                                <span>Upgrade Plan</span>
                            </button>
                            <button
                                onClick={() => {
                                    window.open('https://x.com/Feliixx0', '_blank');
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <MessageSquare size={16} />
                                <span>Give Feedback</span>
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button
                                onClick={async () => {
                                    await nextAuthSignOut({ redirect: false });
                                    await signOut();
                                    window.location.href = '/';
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Click outside listener could be added here or use a library, simplified for now */}
                {isProfileOpen && (
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                )}
            </div>

            <ProfileSettings isOpen={showSettings} onClose={() => setShowSettings(false)} user={user} />
            <MagicGeneratorModal isOpen={isMagicOpen} onClose={() => setIsMagicOpen(false)} />
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} currentPlan={subscription} />
            <ProjectHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

            <ConfirmDialog
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={resetProject}
                title="Discard Design?"
                description="You have unsaved changes. Starting a new project will permanently lose your current progress."
                confirmText="Discard & Start Fresh"
                cancelText="Keep Editing"
                variant="warning"
                icon="reset"
            />
        </header>
    );
};
