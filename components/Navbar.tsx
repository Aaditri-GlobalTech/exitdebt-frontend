"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const { status, tier } = useSubscription();

    const showUpgrade = isLoggedIn && (status === "trial" || status === "expired");
    const isActive = status === "active";

    function handleSignOut() {
        logout();
        window.location.href = "/";
    }

    return (
        <nav
            className="sticky top-0 z-50 backdrop-blur-sm"
            style={{
                backgroundColor: "rgba(252,252,252,0.9)",
                boxShadow: "0 1px 0 var(--color-border)",
            }}
        >
            <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: "var(--color-teal)" }}
                    >
                        E
                    </div>
                    <span
                        className="text-lg font-bold tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        ExitDebt
                    </span>
                </Link>

                {/* Right */}
                {!isLoggedIn && (
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link href="/#steps" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>How it Works</Link>
                        <Link href="/#pricing" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>Plans</Link>
                        <Link href="/#trust" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>Security</Link>
                        <Link href="/faq" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>FAQs</Link>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" className="text-sm font-semibold px-4 py-2 hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-primary)" }}>
                                Login
                            </Link>
                            <Link
                                href="/#start"
                                className="px-5 py-2.25 rounded-lg text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 bg-[var(--color-teal)]"
                                style={{ backgroundColor: "var(--color-teal)" }}
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-5">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium transition-colors hover:text-teal-600"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/upgrade"
                                className="text-sm font-medium transition-colors hover:text-teal-600"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                Plans
                            </Link>
                            <div className="relative">
                                <Link
                                    href="/profile"
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: "var(--color-teal)" }}
                                    title="Profile"
                                >
                                    {user?.name?.charAt(0) || "U"}
                                </Link>
                                {isActive && tier && (
                                    <span
                                        className="absolute -bottom-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white leading-none"
                                        style={{ backgroundColor: "var(--color-success)" }}
                                    >
                                        {tier === "lite" ? "L" : "S"}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-sm font-medium transition-colors cursor-pointer hover:text-red-500"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
