/* ─── API Services — Barrel Export ────────────────────────────────────────── */

/**
 * Centralized exports for all API service modules.
 *
 * Usage:
 *   import { sendOtp, submitHealthCheck, purchaseSubscription } from "@/lib/api/services";
 */

export { sendOtp, verifyOtp } from "./auth";
export type { OtpSendResponse, OtpVerifyResponse } from "./auth";

export { submitHealthCheck, getHealthCheckResult } from "./healthCheck";
export type { HealthCheckResult } from "./healthCheck";

export {
    getPlans,
    purchaseSubscription,
    getSubscriptionStatus,
} from "./subscription";
export type {
    SubscriptionPlanResponse,
    PurchaseResponse,
    SubscriptionStatusResponse,
} from "./subscription";

export { bookCallback, VALID_TIME_SLOTS } from "./callback";
export type {
    CallbackBookingRequest,
    CallbackBookingResponse,
} from "./callback";
