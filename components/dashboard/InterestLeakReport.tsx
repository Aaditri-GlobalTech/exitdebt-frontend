"use client";

import { InterestLeak } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface InterestLeakReportProps { leak: InterestLeak; }

export default function InterestLeakReport({ leak }: InterestLeakReportProps) {
    return (
        <div 
            className="rounded-xl p-6 lg:p-7 animate-slideUp border border-gray-100 h-full flex flex-col" 
            style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="text-red-500 bg-red-50 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Interest Leak Report</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 relative">
                {/* Divider */}
                <div className="absolute left-1/2 top-1 bottom-1 w-px bg-gray-100 hidden sm:block" />

                <div className="text-center bg-gray-50/50 py-4 rounded-xl">
                    <p className="text-xl font-bold text-gray-800 mb-0.5 tabular-nums">{formatCurrency(leak.totalEmi)}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total EMIs</p>
                </div>
                <div className="text-center bg-red-50/20 py-4 rounded-xl border border-red-50/50">
                    <p className="text-xl font-bold text-red-500 mb-0.5 tabular-nums">{formatCurrency(leak.avoidable)}</p>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Avoidable Interest</p>
                </div>
            </div>

            <div className="mt-auto p-4 rounded-xl bg-red-50/50 border border-red-100/30">
                <p className="text-[11px] leading-relaxed text-gray-600 font-medium">
                    <span className="text-red-600 font-bold uppercase tracking-wider mr-1">Alert:</span> 
                    You are losing {formatCurrency(leak.avoidable)} every month to high-interest debt that could be consolidated.
                    That&apos;s a new iPhone every 10 months wasted on interest.
                </p>
            </div>
        </div>
    );
}
