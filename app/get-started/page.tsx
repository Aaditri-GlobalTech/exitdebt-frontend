"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ───── Constants ───── */

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

const CRITICALITY_OPTIONS = [
  "Slightly struggling",
  "Missing payments",
  "Receiving notices",
  "Severe harassment",
];

const TIME_SLOTS = [
  { hour: 10, label: "10:00 AM" },
  { hour: 11, label: "11:00 AM" },
  { hour: 14, label: "2:00 PM" },
  { hour: 15, label: "3:00 PM" },
  { hour: 18, label: "6:00 PM" },
  { hour: 19, label: "7:00 PM" },
];

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Returns next N weekdays (Mon–Sat) starting from tomorrow. */
function getNextWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // start from tomorrow
  while (days.length < count) {
    if (cursor.getDay() !== 0) { // skip Sundays
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/** Formats a date + hour into an IST-offset ISO string. */
function toISTISOString(date: Date, hour: number): string {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  // Format as ISO with +05:30 offset
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:00:00+05:30`;
}

/* ───── Shared input style ───── */

const inputClassName =
  "w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-transparent";

const inputStyle = {
  backgroundColor: "var(--color-bg-soft)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)",
};

/* ───── Page ───── */

export default function GetStartedPage() {
  const router = useRouter();
  const { onboardUser } = useAuth();

  /* Step 1 fields */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [totalDebt, setTotalDebt] = useState("");
  const [criticality, setCriticality] = useState("");

  /* Step 2 fields */
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [isAsap, setIsAsap] = useState(false);
  const [message, setMessage] = useState("");

  /* Calendar data (computed once) */
  const [availableDays] = useState(() => getNextWeekdays(7));

  /* UI state */
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Step 1 validation ── */
  const validateStep1 = (): boolean => {
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return false;
    }
    if (!city.trim()) {
      setError("City is required.");
      return false;
    }
    if (!state) {
      setError("Please select your state.");
      return false;
    }
    if (!totalDebt || Number(totalDebt) < 10000) {
      setError("Please enter your total debt amount (minimum ₹10,000).");
      return false;
    }
    if (!criticality) {
      setError("Please indicate your situation severity.");
      return false;
    }
    return true;
  };

  /* ── Step 1 → Step 2 ── */
  const handleStep1Next = () => {
    setError("");
    if (validateStep1()) setStep(2);
  };

  /* ── Final submit ── */
  const handleSubmit = async () => {
    setError("");
    if (!isAsap && (!selectedDate || selectedHour === null)) {
      setError("Please select a date and time slot, or choose 'Earliest available'.");
      return;
    }

    // Build the preferred_call_time value
    const preferredCallTime = isAsap
      ? "asap"
      : toISTISOString(selectedDate!, selectedHour!);

    setLoading(true);
    try {
      const res = await fetch("/api/leads/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          state,
          total_debt: Number(totalDebt),
          criticality,
          preferred_call_time: preferredCallTime,
          message: message.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          typeof data.detail === "string"
            ? data.detail
            : Array.isArray(data.detail)
              ? data.detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join(", ")
              : "Something went wrong. Please try again.";
        throw new Error(msg);
      }

      // Establish user session via auth context
      if (data.lead_id && data.name) {
        onboardUser(data.lead_id, data.name, phone.trim());
      }

      // Navigate to thank-you with query params
      const callLabel = isAsap
        ? "Earliest available"
        : `${selectedDate!.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${TIME_SLOTS.find((s) => s.hour === selectedHour)?.label ?? ""}`;
      const params = new URLSearchParams({
        name: name.trim(),
        call: callLabel,
      });
      router.push(`/get-started/thank-you?${params.toString()}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Format debt input display ── */
  const formatDebtDisplay = (value: string) => {
    const num = Number(value);
    if (!num || num < 1000) return "";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return "";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      <main className="min-h-[calc(100vh-180px)] flex items-start justify-center px-4 pt-12 sm:pt-20 pb-12">
        <div className="w-full max-w-md">

          {/* ── Progress indicator ── */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: "var(--color-teal)" }}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="text-sm font-medium" style={{ color: step === 1 ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                Your Details
              </span>
            </div>
            <div
              className="flex-1 h-0.5 rounded-full"
              style={{ backgroundColor: step > 1 ? "var(--color-teal)" : "var(--color-border)" }}
            />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: step === 2 ? "var(--color-teal)" : "var(--color-bg-soft)",
                  color: step === 2 ? "white" : "var(--color-text-muted)",
                  border: step === 2 ? "none" : "1px solid var(--color-border)",
                }}
              >
                2
              </div>
              <span className="text-sm font-medium" style={{ color: step === 2 ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                Book a Call
              </span>
            </div>
          </div>

          {/* ── Form Card ── */}
          <div
            className="rounded-2xl p-6 sm:p-8 animate-fadeIn"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
            }}
          >
            {step === 1 ? (
              /* ── STEP 1: Your Details ── */
              <>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  🚀 Get Started — It&apos;s Free
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Tell us about your situation and we&apos;ll connect you with an expert debt advisor.
                </p>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="gs-name" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                      Full Name
                    </label>
                    <input
                      id="gs-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className={inputClassName}
                      style={inputStyle}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="gs-phone" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                      Phone Number
                    </label>
                    <input
                      id="gs-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={inputClassName}
                      style={inputStyle}
                    />
                  </div>

                  {/* City + State (side by side) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="gs-city" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                        City
                      </label>
                      <input
                        id="gs-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className={inputClassName}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="gs-state" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                        State
                      </label>
                      <select
                        id="gs-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`${inputClassName} appearance-none cursor-pointer`}
                        style={inputStyle}
                      >
                        <option value="">Select...</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Total Debt Amount */}
                  <div>
                    <label htmlFor="gs-debt" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                      Total Outstanding Debt (₹)
                    </label>
                    <div className="relative">
                      <input
                        id="gs-debt"
                        type="number"
                        value={totalDebt}
                        onChange={(e) => setTotalDebt(e.target.value)}
                        placeholder="e.g. 500000"
                        min={10000}
                        className={inputClassName}
                        style={inputStyle}
                      />
                      {totalDebt && Number(totalDebt) >= 1000 && (
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                          style={{ color: "var(--color-teal)" }}
                        >
                          {formatDebtDisplay(totalDebt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Criticality Dropdown */}
                  <div>
                    <label htmlFor="gs-criticality" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                      How critical is your situation?
                    </label>
                    <select
                      id="gs-criticality"
                      value={criticality}
                      onChange={(e) => setCriticality(e.target.value)}
                      className={`${inputClassName} appearance-none cursor-pointer`}
                      style={inputStyle}
                    >
                      <option value="">Select severity...</option>
                      {CRITICALITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-4">
                    {error}
                  </p>
                )}

                {/* Next Button */}
                <button
                  onClick={handleStep1Next}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer mt-6"
                  style={{ backgroundColor: "var(--color-teal)" }}
                >
                  Continue → Book a Call
                </button>

                <p className="text-center text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                  Free · No credit score impact · 100% confidential
                </p>
              </>
            ) : (
              /* ── STEP 2: Book a Call ── */
              <>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  📞 Book a Free Consultation
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  When should our debt expert call you?
                </p>

                {/* Summary of Step 1 */}
                <div
                  className="rounded-xl p-4 mb-6"
                  style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                    Your Profile
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span style={{ color: "var(--color-text-muted)" }}>Name: </span>
                      <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{name}</span>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-muted)" }}>Phone: </span>
                      <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{phone}</span>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-muted)" }}>Location: </span>
                      <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{city}, {state}</span>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-muted)" }}>Debt: </span>
                      <span className="font-semibold" style={{ color: "var(--color-success)" }}>
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(totalDebt))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* ASAP Option */}
                  <button
                    onClick={() => {
                      setIsAsap(!isAsap);
                      if (!isAsap) { setSelectedDate(null); setSelectedHour(null); }
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer border flex items-center gap-2 ${
                      isAsap
                        ? "text-white border-transparent shadow-md"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    style={{
                      backgroundColor: isAsap ? "var(--color-teal)" : "var(--color-bg-soft)",
                      color: isAsap ? "white" : "var(--color-text-secondary)",
                    }}
                    aria-pressed={isAsap}
                    type="button"
                  >
                    ⚡ Earliest available — call me ASAP
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>or pick a date & time</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
                  </div>

                  {/* Date Picker Strip */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                      Select a Date
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1" role="listbox" aria-label="Available dates">
                      {availableDays.map((day) => {
                        const isSelected = selectedDate?.toDateString() === day.toDateString();
                        const isToday = new Date().toDateString() === day.toDateString();
                        return (
                          <button
                            key={day.toISOString()}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedDate(day);
                              setIsAsap(false);
                            }}
                            className={`flex-shrink-0 w-16 py-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                              isSelected
                                ? "text-white border-transparent shadow-md"
                                : "border-gray-200 hover:border-teal-300"
                            }`}
                            style={{
                              backgroundColor: isSelected ? "var(--color-teal)" : "var(--color-bg-soft)",
                              color: isSelected ? "white" : "var(--color-text-secondary)",
                            }}
                            type="button"
                          >
                            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                              {isToday ? "Today" : DAY_NAMES_SHORT[day.getDay()]}
                            </div>
                            <div className="text-lg font-bold leading-tight">{day.getDate()}</div>
                            <div className="text-[10px] opacity-70">{MONTH_NAMES[day.getMonth()].slice(0, 3)}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slot Grid */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                        Select a Time Slot
                      </label>
                      <div className="grid grid-cols-3 gap-2" role="listbox" aria-label="Available time slots">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = selectedHour === slot.hour;
                          return (
                            <button
                              key={slot.hour}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => { setSelectedHour(slot.hour); setIsAsap(false); }}
                              className={`py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                                isSelected
                                  ? "text-white border-transparent shadow-md"
                                  : "border-gray-200 hover:border-teal-300"
                              }`}
                              style={{
                                backgroundColor: isSelected ? "var(--color-teal)" : "var(--color-bg-soft)",
                                color: isSelected ? "white" : "var(--color-text-secondary)",
                              }}
                              type="button"
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Brief Message (optional) */}
                  <div>
                    <label htmlFor="gs-message" className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                      Anything you&apos;d like us to know? <span style={{ color: "var(--color-text-muted)" }}>(optional)</span>
                    </label>
                    <textarea
                      id="gs-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                      placeholder="e.g. I have 3 credit card debts and 1 personal loan..."
                      rows={3}
                      className={inputClassName}
                      style={{ ...inputStyle, resize: "none" as const }}
                    />
                    <p className="text-right text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                      {message.length}/500
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-4">
                    {error}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setStep(1); setError(""); }}
                    className="flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                    style={{
                      backgroundColor: "var(--color-bg-soft)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || (!isAsap && (!selectedDate || selectedHour === null))}
                    className="flex-[2] py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={{ backgroundColor: "var(--color-teal)" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Book Free Consultation →"
                    )}
                  </button>
                </div>

                <p className="text-center text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                  Free · 10 minutes · No obligation
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
