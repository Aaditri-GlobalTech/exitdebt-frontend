"use client";

import { litePlan, shieldPlan, settlementPlan, type SubscriptionPlan, type SettlementPlan } from "@/lib/mockPlans";

interface PricingCardProps {
    tier: "lite" | "shield" | "settlement";
    isAnnual: boolean;
    onSubscribe?: (tier: "lite" | "shield", period: "monthly" | "annual") => void;
    onBookCall?: () => void;
}

function getPlanData(tier: "lite" | "shield" | "settlement"): SubscriptionPlan | SettlementPlan {
    if (tier === "lite") return litePlan;
    if (tier === "shield") return shieldPlan;
    return settlementPlan;
}

function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN").format(amount);
}

export default function PricingCard({ tier, isAnnual, onSubscribe, onBookCall }: PricingCardProps) {
    const plan = getPlanData(tier);
    const isSettlement = tier === "settlement";
    const isSubscription = !isSettlement;
    const isRecommended = plan.isRecommended;

    const subPlan = plan as SubscriptionPlan;
    const setlPlan = plan as SettlementPlan;

    const price = isSubscription
        ? isAnnual
            ? subPlan.annual
            : subPlan.monthly
        : 0;

    const savingsPercent = isSubscription ? subPlan.annualSavings : 0;

    return (
        <div
            className="relative rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300"
            style={{
                backgroundColor: "var(--color-bg-card)",
                border: isRecommended
                    ? "2px solid var(--color-purple)"
                    : "1px solid var(--color-border)",
                boxShadow: isRecommended
                    ? "0 0 24px rgba(115,0,190,0.12), 0 4px 32px rgba(0,0,0,0.06)"
                    : "0 4px 32px rgba(0,0,0,0.06)",
            }}
        >
            {/* Recommended badge */}
            {isRecommended && (
                <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{ backgroundColor: "var(--color-purple)" }}
                >
                    ⭐ Recommended
                </div>
            )}

            {/* Header */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{plan.icon}</span>
                    <h3
                        className="text-xl font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        {plan.name}
                    </h3>
                </div>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {plan.tagline}
                </p>
            </div>

            {/* Price */}
            <div className="mb-6">
                {isSubscription ? (
                    <>
                        <div className="flex items-baseline gap-1">
                            <span
                                className="text-3xl font-bold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                ₹{formatINR(price)}
                            </span>
                            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                /{isAnnual ? "year" : "month"}
                            </span>
                        </div>
                        {isAnnual && savingsPercent > 0 && (
                            <p
                                className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block"
                                style={{
                                    backgroundColor: "rgba(5,150,105,0.1)",
                                    color: "var(--color-success)",
                                }}
                            >
                                Save {savingsPercent}% vs monthly
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-baseline gap-1">
                            <span
                                className="text-2xl font-bold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                {setlPlan.fee}
                            </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                            on settled amount • One-time fee
                        </p>
                        <p
                            className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block"
                            style={{
                                backgroundColor: "rgba(217,119,6,0.1)",
                                color: "var(--color-warning)",
                            }}
                        >
                            Min debt: ₹{formatINR(setlPlan.minDebt)}
                        </p>
                    </>
                )}
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                        <span
                            className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                            style={{
                                backgroundColor: isRecommended
                                    ? "rgba(115,0,190,0.1)"
                                    : "rgba(5,150,105,0.1)",
                                color: isRecommended
                                    ? "var(--color-purple)"
                                    : "var(--color-success)",
                            }}
                        >
                            ✓
                        </span>
                        <span style={{ color: "var(--color-text-secondary)" }}>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            {isSubscription ? (
                <button
                    onClick={() => onSubscribe?.(tier as "lite" | "shield", isAnnual ? "annual" : "monthly")}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:opacity-90 hover:shadow-lg"
                    style={{
                        backgroundColor: isRecommended
                            ? "var(--color-purple)"
                            : "var(--color-text-primary)",
                    }}
                >
                    Subscribe to {plan.name}
                </button>
            ) : (
                <button
                    onClick={() => onBookCall?.()}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer hover:opacity-90 hover:shadow-lg"
                    style={{
                        backgroundColor: "rgba(217,119,6,0.1)",
                        color: "var(--color-warning)",
                        border: "1px solid rgba(217,119,6,0.3)",
                    }}
                >
                    Book a Call →
                </button>
            )}
        </div>
    );
}
