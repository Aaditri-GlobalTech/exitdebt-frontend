/* ─── Environment-Aware API Configuration ────────────────────────────────── */

/**
 * Centralized configuration derived from environment variables.
 * All components should use this instead of reading process.env directly.
 */
export const API_CONFIG = {
    /** Data source: "mock" = standalone mode, "backend" = FastAPI backend */
    dataSource: (process.env.NEXT_PUBLIC_DATA_SOURCE || "mock") as
        | "mock"
        | "backend",

    /** Backend API URL — only meaningful when dataSource = "backend" */
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "",

    /** Whether real SMS OTP is enabled (false = accept any 6 digits) */
    enableOtp: process.env.NEXT_PUBLIC_ENABLE_OTP === "true",

    /** Whether real UPI payment flow is enabled */
    enablePayment: process.env.NEXT_PUBLIC_ENABLE_PAYMENT === "true",

    /** Whether analytics (GA4/GTM/PostHog) are enabled */
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",

    /** Current app environment */
    appEnv: (process.env.NEXT_PUBLIC_APP_ENV || "development") as
        | "development"
        | "staging"
        | "production",

    /** Public-facing app URL */
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

/** Returns true if running in standalone mock mode (no backend required) */
export function isMockMode(): boolean {
    return API_CONFIG.dataSource === "mock";
}

/** Returns true if configured to connect to the Python FastAPI backend */
export function isBackendMode(): boolean {
    return API_CONFIG.dataSource === "backend";
}

/** Returns true if running in production environment */
export function isProduction(): boolean {
    return API_CONFIG.appEnv === "production";
}
