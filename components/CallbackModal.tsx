"use client";

import { useState, useEffect } from "react";

interface CallbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
    userName: string;
}

const TIME_SLOTS = [
    { id: "morning", label: "Morning", time: "9 AM – 12 PM" },
    { id: "afternoon", label: "Afternoon", time: "12 PM – 5 PM" },
    { id: "evening", label: "Evening", time: "5 PM – 8 PM" },
];

export default function CallbackModal({ isOpen, onClose, reason, userName }: CallbackModalProps) {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [booked, setBooked] = useState(false);
    const [bookedSlot, setBookedSlot] = useState("");

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedSlot(null);
            setBooked(false);
            setBookedSlot("");
        }
    }, [isOpen]);

    // Prevent scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    function handleBook() {
        if (!selectedSlot) return;
        const slot = TIME_SLOTS.find((s) => s.id === selectedSlot);
        setBookedSlot(slot ? `${slot.label} (${slot.time})` : selectedSlot);
        setBooked(true);
        console.log(`[ExitDebt CRM] Callback booked for ${userName}: ${selectedSlot} — Reason: ${reason}`);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 animate-fadeIn"
                style={{ backgroundColor: "rgba(26,26,46,0.5)", backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md rounded-2xl p-6 sm:p-8 animate-scaleIn"
                style={{
                    backgroundColor: "var(--color-bg-card)",
                    boxShadow: "0 8px 48px rgba(0,0,0,0.15)",
                    border: "1px solid var(--color-border)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-100"
                    style={{ color: "var(--color-text-muted)" }}
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!booked ? (
                    <div className="space-y-5">
                        <div className="text-center">
                            <h3
                                className="text-lg font-bold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                Book a Callback
                            </h3>
                            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                                {reason}
                            </p>
                        </div>

                        {/* Time slots */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {TIME_SLOTS.map((slot) => (
                                <label
                                    key={slot.id}
                                    className="relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                                    style={{
                                        borderColor: selectedSlot === slot.id
                                            ? "var(--color-purple)"
                                            : "var(--color-border)",
                                        backgroundColor: selectedSlot === slot.id
                                            ? "rgba(115,0,190,0.04)"
                                            : "var(--color-bg-card)",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="timeslot-modal"
                                        value={slot.id}
                                        checked={selectedSlot === slot.id}
                                        onChange={() => setSelectedSlot(slot.id)}
                                        className="sr-only"
                                        aria-label={`${slot.label} time slot: ${slot.time}`}
                                    />
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: "var(--color-text-primary)" }}
                                    >
                                        {slot.label}
                                    </span>
                                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                        {slot.time}
                                    </span>
                                    {selectedSlot === slot.id && (
                                        <div
                                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: "var(--color-purple)" }}
                                        >
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
                            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:opacity-90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            Confirm Callback
                        </button>

                        <p
                            className="text-xs text-center"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            No commitment required. 100% confidential.
                        </p>
                    </div>
                ) : (
                    <div className="text-center space-y-4 animate-fadeIn">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl"
                            style={{ backgroundColor: "rgba(5,150,105,0.1)" }}
                        >
                            ✓
                        </div>
                        <h3
                            className="text-lg font-bold"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Callback Confirmed!
                        </h3>
                        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                            A specialist will call you <strong>{bookedSlot}</strong> today regarding{" "}
                            <strong>{reason.toLowerCase()}</strong>.
                        </p>
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                            style={{
                                backgroundColor: "rgba(5,150,105,0.06)",
                                border: "1px solid rgba(5,150,105,0.15)",
                                color: "var(--color-success)",
                            }}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            </svg>
                            Confirmation sent to your WhatsApp
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:opacity-90"
                            style={{
                                backgroundColor: "var(--color-bg-soft)",
                                color: "var(--color-text-secondary)",
                                border: "1px solid var(--color-border)",
                            }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
