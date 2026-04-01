"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";

interface Slot {
  date: string;
  time: string;
  available: boolean;
}

const CRITICALITY_OPTIONS = [
  "Slightly struggling",
  "Missing payments",
  "Receiving notices",
  "Severe harassment",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SchedulePage() {
  const { userId, logout } = useAuth();
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [criticality, setCriticality] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  // Fetch available slots on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/onboarding/consultation/slots");
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
          const firstDate = data.slots[0]?.date;
          if (firstDate) setSelectedDate(firstDate);
        }
      } catch {
        setError("Could not load available slots.");
      } finally {
        setFetchingSlots(false);
      }
    })();
  }, []);

  // Get unique dates
  const uniqueDates = [...new Set(slots.map((s) => s.date))];

  // Get available time slots for selected date
  const timeSlotsForDate = slots.filter((s) => s.date === selectedDate && s.available);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return {
      day: DAY_NAMES[d.getDay()],
      date: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
    };
  };

  const handleBooking = async () => {
    setError("");
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time.");
      return;
    }
    if (!criticality) {
      setError("Please indicate your situation severity.");
      return;
    }

    if (!userId) {
      setError("Please sign up or log in before booking a consultation.");
      return;
    }

    setLoading(true);
    try {
      const scheduledAt = `${selectedDate}T${selectedTime}:00`;
      const res = await fetch("/api/onboarding/consultation/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          scheduled_at: scheduledAt,
          criticality,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Booking failed.");
      setConfirmed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not book consultation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />
      <main className="min-h-[calc(100vh-180px)] flex items-start justify-center px-4 pt-12 sm:pt-20 pb-12">
        <div className="w-full max-w-md">
          {fetchingSlots ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Loading available slots...</p>
            </div>
          ) : !confirmed ? (
            <div
              className="rounded-2xl p-6 sm:p-8 animate-fadeIn"
              style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
            >
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
                <Phone className="w-5 h-5 inline mr-1" /> Book a Free Consultation
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Schedule a 10-minute call with our expert debt advisors.
              </p>

              {/* ── Date Picker (Horizontal Scroll) ── */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a Date</label>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {uniqueDates.map((dateStr) => {
                    const { day, date, month } = formatDate(dateStr);
                    const isSelected = dateStr === selectedDate;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                        className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-teal-500 text-white border-teal-500 shadow-md"
                            : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <div className="text-[10px] font-medium uppercase">{day}</div>
                        <div className="text-lg font-bold">{date}</div>
                        <div className="text-[10px] uppercase">{month}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Time Slots Grid ── */}
              {selectedDate && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select a Time</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                    {timeSlotsForDate.map((slot) => {
                      const isSelected = slot.time === selectedTime;
                      const [h, m] = slot.time.split(":").map(Number);
                      const ampm = h >= 12 ? "PM" : "AM";
                      const h12 = h % 12 || 12;
                      const display = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;

                      return (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-teal-500 text-white border-teal-500"
                              : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                          }`}
                        >
                          {display}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Criticality Dropdown ── */}
              <div className="mb-5">
                <label htmlFor="schedule-criticality" className="block text-sm font-medium text-gray-700 mb-1.5">
                  How critical is your situation?
                </label>
                <select
                  id="schedule-criticality"
                  value={criticality}
                  onChange={(e) => setCriticality(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Select severity...</option>
                  {CRITICALITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={loading || !selectedDate || !selectedTime || !criticality}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: "var(--color-teal)" }}
              >
                {loading ? "Booking..." : "Book Consultation →"}
              </button>

              <p className="text-center text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                Free · 10 minutes · No obligation
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 text-center animate-fadeIn"
              style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                style={{ backgroundColor: "rgba(5,150,105,0.1)", color: "var(--color-success)" }}
              >
                ✓
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                Callback Confirmed!
              </h2>
              <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                We&apos;ll call you during:
              </p>
              <p className="text-base font-semibold mb-2" style={{ color: "var(--color-teal)" }}>
                {(() => {
                  const { day, date, month } = formatDate(selectedDate);
                  const [h, m] = selectedTime.split(":").map(Number);
                  const ampm = h >= 12 ? "PM" : "AM";
                  const h12 = h % 12 || 12;
                  return `${day}, ${date} ${month} at ${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
                })()}
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Our expert will review your debt profile and discuss savings options. No fees, no pressure.
              </p>
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--color-teal)" }}
              >
                ← Back to Home
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
