export const LandingFooter = () => {
    return (
        <footer className="bg-slate-50 py-12 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
                <div className="font-bold flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 rounded-lg"></div>
                    Plainly
                </div>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-slate-900">Privacy</a>
                    <a href="#" className="hover:text-slate-900">Terms</a>
                    <a href="#" className="hover:text-slate-900">Contact</a>
                </div>
                <div className="mt-4 md:mt-0">
                    © 2024 Plainly. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
