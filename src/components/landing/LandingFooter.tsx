'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Mail, Shield, Scale, Info, Globe } from 'lucide-react';
import Image from 'next/image';

export const LandingFooter = () => {
    const [openTab, setOpenTab] = useState<'privacy' | 'terms' | 'contact' | 'about' | null>(null);

    const info = {
        privacy: {
            title: "Privacy Policy",
            icon: <Shield className="w-5 h-5 text-indigo-500" />,
            content: (
                <div className="space-y-4 text-sm">
                    <p>We believe in absolute data privacy. Our principles are simple:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span><strong>No Data Reselling:</strong> We never sell your personal information or email lists to third parties.</span>
                        </li>
                        <li className="flex gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span><strong>Encryption:</strong> All designs and account data are encrypted using industry-standard protocols.</span>
                        </li>
                        <li className="flex gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span><strong>Control:</strong> You have the right to export or delete your data at any time through your settings.</span>
                        </li>
                    </ul>
                </div>
            )
        },
        terms: {
            title: "Terms & Conditions",
            icon: <Scale className="w-5 h-5 text-indigo-500" />,
            content: (
                <div className="space-y-4 text-sm">
                    <p>By using Plainly, you agree to our standard operating terms:</p>
                    <ul className="space-y-3">
                        <li className="flex gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span><strong>Ownership:</strong> You own the rights to all email code exported from the platform.</span>
                        </li>
                        <li className="flex gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span><strong>Account Use:</strong> You are responsible for maintaining the security of your account and its content.</span>
                        </li>
                        <li className="flex gap-2 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <span><strong>Prohibited Behavior:</strong> The platform may not be used for spam or distributing malicious content.</span>
                        </li>
                    </ul>
                </div>
            )
        },
        about: {
            title: "About Plainly",
            icon: <Info className="w-5 h-5 text-indigo-500" />,
            content: (
                <div className="space-y-4 text-sm">
                    <p>Plainly is a visual email designer built for creators, marketers, and developers who value clean code and beautiful design.</p>
                    <p>Our mission is to bridge the gap between complex coding and high-end design, allowing you to build professional emails as easily as a slide deck.</p>
                    <p className="font-bold text-slate-900 border-l-2 border-indigo-500 pl-4 py-1">Built with precision for the next generation of email marketing.</p>
                </div>
            )
        },
        contact: {
            title: "Support",
            icon: <Mail className="w-5 h-5 text-indigo-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Our team is available to help with any questions regarding the platform or your subscription.</p>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Direct Contact</div>
                        <a href="mailto:hello@plainly.app" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">hello@plainly.app</a>
                    </div>
                </div>
            )
        }
    };

    return (
        <footer className="bg-white pt-24 pb-12 border-t border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50/20 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

                    {/* Column 1: Brand */}
                    <div className="md:col-span-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Image
                                src="/logo.png"
                                alt="Plainly"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-xl shadow-indigo-100 shadow-xl"
                            />
                            <span className="font-black text-2xl text-slate-900 tracking-tight">Plainly</span>
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-sm font-medium">
                            Creating professional emails should be as simple as writing a document.
                        </p>
                    </div>

                    {/* Column 2: Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
                        <ul className="space-y-4 text-slate-500 font-medium text-base">
                            <li><a href="/#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                            <li><button onClick={() => setOpenTab('about')} className="hover:text-indigo-600 transition-colors">Our Story</button></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div className="md:col-span-3">
                        <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-widest">Legal & Help</h4>
                        <ul className="space-y-4 text-slate-500 font-medium text-base">
                            <li><button onClick={() => setOpenTab('contact')} className="hover:text-indigo-600 transition-colors">Support</button></li>
                            <li><button onClick={() => setOpenTab('privacy')} className="hover:text-indigo-600 transition-colors">Privacy</button></li>
                            <li><button onClick={() => setOpenTab('terms')} className="hover:text-indigo-600 transition-colors">Terms</button></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-slate-400 text-sm font-medium">
                        © 2026 Plainly. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-slate-400 hover:text-black transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                            </svg>
                        </a>
                        <div className="h-4 w-[1px] bg-slate-100 hidden md:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cloud Secured</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Info */}
            <Dialog.Root open={!!openTab} onOpenChange={() => setOpenTab(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[101] w-full max-w-lg outline-none animate-in zoom-in-95 duration-300 px-6">
                        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-10 relative">

                            <button
                                onClick={() => setOpenTab(null)}
                                className="absolute top-8 right-8 p-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {openTab && (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                                            {info[openTab].icon}
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Company Info</div>
                                            <Dialog.Title className="text-3xl font-black text-slate-900 tracking-tight">
                                                {info[openTab].title}
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="text-slate-600 leading-relaxed font-medium text-base">
                                        {info[openTab].content}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-50 flex justify-center">
                                        <button
                                            onClick={() => setOpenTab(null)}
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-indigo-600 transition-all active:scale-[0.98]"
                                        >
                                            Got it
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </footer>
    );
};
