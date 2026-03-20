"use client";

import { useState } from "react";
import { CashFlowResult } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface SalaryCashFlowProps { cashFlow: CashFlowResult; }

export default function SalaryCashFlow({ cashFlow }: SalaryCashFlowProps) {
    const [rentUtility, setRentUtility] = useState<number>(22000);
    
    // Monthly calculation
    const remainingAfterEMIs = cashFlow.remaining;
    const finalSavings = Math.max(0, remainingAfterEMIs - rentUtility);

    const events = [
        { day: cashFlow.salaryDay, label: "SALARY IN", amount: `+${formatCurrency(cashFlow.salary)}`, color: "var(--color-teal)", text: "var(--color-teal)", bg: "var(--color-teal-light)" },
        ...cashFlow.emis.map((emi) => ({
            day: emi.day,
            label: emi.lender.split(' ')[0] + " EMI",
            amount: `-${formatCurrency(emi.amount)}`,
            color: "#F97316",
            text: "#F97316",
            bg: "#FFF7ED"
        })),
        { day: 15, label: "Rent/Utility", amount: `-${formatCurrency(rentUtility)}`, color: "#9CA3AF", text: "#6B7280", bg: "#F9FAFB" },
        { day: 30, label: "Savings", amount: formatCurrency(finalSavings), color: "#22D3EE", text: "#0891B2", bg: "#ECFEFF" }
    ].sort((a, b) => a.day - b.day);

    return (
        <div 
            className="rounded-xl p-6 lg:p-7 animate-slideUp border border-gray-100" 
            style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="text-teal-500 bg-teal-50 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Salary Day Cash Flow</h3>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">₹</span>
                        <input 
                            type="number" 
                            value={rentUtility} 
                            onChange={(e) => setRentUtility(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-6 pr-3 text-xs font-bold text-gray-700 w-32 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            placeholder="Rent/Utility"
                        />
                        <label className="absolute -top-5 left-0 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Rent & Utilities</label>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border border-teal-100 bg-teal-50 text-teal-600 text-[9px] font-bold uppercase tracking-widest">
                        Day {cashFlow.salaryDay}
                    </div>
                </div>
            </div>

            <div className="relative pt-4 pb-8">
                {/* Connecting Line */}
                <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-50 bg-repeat-x" style={{ backgroundImage: "linear-gradient(to right, #F3F4FB 50%, transparent 50%)", backgroundSize: "10px 2px" }} />

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 relative z-10">
                    {events.map((ev, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div 
                                className="w-16 h-16 rounded-full flex flex-col items-center justify-center mb-6 border-2 transition-all shadow-sm"
                                style={{ 
                                    backgroundColor: "white", 
                                    borderColor: ev.bg,
                                    boxShadow: `0 4px 14px ${ev.bg}` 
                                }}
                            >
                                <span className="text-xl font-bold tabular-nums" style={{ color: ev.color }}>{ev.day.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">{ev.label}</p>
                                <p className="text-[11px] font-bold tabular-nums" style={{ color: ev.text }}>{ev.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Net Monthly Savings</p>
               <p className="text-lg font-bold text-teal-600 tabular-nums">{formatCurrency(finalSavings)}</p>
            </div>
        </div>
    );
}
