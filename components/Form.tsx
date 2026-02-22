"use client";

import { useState, FormEvent } from "react";
import { validatePAN, validatePhone, selectProfile } from "@/lib/utils";
import { MockProfile } from "@/lib/mockProfiles";
import LoadingSpinner from "./LoadingSpinner";

interface FormProps {
    onResult: (profile: MockProfile) => void;
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
    submitted: boolean;
}

export default function DebtForm({ onResult, isLoading, setIsLoading, submitted }: FormProps) {
    const [pan, setPan] = useState("");
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState(false);
    const [panError, setPanError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [consentError, setConsentError] = useState("");
    const [verifiedName, setVerifiedName] = useState("");

    function handlePanChange(value: string) {
        const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
        setPan(upper);
        setVerifiedName(""); // Reset verification on PAN change
        if (upper.length === 10 && !validatePAN(upper)) {
            setPanError("Invalid PAN format. Expected: ABCDE1234F");
        } else {
            setPanError("");
        }
    }

    function handlePhoneChange(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 10);
        setPhone(digits);
        if (digits.length === 10 && !validatePhone(digits)) {
            setPhoneError("Invalid mobile number. Must start with 6-9.");
        } else {
            setPhoneError("");
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        let valid = true;

        if (!validatePAN(pan)) {
            setPanError("Invalid PAN format. Expected: ABCDE1234F");
            valid = false;
        }
        if (!validatePhone(phone)) {
            setPhoneError("Enter a valid 10-digit Indian mobile number.");
            valid = false;
        }
        if (!consent) {
            setConsentError("You must agree to proceed.");
            valid = false;
        }
        if (!valid) return;

        setIsLoading(true);

        try {
            // Step 1: Verify PAN via Setu API
            const panResp = await fetch("/api/pan/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pan: pan.toUpperCase(),
                    consent: "Y",
                    reason: "Debt health check for ExitDebt user",
                }),
            });

            if (panResp.ok) {
                const panData = await panResp.json();
                if (panData.verification === "success" && panData.data?.full_name) {
                    setVerifiedName(panData.data.full_name);
                }
            }
            // If PAN verification fails (backend down, etc.), continue with mock — non-blocking
        } catch {
            // PAN verification is best-effort; proceed with profile selection
            console.warn("PAN verification unavailable, falling back to local profile");
        }

        // Step 2: Select profile and return result
        setTimeout(() => {
            const profile = selectProfile(pan);
            onResult(profile);
        }, 1500);
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (submitted) {
        return (
            <div className="py-10 text-center">
                <p className="text-sm text-gray-500">Your report has been generated.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card Number
                </label>
                <input
                    id="pan"
                    type="text"
                    value={pan}
                    onChange={(e) => handlePanChange(e.target.value)}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    aria-describedby="pan-error"
                    className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:border-transparent ${panError ? "border-red-300 bg-red-50/30 focus:ring-red-300" : "border-gray-200 bg-gray-50/50 focus:ring-[#00CAC7]/30"
                        }`}
                />
                {panError && (
                    <p id="pan-error" className="text-xs text-red-500 mt-1.5">{panError}</p>
                )}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                </label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    aria-describedby="phone-error"
                    className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:border-transparent ${phoneError ? "border-red-300 bg-red-50/30 focus:ring-red-300" : "border-gray-200 bg-gray-50/50 focus:ring-[#00CAC7]/30"
                        }`}
                />
                {phoneError && (
                    <p id="phone-error" className="text-xs text-red-500 mt-1.5">{phoneError}</p>
                )}
            </div>

            <div className="flex items-start gap-3">
                <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                        setConsent(e.target.checked);
                        if (e.target.checked) setConsentError("");
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#00CAC7]"
                />
                <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="underline underline-offset-2" style={{ color: "var(--accent-teal)" }}>
                        Privacy Policy
                    </a>{" "}
                    and consent to ExitDebt accessing my credit information for this assessment.
                </label>
            </div>
            {consentError && (
                <p className="text-xs text-red-500 -mt-2">{consentError}</p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                    backgroundColor: "var(--accent-lime)",
                    color: "var(--ink)",
                }}
            >
                Check your debt health →
            </button>

            <p className="text-center text-xs text-gray-400">
                Takes 30 seconds · No impact on your CIBIL score
            </p>
        </form>
    );
}
