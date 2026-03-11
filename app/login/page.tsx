"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggedIn } = useAuth();

    const [step, setStep] = useState<1 | 2>(1); // 1: Mobile, 2: OTP
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push("/dashboard");
        }
    }, [isLoggedIn, router]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        setLoading(true);
        try {
            // Send OTP directly — never reveal whether account exists
            const otpRes = await fetch("/api/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            if (!otpRes.ok) {
                throw new Error("Failed to send OTP. Please try again.");
            }

            setStep(2);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp_code: otp }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Invalid OTP.");
            }

            // In our current mock/simple AuthContext, login just needs a "PAN" or similar
            // For now, we'll simulate a login. We might need a real PAN or we use a dummy one for existing users.
            // Since we don't have the user's PAN here, we'll use a placeholder or update AuthContext later.
            // For this session, let's assume login() marks them as logged in.
            login("LOGGEDIN_USER", phone); // Placeholder PAN for now
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Verification failed.");
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
                            {step === 1 ? "Enter your mobile to sign in" : `Enter the 6-digit OTP sent to +91 ${phone}`}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
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
                                {loading ? "Checking..." : "Next Step"}
                                {!loading && (
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">6-Digit OTP</label>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100/50 text-red-600 text-xs font-bold animate-fadeIn">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-all shadow-lg shadow-teal-100 disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Verify & Login"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)}
                                    className="text-xs font-bold text-gray-400 hover:text-teal-600 transition-colors"
                                >
                                    Change phone number
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
