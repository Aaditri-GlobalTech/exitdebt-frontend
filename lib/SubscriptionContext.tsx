"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { TierKey } from "@/lib/mockPlans";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type SubscriptionStatus = "trial" | "active" | "expired";
export type BillingPeriod = "monthly" | "annual";

interface SubscriptionState {
    tier: TierKey | null;          // null = free trial (no paid tier)
    status: SubscriptionStatus;
    trialEndsAt: Date;
    billingPeriod: BillingPeriod;
    daysRemaining: number;         // computed
}

interface SubscriptionContextType extends SubscriptionState {
    upgradeToTier: (tier: "lite" | "shield", period: BillingPeriod) => void;
    bookSettlementCall: () => void;
    expireTrial: () => void;        // dev-only helper
    resetTrial: () => void;         // dev-only helper
}

/* ─── Cookie Helpers ─────────────────────────────────────────────────────── */

const COOKIE_NAME = "exidebt_subscription";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function setCookie(data: Record<string, unknown>) {
    if (typeof document === "undefined") return;
    const value = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

function getCookie(): Record<string, unknown> | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return null;
    try {
        return JSON.parse(decodeURIComponent(match[1]));
    } catch {
        return null;
    }
}

function deleteCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function computeDaysRemaining(trialEndsAt: Date): number {
    const diff = trialEndsAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function defaultTrialEnd(): Date {
    return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const SubscriptionContext = createContext<SubscriptionContextType>({
    tier: null,
    status: "trial",
    trialEndsAt: defaultTrialEnd(),
    billingPeriod: "monthly",
    daysRemaining: 90,
    upgradeToTier: () => { },
    bookSettlementCall: () => { },
    expireTrial: () => { },
    resetTrial: () => { },
});

/* ─── Provider ───────────────────────────────────────────────────────────── */

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [tier, setTier] = useState<TierKey | null>(null);
    const [status, setStatus] = useState<SubscriptionStatus>("trial");
    const [trialEndsAt, setTrialEndsAt] = useState<Date>(defaultTrialEnd());
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
    const [isReady, setIsReady] = useState(false);

    // Hydrate from cookie on mount
    useEffect(() => {
        const data = getCookie();
        if (data) {
            if (data.tier) setTier(data.tier as TierKey);
            if (data.status) setStatus(data.status as SubscriptionStatus);
            if (data.trialEndsAt) setTrialEndsAt(new Date(data.trialEndsAt as string));
            if (data.billingPeriod) setBillingPeriod(data.billingPeriod as BillingPeriod);
        }
        setIsReady(true);
    }, []);

    // Auto-check trial expiry
    useEffect(() => {
        if (!isReady) return;
        if (status === "trial" && computeDaysRemaining(trialEndsAt) === 0) {
            setStatus("expired");
        }
    }, [isReady, status, trialEndsAt]);

    // Persist to cookie
    useEffect(() => {
        if (!isReady) return;
        setCookie({
            tier,
            status,
            trialEndsAt: trialEndsAt.toISOString(),
            billingPeriod,
        });
    }, [tier, status, trialEndsAt, billingPeriod, isReady]);

    const daysRemaining = computeDaysRemaining(trialEndsAt);

    const upgradeToTier = useCallback(
        (newTier: "lite" | "shield", period: BillingPeriod) => {
            setTier(newTier);
            setStatus("active");
            setBillingPeriod(period);
            console.log(
                `[ExitDebt] Subscribed to ${newTier} (${period}). Mock payment successful.`
            );
        },
        []
    );

    const bookSettlementCall = useCallback(() => {
        console.log("[ExitDebt] Settlement call booked. Reason: Settlement inquiry.");
    }, []);

    const expireTrial = useCallback(() => {
        setTrialEndsAt(new Date(Date.now() - 1000));
        setStatus("expired");
        setTier(null);
        console.log("[ExitDebt] Trial manually expired (dev mode).");
    }, []);

    const resetTrial = useCallback(() => {
        setTier(null);
        setStatus("trial");
        setTrialEndsAt(defaultTrialEnd());
        setBillingPeriod("monthly");
        deleteCookie();
        console.log("[ExitDebt] Subscription state reset to trial (dev mode).");
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{
                tier,
                status,
                trialEndsAt,
                billingPeriod,
                daysRemaining,
                upgradeToTier,
                bookSettlementCall,
                expireTrial,
                resetTrial,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useSubscription() {
    return useContext(SubscriptionContext);
}
