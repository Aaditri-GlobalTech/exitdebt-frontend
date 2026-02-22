"use client";

import { useState, useRef, useCallback } from "react";
import { Account } from "@/lib/mockProfiles";
import { calculatePaymentPrioritizer, PaymentAllocation } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface SmartPaymentPrioritizerProps { accounts: Account[]; optimalRate: number; }

export default function SmartPaymentPrioritizer({ accounts, optimalRate }: SmartPaymentPrioritizerProps) {
    const [extraAmount, setExtraAmount] = useState("");
    const [allocations, setAllocations] = useState<PaymentAllocation[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const totalOutstanding = accounts.reduce((s, a) => s + a.outstanding, 0);

    const handleChange = useCallback((value: string) => {
        setExtraAmount(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0) setAllocations(calculatePaymentPrioritizer(num, accounts, optimalRate));
            else setAllocations([]);
        }, 300);
    }, [accounts, optimalRate]);

    const handleCalculate = () => {
        const num = parseInt(extraAmount, 10);
        if (!isNaN(num) && num > 0) setAllocations(calculatePaymentPrioritizer(num, accounts, optimalRate));
    };

    const parsedAmount = parseInt(extraAmount, 10) || 0;
    const excessAmount = parsedAmount > totalOutstanding ? parsedAmount - totalOutstanding : 0;
    const totalSavings = allocations.reduce((s, a) => s + a.savings, 0);

    return (
        <div className="rounded-2xl p-6 sm:p-8 animate-slideUp stagger-2" style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-purple)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Smart Payment Prioritizer</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <label htmlFor="extra-payment" className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>Have extra cash? Enter amount:</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>₹</span>
                        <input id="extra-payment" type="number" min={0} step={1000} placeholder="e.g. 10000" value={extraAmount} onChange={(e) => handleChange(e.target.value)}
                            className="w-full rounded-xl pl-8 pr-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2"
                            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                            aria-label="Extra payment amount" />
                    </div>
                </div>
                <button onClick={handleCalculate} className="self-end px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer" style={{ backgroundColor: "var(--color-purple)" }} aria-label="Calculate optimal allocation">Calculate</button>
            </div>

            {allocations.length > 0 && (
                <div className="space-y-3">
                    {allocations.map((alloc) => (
                        <div key={alloc.lender} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}>
                            <span style={{ color: "var(--color-purple)" }}>→</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                                    <span className="font-semibold tabular-nums">{formatCurrency(alloc.amount)}</span> to <span className="font-medium">{alloc.lender}</span>
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 rounded-lg shrink-0 tabular-nums" style={{ backgroundColor: "rgba(5,150,105,0.08)", color: "var(--color-success)" }}>saves {formatCurrency(alloc.savings)}/yr</span>
                        </div>
                    ))}

                    <div className="flex items-center justify-between px-4 py-3 rounded-xl mt-2" style={{ backgroundColor: "rgba(115,0,190,0.04)", border: "1px solid rgba(115,0,190,0.15)" }}>
                        <span className="text-sm font-medium" style={{ color: "var(--color-purple)" }}>Total Annual Savings</span>
                        <span className="text-lg font-bold tabular-nums" style={{ color: "var(--color-purple)" }}>{formatCurrency(totalSavings)}/yr</span>
                    </div>

                    {excessAmount > 0 && <p className="text-xs text-center mt-2" style={{ color: "var(--color-success)" }}>🎉 You could pay off all debt! Remaining: {formatCurrency(excessAmount)}</p>}
                </div>
            )}

            {!allocations.length && !extraAmount && <p className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>Enter an amount above to see how to optimally allocate your extra payment.</p>}
            {extraAmount && !allocations.length && <p className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>Enter a valid amount greater than 0 to see recommendations.</p>}
        </div>
    );
}
