import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/upgrade
 * Body: { userId: string, tier: "shield", billingPeriod: "monthly"|"annual" }
 * Upgrade tier (Lite → Shield) with prorated billing.
 * Proxies to backend /api/subscription/upgrade.
 * Returns: { success, tier, status, billingPeriod, amountPaid, expiresAt, message }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, tier, billingPeriod } = body;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'userId' field." },
                { status: 400 }
            );
        }

        if (!tier || !["lite", "shield"].includes(tier)) {
            return NextResponse.json(
                { success: false, error: "Invalid tier. Must be 'lite' or 'shield'." },
                { status: 400 }
            );
        }

        if (!billingPeriod || !["monthly", "annual"].includes(billingPeriod)) {
            return NextResponse.json(
                { success: false, error: "Invalid billingPeriod. Must be 'monthly' or 'annual'." },
                { status: 400 }
            );
        }

        const backendResp = await fetch(`${BACKEND_URL}/api/subscription/upgrade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                tier,
                billing_period: billingPeriod,
            }),
        });

        const data = await backendResp.json();

        if (!backendResp.ok) {
            return NextResponse.json(
                { success: false, error: data?.detail || "Upgrade failed" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json({
            success: true,
            subscriptionId: data.id,
            userId: data.user_id,
            tier: data.tier,
            status: data.status,
            billingPeriod: data.billing_period,
            amountPaid: data.amount_paid,
            expiresAt: data.expires_at,
            message: data.message,
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error during upgrade." },
            { status: 500 }
        );
    }
}
