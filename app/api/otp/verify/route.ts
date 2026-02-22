import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/otp/verify
 * Body: { phone: string, otp: string }
 * Verify the OTP code sent to the phone number.
 * Returns: { success, verified }
 *
 * NOTE: Mock implementation. In production, validate against stored OTP
 * with expiry check and rate limiting.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, otp } = body;

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'phone' field." },
                { status: 400 }
            );
        }

        if (!otp || typeof otp !== "string" || otp.length !== 6) {
            return NextResponse.json(
                { success: false, error: "OTP must be a 6-digit string." },
                { status: 400 }
            );
        }

        // Mock: Accept any 6-digit OTP
        // In production: validate against Redis/DB stored OTP + expiry
        return NextResponse.json({
            success: true,
            verified: true,
            message: "Phone number verified successfully.",
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
