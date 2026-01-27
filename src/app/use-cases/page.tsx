import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingUseCases } from "@/components/landing/LandingUseCases";

export default function UseCasesPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <LandingNavbar />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Built for You
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto text-center leading-relaxed">
                        Whether you're marketing a product, scaling an agency, or building an app.
                    </p>
                </div>

                <LandingUseCases />
            </main>

            <LandingFooter />
        </div>
    );
}
