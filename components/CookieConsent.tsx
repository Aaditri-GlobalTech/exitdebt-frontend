"use client";

import { useState, useEffect, useCallback } from "react";

const CONSENT_KEY = "exitdebt_cookie_consent";
const CONSENT_VERSION = "1.0";

interface ConsentState {
    accepted: boolean;
    version: string;
    timestamp: string;
}

/**
 * DPDP-compliant cookie consent banner (PRD LP-05).
 *
 * Appears at bottom of viewport on first visit.
 * Stores consent in localStorage with timestamp and version.
 * Does not re-appear once accepted.
 */
export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (stored) {
                const parsed: ConsentState = JSON.parse(stored);
                // Re-show if consent version changed
                if (parsed.accepted && parsed.version === CONSENT_VERSION) {
                    return;
                }
            }
            // Small delay before showing to avoid layout shift on initial paint
            const timer = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(timer);
        } catch {
            setVisible(true);
        }
    }, []);

    const handleAccept = useCallback(() => {
        const consent: ConsentState = {
            accepted: true,
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
        };
        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        } catch {
            // localStorage not available — consent is session-only
        }
        setAnimateOut(true);
        setTimeout(() => setVisible(false), 300);
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[200] transition-all duration-300 ${
                animateOut
                    ? "translate-y-full opacity-0"
                    : "translate-y-0 opacity-100"
            }`}
        >
            <div
                className="max-w-5xl mx-auto px-4 sm:px-6 pb-4"
            >
                <div
                    className="rounded-2xl px-5 py-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        boxShadow:
                            "0 -4px 32px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12)",
                    }}
                >
                    {/* Icon */}
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                            backgroundColor: "rgba(115, 0, 190, 0.08)",
                        }}
                    >
                        <svg
                            className="w-4.5 h-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{ color: "var(--color-purple)" }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            We use cookies to improve your experience and analyze
                            site usage. Your data is encrypted and handled per
                            the{" "}
                            <a
                                href="/docs"
                                className="underline font-medium"
                                style={{ color: "var(--color-purple)" }}
                            >
                                DPDP Act 2023
                            </a>
                            .
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={handleAccept}
                            className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
