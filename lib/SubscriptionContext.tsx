"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { TierKey } from "@/lib/mockPlans";
import { useAuth } from "@/lib/AuthContext";

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
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict; Secure`;
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
    tier: "lite",
    status: "active",
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
    const { consent } = useAuth();
    const [tier, setTier] = useState<TierKey | null>("lite");
    const [status, setStatus] = useState<SubscriptionStatus>("active");
    const [trialEndsAt, setTrialEndsAt] = useState<Date>(defaultTrialEnd());
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
    const [isReady, setIsReady] = useState(false);

    // Sync trial end with profile creation date (consent timestamp)
    useEffect(() => {
        if (!isReady) return;
        
        // Only override if we are in Lite plan (which is the 3-month free plan)
        if (tier === "lite" && consent?.timestamp) {
            const creationDate = new Date(consent.timestamp);
            const ninetyDaysOut = new Date(creationDate.getTime() + 90 * 24 * 60 * 60 * 1000);
            
            // Only update if it's significantly different (to avoid loop or unnecessary jitter)
            if (Math.abs(ninetyDaysOut.getTime() - trialEndsAt.getTime()) > 1000 * 60 * 60) {
                setTrialEndsAt(ninetyDaysOut);
            }
        }
    }, [isReady, tier, consent, trialEndsAt]);

    // Hydrate from cookie on mount
    useEffect(() => {
        const data = getCookie();
        if (data) {
            // Hydrate tier from cookie — no force-reset
            setTier((data.tier as TierKey) || "lite");
            setStatus((data.status as SubscriptionStatus) || "active");
            if (data.trialEndsAt) setTrialEndsAt(new Date(data.trialEndsAt as string));
            if (data.billingPeriod) setBillingPeriod(data.billingPeriod as BillingPeriod);
        } else {
            // First time or no cookie: ensure Lite is active
            setTier("lite");
            setStatus("active");
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
        },
        []
    );

    const bookSettlementCall = useCallback(() => {
        // In production: call backend to schedule settlement
    }, []);

    const expireTrial = useCallback(() => {
        if (process.env.NODE_ENV === "production") return;
        setTrialEndsAt(new Date(Date.now() - 1000));
        setStatus("expired");
        setTier(null);
    }, []);

    const resetTrial = useCallback(() => {
        if (process.env.NODE_ENV === "production") return;
        setTier(null);
        setStatus("trial");
        setTrialEndsAt(defaultTrialEnd());
        setBillingPeriod("monthly");
        deleteCookie();
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
