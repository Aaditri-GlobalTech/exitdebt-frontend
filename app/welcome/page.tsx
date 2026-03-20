/**
 * Welcome Page — Screen 4 (PS-01 through PS-04)
 * 
 * Purpose: Post-signup engagement screen shown after onboarding completion.
 * Highlights free Basic dashboard features, introduces Lite/Shield upgrades,
 * and provides content engagement links.
 * 
 * PRD References:
 *  - PS-01: Welcome message with user's first name
 *  - PS-02: Feature highlights with dashboard CTA (Lite features)
 *  - PS-03: Shield/Shield+ awareness links (subtle, not pushy)
 *  - PS-04: Content links for engagement
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WelcomePage() {
    const { isLoggedIn, isReady, user } = useAuth();
    const router = useRouter();

    /* Redirect unauthenticated users to home */
    useEffect(() => {
        if (isReady && !isLoggedIn) {
            router.push("/");
        }
    }, [isReady, isLoggedIn, router]);

    if (!isReady || !isLoggedIn || !user) return null;

    const firstName = user.name?.split(" ")[0] || "there";

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-16 lg:py-24">

                {/* PS-01: Welcome message with first name */}
                <div className="text-center mb-12 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 mb-6">
                        <svg className="w-10 h-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Welcome to ExitDebt, {firstName}!
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                        Your free Basic dashboard is ready. Schedule your free consultation with our debt advisor.
                    </p>
                </div>

                {/* PS-02: What's included in Basic (free forever) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-8 mb-8 animate-slideUp">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                        What&apos;s included in Basic <span className="text-teal-600">(free forever)</span>:
                    </h2>
                    <p className="text-xs text-gray-400 mb-6">Your essential debt intelligence tools</p>
                    <ul className="space-y-3">
                        {[
                            { icon: "📊", title: "Debt Health Score", desc: "your 0–100 debt picture" },
                            { icon: "📋", title: "Debt Summary", desc: "all loans and cards in one view" },
                            { icon: "💸", title: "Interest Leak Report", desc: "see where money is wasted" },
                            { icon: "📅", title: "Salary Day Cash Flow", desc: "see what's left after EMIs" },
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <span className="text-sm font-bold text-gray-900">{item.title}</span>
                                    <span className="text-sm text-gray-400"> — {item.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* PS-02: Unlock more with Lite/Shield */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white animate-slideUp">
                    <h2 className="text-lg font-bold mb-1">Unlock more with Lite or Shield:</h2>
                    <p className="text-xs text-slate-400 mb-5">Advanced tools for serious debt optimization</p>
                    <ul className="space-y-3 mb-6">
                        {[
                            "🧭 Debt Freedom GPS — your debt-free countdown",
                            "💰 Smart Payment Prioritizer — optimize extra payments",
                            "📈 Credit Score Impact Predictor",
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/upgrade"
                        className="inline-block px-6 py-3 rounded-xl bg-teal-500 text-white text-sm font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all"
                    >
                        Learn about our services →
                    </Link>
                </div>

                {/* PS-01 + PS-02: Primary CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <Link
                        href="/dashboard"
                        className="flex-1 text-center px-6 py-4 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all"
                    >
                        Go to My Dashboard →
                    </Link>
                    <Link
                        href="/schedule"
                        className="flex-1 text-center px-6 py-4 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all"
                    >
                        Schedule Free Consultation →
                    </Link>
                </div>

                {/* PS-03: Shield/Shield+ awareness (subtle) */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Need more help?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                            <p className="text-sm font-bold text-gray-800 mb-1">🛡️ Shield</p>
                            <p className="text-xs text-gray-500">Harassment protection + creditor negotiation</p>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                            <p className="text-sm font-bold text-gray-800 mb-1">💰 Shield+</p>
                            <p className="text-xs text-gray-500">We negotiate debt reduction for you</p>
                        </div>
                    </div>
                </div>

                {/* PS-04: Content engagement links */}
                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meanwhile, learn more:</h3>
                    <ul className="space-y-2">
                        {[
                            { title: "How debt restructuring works", href: "/debt-restructuring-india" },
                            { title: "How to get out of debt in India", href: "/how-to-get-out-of-debt-india" },
                            { title: "How to reduce your EMI burden", href: "/how-to-reduce-emi-burden" },
                        ].map((link, i) => (
                            <li key={i}>
                                <Link
                                    href={link.href}
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors"
                                >
                                    {link.title} →
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </main>
            <Footer />
        </div>
    );
}
