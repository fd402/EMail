'use client';

import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signIn as supabaseSignIn } from '@/app/actions/supabase-auth';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await supabaseSignIn(email, password);

        if (!result.success) {
            setError(result.error || 'Invalid email or password');
            setIsLoading(false);
            return;
        }

        // Redirect to editor on success
        router.push('/editor');
    };

    const onGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Google login error:', error);
            setGoogleLoading(false);
            // Optional: setError('Failed to login with Google');
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding & Testimonial */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-3xl opacity-20 -ml-40 -mb-40"></div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black shadow-lg">
                            P
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Plainly</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg mb-20">
                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        Welcome back!
                    </h2>
                    <p className="text-xl text-slate-400 font-medium">
                        "Reliability and ease of use are why we switched to Plainly. It just works."
                    </p>
                    <div className="flex items-center gap-4 mt-8">
                        <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600"></div>
                        <div>
                            <div className="font-bold">Mark Thompson</div>
                            <div className="text-slate-400 text-sm">CTO @ NexusCorp</div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs font-medium text-slate-400 flex justify-between">
                    <div>© 2024 Plainly Inc.</div>
                    <div className="space-x-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight lg:text-4xl">Sign in to your account</h1>
                        <p className="mt-3 text-slate-500 text-lg">Good to see you again.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={onGoogleLogin}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            {googleLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            <span className="text-sm">Continue with Google</span>
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">Or sign in with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">Email address</label>
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

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">Password</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm font-medium text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline underline-offset-2">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
