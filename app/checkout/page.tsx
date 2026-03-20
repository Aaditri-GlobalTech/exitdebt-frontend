/**
 * Checkout Page — Phase 5 (TS-02, TS-05)
 * 
 * Purpose: Handle subscription payments for Lite and Shield tiers.
 * 
 * Flow:
 *  1. User arrives from PricingCard with ?tier=lite&period=monthly (or annual)
 *  2. Displays order summary with plan name, price, and billing cycle
 *  3. "Pay with UPI" calls backend POST /api/subscription/purchase
 *  4. On success → redirect to /dashboard with a success toast
 *  5. On failure → show error and allow retry
 * 
 * PRD References:
 *  - TS-02: Subscribe → UPI payment flow (Razorpay/Cashfree/Decentro)
 *  - TS-05: After successful payment → redirect to dashboard with tier badge
 */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Plan pricing lookup — must match PricingCard.tsx and PRD */
const PLAN_DETAILS: Record<string, Record<string, { name: string; price: number; display: string }>> = {
    lite: {
        monthly: { name: "Lite", price: 499, display: "₹499/month" },
        annual: { name: "Lite", price: 4999, display: "₹4,999/year" },
    },
    shield: {
        monthly: { name: "Shield", price: 1999, display: "₹1,999/month" },
        annual: { name: "Shield", price: 14999, display: "₹14,999/year" },
    },
};

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoggedIn, isReady, userId } = useAuth();

    const tier = searchParams.get("tier") || "lite";
    const period = searchParams.get("period") || "monthly";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const plan = PLAN_DETAILS[tier]?.[period] ?? PLAN_DETAILS.lite.monthly;

    /* Redirect unauthenticated users */
    useEffect(() => {
        if (isReady && !isLoggedIn) {
            router.push("/");
        }
    }, [isReady, isLoggedIn, router]);

    /**
     * Initiate payment via backend subscription/purchase endpoint.
     * In production, this would open a UPI intent or Razorpay checkout.
     * For now, we call the backend mock payment service.
     */
    const handlePayment = async () => {
        setError("");
        setLoading(true);
        try {
            const token = sessionStorage.getItem("access_token") || "";
            const res = await fetch("/api/subscription/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: userId || "",
                    tier,
                    billing_period: period,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(
                    typeof data.detail === "string"
                        ? data.detail
                        : "Payment failed. Please try again."
                );
            }
            setSuccess(true);
            /* TS-05: Redirect to dashboard after successful payment */
            setTimeout(() => router.push("/dashboard"), 2500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!isReady || !isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Navbar />
            <main className="max-w-md mx-auto px-6 py-16 lg:py-24">

                {success ? (
                    /* Payment success state */
                    <div className="text-center animate-fadeIn">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-sm text-gray-500">
                            Your <strong>{plan.name}</strong> plan is now active. Redirecting to dashboard...
                        </p>
                    </div>
                ) : (
                    /* Checkout form */
                    <div className="animate-fadeIn">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Complete Your Order</h1>
                        <p className="text-sm text-gray-400 text-center mb-10">
                            Subscribe to {plan.name} and unlock premium features
                        </p>

                        {/* Order summary card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-8 mb-8">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                                    <p className="text-lg font-bold text-gray-900">{plan.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Billing</p>
                                    <p className="text-sm font-bold text-gray-700 capitalize">{period}</p>
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm font-medium text-gray-500">Total</span>
                                <span className="text-3xl font-extrabold text-gray-900">{plan.display}</span>
                            </div>
                        </div>

                        {/* Error display */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium animate-fadeIn">
                                {error}
                            </div>
                        )}

                        {/* Payment button */}
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full py-4 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Pay {plan.display}
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                            Payments secured via UPI. Cancel anytime. Your Basic dashboard remains free forever.
                        </p>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}

/** Wraps in Suspense for useSearchParams */
export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F9FAFB]" />}>
            <CheckoutContent />
        </Suspense>
    );
}
