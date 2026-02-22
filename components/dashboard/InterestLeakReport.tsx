"use client";

import { InterestLeak } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface InterestLeakReportProps { leak: InterestLeak; }

export default function InterestLeakReport({ leak }: InterestLeakReportProps) {
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

            <div className="space-y-4 mb-6">
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

            {leak.avoidable > 0 && (
                <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)" }}>
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--color-warning)" }}>
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-warning)" }}>{formatCurrency(leak.avoidable)} of that interest was AVOIDABLE</p>
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>By restructuring at an optimal rate, you could save this amount every month.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
