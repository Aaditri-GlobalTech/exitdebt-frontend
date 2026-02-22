"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSubscription } from "@/lib/SubscriptionContext";

interface DashboardBannerProps {
    lastUpdated: Date;
}

export default function DashboardBanner({ lastUpdated }: DashboardBannerProps) {
    const { status, daysRemaining, tier } = useSubscription();
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        setDateStr(
            lastUpdated.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
            ", " +
            lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        );
    }, [lastUpdated]);

    // Don't show banner if expired (SubscriptionGate handles that)
    if (status === "expired") return null;

    return (
        <div
            className="w-full rounded-xl px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fadeIn"
            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}
        >
            <div className="flex items-center gap-2 flex-wrap">
                {status === "active" && tier ? (
                    <>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-success)" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
                            {tier.charAt(0).toUpperCase() + tier.slice(1)} Active
                        </span>
                    </>
                ) : (
                    <>
                        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-purple)" }} />
                        <span className="text-sm font-medium" style={{ color: "var(--color-purple)" }}>
                            {daysRemaining} days left in your free trial
                        </span>
                        <Link
                            href="/upgrade"
                            className="text-xs font-semibold px-3 py-1 rounded-full transition-all hover:opacity-80"
                            style={{
                                backgroundColor: "rgba(115,0,190,0.08)",
                                color: "var(--color-purple)",
                                border: "1px solid rgba(115,0,190,0.15)",
                            }}
                        >
                            Upgrade →
                        </Link>
                    </>
                )}
            </div>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Last updated: {dateStr}
            </span>
        </div>
    );
}
