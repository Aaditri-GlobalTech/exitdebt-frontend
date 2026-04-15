"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
    const { isLoggedIn, isReady, user, logout } = useAuth();

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
                <Link href="/" className="flex items-center group">
                    <Image src="/logo.png" alt="ExitDebt" width={288} height={96} className="h-24 w-auto" />
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link href="/#steps" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>How it Works</Link>
                    <Link href="/#pricing" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>Plans</Link>
                    <Link href="/#trust" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>Security</Link>
                    <Link href="/faq" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>FAQs</Link>
                    <Link href="/blogs" className="text-sm font-medium hover:text-teal-600 transition-colors" style={{ color: "var(--color-text-secondary)" }}>Blog</Link>
                </div>

                {/* Auth-Aware CTA */}
                <div className="flex items-center gap-3">
                    {isReady && isLoggedIn ? (
                        <>
                            <span className="hidden md:inline text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                                Hi, {user?.name?.split(" ")[0] || "User"}
                            </span>
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
                                style={{ backgroundColor: "var(--color-teal)" }}
                            >
                                Access Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="hidden md:inline-flex px-3 py-2 rounded-full text-xs font-medium transition-colors hover:bg-gray-100"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden md:inline-flex px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100"
                                style={{ color: "var(--color-teal)" }}
                            >
                                Login
                            </Link>
                            <Link
                                href="/get-started"
                                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
                                style={{ backgroundColor: "var(--color-teal)" }}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
