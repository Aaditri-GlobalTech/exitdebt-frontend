import { NextRequest, NextResponse } from "next/server";
import { mockProfiles } from "@/lib/mockProfiles";
import { selectProfile } from "@/lib/utils";

/**
 * GET /api/profiles
 * Returns all available mock profiles (names + PAN hashes only).
 */
export async function GET() {
    const summaries = mockProfiles.map((p) => ({
        name: p.name,
        panHash: p.panHash,
        score: p.score,
        scoreLabel: p.scoreLabel,
        activeAccounts: p.activeAccounts,
    }));

    return NextResponse.json({ profiles: summaries });
}

/**
 * POST /api/profiles
 * Body: { pan: string }
 * Returns the full profile matched to the given PAN.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pan } = body;

        if (!pan || typeof pan !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'pan' field." },
                { status: 400 }
            );
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panRegex.test(pan.toUpperCase())) {
            return NextResponse.json(
                { error: "Invalid PAN format. Expected: ABCDE1234F" },
                { status: 400 }
            );
        }

        const profile = selectProfile(pan);

        if (!profile) {
            return NextResponse.json(
                { error: "No profile found for the given PAN." },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile });
    } catch {
        return NextResponse.json(
            { error: "Invalid request body. Send JSON with a 'pan' field." },
            { status: 400 }
        );
    }
}
