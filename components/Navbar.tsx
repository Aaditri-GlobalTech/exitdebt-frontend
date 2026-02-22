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
                        style={{ backgroundColor: "var(--color-purple)" }}
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
                {isLoggedIn ? (
                    <div className="flex items-center gap-5">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium transition-colors"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Dashboard
                        </Link>
                        {showUpgrade && (
                            <Link
                                href="/upgrade"
                                className="text-sm font-bold px-3.5 py-1.5 rounded-full transition-all hover:opacity-80 hidden sm:block"
                                style={{
                                    backgroundColor: "rgba(115,0,190,0.08)",
                                    color: "var(--color-purple)",
                                    border: "1px solid rgba(115,0,190,0.15)",
                                }}
                            >
                                Upgrade ✨
                            </Link>
                        )}
                        <Link
                            href="/schedule"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Schedule
                        </Link>
                        <Link
                            href="/settings"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Settings
                        </Link>
                        <Link
                            href="/docs"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Docs
                        </Link>
                        {/* Profile avatar + tier badge */}
                        <div className="relative">
                            <Link
                                href="/profile"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-opacity hover:opacity-80"
                                style={{ backgroundColor: "var(--color-purple)" }}
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
                ) : (
                    <div className="flex items-center gap-6">
                        <Link
                            href="/#steps"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            How it works
                        </Link>
                        <Link
                            href="/#trust"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Security
                        </Link>
                        <Link
                            href="/faq"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/docs"
                            className="text-sm font-medium transition-colors hidden sm:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Docs
                        </Link>
                        <Link
                            href="/#start"
                            className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            Get started →
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
