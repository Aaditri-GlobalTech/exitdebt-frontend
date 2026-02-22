"use client";

const STEPS = [
    {
        number: "01",
        title: "Enter your PAN",
        description: "We use your PAN to securely pull your credit report. No impact on your CIBIL score.",
        icon: (
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Get your report",
        description: "See your debt health score, all active accounts, and exactly how much you're overpaying.",
        icon: (
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Talk to an expert",
        description: "A debt specialist will walk you through your options and help you save on interest.",
        icon: (
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    return (
        <section className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How it works</h2>
                <p className="text-gray-500 mt-2 text-sm">Three simple steps to financial clarity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {STEPS.map((step, i) => (
                    <div key={step.number} className="relative text-center animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="bg-white border border-gray-100 rounded-xl p-6 h-full hover:shadow-sm transition-all duration-200">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
                                {step.icon}
                            </div>
                            <div className="text-xs text-teal-600 font-semibold uppercase tracking-widest mb-2">
                                Step {step.number}
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
