"use client";

import { useState, useRef, useCallback } from "react";
import { Account } from "@/lib/mockProfiles";
import { calculatePaymentPrioritizer, PaymentAllocation } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface SmartPaymentPrioritizerProps { accounts: Account[]; optimalRate: number; }

export default function SmartPaymentPrioritizer({ accounts, optimalRate }: SmartPaymentPrioritizerProps) {
    const [extraAmount, setExtraAmount] = useState<string>("7000");
    const [allocations, setAllocations] = useState<PaymentAllocation[]>(calculatePaymentPrioritizer(7000, accounts, optimalRate));
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChange = useCallback((value: string) => {
        setExtraAmount(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0) setAllocations(calculatePaymentPrioritizer(num, accounts, optimalRate));
            else setAllocations([]);
        }, 300);
    }, [accounts, optimalRate]);

    return (
        <div 
            className="rounded-xl p-6 lg:p-7 animate-slideUp border border-gray-100 flex flex-col h-full" 
            style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="text-teal-500 bg-teal-50 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Smart Payment Prioritizer</h3>
            </div>

            <div className="mb-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Available Extra Cash</p>
                <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                    <input 
                        type="text" 
                        value={extraAmount} 
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-12 pr-6 text-2xl font-bold text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm group-hover:shadow-md"
                    />
                </div>
            </div>

            {allocations.length > 0 ? (
                <div className="mt-auto space-y-6 animate-fadeIn">
                    <div className="p-6 rounded-2xl border border-teal-50 bg-teal-50/20 relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="text-sm font-bold text-teal-600">Optimization Recommendation</h4>
                            <span className="px-2.5 py-1 rounded bg-teal-500 text-white text-[9px] font-bold tracking-widest uppercase">Best ROI</span>
                        </div>
                        
                        <p className="text-sm font-bold text-gray-800 mb-6">
                            Pay the extra <span className="text-teal-600">{formatCurrency(parseInt(extraAmount) || 0)}</span> to <span className="text-teal-600">{allocations[0].lender}</span>.
                        </p>
                        
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-teal-600/70 border-r border-teal-100 pr-6">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                Saves {formatCurrency(allocations[0].savings)} Interest
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-teal-600/70">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                Debt-free 2 weeks sooner
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-xl bg-teal-500 text-white text-sm font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-100">
                        Execute Recommendation
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            ) : (
                <p className="text-xs text-center py-4 text-gray-400 mt-auto">Enter an amount to see recommendations.</p>
            )}
        </div>
    );
}
