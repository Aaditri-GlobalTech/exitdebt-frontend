import { NextRequest, NextResponse } from "next/server";
import { selectProfile } from "@/lib/utils";
import {
    calculateDebtHealthScore,
    calculateTotalAnnualSavings,
    calculateInterestLeak,
    calculateCashFlow,
    calculatePaymentPrioritizer,
} from "@/lib/calculations";

/**
 * GET /api/dashboard/sales/[userId]
 * Sales-only: full dashboard + 12-month trends + lender offers.
 * This endpoint is for internal sales team use.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    if (!userId || typeof userId !== "string") {
        return NextResponse.json(
            { success: false, error: "Missing or invalid user ID." },
            { status: 400 }
        );
    }

    const profile = selectProfile(userId);
    const healthScore = calculateDebtHealthScore(profile);
    const savings = calculateTotalAnnualSavings(profile.accounts, profile.optimalRate);
    const interestLeak = calculateInterestLeak(
        profile.accounts,
        profile.monthlyEmi,
        profile.totalOutstanding,
        profile.optimalRate
    );
    const cashFlow = calculateCashFlow(profile.salary, profile.salaryDate, profile.accounts);
    const prioritizer = calculatePaymentPrioritizer(5000, profile.accounts, profile.optimalRate);

    // Mock 12-month trends
    const generateMonthlyTrend = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map((month, i) => ({
            month,
            outstanding: Math.round(profile.totalOutstanding * (1 - i * 0.02)),
            emiPaid: profile.monthlyEmi,
            interestPaid: Math.round(interestLeak.interest * (1 + (Math.random() - 0.5) * 0.1)),
            principalPaid: Math.round(interestLeak.principal * (1 + (Math.random() - 0.5) * 0.1)),
        }));
    };

    // Mock lender offers
    const lenderOffers = profile.accounts
        .filter((acc) => acc.apr > profile.optimalRate + 2)
        .map((acc) => ({
            currentLender: acc.lender,
            currentRate: acc.apr,
            offeredRate: profile.optimalRate + Math.round(Math.random() * 2),
            offeredBy: ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak"][Math.floor(Math.random() * 5)],
            monthlySaving: Math.round((acc.outstanding * (acc.apr - profile.optimalRate - 1)) / 100 / 12),
            status: "available",
        }));

    return NextResponse.json({
        success: true,
        userId,
        salesView: true,
        profile: {
            name: profile.name,
            phone: "masked", // Never expose full phone in sales view
            score: healthScore.total,
            scoreLabel: healthScore.label,
            color: healthScore.color,
            scoreBreakdown: healthScore.breakdown,
            totalOutstanding: profile.totalOutstanding,
            monthlyEmi: profile.monthlyEmi,
            activeAccounts: profile.activeAccounts,
            avgInterestRate: profile.avgInterestRate,
            creditUtilization: profile.creditUtilization,
            creditScore: profile.creditScore,
            salary: profile.salary,
        },
        freedomGPS: {
            currentTimeline: profile.currentTimeline,
            optimizedTimeline: profile.optimizedTimeline,
            timelineSaved: profile.timelineSaved,
        },
        interestLeak,
        cashFlow,
        prioritizer: {
            extraAmount: 5000,
            allocations: prioritizer,
            totalSavings: prioritizer.reduce((s, a) => s + a.savings, 0),
        },
        savings: {
            totalAnnual: savings.total,
            breakdown: savings.breakdown,
        },
        accounts: profile.accounts,
        trends: generateMonthlyTrend(),
        lenderOffers,
        generatedAt: new Date().toISOString(),
    });
}
