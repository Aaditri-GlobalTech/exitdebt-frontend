/* ─── Mock Subscription Plans (PRD3) ─────────────────────────────────────── */

export type TierKey = "lite" | "shield" | "shield-plus";

export interface SubscriptionPlan {
    key: TierKey;
    name: string;
    tagline: string;
    icon: string;
    monthly: number;
    annual: number;
    annualSavings: number; // percentage
    isRecommended: boolean;
    features: string[];
}

export interface SettlementPlan {
    key: "shield-plus";
    name: string;
    tagline: string;
    icon: string;
    fee: string;
    minDebt: number;
    isRecommended: boolean;
    features: string[];
}

export const litePlan: SubscriptionPlan = {
    key: "lite",
    name: "Lite",
    tagline: "Essential debt intelligence",
    icon: "📊",
    monthly: 499,
    annual: 4999,
    annualSavings: 17,
    isRecommended: false,
    features: [
        "Full debt health dashboard",
        "7 intelligence tools",
        "Credit bureau quarterly refresh",
        "Interest leak analysis",
        "Smart payment prioritizer",
        "Salary cash-flow mapping",
        "Debt-freedom GPS",
    ],
};

export const shieldPlan: SubscriptionPlan = {
    key: "shield",
    name: "Shield",
    tagline: "Protection + negotiation",
    icon: "🛡️",
    monthly: 1999,
    annual: 14999,
    annualSavings: 37,
    isRecommended: true,
    features: [
        "Everything in Lite",
        "Harassment protection",
        "Creditor communication",
        "Legal notice drafting",
        "Dedicated case manager",
        "Priority support",
    ],
};

export const settlementPlan: SettlementPlan = {
    key: "shield-plus",
    name: "Shield Plus",
    tagline: "We negotiate for you",
    icon: "💰",
    fee: "10% + GST",
    minDebt: 100000,
    isRecommended: false,
    features: [
        "Full debt negotiation",
        "Creditor communications",
        "Legal notices & documentation",
        "Dedicated settlement team",
        "Pay only on success",
    ],
};

export const allPlans = [litePlan, shieldPlan, settlementPlan] as const;
