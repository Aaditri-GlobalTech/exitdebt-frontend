"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import Step1BasicDetails from "./_components/Step1BasicDetails";
import Step2Verification from "./_components/Step2Verification";
import Step3BookCall from "./_components/Step3BookCall";

/* ───── Types ───── */
type OnboardingStep = 1 | 2 | 3 | "complete";

const STEP_LABELS = [
  { num: 1, title: "Basic Details" },
  { num: 2, title: "Verification" },
  { num: 3, title: "Book a Call" },
];

/* ───── JWT Decoder (base64url → JSON) ───── */
function decodeJwtPayload(token: string): Record<string, string> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // base64url → base64 → decode
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* ───── Component ───── */
function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOnboarding } = useAuth();
  
  const initialStep = Number(searchParams.get("step")) || 1;
  const initialUserId = searchParams.get("userId") || "";

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep as OnboardingStep);
  const [userId, setUserId] = useState<string>(initialUserId);
  const [mobile, setMobile] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate credentials from sessionStorage on mount (runs once)
  useEffect(() => {
    const savedToken = sessionStorage.getItem("onboarding_token");
    const savedMobile = sessionStorage.getItem("onboarding_mobile");
    const savedUserId = sessionStorage.getItem("onboarding_userId");

    if (savedToken) {
      setAccessToken(savedToken);

      // Extract userId from JWT as canonical source of truth
      const payload = decodeJwtPayload(savedToken);
      if (payload?.sub) {
        setUserId(payload.sub);
        // Keep URL in sync
        const params = new URLSearchParams(searchParams.toString());
        if (params.get("userId") !== payload.sub) {
          params.set("userId", payload.sub);
          router.replace(`/onboarding?${params.toString()}`);
        }
      }
    }
    if (savedMobile) setMobile(savedMobile);
    if (savedUserId && !savedToken) setUserId(savedUserId);

    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync step from URL params (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const stepParam = searchParams.get("step");
    if (stepParam) {
      setCurrentStep(Number(stepParam) as OnboardingStep);
    }
  }, [searchParams, hydrated]);

  const handleStep1Complete = (newUserId: string, token: string, newMobile: string) => {
    // 1. Update state FIRST — accessToken must be set before Step2 renders
    setUserId(newUserId);
    setMobile(newMobile);
    setAccessToken(token);
    setCurrentStep(2);

    // 2. Persist to sessionStorage for page-refresh resilience
    sessionStorage.setItem("onboarding_token", token);
    sessionStorage.setItem("onboarding_mobile", newMobile);
    sessionStorage.setItem("onboarding_userId", newUserId);
    
    // 3. Update URL on next tick to avoid race condition —
    //    router.replace can cause re-render before state propagates
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "2");
      params.set("userId", newUserId);
      router.replace(`/onboarding?${params.toString()}`);
    }, 0);
  };

  const handleStep2Complete = () => {
    /**
     * At this point, Step 2 verification is fully done:
     *  - PAN verified ✓
     *  - Mobile OTP verified ✓
     *  - Aadhar OTP verified ✓
     *  - Decentro credit bureau data fetched ✓
     *
     * Mark onboarding as complete so the dashboard becomes accessible.
     */
    completeOnboarding();
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    setCurrentStep("complete");
    // Redirect to dashboard after a brief success message
    /* After onboarding, redirect to the Welcome screen (PRD Screen 4) */
    setTimeout(() => router.push("/welcome"), 3000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20">

          {/* ── Progress Bar ── */}
          {currentStep !== "complete" && (
            <div className="mb-10 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                {STEP_LABELS.map((s, i) => {
                  const isActive = typeof currentStep === "number" && currentStep === s.num;
                  const isDone = typeof currentStep === "number" && currentStep > s.num;
                  return (
                    <div key={s.num} className="flex items-center flex-1">
                      {/* Step circle */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isDone
                              ? "bg-teal text-white"
                              : isActive
                              ? "bg-teal text-white ring-4 ring-teal/20"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isDone ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            s.num
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium hidden sm:block transition-colors ${
                            isActive ? "text-teal-dark" : isDone ? "text-teal" : "text-gray-400"
                          }`}
                        >
                          {s.title}
                        </span>
                      </div>
                      {/* Connector line */}
                      {i < STEP_LABELS.length - 1 && (
                        <div className="flex-1 mx-3">
                          <div
                            className={`h-0.5 rounded transition-all duration-500 ${
                              isDone ? "bg-teal" : "bg-gray-200"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step Card ── */}
          <div
            className="rounded-xl p-8 lg:p-10 border border-gray-100 shadow-2xl animate-scaleIn"
            style={{
              backgroundColor: "var(--color-bg-card)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
            }}
          >
            {currentStep === 1 && (
              <Step1BasicDetails onComplete={handleStep1Complete} />
            )}
            {currentStep === 2 && !hydrated ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
              </div>
            ) : currentStep === 2 && (
              <Step2Verification userId={userId} token={accessToken} initialPhone={mobile} onComplete={handleStep2Complete} />
            )}
            {currentStep === 3 && !hydrated ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
              </div>
            ) : currentStep === 3 && (
              <Step3BookCall userId={userId} token={accessToken} onComplete={handleStep3Complete} />
            )}
            {currentStep === "complete" && (
              <div className="text-center py-12 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
                  Thank you for believing in us!
                </h2>
                <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  Our debt advisor will contact you shortly.
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Redirecting to your dashboard...
                </p>
              </div>
            )}
          </div>

          {/* ── Trust Footer ── */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                256-bit encryption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                DPDP Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
