"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, phone, logout, isReady } = useAuth();

  if (isReady && !isLoggedIn) {
    router.replace("/get-started");
    return null;
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-teal)" }} />
      </div>
    );
  }

  const maskedPhone = phone ? `+91 ${phone.slice(0, 2)}****${phone.slice(-4)}` : "—";

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
          Your Profile
        </h1>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
          {/* Header */}
          <div className="p-6 flex items-center gap-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: "rgba(115,0,190,0.1)", color: "var(--color-teal)" }}
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                {user?.name || "User"}
              </h2>
              <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-text-secondary)" }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-success)" }} />
                Consultation Booked
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Personal</h3>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-teal)" }}>📱</div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Phone</p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{maskedPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-teal)" }}>📍</div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Status</p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    Consultation Scheduled
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Financial</h3>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-teal)" }}>💰</div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Monthly Salary</p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {user && user.salary > 0 ? formatCurrency(user.salary) : "Pending — will be discussed on call"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-teal)" }}>📊</div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--color-text-muted)" }}>Debt Health Score</p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    Pending — assessed after consultation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mx-6 mb-4 p-4 rounded-xl" style={{ backgroundColor: "var(--color-bg-soft)" }}>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              📞 <strong>Our debt expert will call you</strong> at your preferred time to discuss your situation and create a personalized plan.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col sm:flex-row gap-3" style={{ borderTop: "1px solid var(--color-border)" }}>
            <Link
              href="/get-started"
              className="flex-1 text-center py-2.5 px-4 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-teal)" }}
            >
              📅 Book Another Call
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi%20ExitDebt%2C%20I%20need%20help%20with%20my%20debt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors hover:bg-gray-50"
              style={{ border: "1px solid var(--color-border)", color: "#25D366" }}
            >
              💬 WhatsApp Support
            </a>
            <button
              onClick={handleLogout}
              className="flex-1 text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors cursor-pointer hover:bg-gray-50"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
