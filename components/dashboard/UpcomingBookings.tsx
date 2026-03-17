"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface Booking {
    id: string;
    scheduled_at: string;
    status: string;
    criticality?: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatBookingDate(isoStr: string) {
    const d = new Date(isoStr);
    const day = DAY_NAMES[d.getDay()];
    const date = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${day}, ${date} ${month} · ${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function UpcomingBookings() {
    const { userId } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        (async () => {
            try {
                // Fetch bookings from the backend using the current user's ID
                const res = await fetch(`/api/onboarding/consultation/bookings?user_id=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.bookings && data.bookings.length > 0) {
                        setBookings(data.bookings);
                    }
                }
            } catch {
                // Silently fail — bookings is a non-critical feature
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    if (loading) return null;

    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-gray-900">Consultation Calls</h3>
                </div>
                <Link
                    href="/schedule"
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                >
                    Book New →
                </Link>
            </div>

            {bookings.length > 0 ? (
                <div className="space-y-3">
                    {bookings.slice(0, 3).map((booking) => (
                        <div
                            key={booking.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{formatBookingDate(booking.scheduled_at)}</p>
                                    {booking.criticality && (
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{booking.criticality}</p>
                                    )}
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                booking.status === "confirmed"
                                    ? "bg-green-50 text-green-600"
                                    : booking.status === "completed"
                                        ? "bg-gray-100 text-gray-500"
                                        : "bg-amber-50 text-amber-600"
                            }`}>
                                {booking.status}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-sm text-gray-400 font-medium mb-3">No upcoming consultations</p>
                    <Link
                        href="/schedule"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 text-teal-600 text-sm font-bold hover:bg-teal-100 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Schedule a Free Call
                    </Link>
                </div>
            )}
        </div>
    );
}
