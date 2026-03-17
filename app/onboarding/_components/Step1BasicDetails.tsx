"use client";

import React, { useState } from "react";

/* ───── Indian States ───── */
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

interface Step1Props {
  onComplete: (userId: string) => void;
}

export default function Step1BasicDetails({ onComplete }: Step1Props) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) { setError("Full name is required."); return; }
    if (!/^[6-9]\d{9}$/.test(mobile)) { setError("Enter a valid 10-digit mobile number."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    if (!city.trim()) { setError("City is required."); return; }
    if (!state) { setError("Please select your state."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/step-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, mobile, email, city, state }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      onComplete(data.user_id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
        Start Your Debt Analysis
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
        Tell us about yourself to get started.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="onb-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name
          </label>
          <input
            id="onb-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Saurabh Kumar"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent"
          />
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="onb-mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number
          </label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500">
              +91
            </span>
            <input
              id="onb-mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
              maxLength={10}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="onb-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            id="onb-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent"
          />
        </div>

        {/* City + State row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="onb-city" className="block text-sm font-medium text-gray-700 mb-1.5">
              City
            </label>
            <input
              id="onb-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="onb-state" className="block text-sm font-medium text-gray-700 mb-1.5">
              State
            </label>
            <select
              id="onb-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select...</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ backgroundColor: "var(--color-teal)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            "Continue →"
          )}
        </button>

        <p className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          Your data is encrypted and never shared without consent.
        </p>
      </form>
    </div>
  );
}
