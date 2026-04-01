"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CALL_TIME_LABELS: Record<string, string> = {
  asap: "as soon as possible",
  morning: "in the morning (10 AM – 12 PM)",
  afternoon: "in the afternoon (2 PM – 4 PM)",
  evening: "in the evening (6 PM – 8 PM)",
};

function ThankYouContent() {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") || "there";
  const callTime = params.get("call") || "asap";
  const callLabel = CALL_TIME_LABELS[callTime] || "soon";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      <main className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl p-8 text-center animate-scaleIn"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
            }}
          >
            {/* Success icon */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
              style={{ backgroundColor: "rgba(5,150,105,0.1)", color: "var(--color-success)" }}
            >
              <Check className="w-8 h-8" />
            </div>

            <h1
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Thank You, {name}!
            </h1>

            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Your request has been received. Our expert debt advisor will call you{" "}
              <span className="font-semibold" style={{ color: "var(--color-teal)" }}>
                {callLabel}
              </span>
              .
            </p>

            <p
              className="text-xs mb-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              We&apos;ll review your profile before the call so we can provide the most relevant advice.
            </p>

            {/* What to expect */}
            <div
              className="rounded-xl p-5 mb-8 text-left"
              style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
                What to Expect
              </p>
              <ul className="space-y-2.5">
                {[
                  "A 10-minute confidential call with no obligations",
                  "Personalized debt assessment based on your situation",
                  "Clear options for reducing interest and getting debt-free faster",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-success)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Back to Home */}
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: "var(--color-bg-soft)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              <ArrowLeft className="w-4 h-4 inline" /> Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
