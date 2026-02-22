import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/purchase
 * Body: { userId: string, tier: "lite"|"shield", billingPeriod: "monthly"|"annual" }
 * Initiate UPI payment for Lite/Shield subscription via Setu.
 * Returns: { success, paymentId, amount, paymentLink, upiLink, status }
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

        // Create UPI payment link via backend Setu payment service
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

        return NextResponse.json({
            success: true,
            paymentId: data.id,
            tier: data.tier,
            billingPeriod: data.billing_period,
            amount: data.amount,
            currency: data.currency || "INR",
            paymentLink: data.payment_link,
            upiLink: data.upi_link,
            status: data.status,
            message: "Payment link generated. Complete payment via UPI.",
            createdAt: data.created_at,
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error creating payment." },
            { status: 500 }
        );
    }
}
