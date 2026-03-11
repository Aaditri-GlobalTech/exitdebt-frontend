"use client";

interface DebtFreedomGPSProps { 
    currentTimeline: string; 
    optimizedTimeline: string; 
    timelineSaved: string; 
}

export default function DebtFreedomGPS({ currentTimeline, optimizedTimeline, timelineSaved }: DebtFreedomGPSProps) {
    return (
        <div 
            className="rounded-xl p-6 lg:p-7 animate-slideUp border border-gray-100" 
            style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Debt Freedom GPS</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-50 grid grid-cols-1 md:grid-cols-2 relative overflow-hidden shadow-sm">
                
                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gray-100" />

                {/* Left Side — Current */}
                <div className="p-10 text-center flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Current Projection</p>
                    <p className="text-5xl font-bold text-gray-400 mb-6">{currentTimeline}</p>
                    <p className="text-[11px] leading-relaxed text-gray-400 max-w-[200px] font-medium">
                        Paying minimum amounts will result in a debt-free date of August 2028.
                    </p>
                </div>

                {/* Right Side — Optimized */}
                <div className="p-10 text-center flex flex-col items-center justify-center relative bg-teal-50/20">
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-md bg-[#FEF9C3] text-[#A16207] text-[10px] font-bold tracking-widest uppercase">
                        Recommended
                    </div>
                    
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-4">With Restructuring</p>
                    <p className="text-7xl font-bold text-teal-500 mb-6">{optimizedTimeline}</p>
                    
                    <div className="flex flex-col items-center gap-2">
                        <p className="flex items-center gap-1.5 text-teal-600 font-bold text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            {timelineSaved} Faster
                        </p>
                        <p className="text-[11px] text-teal-600/70 font-bold uppercase tracking-wider">
                            Save ₹1,42,000 in interest leakages
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
