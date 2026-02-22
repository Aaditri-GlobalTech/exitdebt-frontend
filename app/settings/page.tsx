"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SettingsPage() {
    const router = useRouter();
    const { isLoggedIn, user, isReady, updateIncome } = useAuth();
    const { tier, status, billingPeriod } = useSubscription();

    const [salary, setSalary] = useState("");
    const [salaryDate, setSalaryDate] = useState("");
    const [otherIncome, setOtherIncome] = useState("");
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Populate with existing values
    useEffect(() => {
        if (user) {
            setSalary(user.salary > 0 ? String(user.salary) : "");
            setSalaryDate(user.salaryDate > 0 ? String(user.salaryDate) : "");
            setOtherIncome(user.otherIncome > 0 ? String(user.otherIncome) : "");
        }
    }, [user]);

    // Auth guard
    if (isReady && !isLoggedIn) {
        router.replace("/");
        return null;
    }
    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
                <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-purple)" }} />
            </div>
        );
    }

    function validate(): boolean {
        const newErrors: Record<string, string> = {};
        const s = Number(salary);
        const d = Number(salaryDate);
        const o = Number(otherIncome);

        if (!salary || isNaN(s) || s < 1000) {
            newErrors.salary = "Enter a valid salary (min ₹1,000)";
        }
        if (!salaryDate || isNaN(d) || d < 1 || d > 31) {
            newErrors.salaryDate = "Enter a valid day (1–31)";
        }
        if (otherIncome && (isNaN(o) || o < 0)) {
            newErrors.otherIncome = "Enter a valid amount";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSave() {
        if (!validate()) return;
        updateIncome(Number(salary), Number(salaryDate), Number(otherIncome) || 0);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                        Settings
                    </h1>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: "var(--color-purple)" }}
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Subscription Status Card */}
                <div
                    className="rounded-2xl p-6 mb-6"
                    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                >
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>
                        Subscription
                    </h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span
                                className="inline-block w-2.5 h-2.5 rounded-full"
                                style={{
                                    backgroundColor: status === "active" ? "var(--color-success)"
                                        : status === "trial" ? "var(--color-purple)"
                                            : "var(--color-danger)",
                                }}
                            />
                            <div>
                                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                                    {status === "active" && tier
                                        ? `${tier.charAt(0).toUpperCase() + tier.slice(1)} — ${billingPeriod === "annual" ? "Annual" : "Monthly"}`
                                        : status === "trial"
                                            ? "Free Trial"
                                            : "Expired"}
                                </p>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                    {status === "active" ? "Your subscription is active" : status === "trial" ? "Full access for 3 months" : "Upgrade to continue"}
                                </p>
                            </div>
                        </div>
                        {status !== "active" && (
                            <Link
                                href="/upgrade"
                                className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: "rgba(115,0,190,0.08)",
                                    color: "var(--color-purple)",
                                    border: "1px solid rgba(115,0,190,0.15)",
                                }}
                            >
                                Upgrade
                            </Link>
                        )}
                    </div>
                </div>

                {/* Income Settings */}
                <div
                    className="rounded-2xl p-6 mb-6"
                    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                >
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "var(--color-text-muted)" }}>
                        Income Details
                    </h2>
                    <div className="space-y-5">
                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                                Monthly Salary (₹)
                            </label>
                            <input
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="e.g. 60000"
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-bg-soft)",
                                    border: `1px solid ${errors.salary ? "var(--color-danger)" : "var(--color-border)"}`,
                                    color: "var(--color-text-primary)",
                                }}
                            />
                            {errors.salary && (
                                <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.salary}</p>
                            )}
                            {user && user.salary > 0 && salary !== String(user.salary) && (
                                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                    Current: {formatCurrency(user.salary)}
                                </p>
                            )}
                        </div>

                        {/* Salary Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                                Salary Credit Date
                            </label>
                            <input
                                type="number"
                                value={salaryDate}
                                onChange={(e) => setSalaryDate(e.target.value)}
                                placeholder="e.g. 1"
                                min={1}
                                max={31}
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-bg-soft)",
                                    border: `1px solid ${errors.salaryDate ? "var(--color-danger)" : "var(--color-border)"}`,
                                    color: "var(--color-text-primary)",
                                }}
                            />
                            {errors.salaryDate && (
                                <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.salaryDate}</p>
                            )}
                        </div>

                        {/* Other Income */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                                Other Monthly Income (₹) <span style={{ color: "var(--color-text-muted)" }}>— optional</span>
                            </label>
                            <input
                                type="number"
                                value={otherIncome}
                                onChange={(e) => setOtherIncome(e.target.value)}
                                placeholder="e.g. 10000"
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-bg-soft)",
                                    border: `1px solid ${errors.otherIncome ? "var(--color-danger)" : "var(--color-border)"}`,
                                    color: "var(--color-text-primary)",
                                }}
                            />
                            {errors.otherIncome && (
                                <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.otherIncome}</p>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            {saved ? "✓ Saved Successfully" : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* Account Section */}
                <div
                    className="rounded-2xl p-6"
                    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                >
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>
                        Account
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                    Verified via PAN
                                </p>
                            </div>
                            <Link
                                href="/profile"
                                className="text-xs font-medium transition-colors hover:opacity-80"
                                style={{ color: "var(--color-purple)" }}
                            >
                                View Profile →
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-center mt-6" style={{ color: "var(--color-text-muted)" }}>
                    Changes to income details will immediately update your dashboard calculations.
                </p>
            </main>
            <Footer />

            {/* Save toast */}
            {saved && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] animate-slideUp">
                    <div
                        className="px-6 py-3 rounded-xl flex items-center gap-2"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                            border: "1px solid rgba(5,150,105,0.3)",
                        }}
                    >
                        <span className="text-sm" style={{ color: "var(--color-success)" }}>✓</span>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                            Income details updated
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
