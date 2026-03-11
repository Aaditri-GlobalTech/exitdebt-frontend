"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useSubscription } from "@/lib/SubscriptionContext";

import { TierKey } from "@/lib/mockPlans";

interface SubscriptionGateProps {
    children: ReactNode;
    requiredTier?: TierKey;
}

export default function SubscriptionGate({ children, requiredTier }: SubscriptionGateProps) {
    const { status, tier } = useSubscription();

    // 1. Check for expired trial (Global)
    if (status === "expired") {
        return (
            <div className="relative min-h-screen">
                {/* Blurred dashboard content beneath */}
                <div
                    className="pointer-events-none select-none"
                    style={{ filter: "blur(8px)", opacity: 0.5 }}
                    aria-hidden="true"
                >
                    {children}
                </div>

                {/* Overlay */}
                <div
                    className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-white/60"
                >
                    <div
                        className="rounded-2xl p-8 sm:p-10 text-center max-w-md mx-4 animate-scaleIn bg-white shadow-2xl border border-slate-100"
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl bg-teal-50"
                        >
                            🔒
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900">
                            Your free trial has ended
                        </h2>
                        <p className="text-sm leading-relaxed mb-6 text-slate-500">
                            Choose a plan to continue accessing your debt intelligence dashboard
                            and unlock advanced features.
                        </p>
                        <Link
                            href="/upgrade"
                            className="inline-block w-full py-3.5 rounded-xl text-sm font-bold text-white bg-teal-600 transition-all hover:bg-teal-700 hover:shadow-lg"
                        >
                            Choose a Plan →
                        </Link>
                        <p className="text-xs mt-4 text-slate-400">
                            Plans start at ₹499/month
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Check for required tier (Shield only features)
    if (requiredTier === "shield" && tier !== "shield") {
        return (
            <div className="relative min-h-screen">
                <div
                    className="pointer-events-none select-none h-screen overflow-hidden"
                    style={{ filter: "blur(12px)", opacity: 0.4 }}
                    aria-hidden="true"
                >
                    {children}
                </div>

                <div className="absolute inset-0 z-40 h-full w-full bg-[#0F172A]/80 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl animate-scaleIn">
                        <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-500/20">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Shield Feature</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                            The feature you're trying to access is reserved for Shield members. Upgrade now to get 100% harassment protection and expert negotiation.
                        </p>
                        <div className="space-y-4">
                            <Link
                                href="/upgrade"
                                className="block w-full py-4 rounded-2xl bg-teal-500 text-white font-extrabold text-sm shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition-all uppercase tracking-widest"
                            >
                                Upgrade to Shield
                            </Link>
                            <Link
                                href="/dashboard"
                                className="block w-full py-4 rounded-2xl bg-slate-50 text-slate-400 font-bold text-sm hover:bg-slate-100 transition-all"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
