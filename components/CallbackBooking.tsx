"use client";

import { useState } from "react";

interface CallbackBookingProps {
    userName: string;
}

const TIME_SLOTS = [
    { id: "morning", label: "Morning", time: "9 AM – 12 PM" },
    { id: "afternoon", label: "Afternoon", time: "12 PM – 5 PM" },
    { id: "evening", label: "Evening", time: "5 PM – 8 PM" },
];

export default function CallbackBooking({ userName }: CallbackBookingProps) {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [booked, setBooked] = useState(false);
    const [bookedSlot, setBookedSlot] = useState<string>("");

    function handleBook() {
        if (!selectedSlot) return;
        const slot = TIME_SLOTS.find((s) => s.id === selectedSlot);
        setBookedSlot(slot ? `${slot.label} (${slot.time})` : selectedSlot);
        setBooked(true);
        console.log(`[ExitDebt CRM] Callback booked for ${userName}: ${selectedSlot}`);
    }

    if (booked) {
        return (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-6 sm:p-8 text-center space-y-3 animate-fadeIn">
                <h3 className="text-lg font-semibold text-teal-900">Callback Confirmed</h3>
                <p className="text-sm text-teal-700">
                    A debt specialist will call you <strong>{bookedSlot}</strong> today.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    We&apos;ve sent a confirmation to your WhatsApp
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Talk to a Debt Specialist</h3>
                <p className="text-sm text-gray-400 mt-1">No obligation. We&apos;ll help you understand your options.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => (
                    <label
                        key={slot.id}
                        className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedSlot === slot.id
                                ? "border-teal-500 bg-teal-50/50 shadow-sm"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                    >
                        <input
                            type="radio"
                            name="timeslot"
                            value={slot.id}
                            checked={selectedSlot === slot.id}
                            onChange={() => setSelectedSlot(slot.id)}
                            className="sr-only"
                            aria-label={`${slot.label} time slot: ${slot.time}`}
                        />
                        <span className="text-sm font-medium text-gray-900">{slot.label}</span>
                        <span className="text-xs text-gray-400">{slot.time}</span>
                        {selectedSlot === slot.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </label>
                ))}
            </div>

            <button
                onClick={handleBook}
                disabled={!selectedSlot}
                className="w-full py-3.5 rounded-lg bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 active:bg-teal-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:shadow-md"
            >
                Get My Free Callback
            </button>
        </div>
    );
}
