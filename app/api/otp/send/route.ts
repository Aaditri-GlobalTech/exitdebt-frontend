import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/otp/send
 * Body: { phone: string }
 * Send OTP to the given phone number.
 * Returns: { success, message, expiresIn }
 *
 * NOTE: This is a mock implementation. In production, integrate with
 * an SMS gateway (e.g., MSG91, Twilio, AWS SNS).
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone } = body;

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'phone' field." },
                { status: 400 }
            );
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.trim())) {
            return NextResponse.json(
                { success: false, error: "Invalid Indian mobile number. Must be 10 digits starting with 6-9." },
                { status: 400 }
            );
        }

        // Mock: In production, generate and send real OTP via SMS gateway
        // For demo, always succeed
        return NextResponse.json({
            success: true,
            message: "OTP sent successfully.",
            expiresIn: 300, // 5 minutes
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
