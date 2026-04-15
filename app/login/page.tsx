"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggedIn } = useAuth();

    const [pan, setPan] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push("/dashboard");
        }
    }, [isLoggedIn, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const normalizedPan = pan.toUpperCase().trim();

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
            setError("Invalid PAN format. Expected: ABCDE1234F (5 letters, 4 digits, 1 letter).");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setError("Please enter a valid 10-digit Indian mobile number.");
            return;
        }

        setLoading(true);
        try {
            // Direct login — bypass OTP for admin-created clients
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pan: normalizedPan, phone }),
            });

            const loginData = await loginRes.json();

            if (!loginRes.ok) {
                throw new Error(loginData.detail || "Login failed. Please check your credentials.");
            }

            // Set auth context with backend data (including JWT access_token)
            login(normalizedPan, phone, loginData);
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl shadow-gray-200/50 border border-gray-100 animate-slideUp">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Enter your PAN and mobile number to access your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">PAN Card Number</label>
                            <div className="relative">
                                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                <input 
                                    type="text" 
                                    maxLength={10}
                                    value={pan}
                                    onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all uppercase"
                                    placeholder="ABCDE1234F"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1.5">Format: 5 letters + 4 digits + 1 letter</p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">+91</span>
                                <input 
                                    type="tel" 
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100/50 text-red-600 text-xs font-bold animate-fadeIn">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && (
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 font-medium">
                            Don&apos;t have an account?{" "}
                            <a href="/get-started" className="text-teal-600 font-bold hover:underline">Get Started</a>
                        </p>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
