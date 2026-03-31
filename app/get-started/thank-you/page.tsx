"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
              ✓
            </div>

            <h1
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Thank You, {name}! 🎉
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

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi%2C%20I%20just%20registered%20on%20ExitDebt%20and%20need%20help%20with%20my%20debt."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 cursor-pointer mb-3"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>

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
              ← Back to Home
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
