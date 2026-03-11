"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrimaryButton from "@/components/PrimaryButton";
import FAQAccordion from "@/components/FAQAccordion";
import OTPInput from "@/components/OTPInput";

/* ───── Data ───── */

const STEPS = [
  { num: "1", title: "Enter PAN Details", desc: "Provide your basic details and PAN for a secure identity verification process." },
  { num: "2", title: "See Your Score", desc: "Get a comprehensive analysis of your current debt-to-income ratio and interest leakage." },
  { num: "3", title: "Get a Plan", desc: "Receive a tailored step-by-step strategy to consolidate and payoff debts faster." },
];

const TRUST_POINTS = [
  { icon: "iso", title: "ISO 27001 Certified", desc: "Adhering to global standards for information security management systems." },
  { icon: "calls", title: "No Sales Calls", desc: "We respect your privacy. No unwanted marketing calls or spam, ever." },
  { icon: "encrypted", title: "Encrypted Storage", desc: "Personal information is encrypted using AES-256 before being stored in our secure servers." },
  { icon: "privacy", title: "Bank-Grade Privacy", desc: "We follow the same stringent security protocols as major financial institutions." },
];

const LANDING_FAQS = [
  { question: "Will this check affect my credit score?", answer: "No, we perform a \"soft pull\" on your credit record which does not impact your Equifax or other bureau credit scores in any way." },
  { question: "How long does the analysis take?", answer: "The analysis is near-instant. Once you provide your details and verify your mobile via OTP, your dashboard will be ready in under 60 seconds." },
  { question: "Is ExitDebt a bank or a lender?", answer: "ExitDebt is a financial wellness platform. We analyze your debt and suggest the best strategies or products from our partner lenders to help you save money." },
];

type FormStep = "details" | "otp" | "processing";

/* ───── Component ───── */

export default function Home() {
  const { isLoggedIn, user, login, isReady } = useAuth();
  const router = useRouter();
  const formCardRef = useRef<HTMLDivElement>(null);

  // Form state
  const [step, setStep] = useState<FormStep>("details");
  const [pan, setPan] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  // Glow effect legacy - kept for smooth transitions but simplified
  useEffect(() => {
    function triggerGlow() {
      if (formCardRef.current) {
        formCardRef.current.classList.add("form-glow-active");
        setTimeout(() => formCardRef.current?.classList.remove("form-glow-active"), 2000);
      }
    }
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a[href*="#start"]')) setTimeout(triggerGlow, 100);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Validation
  const validateDetails = (): boolean => {
    if (!panRegex.test(pan.toUpperCase())) {
      setError("Invalid PAN format. Expected: ABCDE1234F");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setError("Invalid phone number. Enter a 10-digit Indian mobile number.");
      return false;
    }
    if (!consent) {
      setError("Please provide consent to proceed.");
      return false;
    }
    return true;
  };

  // OTP flow
  const handleSendOTP = async () => {
    setError("");
    if (!validateDetails()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.detail || "Failed to send OTP");
      }
      
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setError("");
    if (code.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }
    setStep("processing");

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code: code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Invalid OTP");
      }

      login(pan.toUpperCase(), phone);
      router.push("/income");
    } catch (err: unknown) {
      setStep("otp");
      setError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    }
  };

  const auth = useAuth();
  const authPhone = auth.phone;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      {/* ───── HERO ───── */}
      <section id="start" style={{ backgroundColor: "var(--color-bg)" }} className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center text-left">
            {/* Left — Headline */}
            <div className="lg:col-span-7 animate-fadeIn">
              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
                style={{ backgroundColor: "var(--color-teal-light)", color: "var(--color-teal-dark)" }}
              >
                <span className="mr-1.5 min-w-[12px] min-h-[12px] inline-flex items-center justify-center rounded-full bg-teal-600 text-[8px] text-white">✓</span> Trusted by 50,000+ Users
              </div>

              <h1
                className="text-5xl lg:text-[4rem] font-bold leading-[1.05] tracking-tight mb-8"
                style={{ color: "var(--color-text-primary)" }}
              >
                Are you <span style={{ color: "var(--color-teal)" }}>overpaying</span><br />
                on your loans?
              </h1>

              <p className="text-lg leading-relaxed max-w-xl mb-10" style={{ color: "var(--color-text-secondary)" }}>
                Take control of your financial future. Our AI-driven analysis helps you
                find hidden savings and creates a personalized debt reduction plan in
                minutes.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>256-bit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>No Equifax impact</span>
                </div>
              </div>
            </div>

            {/* Right — Form Card */}
            <div className="lg:col-span-5 animate-slideUp stagger-1">
              <div
                ref={formCardRef}
                className="rounded-xl p-8 lg:p-10 border border-gray-100 shadow-2xl transition-all"
                style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}
              >
                {isReady && isLoggedIn && user ? (
                  <div className="text-center space-y-6 py-8">
                    <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg" style={{ backgroundColor: "var(--color-teal)" }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Welcome back, {user.name.split(' ')[0]}</h3>
                      <p className="text-sm text-gray-500">You are logged in via +91 {authPhone}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="w-full py-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 bg-[var(--color-teal)]"
                    >
                      Go to Dashboard →
                    </Link>
                  </div>
                ) : step === "details" ? (
                  <>
                    <h2 className="text-xl font-bold mb-8 text-left" style={{ color: "var(--color-text-primary)" }}>
                      Start Your Debt Analysis
                    </h2>

                    <div className="space-y-6">
                      <div className="space-y-2 text-left">
                        <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>PAN Card Number</label>
                        <input
                          type="text"
                          value={pan}
                          onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="w-full px-4 py-3.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-teal-500 border border-transparent font-medium"
                          style={{
                            backgroundColor: "var(--color-teal-light)",
                            color: "var(--color-text-primary)",
                          }}
                        />
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>Mobile Number</label>
                        <div className="flex gap-2">
                          <div
                            className="px-4 py-3.5 rounded-lg text-sm font-medium flex items-center shrink-0"
                            style={{ backgroundColor: "var(--color-teal-light)", color: "var(--color-text-secondary)" }}
                          >
                            +91
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="98765 43210"
                            maxLength={10}
                            className="w-full px-4 py-3.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-teal-500 border border-transparent font-medium"
                            style={{
                              backgroundColor: "var(--color-teal-light)",
                              color: "var(--color-text-primary)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-2 text-left">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-teal-200 text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <span className="text-[10px] leading-relaxed select-none" style={{ color: "var(--color-text-secondary)" }}>
                            I authorize ExitDebt to fetch my credit information from bureaus. This will **not impact my credit score**.
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-teal-200 text-teal-600 focus:ring-teal-500 cursor-pointer" />
                          <span className="text-[10px] leading-relaxed select-none" style={{ color: "var(--color-text-secondary)" }}>
                            (Optional) I agree to share my details with financial partners for debt consolidation offers.
                          </span>
                        </label>
                      </div>

                      {error && (
                        <p className="text-xs text-center font-medium animate-fadeIn" style={{ color: "var(--color-danger)" }}>{error}</p>
                      )}

                      <button
                        onClick={handleSendOTP}
                        disabled={loading || !pan || !phone || !consent}
                        className="w-full py-4 rounded-lg flex items-center justify-center gap-3 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "var(--color-teal)" }}
                      >
                        {loading ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Check My Debt Health <span className="text-lg leading-none">›</span></>
                        )}
                      </button>

                      <p className="text-[9px] text-center px-4 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                        By proceeding, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                      </p>
                    </div>
                  </>
                ) : step === "otp" ? (
                  <div className="animate-fadeIn text-left">
                    <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
                    <p className="text-sm text-gray-500 mb-8">Sent to +91 {phone}</p>
                    <OTPInput onComplete={handleVerifyOTP} disabled={loading} />
                    {error && <p className="text-xs text-center mt-6 font-medium" style={{ color: "var(--color-danger)" }}>{error}</p>}
                    <button
                      onClick={() => setStep("details")}
                      className="w-full mt-8 py-2 text-xs font-bold uppercase tracking-widest text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      ← Back to Details
                    </button>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-teal-50 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-teal-600 rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold">Analyzing Your Debt...</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">Fetching credit report from bureaus<br/>& calculating potential savings</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="steps" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 border-t border-gray-50">
        <div className="text-center mb-16 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`relative rounded-xl p-10 text-left border border-gray-50 flex flex-col items-start transition-all hover:shadow-xl hover:shadow-gray-100`}
              style={{ backgroundColor: "var(--color-bg-card)" }}
            >
              <span className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 shadow-lg shadow-teal-100" style={{ backgroundColor: "var(--color-teal)" }}>{s.num}</span>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── SECURITY SECTION ───── */}
      <section id="security" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Security</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Your Data Security is Our Top Priority</h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-text-secondary)" }}>
              We use bank-grade security and encryption to ensure your data stays private and safe. 
              ExitDebt is committed to maintaining the highest standards of data protection.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-bold text-lg mb-1" style={{ color: "var(--color-teal)" }}>AES-256</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Encryption Standard</p>
               </div>
               <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-bold text-lg mb-1" style={{ color: "var(--color-teal)" }}>SSL/TLS</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Secure Protocol</p>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRUST_POINTS.map((point, i) => (
              <div
                key={point.title}
                className="rounded-xl p-8 border border-gray-100 shadow-sm"
                style={{ backgroundColor: "var(--color-bg-card)" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "var(--color-teal-light)" }}>
                  <svg className="w-5 h-5" fill="var(--color-teal)" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.92v3.13a4 4 0 11-8 0V8.5a.5.5 0 011 0v.45a3 3 0 106 0V6.432L10 3.22 2.5 6.432v7.136c0 1.56 1.024 3.037 2.587 3.522L10 18.78l4.913-1.69c.991-.34 1.787-1.113 2.23-2.08a1 1 0 011.814.84a5.986 5.986 0 01-3.573 3.101L10 20.85l-5.384-1.854C2.616 18.358 1.5 16.51 1.5 14.5V6.5a1 1 0 01.666-.9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>{point.title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING SECTION ───── */}
      <section id="pricing" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 border-t border-gray-50">
        <div className="text-center mb-16 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Choose Your Path to Freedom</h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">Flexible plans designed to support you at every stage of your debt recovery journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {/* Lite Plan */}
          <div className="rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col bg-white">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">LITE</span>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-extrabold text-[#0F172A]">₹499</span>
              <span className="text-gray-400 font-medium font-bold">/mo</span>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 flex-1">
              Essential tools for independent debt management and tracking.
            </p>
            <ul className="space-y-4 mb-10">
              {["Dashboard access", "7 Pro debt tools", "Quarterly bureau refresh"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#1E293B]">
                  <svg className="w-5 h-5 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/#start" className="w-full py-4 rounded-xl text-sm font-bold border border-teal-500 text-teal-600 text-center hover:bg-teal-50 transition-all">
              Get Started
            </Link>
          </div>

          {/* Shield Plan */}
          <div className="relative rounded-3xl p-8 border-2 border-teal-500 scale-[1.05] shadow-2xl shadow-teal-100 z-10 flex flex-col bg-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-teal-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase">Recommended</div>
            <span className="text-[10px] font-bold tracking-widest text-teal-600 uppercase mb-4">SHIELD</span>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-extrabold text-[#0F172A]">₹1,999</span>
              <span className="text-gray-400 font-medium font-bold">/mo</span>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 flex-1">
              Active protection against harassment and direct bank coordination.
            </p>
            <ul className="space-y-4 mb-10">
              {["Everything in LITE", "Harassment protection", "Creditor communications", "Priority 24/7 support"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#1E293B]">
                  <svg className="w-5 h-5 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/#start" className="w-full py-4 rounded-xl text-sm font-bold bg-teal-500 text-white text-center hover:bg-teal-600 transition-all shadow-lg shadow-teal-100">
              Protect Me Now
            </Link>
          </div>

          {/* Settlement Plan */}
          <div className="rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col bg-white">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">SETTLEMENT</span>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-extrabold text-[#0F172A]">10%</span>
              <span className="text-gray-400 font-medium font-bold ml-1">+ GST</span>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 flex-1">
              End-to-end legal and negotiation support for closing your debts.
            </p>
            <ul className="space-y-4 mb-10">
              {["Full debt negotiation", "Legal notice handling", "Dedicated Case Manager"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#1E293B]">
                  <svg className="w-5 h-5 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/#start" className="w-full py-4 rounded-xl text-sm font-bold border border-black text-black text-center hover:bg-gray-50 transition-all">
              Check My Health First
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FAQ SECTION ───── */}
      <section id="faq" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 border-t border-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Support</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500">Everything you need to know about checking your debt health.</p>
          </div>
          <FAQAccordion items={LANDING_FAQS} />
          <div className="text-center mt-12 p-8 rounded-2xl bg-teal-50 border border-teal-100">
            <h4 className="font-bold mb-2">Still have questions?</h4>
            <p className="text-sm text-gray-600 mb-6">Our team is here to help you navigate your financial journey.</p>
            <Link href="/contact" className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--color-teal)] hover:shadow-lg transition-all">
               Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
