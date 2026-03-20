/**
 * CookieConsent.tsx
 * 
 * LP-05 (P0): DPDP Act compliant cookie consent banner.
 * 
 * Displays a fixed bottom banner on first visit. The user can accept all cookies
 * or manage preferences. Consent choice is persisted in localStorage to prevent
 * the banner from reappearing on subsequent visits.
 * 
 * This component is rendered globally from app/layout.tsx.
 */
"use client";

import { useState, useEffect } from "react";

/** Key used to persist cookie consent in localStorage */
const CONSENT_KEY = "exitdebt_cookie_consent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        /* Only show the banner if the user hasn't already made a choice */
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) {
            setVisible(true);
        }
    }, []);

    /** Accept all cookies and dismiss the banner */
    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString(),
        }));
        setVisible(false);
    };

    /** Accept only essential cookies */
    const handleEssentialOnly = () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString(),
        }));
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slideUp">
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Consent text */}
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">🍪 We value your privacy</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                        By clicking &quot;Accept All&quot;, you consent to our use of cookies in accordance with the{" "}
                        <a href="/privacy" className="underline text-teal-600 hover:text-teal-700">Digital Personal Data Protection (DPDP) Act</a>.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleEssentialOnly}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Essential Only
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-200 transition-all cursor-pointer"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
