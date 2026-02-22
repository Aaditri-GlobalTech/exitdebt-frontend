/**
 * Unit tests for debt calculation functions.
 *
 * Covers all 5 exported calculation functions in calculations.ts:
 *   - calculateDebtHealthScore
 *   - calculateInterestLeak
 *   - calculatePaymentPrioritizer
 *   - calculateCashFlow
 *   - calculateTotalAnnualSavings
 */

import {
    calculateDebtHealthScore,
    calculateInterestLeak,
    calculatePaymentPrioritizer,
    calculateCashFlow,
    calculateTotalAnnualSavings,
} from "../calculations";
import { MockProfile, Account } from "../mockProfiles";

/* ─── Test helpers ──────────────────────────────────────────────────────── */

/** Minimal profile factory — override only what each test needs. */
function makeProfile(overrides: Partial<MockProfile> = {}): MockProfile {
    return {
        name: "Test User",
        panHash: "test12345x",
        score: 0,
        scoreLabel: "",
        color: "green",
        totalOutstanding: 100000,
        monthlyEmi: 5000,
        activeAccounts: 1,
        avgInterestRate: 12,
        creditUtilization: 20,
        missedPayments: 0,
        accounts: [],
        overpayment: 0,
        optimalRate: 11,
        salary: 80000,
        salaryDate: 1,
        otherIncome: 0,
        currentTimeline: "2y 0mo",
        optimizedTimeline: "1y 9mo",
        timelineSaved: "3 months",
        creditScore: 750,
        ...overrides,
    };
}

function makeAccount(overrides: Partial<Account> = {}): Account {
    return {
        lender: "Test Bank",
        outstanding: 100000,
        apr: 18,
        type: "loan",
        emi: 5000,
        dueDate: 10,
        ...overrides,
    };
}

/* ═════════════════════════════════════════════════════════════════════════ */
/*  calculateDebtHealthScore                                                */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("calculateDebtHealthScore", () => {
    it("returns Excellent for a healthy low-debt profile", () => {
        const profile = makeProfile({
            salary: 100000,
            monthlyEmi: 10000, // DTI = 10% → 30pts
            avgInterestRate: 10, // → 25pts
            activeAccounts: 1, // → 15pts
            creditUtilization: 10, // → 15pts
            missedPayments: 0, // → 15pts  = 100
        });
        const result = calculateDebtHealthScore(profile);
        expect(result.total).toBe(100);
        expect(result.label).toBe("Excellent");
        expect(result.color).toBe("green");
    });

    it("returns Critical for a heavily indebted profile", () => {
        const profile = makeProfile({
            salary: 30000,
            monthlyEmi: 25000, // DTI ~83% → 0pts
            avgInterestRate: 35, // → 0pts
            activeAccounts: 8, // → 0pts
            creditUtilization: 80, // → 0pts
            missedPayments: 5, // → 0pts  = 0
        });
        const result = calculateDebtHealthScore(profile);
        expect(result.total).toBe(0);
        expect(result.label).toBe("Critical");
        expect(result.color).toBe("red");
    });

    it("returns Fair for a moderate profile", () => {
        const profile = makeProfile({
            salary: 60000,
            monthlyEmi: 24000, // DTI = 40% → 20pts
            avgInterestRate: 15, // → 18pts
            activeAccounts: 3, // → 10pts
            creditUtilization: 35, // → 10pts
            missedPayments: 1, // → 10pts  = 68 → Good
        });
        const result = calculateDebtHealthScore(profile);
        expect(result.total).toBe(68);
        expect(result.label).toBe("Good");
    });

    it("score is always between 0 and 100", () => {
        const profiles = [
            makeProfile({ salary: 1, monthlyEmi: 999999 }),
            makeProfile({ salary: 999999, monthlyEmi: 1 }),
        ];
        for (const p of profiles) {
            const result = calculateDebtHealthScore(p);
            expect(result.total).toBeGreaterThanOrEqual(0);
            expect(result.total).toBeLessThanOrEqual(100);
        }
    });

    it("breakdown components sum to total", () => {
        const profile = makeProfile({
            salary: 50000,
            monthlyEmi: 15000,
            avgInterestRate: 20,
            activeAccounts: 5,
            creditUtilization: 55,
            missedPayments: 2,
        });
        const result = calculateDebtHealthScore(profile);
        const { dti, interestRate, activeAccounts, creditUtil, paymentHistory } =
            result.breakdown;
        expect(dti + interestRate + activeAccounts + creditUtil + paymentHistory).toBe(
            result.total
        );
    });

    it("handles zero salary without crashing (division by zero guard)", () => {
        const profile = makeProfile({ salary: 0, monthlyEmi: 10000 });
        expect(() => calculateDebtHealthScore(profile)).not.toThrow();
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  calculateInterestLeak                                                   */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("calculateInterestLeak", () => {
    it("splits EMI into principal and interest portions", () => {
        const accounts = [makeAccount({ outstanding: 120000, apr: 18 })];
        // Monthly interest = 120000 * 18 / 100 / 12 = 1800
        const result = calculateInterestLeak(accounts, 5000, 120000, 12);
        expect(result.interest).toBe(1800);
        expect(result.principal).toBe(3200);
        expect(result.totalEmi).toBe(5000);
    });

    it("calculates avoidable interest vs optimal rate", () => {
        const accounts = [makeAccount({ outstanding: 240000, apr: 24 })];
        // Interest = 240000 * 24 / 100 / 12 = 4800
        // Optimal  = 240000 * 12 / 100 / 12 = 2400
        // Avoidable = 4800 - 2400 = 2400
        const result = calculateInterestLeak(accounts, 8000, 240000, 12);
        expect(result.avoidable).toBe(2400);
    });

    it("returns zero avoidable when rate is at or below optimal", () => {
        const accounts = [makeAccount({ outstanding: 100000, apr: 10 })];
        const result = calculateInterestLeak(accounts, 5000, 100000, 12);
        expect(result.avoidable).toBe(0);
    });

    it("handles empty accounts", () => {
        const result = calculateInterestLeak([], 0, 0, 12);
        expect(result.interest).toBe(0);
        expect(result.principal).toBe(0);
        expect(result.avoidable).toBe(0);
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  calculatePaymentPrioritizer                                             */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("calculatePaymentPrioritizer", () => {
    const accounts = [
        makeAccount({ lender: "Low Rate", outstanding: 100000, apr: 12 }),
        makeAccount({ lender: "High Rate", outstanding: 50000, apr: 36 }),
        makeAccount({ lender: "Mid Rate", outstanding: 80000, apr: 18 }),
    ];

    it("allocates to highest APR first (avalanche method)", () => {
        const result = calculatePaymentPrioritizer(30000, accounts, 12);
        expect(result[0].lender).toBe("High Rate");
        expect(result[0].amount).toBe(30000);
    });

    it("caps allocation at account outstanding", () => {
        // 60000 extra → 50000 goes to High Rate (capped), 10000 to Mid Rate
        const result = calculatePaymentPrioritizer(60000, accounts, 12);
        expect(result[0].lender).toBe("High Rate");
        expect(result[0].amount).toBe(50000);
        expect(result[1].lender).toBe("Mid Rate");
        expect(result[1].amount).toBe(10000);
    });

    it("returns empty for zero extra amount", () => {
        expect(calculatePaymentPrioritizer(0, accounts, 12)).toEqual([]);
    });

    it("returns empty for negative extra amount", () => {
        expect(calculatePaymentPrioritizer(-1000, accounts, 12)).toEqual([]);
    });

    it("calculates correct annual savings per allocation", () => {
        const result = calculatePaymentPrioritizer(20000, accounts, 12);
        // High Rate: 20000 * (36 - 12) / 100 = 4800
        expect(result[0].savings).toBe(4800);
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  calculateCashFlow                                                       */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("calculateCashFlow", () => {
    const accounts = [
        makeAccount({ lender: "Bank C", dueDate: 20, emi: 3000 }),
        makeAccount({ lender: "Bank A", dueDate: 5, emi: 7000 }),
        makeAccount({ lender: "Bank B", dueDate: 12, emi: 5000 }),
    ];

    it("sorts EMIs by due date ascending", () => {
        const result = calculateCashFlow(80000, 1, accounts);
        expect(result.emis.map((e) => e.day)).toEqual([5, 12, 20]);
    });

    it("computes remaining income correctly", () => {
        const result = calculateCashFlow(80000, 1, accounts);
        expect(result.totalEmi).toBe(15000);
        expect(result.remaining).toBe(65000);
    });

    it("computes EMI-to-salary ratio as percentage", () => {
        const result = calculateCashFlow(80000, 1, accounts);
        // 15000 / 80000 * 100 = 18.75 → rounded to 19
        expect(result.ratio).toBe(19);
    });

    it("preserves salary day", () => {
        const result = calculateCashFlow(50000, 7, accounts);
        expect(result.salaryDay).toBe(7);
        expect(result.salary).toBe(50000);
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  calculateTotalAnnualSavings                                             */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("calculateTotalAnnualSavings", () => {
    it("calculates savings for accounts above optimal rate", () => {
        const accounts = [
            makeAccount({ lender: "High", outstanding: 200000, apr: 24 }),
            makeAccount({ lender: "Low", outstanding: 100000, apr: 10 }),
        ];
        const result = calculateTotalAnnualSavings(accounts, 12);
        // High: 200000 * (24 - 12) / 100 = 24000; Low: skipped
        expect(result.total).toBe(24000);
        expect(result.breakdown).toHaveLength(1);
        expect(result.breakdown[0].account).toBe("High");
        expect(result.breakdown[0].savings).toBe(24000);
    });

    it("returns zero total when all accounts are at or below optimal", () => {
        const accounts = [
            makeAccount({ outstanding: 100000, apr: 10 }),
            makeAccount({ outstanding: 200000, apr: 12 }),
        ];
        const result = calculateTotalAnnualSavings(accounts, 12);
        expect(result.total).toBe(0);
        expect(result.breakdown).toHaveLength(0);
    });

    it("handles empty accounts", () => {
        const result = calculateTotalAnnualSavings([], 12);
        expect(result.total).toBe(0);
        expect(result.breakdown).toHaveLength(0);
    });

    it("breakdown entries have correct structure", () => {
        const accounts = [makeAccount({ lender: "HDFC", outstanding: 500000, apr: 20 })];
        const result = calculateTotalAnnualSavings(accounts, 12);
        const entry = result.breakdown[0];
        expect(entry).toMatchObject({
            account: "HDFC",
            outstanding: 500000,
            currentRate: 20,
            optimalRate: 12,
        });
        expect(entry.currentCost).toBe(100000); // 500000 * 20%
        expect(entry.optimalCost).toBe(60000); // 500000 * 12%
        expect(entry.savings).toBe(40000);
    });
});
