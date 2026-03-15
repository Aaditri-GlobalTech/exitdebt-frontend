"use client";

import { InterestLeak } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface InterestLeakReportProps { leak: InterestLeak; }

export default function InterestLeakReport({ leak }: InterestLeakReportProps) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const principalPct = Math.round((leak.principal / leak.totalEmi) * 100);
    const interestPct = 100 - principalPct;

    return (
        <div className="rounded-2xl p-6 sm:p-8 animate-slideUp" style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-warning)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Interest Leak Report</h3>
                <span className="text-xs px-2 py-0.5 rounded-full ml-auto font-semibold" style={{ backgroundColor: "rgba(217,119,6,0.08)", color: "var(--color-warning)" }}>This Month</span>
            </div>

            {/* Primary Focus: Avoidable Interest */}
            <div className="mb-6">
                <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Total Avoidable Interest</p>
                <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-4xl font-bold tabular-nums tracking-tight" style={{ color: "var(--color-danger)" }}>{formatCurrency(leak.avoidable)}</span>
                    <button 
                         onClick={() => document.getElementById('prioritizer')?.scrollIntoView({ behavior: 'smooth' })}
                         className="mb-1 text-sm font-semibold hover:underline cursor-pointer" style={{ color: "var(--color-purple)" }}
                    >
                        Optimize →
                    </button>
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>This is money you are losing to high interest rates unnecessarily.</p>
            </div>

            {/* Progressive Disclosure Toggle */}
            <button 
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full py-3 mb-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}
            >
                {showBreakdown ? 'Hide Breakdown' : 'View Full Breakdown'}
                <svg className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Complex Details (Hidden by default) */}
            {showBreakdown && (
                <div className="space-y-4 pt-4 border-t animate-slideUp" style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Total EMIs Paid</span>
                        <span className="text-lg font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(leak.totalEmi)}</span>
                    </div>

                    <div className="w-full h-4 rounded-full overflow-hidden flex" style={{ backgroundColor: "var(--color-bg-soft)" }}>
                        <div className="h-full rounded-l-full transition-all duration-700" style={{ width: `${principalPct}%`, backgroundColor: "var(--color-success)" }} />
                        <div className="h-full rounded-r-full transition-all duration-700" style={{ width: `${interestPct}%`, backgroundColor: "var(--color-danger)" }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-success)" }} />
                            <div>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Principal</p>
                                <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(leak.principal)} <span style={{ color: "var(--color-text-muted)" }}>({principalPct}%)</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-danger)" }} />
                            <div>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Interest</p>
                                <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(leak.interest)} <span style={{ color: "var(--color-text-muted)" }}>({interestPct}%)</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
