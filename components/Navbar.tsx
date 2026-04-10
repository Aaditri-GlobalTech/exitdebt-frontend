"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
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
            </div>
        </nav>
    );
}
