import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payment/create-link
 * Body: { userId: string, tier: string, billingPeriod: string }
 * Create a UPI payment link via backend Setu UPI service.
 * Returns: { id, amount, payment_link, upi_link, status }
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
                { success: false, error: "Invalid billing period. Must be 'monthly' or 'annual'." },
                { status: 400 }
            );
        }

        // Call backend payment link creation
        const backendResp = await fetch(`${BACKEND_URL}/api/payment/create-link`, {
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
                { success: false, error: data?.detail || "Failed to create payment link" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json({ success: true, ...data });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error creating payment link." },
            { status: 500 }
        );
    }
}
