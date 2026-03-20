"use client";

import React, { useState, useEffect, useCallback } from "react";
import OTPInput from "@/components/OTPInput";

interface Step2Props {
  userId: string;
  token: string;
  initialPhone?: string;
  onComplete: () => void;
}

type VerifyPhase = "pan" | "mobile_otp" | "aadhar_otp" | "fetching";

const OTP_COUNTDOWN_SECONDS = 60;

export default function Step2Verification({ userId, token, initialPhone = "", onComplete }: Step2Props) {
  const [phase, setPhase] = useState<VerifyPhase>("pan");
  const [pan, setPan] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  /* OB-04b: Optional consent for sharing insights with financial partners (DPDP) */
  const [partnerConsent, setPartnerConsent] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  // OTP resend countdown
  const [countdown, setCountdown] = useState(0);

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const sendMobileOtp = useCallback(async () => {
    const otpRes = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const otpData = await otpRes.json();
    if (!otpRes.ok) {
      const msg = typeof otpData.detail === "string" ? otpData.detail : Array.isArray(otpData.detail) ? otpData.detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join(", ") : "Failed to send OTP.";
      throw new Error(msg);
    }

    if (otpData.dev_otp) {
      setDevOtp(otpData.dev_otp);
    }

    setCountdown(OTP_COUNTDOWN_SECONDS);
  }, [phone]);

  /* ── PAN + Mobile OTP Phase ── */
  const handlePanSubmit = async () => {
    setError("");
    if (!panRegex.test(pan.toUpperCase())) {
      setError("Invalid PAN format. Expected: ABCDE1234F (5 letters, 4 digits, 1 letter).");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!consent) {
      setError("Please provide consent to proceed.");
      return;
    }

    setLoading(true);
    try {
      // Verify PAN
      /* Send PAN + consent flags to backend for verification and credit bureau pull */
      const panRes = await fetch("/api/onboarding/verify-pan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          user_id: userId,
          pan: pan.toUpperCase(),
          partner_consent: partnerConsent, /* OB-04b: optional partner sharing consent */
        }),
      });
      const panData = await panRes.json();
      if (!panRes.ok) {
        const msg = typeof panData.detail === "string" ? panData.detail : Array.isArray(panData.detail) ? panData.detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join(", ") : "PAN verification failed.";
        throw new Error(msg);
      }

      // Send Mobile OTP
      await sendMobileOtp();

      setPhase("mobile_otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend Mobile OTP ── */
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setError("");
    setDevOtp("");
    try {
      await sendMobileOtp();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
    }
  };

  /* ── Mobile OTP Verify ── */
  const handleMobileOTP = async (code: string) => {
    if (code.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.detail === "string" ? data.detail : Array.isArray(data.detail) ? data.detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join(", ") : "Invalid OTP.";
        throw new Error(msg);
      }

      // Move to Aadhar phase
      setPhase("aadhar_otp");

      // Auto-trigger Aadhar OTP (mocked in dev)
      const aadharRes = await fetch("/api/onboarding/aadhar/init", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, aadhar_number: "XXXX" }),
      });
      await aadharRes.json();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Aadhar OTP Verify ── */
  const handleAadharOTP = async (code: string) => {
    if (code.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/aadhar/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, otp_code: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.detail === "string" ? data.detail : Array.isArray(data.detail) ? data.detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join(", ") : "Aadhar verification failed.";
        throw new Error(msg);
      }

      // Data fetching simulation
      setPhase("fetching");
      setTimeout(() => onComplete(), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Aadhar verification failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="animate-fadeIn">
      {/* PAN + Mobile Phase */}
      {phase === "pan" && (
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
            Verify Your Identity
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
            We need your PAN card and mobile number for secure verification.
          </p>

          <div className="space-y-4">
            {/* PAN */}
            <div>
              <label htmlFor="onb-pan" className="block text-sm font-medium text-gray-700 mb-1.5">
                PAN Card Number
              </label>
              <input
                id="onb-pan"
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent"
              />
              <p className="text-[10px] text-gray-400 mt-1">Format: 5 letters + 4 digits + 1 letter</p>
            </div>

            {/* Phone for OTP */}
            <div>
              <label htmlFor="onb-phone2" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mobile Number (for OTP)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500">+91</span>
                <input
                  id="onb-phone2"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  maxLength={10}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent"
                />
              </div>
            </div>

            {/* OB-04: Mandatory consent — credit bureau check */}
            <div className="flex items-start gap-3">
              <input
                id="consent-verify"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-teal"
              />
              <label htmlFor="consent-verify" className="text-xs text-gray-500 leading-relaxed">
                I authorize ExitDebt to fetch my credit information for this assessment.
                I agree to the{" "}
                <a href="/privacy" className="underline underline-offset-2 text-teal">Privacy Policy</a>.
              </label>
            </div>

            {/* OB-04b: Optional consent — sharing with financial partners */}
            <div className="flex items-start gap-3">
              <input
                id="consent-partner"
                type="checkbox"
                checked={partnerConsent}
                onChange={(e) => setPartnerConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-teal"
              />
              <label htmlFor="consent-partner" className="text-xs text-gray-400 leading-relaxed">
                I consent to sharing my debt insights with ExitDebt&apos;s financial partners for
                personalized product recommendations. <span className="italic">(Optional)</span>
              </label>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              onClick={handlePanSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: "var(--color-teal)" }}
            >
              {loading ? "Verifying..." : "Verify & Send OTP →"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile OTP Phase */}
      {phase === "mobile_otp" && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
            Verify Mobile OTP
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Sent to +91 {phone}
          </p>

          {/* Dev OTP hint */}
          {devOtp && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100/50 text-amber-700 text-xs font-bold">
              🔧 Dev mode — OTP: <span className="font-mono text-sm tracking-widest">{devOtp}</span>
            </div>
          )}

          <OTPInput length={6} onComplete={handleMobileOTP} />

          {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

          {/* Resend + Back buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => { setPhase("pan"); setDevOtp(""); setCountdown(0); }}
              className="text-sm font-medium cursor-pointer"
              style={{ color: "var(--color-teal)" }}
            >
              ← Back to Details
            </button>
            <button
              onClick={handleResendOTP}
              disabled={countdown > 0}
              className={`text-xs font-bold transition-colors ${
                countdown > 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-teal-600 hover:text-teal-700 cursor-pointer"
              }`}
            >
              {countdown > 0
                ? `Resend in ${formatCountdown(countdown)}`
                : "Resend OTP"
              }
            </button>
          </div>
        </div>
      )}

      {/* Aadhar OTP Phase */}
      {phase === "aadhar_otp" && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
            Verify Aadhar OTP
          </h2>
          <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
            OTP sent to your Aadhar-linked mobile number.
          </p>
          <p className="text-xs mb-6 px-3 py-1.5 rounded-lg bg-teal/5 inline-block" style={{ color: "var(--color-teal-dark)" }}>
            Dev mode: Use <strong>123456</strong>
          </p>

          <OTPInput length={6} onComplete={handleAadharOTP} />

          {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {/* Fetching Data Phase */}
      {phase === "fetching" && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-teal/20 border-t-teal rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
            Fetching Your Financial Data
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Pulling bank details and generating credit summary...
          </p>
          <div className="mt-6 space-y-2 max-w-xs mx-auto">
            <div className="flex items-center gap-3 text-left">
              <svg className="w-4 h-4 text-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-600">PAN verified</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <svg className="w-4 h-4 text-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-600">Mobile verified</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <svg className="w-4 h-4 text-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-600">Aadhar verified</span>
            </div>
            <div className="flex items-center gap-3 text-left animate-pulse-soft">
              <div className="w-4 h-4 border-2 border-teal/30 border-t-teal rounded-full animate-spin flex-shrink-0" />
              <span className="text-xs text-gray-600">Fetching bank details...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
