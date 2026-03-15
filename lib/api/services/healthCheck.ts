/* ─── Health Check Service ────────────────────────────────────────────────── */

import { isMockMode } from "../config";
import { apiRequest, checkBackendHealth } from "../client";
import { selectProfile } from "@/lib/utils";
import {
    calculateDebtHealthScore,
    calculateTotalAnnualSavings,
    calculateInterestLeak,
    calculateCashFlow,
} from "@/lib/calculations";

export interface HealthCheckResult {
    id: string;
    createdAt: string;
    expiresAt: string;
    profile: {
        name: string;
        score: number;
        scoreLabel: string;
        color: string;
        totalOutstanding: number;
        monthlyEmi: number;
        activeAccounts: number;
        avgInterestRate: number;
        creditUtilization: number;
        creditScore: number;
        accounts: Array<{
            lender: string;
            outstanding: number;
            apr: number;
            type: string;
            emi: number;
            dueDate: number;
        }>;
        overpayment: number;
        optimalRate: number;
        salary: number;
        salaryDate: number;
        otherIncome: number;
        currentTimeline: string;
        optimizedTimeline: string;
        timelineSaved: string;
    };
    savings: {
        totalAnnual: number;
    };
    interestLeak: {
        totalEmi: number;
        principal: number;
        interest: number;
        avoidable: number;
    };
}

interface ConsentRecord {
    timestamp: string;
    version: string;
}

/**
 * Submit a health check request using PAN + phone.
 *
 * Mock mode: uses local profile selection and calculations.
 * Backend mode: calls POST /api/health-check on the FastAPI backend.
 */
export async function submitHealthCheck(
    pan: string,
    phone: string,
    consent: ConsentRecord
): Promise<HealthCheckResult> {
    if (isMockMode()) {
        return performMockHealthCheck(pan, phone, consent);
    }

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) {
        console.warn(
            "[ExitDebt] Backend unavailable — performing local health check."
        );
        return performMockHealthCheck(pan, phone, consent);
    }

    return apiRequest<HealthCheckResult>("/api/health-check", {
        method: "POST",
        body: { pan: pan.toUpperCase(), phone, consent },
        timeout: 20_000, // Credit bureau pull can be slow
    });
}

/**
 * Retrieve an existing health check result by ID.
 *
 * Mock mode: not supported (results are in-memory only).
 * Backend mode: calls GET /api/health-check/:id.
 */
export async function getHealthCheckResult(
    id: string
): Promise<HealthCheckResult | null> {
    if (isMockMode()) return null;

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) return null;

    return apiRequest<HealthCheckResult>(`/api/health-check/${id}`);
}

/* ─── Mock Implementation ────────────────────────────────────────────────── */

function performMockHealthCheck(
    pan: string,
    phone: string,
    consent: ConsentRecord
): HealthCheckResult {
    const profile = selectProfile(pan);
    const healthScore = calculateDebtHealthScore(profile);
    const savings = calculateTotalAnnualSavings(
        profile.accounts,
        profile.optimalRate
    );
    const interestLeak = calculateInterestLeak(
        profile.accounts,
        profile.monthlyEmi,
        profile.totalOutstanding,
        profile.optimalRate
    );
    calculateCashFlow(profile.salary, profile.salaryDate, profile.accounts);

    const id = `hc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    void phone; // Used only when forwarding to backend
    void consent;

    return {
        id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        profile: {
            name: profile.name,
            score: healthScore.total,
            scoreLabel: healthScore.label,
            color: healthScore.color,
            totalOutstanding: profile.totalOutstanding,
            monthlyEmi: profile.monthlyEmi,
            activeAccounts: profile.activeAccounts,
            avgInterestRate: profile.avgInterestRate,
            creditUtilization: profile.creditUtilization,
            creditScore: profile.creditScore,
            accounts: profile.accounts,
            overpayment: savings.total,
            optimalRate: profile.optimalRate,
            salary: profile.salary,
            salaryDate: profile.salaryDate,
            otherIncome: profile.otherIncome,
            currentTimeline: profile.currentTimeline,
            optimizedTimeline: profile.optimizedTimeline,
            timelineSaved: profile.timelineSaved,
        },
        savings: {
            totalAnnual: savings.total,
        },
        interestLeak,
    };
}
