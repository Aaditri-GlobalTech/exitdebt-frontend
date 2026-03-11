"use client";

import { Account } from "@/lib/mockProfiles";
import { formatCurrency } from "@/lib/utils";

interface DebtSummaryCardsProps {
    totalOutstanding: number;
    accounts: Account[];
}

const ACCOUNT_ICONS: Record<Account["type"], React.ReactNode> = {
    credit_card: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    loan: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    emi: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    ),
};

function getStatusInfo(acc: Account) {
    if (acc.apr > 30) return { label: "CRITICAL", bg: "#FEF2F2", text: "#DC2626" };
    if (acc.apr > 15) return { label: "WARNING", bg: "#FFFBEB", text: "#D97706" };
    return { label: "STABLE", bg: "#EFF6FF", text: "#2563EB" };
}

const ICON_BGS = ["#FEF2F2", "#EFF6FF", "#FFF7ED", "#F0FDFA"];

export default function DebtSummaryCards({ totalOutstanding, accounts }: DebtSummaryCardsProps) {
    return (
        <div 
            className="rounded-xl p-6 lg:p-7 animate-fadeIn h-full flex flex-col border border-gray-100"
            style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}
        >
            <div className="flex items-start justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-800">Debt Summary</h3>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Total Outstanding</p>
                    <p className="text-3xl font-bold text-gray-800 tabular-nums">{formatCurrency(totalOutstanding)}</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {accounts.map((acc, i) => {
                    const status = getStatusInfo(acc);
                    const iconBg = ICON_BGS[i % ICON_BGS.length];
                    const iconColor = status.text;

                    return (
                        <div 
                            key={acc.lender}
                            className="group flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/50 transition-all cursor-default"
                        >
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-white transition-all shadow-sm"
                                    style={{ backgroundColor: iconBg, color: iconColor }}
                                >
                                    {ACCOUNT_ICONS[acc.type]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 mb-0.5">{acc.lender}</p>
                                    <p className="text-[11px] font-medium text-gray-400 capitalize">
                                        {acc.apr}% APR • {acc.apr > 20 ? "High Interest" : "Standard"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-800 mb-1.5 tabular-nums">
                                    {formatCurrency(acc.outstanding)}
                                </p>
                                <span 
                                    className="px-2.5 py-1 rounded text-[9px] font-bold tracking-wider"
                                    style={{ backgroundColor: status.bg, color: status.text }}
                                >
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
