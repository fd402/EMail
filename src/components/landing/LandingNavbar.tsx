import Link from 'next/link';

export const LandingNavbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                        P
                    </div>
                    <span className="font-black text-slate-800 text-lg tracking-tight">Plainly</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/features" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
                    <Link href="/use-cases" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Use Cases</Link>

                    {/* Separator */}
                    <div className="h-6 w-px bg-slate-200/60 mx-1"></div>

                    <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
                    <Link href="/register" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Register</Link>
                    <Link href="/editor" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105 active:scale-95">
                        Launch Editor
                    </Link>
                </div>
            </div>
        </nav>
    );
};
