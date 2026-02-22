"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useSubscription } from "@/lib/SubscriptionContext";

interface SubscriptionGateProps {
    children: ReactNode;
}

export default function SubscriptionGate({ children }: SubscriptionGateProps) {
    const { status } = useSubscription();

    if (status === "expired") {
        return (
            <div className="relative">
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
                    className="absolute inset-0 z-40 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(252,252,252,0.6)" }}
                >
                    <div
                        className="rounded-2xl p-8 sm:p-10 text-center max-w-md mx-4 animate-scaleIn"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            boxShadow: "0 8px 48px rgba(0,0,0,0.12)",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
                            style={{ backgroundColor: "rgba(115,0,190,0.08)" }}
                        >
                            🔒
                        </div>
                        <h2
                            className="text-xl sm:text-2xl font-bold mb-2"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Your free trial has ended
                        </h2>
                        <p
                            className="text-sm leading-relaxed mb-6"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Choose a plan to continue accessing your debt intelligence dashboard
                            and unlock advanced features.
                        </p>
                        <Link
                            href="/upgrade"
                            className="inline-block w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            Choose a Plan →
                        </Link>
                        <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                            Plans start at ₹499/month
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
