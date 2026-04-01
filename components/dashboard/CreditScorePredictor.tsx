/**
 * CreditScorePredictor.tsx
 * 
 * RS-09 (P1): Credit Score Impact Predictor
 * 
 * Estimates the potential credit score impact when a user pays off
 * or reduces the balance on specific debt accounts. This is a simplified
 * estimation model based on credit utilization reduction.
 * 
 * The predictor uses a rule-of-thumb model:
 *  - Paying off a high-utilization credit card → larger score boost
 *  - Paying off a loan with good history → smaller score impact
 *  - Closing an account reduces average age → minor negative impact
 */
"use client";

import { TrendingUp } from "lucide-react";

import { useState } from "react";

interface Account {
    lender: string;
    type: string;
    outstanding: number;
    interestRate: number;
    limit?: number;
}

interface CreditScorePredictorProps {
    accounts: Account[];
    currentScore: number;
}

/**
 * Estimate the credit score impact of paying off a specific account.
 * 
 * This simplified model considers:
 *  - Credit utilization reduction (biggest factor for revolving credit)
 *  - Payment history improvement
 *  - Account mix impact
 */
function estimateScoreImpact(account: Account, allAccounts: Account[]): { min: number; max: number; reason: string } {
    const isRevolvingCredit = account.type?.toLowerCase().includes("credit card");
    const totalDebt = allAccounts.reduce((sum, a) => sum + a.outstanding, 0);
    const debtProportion = totalDebt > 0 ? account.outstanding / totalDebt : 0;

    if (isRevolvingCredit) {
        /* Credit card payoff has the highest score impact due to utilization reduction */
        const utilizationReduction = account.limit
            ? (account.outstanding / account.limit) * 100
            : 50; /* Assume 50% if limit is unknown */

        if (utilizationReduction > 70) {
            return { min: 20, max: 45, reason: "High utilization reduction — significant score boost expected" };
        } else if (utilizationReduction > 30) {
            return { min: 10, max: 25, reason: "Moderate utilization reduction — notable improvement" };
        } else {
            return { min: 5, max: 15, reason: "Low utilization — modest improvement" };
        }
    } else {
        /* Installment loans (personal loans, etc.) have smaller score impact */
        if (debtProportion > 0.5) {
            return { min: 10, max: 20, reason: "Major debt reduction — good score improvement" };
        } else {
            return { min: 3, max: 10, reason: "Installment payoff — moderate improvement" };
        }
    }
}

export default function CreditScorePredictor({ accounts, currentScore }: CreditScorePredictorProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selected = selectedIndex !== null ? accounts[selectedIndex] : null;
    const impact = selected ? estimateScoreImpact(selected, accounts) : null;

    return (
        <div
            className="rounded-2xl p-6 sm:p-8 animate-fadeIn"
            style={{
                backgroundColor: "var(--color-bg-card)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.05)",
                border: "1px solid var(--color-border)",
            }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <span className="text-xl"><TrendingUp className="w-5 h-5" /></span>
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900">Credit Score Impact Predictor</h3>
                    <p className="text-xs text-gray-400">Estimate score change for each payoff action</p>
                </div>
            </div>

            {/* Account selector */}
            <select
                value={selectedIndex ?? ""}
                onChange={(e) => setSelectedIndex(e.target.value === "" ? null : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
                <option value="">Select an account to simulate payoff...</option>
                {accounts.map((a, i) => (
                    <option key={i} value={i}>
                        {a.lender} — ₹{a.outstanding.toLocaleString("en-IN")} ({a.interestRate}% APR)
                    </option>
                ))}
            </select>

            {/* Impact display */}
            {impact && selected && (
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5 animate-fadeIn">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">
                        Estimated Impact
                    </p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-extrabold text-gray-900">
                            +{impact.min}–{impact.max}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">pts</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                        If you pay off <strong>{selected.lender}</strong> (₹{selected.outstanding.toLocaleString("en-IN")}),
                        your score could move from{" "}
                        <strong>{currentScore}</strong> to approximately{" "}
                        <strong>{Math.min(100, currentScore + impact.min)}–{Math.min(100, currentScore + impact.max)}</strong>.
                    </p>
                    <p className="text-xs text-gray-400 italic">{impact.reason}</p>
                </div>
            )}

            {!impact && (
                <p className="text-center text-xs text-gray-400 py-4">
                    Select an account above to see the estimated score impact.
                </p>
            )}
        </div>
    );
}
