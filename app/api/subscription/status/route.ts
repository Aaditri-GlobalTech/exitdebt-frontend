import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/subscription/status?userId=xxx
 * Check subscription status (trial/active/expired) + tier + days remaining.
 * Proxies to backend /api/subscription/status/{userId}.
 * Returns: { success, status, tier, billingPeriod, daysRemaining, ... }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { success: false, error: "Missing 'userId' query parameter." },
            { status: 400 }
        );
    }

    try {
        const backendResp = await fetch(
            `${BACKEND_URL}/api/subscription/status/${userId}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        const data = await backendResp.json();

        if (!backendResp.ok) {
            return NextResponse.json(
                { success: false, error: data?.detail || "Failed to fetch subscription status" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json({
            success: true,
            userId: data.user_id,
            status: data.status,
            tier: data.tier,
            billingPeriod: data.billing_period,
            trialEndsAt: data.trial_ends_at,
            expiresAt: data.expires_at,
            daysRemaining: data.days_remaining,
            createdAt: data.created_at,
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error checking subscription." },
            { status: 500 }
        );
    }
}
