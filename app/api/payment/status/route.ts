import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/payment/status?paymentId=xxx
 * Check UPI payment status via backend Setu service.
 * Returns: { id, status, amount, ... }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
    try {
        const paymentId = req.nextUrl.searchParams.get("paymentId");

        if (!paymentId) {
            return NextResponse.json(
                { success: false, error: "Missing 'paymentId' query parameter." },
                { status: 400 }
            );
        }

        const backendResp = await fetch(
            `${BACKEND_URL}/api/payment/status/${paymentId}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        const data = await backendResp.json();

        if (!backendResp.ok) {
            return NextResponse.json(
                { success: false, error: data?.detail || "Failed to check payment status" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json({ success: true, ...data });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error checking payment status." },
            { status: 500 }
        );
    }
}
