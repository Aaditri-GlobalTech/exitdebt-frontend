"use client";

import { Account } from "@/lib/mockProfiles";
import { formatCurrency } from "@/lib/utils";

interface DashboardAccountListProps { accounts: Account[]; }

function typeLabel(type: Account["type"]): string {
    switch (type) { case "credit_card": return "Credit Card"; case "loan": return "Personal Loan"; case "emi": return "EMI"; default: return "Other"; }
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
                    <div className="col-span-2">Outstanding</div>
                    <div className="col-span-1 text-center">APR</div>
                    <div className="col-span-2 text-right">EMI</div>
                    <div className="col-span-2 text-right flex justify-end">Status</div>
                </div>
                {sorted.map((acc, i) => (
                    <div key={acc.lender} className={`grid grid-cols-12 gap-4 px-7 py-4 items-center transition-colors ${i % 2 === 0 ? "" : ""}`} style={{ borderTop: "1px solid var(--color-border)" }}>
                        <div className="col-span-3">
                            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{acc.lender}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Due: {ordinalDay(acc.dueDate)}</p>
                        </div>
                        <div className="col-span-2"><span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{typeLabel(acc.type)}</span></div>
                        <div className="col-span-2"><span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(acc.outstanding)}</span></div>
                        <div className="col-span-1 text-center"><span className="text-sm font-bold tabular-nums" style={{ color: acc.apr > 18 ? "var(--color-danger)" : "var(--color-success)" }}>{acc.apr}%</span></div>
                        <div className="col-span-2 text-right"><span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-text-secondary)" }}>{formatCurrency(acc.emi)}</span></div>
                        <div className="col-span-2 flex justify-end items-center">
                            {acc.apr > 18 ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(220,38,38,0.08)" }}>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-danger)" }}><path fillRule="evenodd" d="M2.25 21h19.5c.829 0 1.5-.671 1.5-1.5s-.671-1.5-1.5-1.5H3.75c-.829 0-1.5.671-1.5 1.5S1.421 21 2.25 21zM11.235 3.197c.338-.636 1.192-.636 1.53 0l6.75 12.695A.75.75 0 0118.852 17h-13.7a.75.75 0 01-.663-1.108l6.746-12.695z" clipRule="evenodd" /></svg>
                                    <div className="flex flex-col leading-none text-right">
                                        <span className="text-[10px] font-bold" style={{ color: "var(--color-danger)" }}>High</span>
                                        <span className="text-[10px] font-bold" style={{ color: "var(--color-danger)" }}>Rate</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(5,150,105,0.08)", color: "var(--color-success)" }}>OK</span>
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
                            <span className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{acc.lender}</span>
                            {acc.apr > 18 ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(220,38,38,0.08)" }}>
                                    <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-danger)" }}><path fillRule="evenodd" d="M2.25 21h19.5c.829 0 1.5-.671 1.5-1.5s-.671-1.5-1.5-1.5H3.75c-.829 0-1.5.671-1.5 1.5S1.421 21 2.25 21zM11.235 3.197c.338-.636 1.192-.636 1.53 0l6.75 12.695A.75.75 0 0118.852 17h-13.7a.75.75 0 01-.663-1.108l6.746-12.695z" clipRule="evenodd" /></svg>
                                    <span className="text-[10px] font-bold tracking-wide" style={{ color: "var(--color-danger)" }}>High Rate</span>
                                </div>
                            ) : (
                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: "rgba(5,150,105,0.08)", color: "var(--color-success)" }}>OK</span>
                            )}
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
