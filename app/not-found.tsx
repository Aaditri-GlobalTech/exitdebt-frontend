"use client";

import React from "react";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-md w-full animate-fadeIn">
                    {/* Lottie Animation */}
                    <div className="w-full aspect-square mb-8">
                        <DotLottieReact
                            src="/animations/404Error.lottie"
                            loop
                            autoplay
                        />
                    </div>

                    <h1
                        className="text-4xl font-extrabold mb-4 tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Page Not Found
                    </h1>

                    <p
                        className="text-lg mb-8 leading-relaxed"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        Let&apos;s get you back on track to clearing your debt.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            backgroundColor: "var(--color-teal)",
                            boxShadow: "0 4px 12px rgba(115,0,190,0.2)"
                        }}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
