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
 * GET /api/dashboard/[userId]
 * Get full dashboard data: Freedom GPS, Interest Leak, Payment Prioritizer, Cash Flow.
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

    // Use userId as PAN to look up profile (mock)
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

    // Prioritizer with default ₹5000 extra per month
    const prioritizer = calculatePaymentPrioritizer(5000, profile.accounts, profile.optimalRate);

    return NextResponse.json({
        success: true,
        userId,
        profile: {
            name: profile.name,
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
        accounts: profile.accounts.map((acc) => ({
            lender: acc.lender,
            type: acc.type,
            outstanding: acc.outstanding,
            apr: acc.apr,
            emi: acc.emi,
            dueDate: acc.dueDate,
        })),
        generatedAt: new Date().toISOString(),
    });
}
