"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrimaryButton from "@/components/PrimaryButton";

export default function SchedulePage() {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const slots = [
        "Morning (10am – 12pm)",
        "Afternoon (2pm – 5pm)",
        "Evening (6pm – 8pm)",
    ];

    const handleBooking = () => {
        if (!selectedSlot) return;
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setConfirmed(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />
            <main className="min-h-[calc(100vh-180px)] flex items-start justify-center px-4 pt-12 sm:pt-20 pb-12">
                <div className="w-full max-w-md">
                    {!confirmed ? (
                        <div
                            className="rounded-2xl p-6 sm:p-8"
                            style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
                        >
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                                📞 Book a Free Consultation
                            </h2>
                            <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                                Speak to our debt restructuring expert to understand your savings plan.
                            </p>

                            <div className="space-y-3 mb-6">
                                {slots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between cursor-pointer"
                                        style={{
                                            border: selectedSlot === slot
                                                ? "1px solid var(--color-purple)"
                                                : "1px solid var(--color-border)",
                                            backgroundColor: selectedSlot === slot ? "rgba(115,0,190,0.05)" : "transparent",
                                            color: selectedSlot === slot ? "var(--color-purple)" : "var(--color-text-secondary)",
                                            ...(selectedSlot === slot ? { boxShadow: "0 0 0 1px var(--color-purple)" } : {}),
                                        }}
                                    >
                                        <span className="flex items-center gap-2 text-sm">
                                            🕐 {slot}
                                        </span>
                                        {selectedSlot === slot && (
                                            <span className="font-bold" style={{ color: "var(--color-purple)" }}>✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <PrimaryButton
                                onClick={handleBooking}
                                loading={isSubmitting}
                                disabled={!selectedSlot}
                                className="w-full"
                            >
                                Confirm Callback
                            </PrimaryButton>

                            <p className="text-center text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
                                No commitment required. 100% confidential.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="rounded-2xl p-8 text-center"
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
                            <p className="text-base font-semibold mb-6" style={{ color: "var(--color-purple)" }}>
                                {selectedSlot}
                            </p>
                            <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                                Our expert will review your debt profile and discuss savings options. No fees, no pressure.
                            </p>
                            <PrimaryButton onClick={() => router.push("/dashboard")} className="w-full">
                                ← Back to Dashboard
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
