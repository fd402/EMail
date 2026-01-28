import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Code, Copy, Monitor, Smartphone, LayoutTemplate, ChevronDown, Settings, LogOut, User, Undo2, Redo2, Sparkles, Moon, Sun, MessageSquare, Share2, Download } from 'lucide-react';
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

interface HeaderProps {
    viewMode: 'editor' | 'preview';
    setViewMode: (mode: 'editor' | 'preview') => void;
    onOpenTemplates: () => void;
    isDarkMode?: boolean;
    setIsDarkMode?: (isDark: boolean) => void;
}

export const Header = ({ viewMode, setViewMode, onOpenTemplates, isDarkMode, setIsDarkMode }: HeaderProps) => {
    const { blocks, settings, undo, redo, canUndo, canRedo, subscription } = useEmailStore();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const { data: session } = useSession();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isMagicOpen, setIsMagicOpen] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
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

    const handleCopyVisual = async () => {
        try {
            // Pass the current settings (including background color) to the renderer
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

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-subtle z-50">
            {/* Left: Brand */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                    P
                </div>
                <span className="font-black text-slate-900 text-lg leading-none tracking-tight">Plainly</span>
            </Link>


            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Upgrade Button - Only show if FREE */}
                {subscription === 'free' && (
                    <button
                        onClick={() => setIsPricingOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-200 to-yellow-400 hover:from-amber-300 hover:to-yellow-500 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-100 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Upgrade</span>
                    </button>
                )}

                {/* Dark Mode Toggle */}
                {setIsDarkMode && (
                    <div className="relative group/tooltip">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-xl transition-all ${isDarkMode
                                ? 'bg-slate-900 text-yellow-400 shadow-md border border-slate-700'
                                : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {isDarkMode ? <Monitor size={18} /> : <Monitor size={18} className="rotate-180" />}
                        </button>

                        {/* Custom Tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200">
                            <div className="bg-white/95 backdrop-blur-xl text-slate-900 px-5 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 w-[200px] animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Preview Mode</div>
                                </div>
                                <div className="text-xs text-slate-600 leading-relaxed font-medium tracking-tight">Simulates Dark Mode for email clients</div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Undo/Redo */}
                <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/50">
                    <button
                        onClick={undo}
                        disabled={!canUndo()}
                        title={`Rückgängig (${isMac ? '⌘Z' : 'Ctrl+Z'})`}
                        className={`p-2 rounded-lg text-xs font-bold transition-all ${canUndo()
                            ? 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                            : 'text-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <Undo2 size={16} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo()}
                        title={`Wiederholen (${isMac ? '⌘⇧Z' : 'Ctrl+Y'})`}
                        className={`p-2 rounded-lg text-xs font-bold transition-all ${canRedo()
                            ? 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                            : 'text-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <Redo2 size={16} />
                    </button>
                </div>

                {/* Editor/Preview Toggle */}
                <div className="flex bg-slate-100/80 rounded-xl p-1 border border-slate-200/50">
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
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Magic</span>
                </button>

                <button
                    onClick={onOpenTemplates}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200/60 shadow-sm hover:shadow-md active:scale-95"
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
                                <p className="text-xs font-bold text-slate-900">Export Options</p>
                            </div>

                            <button
                                onClick={() => {
                                    handleCopyVisual();
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
                                    handleCopyHtml();
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
                                onClick={async () => {
                                    const html = await renderEmail(blocks, settings);
                                    const blob = new Blob([html], { type: 'text/html' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `plainly-email-${Date.now()}.html`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
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
                                <p className="text-xs font-bold text-slate-900">Signed in as</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || session?.user?.email || 'Not logged in'}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowSettings(true);
                                    setIsProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <Settings size={16} />
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
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} currentPlan={subscription as 'free' | 'pro' | 'agency'} />
        </header>
    );
};
