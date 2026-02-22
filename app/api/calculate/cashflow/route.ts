import { NextRequest, NextResponse } from "next/server";
import { Account } from "@/lib/mockProfiles";
import { calculateCashFlow } from "@/lib/calculations";

/**
 * POST /api/calculate/cashflow
 * Body: { salary: number, salaryDate: number, accounts: Account[] }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { salary, salaryDate, accounts } = body;

        if (typeof salary !== "number" || salary <= 0) {
            return NextResponse.json(
                { error: "'salary' must be a positive number." },
                { status: 400 }
            );
        }

        if (typeof salaryDate !== "number" || salaryDate < 1 || salaryDate > 31) {
            return NextResponse.json(
                { error: "'salaryDate' must be between 1 and 31." },
                { status: 400 }
            );
        }

        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid 'accounts' array." },
                { status: 400 }
            );
        }

        const result = calculateCashFlow(
            salary,
            salaryDate,
            accounts as Account[]
        );

        return NextResponse.json({ result });
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 }
        );
    }
}
