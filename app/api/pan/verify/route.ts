import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/pan/verify
 * Body: { pan: string, consent?: string, reason?: string }
 * Proxy to backend Setu PAN verification.
 * Returns: { verification, message, data: { full_name, category, ... } }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pan, consent, reason } = body;

        if (!pan || typeof pan !== "string") {
            return NextResponse.json(
                { verification: "error", message: "Missing or invalid 'pan' field." },
                { status: 400 }
            );
        }

        // Validate PAN format on frontend side too
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panRegex.test(pan.toUpperCase())) {
            return NextResponse.json(
                { verification: "error", message: "Invalid PAN format. Expected: ABCDE1234F" },
                { status: 400 }
            );
        }

        // Call backend PAN verification endpoint
        const backendResp = await fetch(`${BACKEND_URL}/api/pan/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pan: pan.toUpperCase(),
                consent: consent || "Y",
                reason: reason || "Debt health check for ExitDebt user",
            }),
        });

        const data = await backendResp.json();

        if (!backendResp.ok) {
            return NextResponse.json(
                { verification: "error", message: data?.detail?.message || "PAN verification failed" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { verification: "error", message: "Internal server error during PAN verification." },
            { status: 500 }
        );
    }
}
