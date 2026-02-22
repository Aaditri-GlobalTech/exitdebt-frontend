import { NextRequest, NextResponse } from "next/server";
import { Account } from "@/lib/mockProfiles";
import { calculatePaymentPrioritizer } from "@/lib/calculations";

/**
 * POST /api/calculate/prioritizer
 * Body: { extraAmount: number, accounts: Account[], optimalRate: number }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { extraAmount, accounts, optimalRate } = body;

        if (typeof extraAmount !== "number" || extraAmount <= 0) {
            return NextResponse.json(
                { error: "'extraAmount' must be a positive number." },
                { status: 400 }
            );
        }

        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid 'accounts' array." },
                { status: 400 }
            );
        }

        if (typeof optimalRate !== "number") {
            return NextResponse.json(
                { error: "'optimalRate' must be a number." },
                { status: 400 }
            );
        }

        const allocations = calculatePaymentPrioritizer(
            extraAmount,
            accounts as Account[],
            optimalRate
        );

        const totalSavings = allocations.reduce((s, a) => s + a.savings, 0);

        return NextResponse.json({ allocations, totalSavings });
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 }
        );
    }
}
