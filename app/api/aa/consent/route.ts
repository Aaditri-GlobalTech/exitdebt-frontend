import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/aa/consent
 * Body: { userId: string, phone: string }
 * Initiate Account Aggregator consent flow via backend Setu AA service.
 * Returns: { success, consentId, redirectUrl, status }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, phone } = body;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'userId' field." },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'phone' field." },
                { status: 400 }
            );
        }

        // Call backend AA consent endpoint
        const backendResp = await fetch(`${BACKEND_URL}/aa/consent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone,
                fi_types: ["DEPOSIT", "CREDIT_CARD", "TERM_DEPOSIT"],
            }),
        });

        const data = await backendResp.json();

        if (!backendResp.ok) {
            return NextResponse.json(
                { success: false, error: data?.detail || "Failed to create AA consent" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json({
            success: true,
            consentId: data.id,
            status: data.status,
            redirectUrl: data.url,
            message: "Consent request created. Redirect user to complete AA approval.",
            createdAt: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error creating AA consent." },
            { status: 500 }
        );
    }
}
