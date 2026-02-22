"use client";

import { Account } from "@/lib/mockProfiles";
import { formatCurrency } from "@/lib/utils";

interface DashboardAccountListProps { accounts: Account[]; }

function typeLabel(type: Account["type"]): string {
    switch (type) { case "credit_card": return "Credit Card"; case "loan": return "Personal Loan"; case "emi": return "EMI"; }
}

function ordinalDay(day: number): string {
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${day}${suffix}`;
}

export default function DashboardAccountList({ accounts }: DashboardAccountListProps) {
    const sorted = [...accounts].sort((a, b) => b.apr - a.apr);

    return (
        <div className="rounded-2xl overflow-hidden animate-fadeIn" style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)", border: "1px solid var(--color-border)" }}>
            <div className="px-7 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Your Accounts</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Sorted by interest rate — highest first</p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block" style={{ color: "var(--color-text-muted)" }}>{accounts.length} active</span>
            </div>

            {/* Desktop */}
            <div className="hidden sm:block">
                <div className="grid grid-cols-12 gap-4 px-7 py-3 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-muted)" }}>
                    <div className="col-span-3">Lender</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2 text-right">Outstanding</div>
                    <div className="col-span-2 text-right">APR</div>
                    <div className="col-span-1 text-right">EMI</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>
                {sorted.map((acc, i) => (
                    <div key={acc.lender} className={`grid grid-cols-12 gap-4 px-7 py-4 items-center transition-colors ${i % 2 === 0 ? "" : ""}`} style={{ borderTop: "1px solid var(--color-border)" }}>
                        <div className="col-span-3">
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{acc.lender}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Due: {ordinalDay(acc.dueDate)}</p>
                        </div>
                        <div className="col-span-2"><span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{typeLabel(acc.type)}</span></div>
                        <div className="col-span-2 text-right"><span className="text-sm font-medium tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(acc.outstanding)}</span></div>
                        <div className="col-span-2 text-right"><span className="text-sm font-semibold tabular-nums" style={{ color: acc.apr > 18 ? "var(--color-danger)" : "var(--color-success)" }}>{acc.apr}%</span></div>
                        <div className="col-span-1 text-right"><span className="text-sm font-medium tabular-nums" style={{ color: "var(--color-text-secondary)" }}>{formatCurrency(acc.emi)}</span></div>
                        <div className="col-span-2 text-right">
                            {acc.apr > 18 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "var(--color-danger)" }}>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                                    High Rate
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(5,150,105,0.08)", color: "var(--color-success)" }}>OK</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile */}
            <div className="sm:hidden">
                {sorted.map((acc) => (
                    <div key={acc.lender} className="px-5 py-4 space-y-2" style={{ borderTop: "1px solid var(--color-border)" }}>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>{acc.lender}</span>
                            {acc.apr > 18 && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--color-danger)", backgroundColor: "rgba(220,38,38,0.08)" }}>High</span>}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span style={{ color: "var(--color-text-muted)" }}>{typeLabel(acc.type)}</span>
                            <span className="font-semibold tabular-nums" style={{ color: acc.apr > 18 ? "var(--color-danger)" : "var(--color-success)" }}>{acc.apr}% APR</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(acc.outstanding)}</span>
                            <span style={{ color: "var(--color-text-muted)" }}>EMI: {formatCurrency(acc.emi)} · Due {ordinalDay(acc.dueDate)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
