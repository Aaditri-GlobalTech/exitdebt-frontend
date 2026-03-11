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
    const { status, upgradeToTier, bookSettlementCall } = useSubscription();
    const router = useRouter();

    const [isAnnual, setIsAnnual] = useState(true);
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

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
                        Take control of your debt journey
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Choose the right level of protection and assistance to reach financial freedom faster.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-16">
                    <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
                    <PricingCard
                        tier="lite"
                        isAnnual={isAnnual}
                        onSubscribe={handleSubscribe}
                    />
                    <PricingCard
                        tier="shield"
                        isAnnual={isAnnual}
                        onSubscribe={handleSubscribe}
                        isRecommended={true}
                    />
                    <PricingCard
                        tier="settlement"
                        isAnnual={isAnnual}
                        onBookCall={handleBookCall}
                    />
                </div>

                {/* Discovery Call CTA */}
                <div className="text-center mb-24 animate-fadeIn">
                    <p className="text-gray-600 mb-6 font-medium">Not sure which plan is right for you?</p>
                    <button 
                        onClick={handleFreeCall}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-teal-100 bg-white text-teal-600 font-bold text-sm hover:bg-teal-50 transition-all shadow-sm group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Book a free 15-min discovery call
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-20 animate-fadeIn">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.92v3.13a4 4 0 11-8 0V8.5a.5.5 0 011 0v.45a3 3 0 106 0V6.432L10 3.22 2.5 6.432v7.136c0 1.56 1.024 3.037 2.587 3.522L10 18.78l4.913-1.69c.991-.34 1.787-1.113 2.23-2.08a1 1 0 011.814.84a5.986 5.986 0 01-3.573 3.101L10 20.85l-5.384-1.854C2.616 18.358 1.5 16.51 1.5 14.5V6.5a1 1 0 01.666-.9z" clipRule="evenodd" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2 underline decoration-teal-500/30 underline-offset-4">DPDP Compliant</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[240px]">
                            Your financial data is encrypted and handled as per Digital Personal Data Protection Act.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2 underline decoration-teal-500/30 underline-offset-4">Cancel Anytime</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[240px]">
                            No lock-in periods. Stop your subscription whenever you&apos;re debt-free.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2 underline decoration-teal-500/30 underline-offset-4">Expert Led</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[240px]">
                            Certified financial advisors and legal experts managing your case.
                        </p>
                    </div>
                </div>

            </main>

            <Footer />

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-slideUp">
                    <div className="px-8 py-5 rounded-2xl flex items-center gap-4 bg-[#0F172A] text-white shadow-2xl">
                        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">✓</div>
                        <div>
                            <p className="font-bold tracking-tight">{subscribedTier} plan activated!</p>
                            <p className="text-xs text-gray-400 font-medium">Redirecting to dashboard…</p>
                        </div>
                    </div>
                </div>
            )}

            <CallbackModal
                isOpen={callbackOpen}
                onClose={() => setCallbackOpen(false)}
                reason={callbackReason}
                userName={user?.name || "User"}
            />
        </div>
    );
}
