import Link from 'next/link';
import { ArrowRight, Sparkles, Layout, Zap, Image as ImageIcon, Box, Smartphone, Wand2 } from 'lucide-react';
import { LandingPricing } from '@/components/landing/LandingPricing';
import { LandingFAQ } from '@/components/landing/LandingFAQ';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingIntegrations } from '@/components/landing/LandingIntegrations';
import { LandingTestimonials } from '@/components/landing/LandingTestimonials';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">


                    <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Design Emails <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">
                            Like a Pro
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Stop coding HTML tables. Build stunning, responsive emails in seconds with our drag & drop editor powered by AI.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link href="/editor" className="group h-14 px-8 bg-slate-900 text-white rounded-full font-bold text-lg flex items-center gap-3 shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl active:translate-y-0">
                            Start Building Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="h-14 px-8 bg-white text-slate-700 border border-slate-200/60 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
                            View Templates
                        </button>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-20 relative px-4 animate-in fade-in zoom-in duration-1000 delay-500">
                        <div className="bg-slate-900/5 backdrop-blur-lg rounded-[2.5rem] p-4 max-w-5xl mx-auto border border-white/20 shadow-2xl">
                            <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner border border-slate-100">
                                <img src="https://placehold.co/2400x1200/ffffff/e2e8f0?text=Editor+Interface+Preview" alt="Editor" className="w-full h-auto opacity-90" />
                                {/* In a real app, put a screenshot of the editor here */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrations */}
            <LandingIntegrations />

            {/* Features Grid */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Everything you need</h2>
                        <p className="text-slate-500 text-lg">Powerful features wrapped in a simple interface.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-500" />}
                            title="Drag & Drop"
                            desc="Intuitive canvas. Just drag blocks, resize, and style. No coding required."
                        />
                        <FeatureCard
                            icon={<Wand2 className="w-6 h-6 text-indigo-500" />}
                            title="AI Magic"
                            desc="Generate layouts and rewrite copy instantly with our built-in AI assistant."
                        />
                        <FeatureCard
                            icon={<ImageIcon className="w-6 h-6 text-rose-500" />}
                            title="Stock Photos"
                            desc="Access millions of high-quality images from Unsplash directly in the editor."
                        />
                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6 text-blue-500" />}
                            title="Mobile Perfect"
                            desc="Visualize how your email looks on iPhone & Android with one click."
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-6 h-6 text-purple-500" />}
                            title="Smart Themes"
                            desc="Switch branding in seconds. Consistent fonts and colors everywhere."
                        />
                        <FeatureCard
                            icon={<Box className="w-6 h-6 text-emerald-500" />}
                            title="Export Code"
                            desc="Copy clean, production-ready HTML code to use in Mailchimp or HubSpot."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <LandingTestimonials />

            {/* Pricing Section */}
            <LandingPricing />

            {/* FAQ Section */}
            <LandingFAQ />

            {/* CTA Section */}
            <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl font-black mb-8 tracking-tight">Ready to send better emails?</h2>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join the new standard of email design. No credit card required.</p>
                    <Link href="/editor" className="inline-flex h-16 px-10 bg-white text-slate-900 rounded-full font-bold text-xl items-center gap-3 shadow-2xl hover:bg-indigo-50 transition-all hover:scale-105">
                        Launch Editor for Free
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    )
}

function CheckIcon({ color = 'text-indigo-500' }: { color?: string }) {
    return (
        <div className={`w-5 h-5 rounded-full bg-current ${color === 'text-indigo-500' ? 'bg-indigo-100 text-indigo-500' : 'bg-white/10 text-indigo-300'} flex items-center justify-center`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{question}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{answer}</p>
        </div>
    );
}
