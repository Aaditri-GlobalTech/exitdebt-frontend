import { mockProfiles, MockProfile } from "./mockProfiles";
import { calculateDebtHealthScore, calculateTotalAnnualSavings } from "./calculations";

/**
 * Validate PAN card number format: ABCDE1234F
 */
export function validatePAN(pan: string): boolean {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase().trim());
}

/**
 * Validate Indian mobile number: starts with 6-9, 10 digits
 */
export function validatePhone(phone: string): boolean {
    return /^[6-9]\d{9}$/.test(phone.trim());
}

/**
 * Format number as Indian currency (₹XX,XX,XXX)
 */
export function formatCurrency(amount: number): string {
    return "₹" + amount.toLocaleString("en-IN");
}

/**
 * SHA-256 hash a string (for PAN storage).
 * Returns hex-encoded hash. Only available in browser.
 */
export async function hashPAN(pan: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(pan.toUpperCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Select a mock profile based on PAN input.
 * Normalizes PAN to lowercase and matches against predefined hashes.
 * Falls back to a deterministic selection based on PAN character sum.
 * Dynamically calculates the debt health score and annual savings.
 */
export function selectProfile(pan: string): MockProfile {
    const normalized = pan.toLowerCase().replace(/[^a-z0-9]/g, "");
    let profile = mockProfiles.find((p) => p.panHash === normalized);

    if (!profile) {
        // Deterministic fallback: sum char codes and pick a profile
        const charSum = normalized
            .split("")
            .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        profile = mockProfiles[charSum % mockProfiles.length];
    }

    // Calculate score dynamically from the 5-factor model
    const health = calculateDebtHealthScore(profile);

    // Calculate annual savings dynamically
    const savings = calculateTotalAnnualSavings(profile.accounts, profile.optimalRate);

    return {
        ...profile,
        score: health.total,
        scoreLabel: health.label,
        color: health.color,
        overpayment: savings.total,
    };
}

/**
 * Calculate yearly overpayment for a single account
 * compared to the optimal interest rate.
 */
export function calculateSavings(
    outstanding: number,
    apr: number,
    optimalRate: number
): number {
    if (apr <= optimalRate) return 0;
    return Math.round((outstanding * (apr - optimalRate)) / 100);
}
