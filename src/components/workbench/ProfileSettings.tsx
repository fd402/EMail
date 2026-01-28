'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Save, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/supabase-auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useEmailStore } from '@/store/useEmailStore';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { getSubscriptionStatus } from '@/app/actions/subscription';
import { uploadAvatar } from '@/lib/upload';

interface ProfileSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    user: SupabaseUser | null;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose, user: propUser }) => {
    // Internal user state (merges prop and fetched user)
    const [internalUser, setInternalUser] = useState<SupabaseUser | null>(propUser);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const storeSubscription = useEmailStore((state) => state.subscription);
    const [debugSource, setDebugSource] = useState('Init');
    const exportCount = useEmailStore((state) => state.exportCount);

    // NextAuth Session
    const { data: session, status } = useSession();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !internalUser) return;

        setIsUploading(true);
        try {
            // 1. Upload to Storage
            const publicUrl = await uploadAvatar(file, internalUser.id);

            // 2. Update Auth Metadata
            const supabase = createClient();
            const { data: { user }, error } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (error) throw error;

            // 3. Update Local State
            if (user) {
                setInternalUser(user);
                // Force refresh session to propogate changes
                window.location.reload();
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
            alert('Error uploading profile picture.');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Effect 1: Sync with Prop
    useEffect(() => {
        if (propUser) {
            setInternalUser(propUser);
            setDebugSource('Prop Update');
        }
    }, [propUser]);

    // Effect 2: Fallback Fetch or Session Sync
    useEffect(() => {
        if (!propUser && !internalUser) {
            // Try Supabase first
            const supabase = createClient();
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                    setInternalUser(user);
                    setDebugSource('Fallback Fetch Success');
                } else if (session?.user) {
                    // Fallback to NextAuth Session
                    setDebugSource('NextAuth Session Fallback');
                } else {
                    setDebugSource('All Fetches Empty');
                }
            });
        }
    }, [propUser, internalUser, session]);

    // Effect 3: Populate Form Fields from Supabase User OR NextAuth Session
    // Effect 3: Populate Form Fields from Supabase User OR NextAuth Session
    useEffect(() => {
        // STRICT MODE: Only use internalUser if it matches the authenticated session (if both exist)
        // This prevents showing Profile A with Email B if state is mixed.

        if (internalUser) {
            const meta = internalUser.user_metadata || {};
            const displayName = meta.display_name || meta.full_name || meta.name || internalUser.email?.split('@')[0] || '';
            const userEmail = internalUser.email || '';

            setName(displayName || 'User');
            setEmail(userEmail);
        } else if (session?.user) {
            // Fallback: Only use session if we have NO internal DB record yet
            setName(session.user.name || 'User');
            setEmail(session.user.email || '');
        } else {
            setName('User');
        }
    }, [internalUser, session]);

    // Fetch latest usage on mount/open
    useEffect(() => {
        if (isOpen && storeSubscription === 'free') {
            getSubscriptionStatus().then(status => {
                if (status.exportCount !== undefined) useEmailStore.getState().setUsage(status.exportCount);
            });
        }
    }, [isOpen, storeSubscription]);

    const handleLogout = async () => {
        try {
            // Attempt clean signout
            await nextAuthSignOut({ redirect: false });
            await signOut(); // Supabase signout
        } catch (error) {
            // Ignore errors (like "AbortError" during navigation)
            console.warn("Logout cleanup warning:", error);
        } finally {
            // FORCE CLEANUP & REDIRECT
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        }
    };

    if (!isOpen) return null;

    // Helper for Avatar URL
    const getAvatarUrl = () => {
        if (internalUser?.user_metadata?.avatar_url) return internalUser.user_metadata.avatar_url;
        if (session?.user?.image) return session.user.image;

        return `https://api.dicebear.com/9.x/avataaars/svg?seed=${name || 'User'}`;
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Immersive Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-[32px] transition-all duration-500"
                onClick={onClose}
            />

            {/* Safe Centering Container */}
            <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
                {/* Modal Container */}
                <div className="relative transform rounded-[2.5rem] bg-white/90 backdrop-blur-xl text-left shadow-2xl transition-all w-full max-w-4xl border border-white/40 shadow-indigo-500/10 max-h-[90vh] sm:my-8 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="relative flex-none px-8 md:px-12 pt-8 pb-6 border-b border-slate-100/50 z-10 bg-white/50 backdrop-blur-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                    Account Management
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Settings</h2>
                            </div>
                            <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 md:px-12 md:py-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                            {/* Sidebar / Avatar */}
                            <div className="md:col-span-4 flex flex-col items-center text-center">
                                <div
                                    className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl mb-6 cursor-pointer group"
                                    onClick={triggerFileInput}
                                >
                                    <div className="w-full h-full rounded-full bg-white p-1 relative overflow-hidden">
                                        <img
                                            src={getAvatarUrl()}
                                            alt="Profile"
                                            className={`w-full h-full rounded-full object-cover bg-slate-50 transition-opacity ${isUploading ? 'opacity-50' : ''}`}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${name || 'User'}`;
                                            }}
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                            <span className="text-white text-xs font-bold">Change</span>
                                        </div>

                                        {/* Loading State */}
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-0.5">{name || 'Loading...'}</h3>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{email || '...'}</div>
                            </div>

                            {/* Form */}
                            <div className="md:col-span-8 flex flex-col h-full">
                                <div className="mb-6">
                                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border-2 border-red-100">
                                        Log out
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-5 md:gap-6 mb-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="text-slate-400" size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 px-4 text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 mt-2 pt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Your Subscription</h4>
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-900 capitalize">{storeSubscription} Plan</span>
                                                {storeSubscription !== 'free' && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Active</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium">
                                                {storeSubscription === 'free' ? (
                                                    <div className="mt-3">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="relative flex h-2 w-2">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                                </div>
                                                                Monthly Exports (Live)
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        const status = await getSubscriptionStatus();
                                                                        if (status.exportCount !== undefined) useEmailStore.getState().setUsage(status.exportCount);
                                                                    }}
                                                                    className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-400 hover:text-indigo-500"
                                                                    title="Refresh usage"
                                                                >
                                                                    <RefreshCw size={12} />
                                                                </button>
                                                                <span className={exportCount >= 3 ? "text-rose-500" : "text-orange-500"}>
                                                                    {exportCount} of 3 used
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                                                                style={{ width: `${Math.min((exportCount / 3) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 mt-2 font-medium">
                                                            Upgrade for unlimited exports and premium templates.
                                                        </div>
                                                    </div>
                                                ) : (
                                                    'Thank you for supporting Plainly!'
                                                )}
                                            </div>
                                        </div>

                                        {storeSubscription === 'free' ? (
                                            <button
                                                onClick={() => window.open('?upgrade=true', '_self')} // Assuming we have a way to trigger pricing modal, or just let them find the header button. Better: close and open pricing.
                                                // Actually, Header handles pricing. We can't easily open it from here without callback. 
                                                // Let's just act as a trigger or tell them to upgrade in header.
                                                // Wait, ProfileSettings is inside Header. We can pass a callback? Or just use URL state?
                                                // For now simple button styles.
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                                            >
                                                Upgrade
                                            </button>
                                        ) : (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch('/api/stripe/portal', { method: 'POST' });
                                                        const data = await res.json();
                                                        if (data.url) window.location.href = data.url;
                                                    } catch (err) {
                                                        console.error('Portal redirect failed', err);
                                                        alert('Error redirecting to customer portal.');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold rounded-xl transition-all"
                                            >
                                                Manage Subscription
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2 mt-2 pt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Support & Feedback</h4>
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 mb-1">Questions or ideas?</div>
                                            <div className="text-xs text-slate-500 font-medium max-w-xs">
                                                DM me directly on X (Twitter). I appreciate every feedback!
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.open('https://x.com/Feliixx0', '_blank')}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 text-xs font-bold rounded-xl transition-all"
                                        >
                                            Contact on X
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative flex-none px-8 md:px-12 py-5 border-t border-slate-100/50 bg-white/50 backdrop-blur-md flex items-center justify-end gap-3 z-10">
                        <button onClick={onClose} className="px-6 py-3 bg-white text-slate-600 rounded-2xl text-xs font-black border border-slate-100">
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};
