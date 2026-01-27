import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingFeatureTabs } from "@/components/landing/LandingFeatureTabs";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <LandingNavbar />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Powerful Features
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto text-center leading-relaxed">
                        Explore the tools that make Plainly the best email editor for modern creators.
                    </p>
                </div>

                <LandingFeatureTabs />
            </main>

            <LandingFooter />
        </div>
    );
}
