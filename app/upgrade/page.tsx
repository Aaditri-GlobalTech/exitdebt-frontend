"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingToggle from "@/components/PricingToggle";
import PricingCard from "@/components/PricingCard";
import CallbackModal from "@/components/CallbackModal";

export default function UpgradePage() {
    const { user } = useAuth();
    const { status, daysRemaining, upgradeToTier, bookSettlementCall } = useSubscription();
    const router = useRouter();

    const [isAnnual, setIsAnnual] = useState(false);
    const [callbackOpen, setCallbackOpen] = useState(false);
    const [callbackReason, setCallbackReason] = useState("General consultation");
    const [showSuccess, setShowSuccess] = useState(false);
    const [subscribedTier, setSubscribedTier] = useState("");

    function handleSubscribe(tier: "lite" | "shield", period: "monthly" | "annual") {
        upgradeToTier(tier, period);
        setSubscribedTier(tier.charAt(0).toUpperCase() + tier.slice(1));
        setShowSuccess(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    }

    function handleBookCall() {
        setCallbackReason("Settlement inquiry");
        bookSettlementCall();
        setCallbackOpen(true);
    }

    function handleFreeCall() {
        setCallbackReason("General consultation — help me choose a plan");
        setCallbackOpen(true);
    }

    const isExpired = status === "expired";
    const isTrial = status === "trial";

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />

            <main className="max-w-[1100px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
                {/* Trial banner */}
                <div className="text-center mb-10 animate-fadeIn">
                    {isExpired ? (
                        <div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-6"
                            style={{
                                backgroundColor: "rgba(220,38,38,0.08)",
                                color: "var(--color-danger)",
                                border: "1px solid rgba(220,38,38,0.15)",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-danger)" }} />
                            Your free trial has ended
                        </div>
                    ) : isTrial ? (
                        <div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-6"
                            style={{
                                backgroundColor: "rgba(115,0,190,0.06)",
                                color: "var(--color-purple)",
                                border: "1px solid rgba(115,0,190,0.12)",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-purple)" }} />
                            Your free trial ends in {daysRemaining} days
                        </div>
                    ) : null}

                    <h1
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Choose the right plan for you
                    </h1>
                    <p
                        className="text-base sm:text-lg max-w-xl mx-auto"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        From debt insights to full settlement — we&apos;ve got you covered.
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex justify-center mb-10">
                    <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
                    <div className="animate-fadeIn stagger-1">
                        <PricingCard
                            tier="lite"
                            isAnnual={isAnnual}
                            onSubscribe={handleSubscribe}
                        />
                    </div>
                    <div className="animate-fadeIn stagger-2">
                        <PricingCard
                            tier="shield"
                            isAnnual={isAnnual}
                            onSubscribe={handleSubscribe}
                        />
                    </div>
                    <div className="animate-fadeIn stagger-3">
                        <PricingCard
                            tier="settlement"
                            isAnnual={isAnnual}
                            onBookCall={handleBookCall}
                        />
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center animate-fadeIn">
                    <button
                        onClick={handleFreeCall}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-all cursor-pointer hover:opacity-80"
                        style={{ color: "var(--color-purple)" }}
                    >
                        Not sure? Book a free 15-min call
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </main>

            <Footer />

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] animate-slideUp">
                    <div
                        className="px-6 py-4 rounded-xl flex items-center gap-3"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                            border: "1px solid rgba(5,150,105,0.3)",
                        }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: "rgba(5,150,105,0.1)", color: "var(--color-success)" }}
                        >
                            ✓
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                {subscribedTier} plan activated!
                            </p>
                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                Redirecting to dashboard…
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Callback Modal */}
            <CallbackModal
                isOpen={callbackOpen}
                onClose={() => setCallbackOpen(false)}
                reason={callbackReason}
                userName={user?.name || "User"}
            />
        </div>
    );
}
