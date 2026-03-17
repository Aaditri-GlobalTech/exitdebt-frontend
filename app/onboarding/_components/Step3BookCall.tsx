"use client";

import React, { useState, useEffect } from "react";

interface Step3Props {
  userId: string;
  onComplete: () => void;
}

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

export default function Step3BookCall({ userId, onComplete }: Step3Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [criticality, setCriticality] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(true);

  // Fetch available slots on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/onboarding/consultation/slots");
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
          // Auto-select first date
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

  // Get time slots for selected date
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

  const handleBook = async () => {
    setError("");
    if (!selectedDate || !selectedTime) { setError("Please select a date and time."); return; }
    if (!criticality) { setError("Please indicate your situation severity."); return; }

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
      if (!res.ok) {
        // If they already have a consultation, gracefully skip this step
        if (res.status === 409 && data.detail?.includes("already have a scheduled consultation")) {
          onComplete();
          return;
        }
        throw new Error(data.detail || "Booking failed.");
      }

      onComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not book consultation.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingSlots) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Loading available slots...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
        Book a Free Consultation
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
                    ? "bg-teal text-white border-teal shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal/40"
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
              // Format to 12h
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
                      ? "bg-teal text-white border-teal"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal/40"
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
        <label htmlFor="onb-criticality" className="block text-sm font-medium text-gray-700 mb-1.5">
          How critical is your situation?
        </label>
        <select
          id="onb-criticality"
          value={criticality}
          onChange={(e) => setCriticality(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-transparent appearance-none cursor-pointer"
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

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleBook}
          disabled={loading || !selectedDate || !selectedTime || !criticality}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ backgroundColor: "var(--color-teal)" }}
        >
          {loading ? "Booking..." : "Book Consultation →"}
        </button>

        <button
          onClick={onComplete}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 cursor-pointer"
        >
          I'll book later
        </button>
      </div>

      <p className="text-center text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
        Free · 10 minutes · No obligation
      </p>
    </div>
  );
}
