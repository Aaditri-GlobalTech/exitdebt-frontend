import { NextRequest, NextResponse } from "next/server";
import { Account } from "@/lib/mockProfiles";
import {
    calculateInterestLeak,
    calculatePaymentPrioritizer,
    calculateCashFlow,
} from "@/lib/calculations";

/**
 * POST /api/calculate/interest-leak
 * Body: { accounts: Account[], totalEmi: number, totalOutstanding: number, optimalRate: number }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { accounts, totalEmi, totalOutstanding, optimalRate } = body;

        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid 'accounts' array." },
                { status: 400 }
            );
        }

        if (typeof totalEmi !== "number" || typeof totalOutstanding !== "number" || typeof optimalRate !== "number") {
            return NextResponse.json(
                { error: "Fields 'totalEmi', 'totalOutstanding', and 'optimalRate' must be numbers." },
                { status: 400 }
            );
        }

        const result = calculateInterestLeak(
            accounts as Account[],
            totalEmi,
            totalOutstanding,
            optimalRate
        );

        return NextResponse.json({ result });
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 }
        );
    }
}
