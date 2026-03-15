/* ─── Auth / OTP Service ─────────────────────────────────────────────────── */

import { API_CONFIG, isMockMode } from "../config";
import { apiRequest, checkBackendHealth } from "../client";

export interface OtpSendResponse {
    success: boolean;
    message: string;
}

export interface OtpVerifyResponse {
    success: boolean;
    token?: string;
    message: string;
}

/**
 * Send OTP to the given phone number.
 *
 * Mock mode: always returns success (any 6-digit code will work).
 * Backend mode: calls POST /api/otp/send.
 */
export async function sendOtp(phone: string): Promise<OtpSendResponse> {
    if (isMockMode() || !API_CONFIG.enableOtp) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 600));
        return {
            success: true,
            message: `OTP sent to ${phone.slice(0, 2)}****${phone.slice(-4)} (mock mode — enter any 6 digits)`,
        };
    }

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) {
        return {
            success: true,
            message: `OTP sent to ${phone.slice(0, 2)}****${phone.slice(-4)} (offline fallback — enter any 6 digits)`,
        };
    }

    return apiRequest<OtpSendResponse>("/api/otp/send", {
        method: "POST",
        body: { phone },
    });
}

/**
 * Verify the OTP code for the given phone number.
 *
 * Mock mode: accepts any 6-digit code.
 * Backend mode: calls POST /api/otp/verify.
 */
export async function verifyOtp(
    phone: string,
    code: string
): Promise<OtpVerifyResponse> {
    if (isMockMode() || !API_CONFIG.enableOtp) {
        await new Promise((r) => setTimeout(r, 400));
        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            return { success: false, message: "Invalid OTP code." };
        }
        return {
            success: true,
            token: `mock_token_${Date.now()}`,
            message: "Phone verified successfully.",
        };
    }

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) {
        if (code.length === 6 && /^\d{6}$/.test(code)) {
            return {
                success: true,
                token: `fallback_token_${Date.now()}`,
                message: "Phone verified (offline fallback).",
            };
        }
        return { success: false, message: "Invalid OTP code." };
    }

    return apiRequest<OtpVerifyResponse>("/api/otp/verify", {
        method: "POST",
        body: { phone, otp: code },
    });
}
