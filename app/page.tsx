"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrimaryButton from "@/components/PrimaryButton";
import FAQAccordion from "@/components/FAQAccordion";

/* ───── Data ───── */

const STEPS = [
  { num: "01", title: "Enter your PAN", desc: "We use your PAN card number to securely pull your credit report. Nothing else is needed." },
  { num: "02", title: "Get your score", desc: "You'll see a debt health score that tells you exactly how well you're managing your debt." },
  { num: "03", title: "See the full picture", desc: "Every loan, every card — with interest rates and what they're really costing you." },
];

const TRUST_ICONS: Record<string, React.ReactNode> = {
  shield: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  chart: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  dollar: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  block: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
};

const TRUST_POINTS = [
  { icon: "shield", title: "Bank-grade encryption", desc: "Your data is encrypted end-to-end. We never store your PAN." },
  { icon: "chart", title: "No CIBIL impact", desc: "This is a soft pull. Your credit score stays exactly where it is." },
  { icon: "dollar", title: "3-month free trial", desc: "Full dashboard access free for 3 months. Plans start at ₹499/month after trial." },
  { icon: "block", title: "No data selling", desc: "We don't sell, share, or trade your personal data. Period." },
];

const TESTIMONIALS = [
  { name: "Priya M.", city: "Pune", savings: "₹62,400", timeline: "11 days", quote: "I had no idea I was overpaying so much on my personal loan. The call was calm and private — no pressure at all." },
  { name: "Rahul K.", city: "Bangalore", savings: "₹48,000", timeline: "17 days", quote: "I was nervous about sharing my PAN. But the check took 30 seconds and nothing showed up on my CIBIL." },
  { name: "Sneha D.", city: "Mumbai", savings: "₹1,12,000", timeline: "21 days", quote: "Three credit cards and a personal loan — I didn't know where to start. They gave me a clear plan." },
];

const LANDING_FAQS = [
  { question: "Is this a scam?", answer: "ExitDebt is a registered debt advisory platform. We don't ask for your bank password. We don't move your money. We only read your credit report to show you where you're overpaying." },
  { question: "Will this hurt my CIBIL score?", answer: "No. We do a soft credit check. This has zero impact on your CIBIL score. Only hard inquiries from loan applications affect your score." },
  { question: "Is my PAN safe?", answer: "Your PAN is hashed instantly using SHA-256. We never store your raw PAN. All data is encrypted with bank-grade AES-256 encryption and auto-deleted after 30 days." },
  { question: "Is there a free trial?", answer: "Yes! Every new user gets a free 3-month trial with full dashboard access. After the trial, plans start at just ₹499/month. We also offer Shield protection and one-time Settlement services." },
];

const ARTICLES = [
  { slug: "credit-card-mistakes", title: "5 mistakes people make with credit cards", category: "Credit Cards", desc: "Most people don't realise how much revolving credit actually costs them." },
  { slug: "priya-saved-62k", title: "How Priya saved ₹62K/year by restructuring her debt", category: "Success Story", desc: "A real story of someone who turned their finances around in 3 months." },
  { slug: "personal-loan-vs-credit-card", title: "Personal loan vs. credit card debt: which to pay first?", category: "Strategy", desc: "The answer isn't always obvious. Here's a framework to decide." },
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
  const [otpCode, setOtpCode] = useState("");

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  // Glow effect for "Get started" button
  useEffect(() => {
    function triggerGlow() {
      if (formCardRef.current) {
        formCardRef.current.classList.remove("form-glow");
        void formCardRef.current.offsetWidth;
        formCardRef.current.classList.add("form-glow");
      }
    }
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href*="#start"]');
      if (anchor) setTimeout(triggerGlow, 100);
    }
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
  const handleSendOTP = () => {
    setError("");
    if (!validateDetails()) return;
    setLoading(true);
    setTimeout(() => {
      setStep("otp");
      setLoading(false);
    }, 800);
  };

  const handleVerifyOTP = (code: string) => {
    setError("");
    if (code.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }
    setStep("processing");
    setTimeout(() => {
      login(pan.toUpperCase(), phone);
      router.push("/income");
    }, 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      {/* ───── HERO ───── */}
      <section id="start" style={{ backgroundColor: "var(--color-bg-soft)" }}>
        <div className="max-w-6xl mx-auto px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left — Headline */}
            <div className="lg:col-span-7 animate-fadeIn">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
                style={{ backgroundColor: "rgba(115,0,190,0.08)", color: "var(--color-purple)" }}
              >
                Free debt health check
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] tracking-tight mb-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                Find out if you&apos;re{" "}
                <span className="relative inline-block" style={{ color: "var(--color-danger)" }}>
                  overpaying
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3C40 0.5 80 5 120 2.5C160 0 200 4 200 3" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                on your loans.
              </h1>

              <p className="text-base leading-relaxed max-w-lg mb-4" style={{ color: "var(--color-text-secondary)" }}>
                Most salaried Indians overpay ₹30,000–₹1,50,000 per year on their loans.
                Check yours in 30 seconds — and see exactly where your money is going.
              </p>

              <p className="text-lg leading-relaxed max-w-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
                Enter your PAN and we&apos;ll pull your credit report. You&apos;ll see
                exactly where your money is going — in 30 seconds.
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-3">
                {["No CIBIL impact", "256-bit encrypted", "3-month free trial"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-bg-card)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-secondary)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-purple)" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Form Card */}
            <div className="lg:col-span-5 animate-slideUp stagger-1">
              <div
                ref={formCardRef}
                className="rounded-2xl p-7 sm:p-8"
                style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
              >
                {isReady && isLoggedIn && user ? (
                  /* Logged-in state */
                  <div className="text-center space-y-5 py-6">
                    <div
                      className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: "var(--color-purple)" }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        Welcome back, <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{user.name}</span>
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "var(--color-purple)" }}
                    >
                      View your dashboard
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ) : step === "details" ? (
                  /* Details form (PAN + Phone only) */
                  <>
                    <h2 className="text-lg font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
                      Check your debt health
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                      Takes 30 seconds. Completely free.
                    </p>

                    {error && (
                      <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "var(--color-danger)" }}>
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>PAN Number</label>
                        <input
                          type="text"
                          value={pan}
                          onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 uppercase tracking-wider"
                          style={{
                            backgroundColor: "var(--color-bg-soft)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                        />
                        {pan && !panRegex.test(pan) && pan.length === 10 && (
                          <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>Format: 5 letters + 4 digits + 1 letter</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>Phone Number</label>
                        <div className="flex">
                          <span
                            className="px-3 py-3 rounded-l-xl text-sm flex items-center"
                            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", borderRight: "none", color: "var(--color-text-muted)" }}
                          >
                            +91
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="9876543210"
                            maxLength={10}
                            className="flex-1 px-4 py-3 rounded-r-xl text-sm transition-all focus:outline-none focus:ring-2"
                            style={{
                              backgroundColor: "var(--color-bg-soft)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-text-primary)",
                            }}
                          />
                        </div>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4"
                          style={{ accentColor: "var(--color-purple)" }}
                        />
                        <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                          I consent to ExitDebt accessing my credit report for debt analysis. Data is encrypted
                          and auto-deleted after 30 days. <Link href="#" className="underline" style={{ color: "var(--color-purple)" }}>Privacy Policy</Link>.
                        </span>
                      </label>
                      <PrimaryButton
                        onClick={handleSendOTP}
                        loading={loading}
                        disabled={!pan || !phone || !consent}
                        className="w-full"
                      >
                        Show Me My Savings →
                      </PrimaryButton>
                      <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
                        Start with a free 3-month trial.
                      </p>
                    </div>
                  </>
                ) : step === "otp" ? (
                  /* OTP verification */
                  <>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                      Verify Your Phone
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                      We sent a 6-digit code to {phone.slice(0, 2)}****{phone.slice(-4)}
                    </p>

                    {error && (
                      <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "var(--color-danger)" }}>
                        {error}
                      </div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          className="w-full px-4 py-3 rounded-xl text-center text-2xl tracking-[0.4em] font-bold transition-all focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: "var(--color-bg-soft)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-primary)",
                          }}
                          autoFocus
                        />
                        <p className="text-xs text-center mt-2" style={{ color: "var(--color-text-muted)" }}>
                          For demo, enter any 6 digits (e.g. 123456)
                        </p>
                      </div>
                      <PrimaryButton
                        onClick={() => handleVerifyOTP(otpCode)}
                        loading={loading}
                        disabled={otpCode.length !== 6}
                        className="w-full"
                      >
                        Verify &amp; Continue →
                      </PrimaryButton>
                      <div className="text-center">
                        <button
                          onClick={handleSendOTP}
                          disabled={loading}
                          className="text-sm transition-colors cursor-pointer hover:underline"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Didn&apos;t receive it? Resend OTP
                        </button>
                      </div>
                      <button
                        onClick={() => { setStep("details"); setError(""); }}
                        className="w-full text-sm transition-colors cursor-pointer"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        ← Back to details
                      </button>
                    </div>
                  </>
                ) : (
                  /* Processing */
                  <div className="py-8 text-center space-y-5">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 border-3 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-purple)" }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Finding where your money is going...</p>
                      <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>This takes about 10 seconds</p>
                    </div>
                    <div className="space-y-2 max-w-xs mx-auto text-left">
                      {["Verifying your identity", "Reading your credit report", "Checking your interest rates", "Calculating your savings"].map(
                        (s, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <div
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ backgroundColor: "var(--color-purple)", animationDelay: `${i * 0.5}s` }}
                            />
                            <span style={{ color: "var(--color-text-secondary)" }}>{s}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="steps" className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>Three steps to clarity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`relative rounded-2xl p-8 hover-lift animate-slideUp stagger-${i + 1}`}
              style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid var(--color-border)" }}
            >
              <span className="text-4xl font-black" style={{ color: "var(--color-blue)" }}>{s.num}</span>
              <h3 className="text-base font-bold mt-4 mb-2" style={{ color: "var(--color-text-primary)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TRUST BAND ───── */}
      <section id="trust" className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>Your data is safe</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>Things you should know</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_POINTS.map((point, i) => (
            <div
              key={point.title}
              className={`rounded-2xl p-7 hover-lift animate-fadeIn stagger-${i + 1}`}
              style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid var(--color-border)" }}
            >
              <span style={{ color: "var(--color-purple)" }}>{TRUST_ICONS[point.icon]}</span>
              <h3 className="text-sm font-bold mt-4 mb-2" style={{ color: "var(--color-text-primary)" }}>{point.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{point.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>Real results</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Real People. Real Savings.</h2>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Here&apos;s what happened when they checked.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 hover-lift animate-slideUp stagger-${i + 1}`}
              style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(115,0,190,0.1)", color: "var(--color-purple)" }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.city}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--color-success)" }}>Saved {t.savings}/year</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>in {t.timeline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── ARTICLES ───── */}
      <section id="articles" className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>Learn more</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>Understand how debt really works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className={`group rounded-2xl p-7 hover-lift animate-slideUp stagger-${i + 1}`}
              style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "1px solid var(--color-border)" }}
            >
              <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white mb-4" style={{ backgroundColor: "var(--color-purple)" }}>
                {article.category}
              </span>
              <h3 className="text-base font-bold mb-2 transition-colors" style={{ color: "var(--color-text-primary)" }}>{article.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{article.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-purple)" }}>
                Read more
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── FAQ PREVIEW ───── */}
      <section id="faq" className="max-w-6xl mx-auto px-8 py-20 lg:py-24" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Your Questions, Answered</h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>No jargon. No fine print. Just clear answers.</p>
          </div>
          <FAQAccordion items={LANDING_FAQS} />
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm font-semibold hover:underline" style={{ color: "var(--color-purple)" }}>
              View all frequently asked questions →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
