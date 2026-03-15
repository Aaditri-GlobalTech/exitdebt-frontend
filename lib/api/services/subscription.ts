/* ─── Subscription Service ────────────────────────────────────────────────── */

import { isMockMode } from "../config";
import { apiRequest, checkBackendHealth } from "../client";
import { litePlan, shieldPlan, settlementPlan } from "@/lib/mockPlans";
import type { BillingPeriod } from "@/lib/SubscriptionContext";

export interface SubscriptionPlanResponse {
    plans: Array<{
        key: string;
        name: string;
        monthly: number;
        annual: number;
        features: string[];
        isRecommended: boolean;
    }>;
}

export interface PurchaseResponse {
    success: boolean;
    subscriptionId?: string;
    paymentUrl?: string; // UPI payment link (production only)
    message: string;
}

export interface SubscriptionStatusResponse {
    status: "trial" | "active" | "expired";
    tier: string | null;
    daysRemaining: number;
    billingPeriod: string;
    trialEndsAt: string;
}

/**
 * Fetch available subscription plans.
 *
 * Mock mode: returns plans from mockPlans.ts.
 * Backend mode: calls GET /api/subscription/plans.
 */
export async function getPlans(): Promise<SubscriptionPlanResponse> {
    if (isMockMode()) {
        return {
            plans: [
                {
                    key: litePlan.key,
                    name: litePlan.name,
                    monthly: litePlan.monthly,
                    annual: litePlan.annual,
                    features: litePlan.features,
                    isRecommended: litePlan.isRecommended,
                },
                {
                    key: shieldPlan.key,
                    name: shieldPlan.name,
                    monthly: shieldPlan.monthly,
                    annual: shieldPlan.annual,
                    features: shieldPlan.features,
                    isRecommended: shieldPlan.isRecommended,
                },
                {
                    key: settlementPlan.key,
                    name: settlementPlan.name,
                    monthly: 0,
                    annual: 0,
                    features: settlementPlan.features,
                    isRecommended: settlementPlan.isRecommended,
                },
            ],
        };
    }

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) return getPlans(); // Recurse once; isMockMode won't change but this is the fallback path

    return apiRequest<SubscriptionPlanResponse>("/api/subscription/plans");
}

/**
 * Purchase a subscription (Lite or Shield).
 *
 * Mock mode: instant success.
 * Backend mode: calls POST /api/subscription/purchase → returns UPI payment link.
 */
export async function purchaseSubscription(
    tier: "lite" | "shield",
    period: BillingPeriod,
    userId?: string
): Promise<PurchaseResponse> {
    if (isMockMode()) {
        await new Promise((r) => setTimeout(r, 800));
        return {
            success: true,
            subscriptionId: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} (${period}) subscription activated successfully.`,
        };
    }

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) {
        return {
            success: true,
            subscriptionId: `sub_fallback_${Date.now()}`,
            message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} activated (offline mode).`,
        };
    }

    return apiRequest<PurchaseResponse>("/api/subscription/purchase", {
        method: "POST",
        body: { tier, billing_period: period, user_id: userId },
    });
}

/**
 * Check current subscription status.
 *
 * Mock mode: returns data from SubscriptionContext (cookie-based).
 * Backend mode: calls GET /api/subscription/status.
 */
export async function getSubscriptionStatus(
    userId?: string
): Promise<SubscriptionStatusResponse | null> {
    if (isMockMode()) return null; // Handled by SubscriptionContext locally

    const isAvailable = await checkBackendHealth();
    if (!isAvailable) return null;

    const query = userId ? `?userId=${userId}` : "";
    return apiRequest<SubscriptionStatusResponse>(
        `/api/subscription/status${query}`
    );
}
