import { Account, MockProfile } from "./mockProfiles";

/* ─── Debt Health Score (5-factor model) ────────────────────────────────── */

export interface DebtHealthScore {
    total: number;         // 0-100
    label: string;         // "Critical" | "Needs Attention" | "Fair" | "Good" | "Excellent"
    color: "red" | "orange" | "yellow" | "green";
    breakdown: {
        dti: number;             // 0-30
        interestRate: number;    // 0-25
        activeAccounts: number;  // 0-15
        creditUtil: number;      // 0-15
        paymentHistory: number;  // 0-15
    };
}

/**
 * Calculate Debt Health Score (0–100, higher = healthier)
 *
 * Factor               | Weight | Scoring Logic
 * DTI                  | 30%    | <30% = 30, 30-50% = 20, 50-70% = 10, >70% = 0
 * Avg Interest Rate    | 25%    | <12% = 25, 12-18% = 18, 18-30% = 10, >30% = 0
 * Active Accounts      | 15%    | 1-2 = 15, 3-4 = 10, 5-6 = 5, >6 = 0
 * Credit Utilization   | 15%    | <30% = 15, 30-50% = 10, 50-75% = 5, >75% = 0
 * Payment History      | 15%    | 0 missed = 15, 1-2 missed = 10, 3+ missed = 0
 */
export function calculateDebtHealthScore(profile: MockProfile): DebtHealthScore {
    const salary = profile.salary || 1; // avoid division by zero
    const dtiPct = (profile.monthlyEmi / salary) * 100;

    // DTI (30pts max)
    const dti = dtiPct < 30 ? 30 : dtiPct <= 50 ? 20 : dtiPct <= 70 ? 10 : 0;

    // Avg Interest Rate (25pts max)
    const rate = profile.avgInterestRate;
    const interestRate = rate < 12 ? 25 : rate <= 18 ? 18 : rate <= 30 ? 10 : 0;

    // Active Accounts (15pts max)
    const n = profile.activeAccounts;
    const activeAccounts = n <= 2 ? 15 : n <= 4 ? 10 : n <= 6 ? 5 : 0;

    // Credit Utilization (15pts max)
    const util = profile.creditUtilization;
    const creditUtil = util < 30 ? 15 : util <= 50 ? 10 : util <= 75 ? 5 : 0;

    // Payment History (15pts max)
    const missed = profile.missedPayments;
    const paymentHistory = missed === 0 ? 15 : missed <= 2 ? 10 : 0;

    const total = dti + interestRate + activeAccounts + creditUtil + paymentHistory;

    // Label & color
    let label: string;
    let color: "red" | "orange" | "yellow" | "green";
    if (total >= 80) { label = "Excellent"; color = "green"; }
    else if (total >= 60) { label = "Good"; color = "green"; }
    else if (total >= 45) { label = "Fair"; color = "yellow"; }
    else if (total >= 30) { label = "Needs Attention"; color = "orange"; }
    else { label = "Critical"; color = "red"; }

    return {
        total,
        label,
        color,
        breakdown: { dti, interestRate, activeAccounts, creditUtil, paymentHistory },
    };
}


export interface InterestLeak {
    totalEmi: number;
    principal: number;
    interest: number;
    avoidable: number;
}

export interface PaymentAllocation {
    lender: string;
    amount: number;
    savings: number;
}

export interface CashFlowResult {
    salaryDay: number;
    salary: number;
    emis: { day: number; lender: string; amount: number }[];
    totalEmi: number;
    remaining: number;
    ratio: number; // EMI-to-salary percentage
}

/**
 * Calculate interest leak for the current month.
 * Splits total EMI into principal vs interest portions
 * and identifies avoidable interest vs optimal rate.
 */
export function calculateInterestLeak(
    accounts: Account[],
    totalEmi: number,
    totalOutstanding: number,
    optimalRate: number
): InterestLeak {
    // Monthly interest = sum of each account's outstanding × (APR/12/100)
    const interest = accounts.reduce(
        (sum, acc) => sum + (acc.outstanding * acc.apr) / 100 / 12,
        0
    );
    const principal = totalEmi - interest;
    // What interest *would* be at the optimal rate
    const optimalInterest = (totalOutstanding * optimalRate) / 100 / 12;
    const avoidable = Math.max(0, Math.round(interest - optimalInterest));

    return {
        totalEmi,
        principal: Math.round(Math.max(0, principal)),
        interest: Math.round(interest),
        avoidable,
    };
}

/**
 * Allocate extra cash to accounts sorted by highest APR first (avalanche method).
 * Returns per-account allocation and estimated annual savings.
 */
export function calculatePaymentPrioritizer(
    extraAmount: number,
    accounts: Account[],
    optimalRate: number
): PaymentAllocation[] {
    if (extraAmount <= 0) return [];

    const sorted = [...accounts].sort((a, b) => b.apr - a.apr);
    const allocations: PaymentAllocation[] = [];
    let remaining = extraAmount;

    for (const acc of sorted) {
        if (remaining <= 0) break;
        const allocated = Math.min(remaining, acc.outstanding);
        const annualSavings = Math.round((allocated * (acc.apr - optimalRate)) / 100);
        allocations.push({
            lender: acc.lender,
            amount: allocated,
            savings: Math.max(0, annualSavings),
        });
        remaining -= allocated;
    }

    return allocations;
}

/**
 * Calculate salary-day cash flow: lists EMIs in order of due date,
 * computes remaining income after EMIs and EMI-to-salary ratio.
 */
export function calculateCashFlow(
    salary: number,
    salaryDate: number,
    accounts: Account[]
): CashFlowResult {
    const emis = [...accounts]
        .sort((a, b) => a.dueDate - b.dueDate)
        .map((acc) => ({
            day: acc.dueDate,
            lender: acc.lender,
            amount: acc.emi,
        }));

    const totalEmi = emis.reduce((sum, e) => sum + e.amount, 0);
    const remaining = salary - totalEmi;
    const ratio = Math.round((totalEmi / salary) * 100);

    return { salaryDay: salaryDate, salary, emis, totalEmi, remaining, ratio };
}

/* ─── Savings Calculation ────────────────────────────────────────────────── */

export interface SavingsBreakdown {
    account: string;
    outstanding: number;
    currentRate: number;
    optimalRate: number;
    currentCost: number;    // annual interest at current rate
    optimalCost: number;    // annual interest at optimal rate
    savings: number;        // annual savings for this account
}

/**
 * Calculate total annual savings by restructuring debt.
 *
 * For each account where current_rate > optimal_rate:
 *   current_cost  = outstanding × current_rate / 100
 *   optimal_cost  = outstanding × optimal_rate / 100
 *   savings       = current_cost - optimal_cost
 *
 * total_annual_savings = sum(savings for all eligible accounts)
 */
export function calculateTotalAnnualSavings(
    accounts: Account[],
    optimalRate: number
): { total: number; breakdown: SavingsBreakdown[] } {
    const breakdown: SavingsBreakdown[] = [];
    let total = 0;

    for (const acc of accounts) {
        if (acc.apr <= optimalRate) continue; // no savings possible

        const currentCost = (acc.outstanding * acc.apr) / 100;
        const optimalCost = (acc.outstanding * optimalRate) / 100;
        const savings = Math.round(currentCost - optimalCost);

        breakdown.push({
            account: acc.lender,
            outstanding: acc.outstanding,
            currentRate: acc.apr,
            optimalRate,
            currentCost: Math.round(currentCost),
            optimalCost: Math.round(optimalCost),
            savings,
        });

        total += savings;
    }

    return { total, breakdown };
}

