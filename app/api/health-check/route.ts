import { NextRequest, NextResponse } from "next/server";
import { selectProfile } from "@/lib/utils";
import {
    calculateDebtHealthScore,
    calculateTotalAnnualSavings,
    calculateInterestLeak,
    calculateCashFlow,
} from "@/lib/calculations";

// In-memory store for health check results (production: use database)
const healthCheckStore = new Map<string, Record<string, unknown>>();

/**
 * POST /api/health-check
 * Body: { pan: string, phone: string, consent: { timestamp: string, version: string } }
 * Submit PAN + phone → trigger CIBIL pull → return parsed results.
 * Returns: { id, profile, healthScore, savings, interestLeak, cashFlow }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pan, phone, consent } = body;

        if (!pan || typeof pan !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'pan' field." },
                { status: 400 }
            );
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panRegex.test(pan.toUpperCase())) {
            return NextResponse.json(
                { success: false, error: "Invalid PAN format. Expected: ABCDE1234F" },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'phone' field." },
                { status: 400 }
            );
        }

        if (!consent || !consent.timestamp || !consent.version) {
            return NextResponse.json(
                { success: false, error: "Missing consent record. Required: { timestamp, version }" },
                { status: 400 }
            );
        }

        // Mock CIBIL pull — in production, call CIBIL/Experian API
        const profile = selectProfile(pan);
        const healthScore = calculateDebtHealthScore(profile);
        const savings = calculateTotalAnnualSavings(profile.accounts, profile.optimalRate);
        const interestLeak = calculateInterestLeak(
            profile.accounts,
            profile.monthlyEmi,
            profile.totalOutstanding,
            profile.optimalRate
        );
        const cashFlow = calculateCashFlow(profile.salary, profile.salaryDate, profile.accounts);

        // Generate unique ID
        const id = `hc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const result = {
            id,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
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
            savings: {
                totalAnnual: savings.total,
                breakdown: savings.breakdown,
            },
            interestLeak,
            cashFlow,
            consent: {
                timestamp: consent.timestamp,
                version: consent.version,
                phone,
            },
        };

        // Store for retrieval
        healthCheckStore.set(id, result);

        return NextResponse.json({ success: true, ...result });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
