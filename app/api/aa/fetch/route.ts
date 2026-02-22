import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/aa/fetch?consentId=xxx
 * Fetch financial data from Account Aggregator after consent approval.
 * Proxies to backend Setu AA service.
 * Returns: { success, accounts, status }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
    const consentId = req.nextUrl.searchParams.get("consentId");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!consentId && !userId) {
        return NextResponse.json(
            { success: false, error: "Missing 'consentId' or 'userId' query parameter." },
            { status: 400 }
        );
    }

    if (!consentId) {
        // No consent ID means no active consent
        return NextResponse.json({
            success: true,
            userId,
            status: "NO_CONSENT",
            data: null,
            message: "No active AA consent found. Initiate consent via POST /api/aa/consent first.",
            lastFetched: null,
        });
    }

    try {
        // Fetch financial data from backend
        const backendResp = await fetch(
            `${BACKEND_URL}/aa/data/${consentId}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        const data = await backendResp.json();

        if (!backendResp.ok) {
            return NextResponse.json(
                { success: false, error: data?.detail || "Failed to fetch AA data" },
                { status: backendResp.status }
            );
        }

        return NextResponse.json({
            success: true,
            consentId: data.consent_id,
            status: data.status,
            accounts: data.accounts,
            rawFiCount: data.raw_fi_count,
            lastFetched: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Internal server error fetching AA data." },
            { status: 500 }
        );
    }
}
