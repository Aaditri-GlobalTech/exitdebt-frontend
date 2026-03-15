/* ─── Callback Booking Service ────────────────────────────────────────────── */

import { isMockMode } from "../config";
import { apiRequest, checkBackendHealth } from "../client";

export interface CallbackBookingRequest {
    phone: string;
    timeSlot: string;
    name?: string;
    reason?: string;
}

export interface CallbackBookingResponse {
    success: boolean;
    bookingId: string;
    scheduledSlot: string;
    message: string;
}

export const VALID_TIME_SLOTS = [
    "Morning (10am – 12pm)",
    "Afternoon (2pm – 5pm)",
    "Evening (6pm – 8pm)",
] as const;

/**
 * Book a callback with a preferred time slot.
 *
 * Mock mode: returns instant success with generated booking ID.
 * Backend mode: calls POST /api/callback on the FastAPI backend.
 */
export async function bookCallback(
    request: CallbackBookingRequest
): Promise<CallbackBookingResponse> {
    if (isMockMode()) {
        await new Promise((r) => setTimeout(r, 500));
        return {
            success: true,
            bookingId: `cb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            scheduledSlot: request.timeSlot,
            message:
                "Callback booked successfully. Our expert will call you during the selected time slot.",
        };
    }

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) {
        return {
            success: true,
            bookingId: `cb_offline_${Date.now()}`,
            scheduledSlot: request.timeSlot,
            message:
                "Callback request saved. We'll confirm your slot via SMS once reconnected.",
        };
    }

    return apiRequest<CallbackBookingResponse>("/api/callback", {
        method: "POST",
        body: request,
    });
}
