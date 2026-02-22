"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
    const router = useRouter();
    const { isLoggedIn, user, pan, phone, logout, isReady } = useAuth();

    // Redirect if not authenticated
    if (isReady && !isLoggedIn) {
        router.replace("/");
        return null;
    }

    // Wait for hydration
    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
                <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-purple)" }} />
            </div>
        );
    }

    const maskedPan = pan ? `${pan.slice(0, 2)}****${pan.slice(-2)}` : "—";
    const maskedPhone = phone ? `+91 ${phone.slice(0, 2)}****${phone.slice(-4)}` : "—";

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
                <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
                    Your Profile
                </h1>

                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                    {/* Header */}
                    <div className="p-6 flex items-center gap-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{ backgroundColor: "rgba(115,0,190,0.1)", color: "var(--color-purple)" }}
                        >
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                                {user?.name || "User"}
                            </h2>
                            <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-text-secondary)" }}>
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-success)" }} />
                                Verified via PAN
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 grid sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Personal</h3>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>📱</div>
                                <div>
                                    <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Phone</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{maskedPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>💳</div>
                                <div>
                                    <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>PAN</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{maskedPan}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Financial</h3>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h,8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>💰</div>
                                <div>
                                    <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Monthly Salary</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                                        {user && user.salary > 0 ? formatCurrency(user.salary) : "Not set"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>📅</div>
                                <div>
                                    <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Salary Credit Date</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                                        {user && user.salaryDate > 0 ? `${user.salaryDate}th of every month` : "Not set"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>📊</div>
                                <div>
                                    <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Debt Health Score</p>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                                        {user?.score ?? "—"} / 100
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 flex flex-col sm:flex-row gap-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                        <Link
                            href="/dashboard"
                            className="flex-1 text-center py-2.5 px-4 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            ← Back to Dashboard
                        </Link>
                        <Link
                            href="/settings"
                            className="flex-1 text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors hover:bg-gray-50"
                            style={{ border: "1px solid var(--color-border)", color: "var(--color-purple)" }}
                        >
                            ⚙ Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors cursor-pointer hover:bg-gray-50"
                            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
