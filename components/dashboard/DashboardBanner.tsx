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
            className="w-full rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn shadow-sm border border-teal-100 bg-white"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                            {tier && tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Activated
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                            {daysRemaining} Days Left
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Enjoying your 3-month free access to standard debt tracking tools.</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Analysis</p>
                    <p className="text-xs font-bold text-gray-600">{dateStr}</p>
                </div>
            </div>
        </div>
    );
}
