import { NextRequest, NextResponse } from "next/server";
import { Account } from "@/lib/mockProfiles";
import { calculatePaymentPrioritizer } from "@/lib/calculations";

/**
 * POST /api/prioritizer/calculate
 * Body: { extraAmount: number, accounts: Account[], optimalRate: number }
 * Calculate optimal payment allocation for a given extra amount.
 * Returns: { success, allocations, totalSavings }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { extraAmount, accounts, optimalRate } = body;

        if (typeof extraAmount !== "number" || extraAmount <= 0) {
            return NextResponse.json(
                { success: false, error: "'extraAmount' must be a positive number." },
                { status: 400 }
            );
        }

        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'accounts' array." },
                { status: 400 }
            );
        }

        if (typeof optimalRate !== "number") {
            return NextResponse.json(
                { success: false, error: "'optimalRate' must be a number." },
                { status: 400 }
            );
        }

        const allocations = calculatePaymentPrioritizer(
            extraAmount,
            accounts as Account[],
            optimalRate
        );

        const totalSavings = allocations.reduce((s, a) => s + a.savings, 0);

        return NextResponse.json({
            success: true,
            extraAmount,
            optimalRate,
            allocations,
            totalSavings,
            method: "avalanche", // Highest APR first
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
