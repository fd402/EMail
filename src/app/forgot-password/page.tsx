'use client';

import Link from 'next/link';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { resetPasswordRequest } from '@/app/actions/supabase-auth';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const result = await resetPasswordRequest(email);

        if (!result.success) {
            setError(result.error || 'Failed to send reset email');
            setIsLoading(false);
            return;
        }

        setSuccess(result.message || 'Check your email for the reset link!');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-indigo-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-400 rounded-full blur-3xl opacity-20 -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-20 -ml-40 -mb-40"></div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-lg">
                            P
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Plainly</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-black mb-6 leading-tight">
                        No worries, we've got you covered
                    </h2>
                    <p className="text-lg text-indigo-100 leading-relaxed">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="relative z-10 text-xs font-medium text-indigo-200">
                    © 2024 Plainly Inc.
                </div>
            </div>

            {/* Right: Reset Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight lg:text-4xl mt-4">
                            Reset your password
                        </h1>
                        <p className="mt-3 text-slate-500 text-lg">
                            Enter your email address and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                                ✉️ {success}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">
                                Email address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Send reset link</span>
                                    <Mail className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm text-slate-500">
                        Remember your password?{' '}
                        <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
