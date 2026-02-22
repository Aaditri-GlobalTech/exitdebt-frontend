import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/callback
 * Body: { phone: string, timeSlot: string, name?: string }
 * Book a callback with time preference.
 * Returns: { success, bookingId, scheduledSlot }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, timeSlot, name } = body;

        if (!phone || typeof phone !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid 'phone' field." },
                { status: 400 }
            );
        }

        const validSlots = [
            "Morning (10am – 12pm)",
            "Afternoon (2pm – 5pm)",
            "Evening (6pm – 8pm)",
        ];

        if (!timeSlot || !validSlots.includes(timeSlot)) {
            return NextResponse.json(
                { success: false, error: `Invalid timeSlot. Must be one of: ${validSlots.join(", ")}` },
                { status: 400 }
            );
        }

        // Mock: In production, create a CRM lead/task
        const bookingId = `cb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        return NextResponse.json({
            success: true,
            bookingId,
            scheduledSlot: timeSlot,
            phone,
            name: name || null,
            message: "Callback booked successfully. Our expert will call you during the selected time slot.",
            createdAt: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request body." },
            { status: 400 }
        );
    }
}
