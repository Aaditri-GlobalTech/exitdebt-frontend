"use client";

import { formatCurrency } from "@/lib/utils";

interface DebtSummaryCardsProps {
    totalOutstanding: number;
    monthlyEmi: number;
    activeAccounts: number;
    avgInterestRate: number;
}

const ICONS = {
    outstanding: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    emi: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),
    accounts: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    rate: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
};

export default function DebtSummaryCards({ totalOutstanding, monthlyEmi, activeAccounts, avgInterestRate }: DebtSummaryCardsProps) {
    const cards = [
        { label: "Total Outstanding", value: formatCurrency(totalOutstanding), icon: ICONS.outstanding, accent: "var(--color-purple)" },
        { label: "Monthly EMI Outgo", value: formatCurrency(monthlyEmi), icon: ICONS.emi, accent: "var(--color-warning)" },
        { label: "Active Accounts", value: activeAccounts.toString(), icon: ICONS.accounts, accent: "var(--color-blue)" },
        { label: "Avg Interest Rate", value: `${avgInterestRate}%`, icon: ICONS.rate, accent: avgInterestRate > 18 ? "var(--color-danger)" : "var(--color-success)" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {cards.map((card, i) => (
                <div
                    key={card.label}
                    className={`rounded-xl p-5 transition-all duration-200 hover:shadow-md hover-lift animate-slideUp stagger-${i + 1}`}
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span style={{ color: card.accent }}>{card.icon}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                            {card.label}
                        </span>
                    </div>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
