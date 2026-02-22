import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/health-check/[id]
 * Get results for a completed health check by ID.
 *
 * NOTE: In production, read from database. This mock returns a placeholder
 * since the in-memory store from POST /api/health-check is not shared.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id || !id.startsWith("hc_")) {
        return NextResponse.json(
            { success: false, error: "Invalid health check ID format." },
            { status: 400 }
        );
    }

    // In production: look up in database
    // Mock: return a "not found or expired" response since we use in-memory
    return NextResponse.json(
        {
            success: false,
            error: "Health check not found or expired. Results auto-delete after 30 days.",
            id,
        },
        { status: 404 }
    );
}
