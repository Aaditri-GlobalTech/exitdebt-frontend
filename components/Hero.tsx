"use client";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white to-cyan-50/40" />

            <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-6 sm:pt-28 sm:pb-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                    </span>
                    Trusted by 10,000+ Indians
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                    Are you <span className="text-teal-600">overpaying</span> on your loans?
                </h1>
                <p className="mt-5 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Check your debt health in 30 seconds. See exactly how much interest you can save and get a personalized plan to become debt-free faster.
                </p>

                {/* Trust banner */}
                <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>We earn from lenders, not from you. Your data is encrypted and never shared without consent.</span>
                </div>
            </div>
        </section>
    );
}
