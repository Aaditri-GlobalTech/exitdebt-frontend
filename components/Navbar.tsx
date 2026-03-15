"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const { status, tier } = useSubscription();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const showUpgrade = isLoggedIn && (status === "trial" || status === "expired");
    const isActive = status === "active";

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 10);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menu on route change or resize
    useEffect(() => {
        function onResize() {
            if (window.innerWidth >= 640) setMenuOpen(false);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Lock body scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    function handleSignOut() {
        logout();
        window.location.href = "/";
    }

    /* ─── Link data ─── */
    const loggedOutLinks = [
        { href: "/#steps", label: "How it works" },
        { href: "/#trust", label: "Security" },
        { href: "/faq", label: "FAQ" },
        { href: "/docs", label: "Docs" },
    ];

    const loggedInLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/schedule", label: "Schedule" },
        { href: "/docs", label: "Docs" },
    ];

    const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

    return (
        <>
            <nav
                className="sticky top-0 z-50 transition-all duration-300"
                style={{
                    backgroundColor: scrolled
                        ? "rgba(15, 23, 41, 0.85)"
                        : "rgba(15, 23, 41, 0.6)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    borderBottom: scrolled
                        ? "1px solid rgba(42, 52, 71, 0.6)"
                        : "1px solid transparent",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-105"
                            style={{ backgroundColor: "var(--color-accent)" }}
                        >
                            E
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            ExitDebt
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden sm:flex items-center gap-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium transition-colors hover:text-white"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {showUpgrade && (
                            <Link
                                href="/upgrade"
                                className="text-sm font-bold px-3.5 py-1.5 rounded-full transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: "rgba(20, 184, 166, 0.1)",
                                    color: "var(--color-accent)",
                                    border: "1px solid rgba(20, 184, 166, 0.2)",
                                }}
                            >
                                Upgrade ✨
                            </Link>
                        )}
                        {isLoggedIn ? (
                            <>
                                <div className="relative">
                                    <Link
                                        href="/profile"
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-opacity hover:opacity-80"
                                        style={{ backgroundColor: "var(--color-accent)" }}
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
                                    className="text-sm font-medium transition-colors cursor-pointer hover:text-red-400"
                                    style={{ color: "var(--color-text-muted)" }}
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/#start"
                                className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:brightness-110"
                                style={{ backgroundColor: "var(--color-accent)" }}
                            >
                                Get started →
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                        style={{ color: "var(--color-text-secondary)" }}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay — glassmorphism */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 sm:hidden"
                    style={{
                        backgroundColor: "rgba(15, 23, 41, 0.5)",
                        backdropFilter: "blur(4px)",
                    }}
                    onClick={closeMenu}
                />
            )}

            {/* Mobile menu panel */}
            <div
                className={`fixed top-16 right-0 bottom-0 z-40 w-72 sm:hidden transition-transform duration-300 ease-out ${
                    menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{
                    backgroundColor: "rgba(26, 35, 50, 0.95)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    borderLeft: "1px solid rgba(42, 52, 71, 0.5)",
                }}
            >
                <div className="flex flex-col p-6 gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-base font-medium py-3 px-4 rounded-xl transition-colors hover:bg-white/5"
                            style={{ color: "var(--color-text-secondary)" }}
                            onClick={closeMenu}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {showUpgrade && (
                        <Link
                            href="/upgrade"
                            className="text-base font-bold py-3 px-4 rounded-xl transition-colors"
                            style={{ color: "var(--color-accent)" }}
                            onClick={closeMenu}
                        >
                            Upgrade ✨
                        </Link>
                    )}
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-colors hover:bg-white/5"
                                    onClick={closeMenu}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                        style={{ backgroundColor: "var(--color-accent)" }}
                                    >
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm text-white">{user?.name || "Profile"}</span>
                                </Link>
                                <button
                                    onClick={() => { closeMenu(); handleSignOut(); }}
                                    className="w-full text-left text-sm font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer hover:bg-red-500/10 mt-1"
                                    style={{ color: "var(--color-danger)" }}
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/#start"
                                className="block text-center py-3 px-4 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
                                style={{ backgroundColor: "var(--color-accent)" }}
                                onClick={closeMenu}
                            >
                                Get started →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
