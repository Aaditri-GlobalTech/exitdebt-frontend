"use client";

import { CashFlowResult } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

interface SalaryCashFlowProps { cashFlow: CashFlowResult; }

function ordinalDay(day: number): string {
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${day}${suffix}`;
}

export default function SalaryCashFlow({ cashFlow }: SalaryCashFlowProps) {
    const ratioPct = cashFlow.ratio;
    const isWarning = ratioPct > 50;

    return (
        <div className="rounded-2xl p-6 sm:p-8 animate-slideUp" style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-purple)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Salary Day Cash Flow</h3>
            </div>

            <div className="rounded-xl px-4 py-3 flex items-center justify-between mb-3" style={{ backgroundColor: "rgba(115,0,190,0.04)", border: "1px solid rgba(115,0,190,0.15)" }}>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-purple)" }}>Salary Credit</span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{ordinalDay(cashFlow.salaryDay)} of month</span>
                </div>
                <span className="text-base font-bold tabular-nums" style={{ color: "var(--color-purple)" }}>+{formatCurrency(cashFlow.salary)}</span>
            </div>

            <div className="space-y-2 mb-4">
                {cashFlow.emis.map((emi) => (
                    <div key={emi.lender} className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}>
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{emi.lender}</p>
                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{ordinalDay(emi.day)} of month</p>
                        </div>
                        <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-danger)" }}>-{formatCurrency(emi.amount)}</span>
                    </div>
                ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                <div>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Remaining after EMIs</p>
                    <p className="text-xl font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(cashFlow.remaining)}</p>
                </div>
                <div className="px-4 py-2 rounded-lg text-sm font-semibold" style={{
                    backgroundColor: isWarning ? "rgba(217,119,6,0.08)" : "rgba(5,150,105,0.08)",
                    color: isWarning ? "var(--color-warning)" : "var(--color-success)",
                    border: `1px solid ${isWarning ? "rgba(217,119,6,0.15)" : "rgba(5,150,105,0.15)"}`,
                }}>
                    EMI-to-Salary Ratio: <span className="tabular-nums">{ratioPct}%</span>{isWarning && " ⚠️"}
                </div>
            </div>
        </div>
    );
}
