"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface DashboardData {
    health_score: { score: number; label: string; color: string; dti_ratio: number | null };
    debt_summary: {
        total_outstanding: number;
        monthly_emi: number;
        active_accounts: number;
        avg_interest_rate: number;
        credit_utilization: number;
        accounts: Array<{
            lender: string;
            type: string;
            outstanding: number;
            interest_rate: number;
            emi: number;
            status: string;
            dpd: number;
        }>;
    };
    debt_freedom_gps: { current_months: number; optimized_months: number; months_saved: number } | null;
    interest_leak: { total_leak: number; potential_savings: number } | null;
    flagged_accounts: Array<{ lender: string; reason: string; outstanding: number }>;
}

function formatINR(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
}

function ScoreGauge({ score, label, color }: { score: number; label: string; color: string }) {
    const colorMap: Record<string, string> = {
        green: "#16a34a", yellow: "#ca8a04", orange: "#ea580c", red: "#dc2626"
    };
    const strokeColor = colorMap[color] || "#6b7280";
    const percent = Math.min(100, Math.max(0, score));

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="relative w-36 h-36 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={strokeColor} strokeWidth="8"
                        strokeDasharray={`${percent * 2.64} 264`} strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 1s ease-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: strokeColor }}>{score}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">/100</span>
                </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
                backgroundColor: `${strokeColor}15`, color: strokeColor
            }}>{label}</span>
            <p className="text-[11px] text-gray-400 font-medium mt-2">Debt Health Score</p>
        </div>
    );
}

export default function DashboardPage() {
    const { isLoggedIn, isReady, user, userId, token, onboardingComplete } = useAuth();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isReady) return;
        if (!isLoggedIn) { router.push("/"); return; }
        if (!onboardingComplete) { router.push("/get-started"); return; }
    }, [isLoggedIn, isReady, onboardingComplete, router]);

    useEffect(() => {
        if (!isReady || !isLoggedIn || !userId || !token) return;

        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const salary = user?.salary || 0;
                const salaryDate = user?.salaryDate || 1;
                const res = await fetch(
                    `/api/dashboard/${userId}?salary_amount=${salary}&salary_date=${salaryDate}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) {
                    if (res.status === 404) {
                        setDashboardData(null);
                        setError("no_data");
                    } else {
                        throw new Error("Failed to load dashboard data");
                    }
                } else {
                    const data = await res.json();
                    setDashboardData(data);
                    setError(null);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("fetch_error");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [isReady, isLoggedIn, userId, token, user?.salary, user?.salaryDate]);

    if (!isReady || !isLoggedIn || !user) return null;

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-10 lg:py-12 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fadeIn">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            Hi, {user.name.split(" ")[0]}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Here is your debt health analysis.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        Last updated: {new Date().toLocaleDateString("en-IN")}
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-sm text-gray-400 font-medium">Loading your dashboard...</p>
                    </div>
                )}

                {!loading && error === "no_data" && (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Dashboard is Being Prepared</h2>
                        <p className="text-sm text-gray-500 font-medium max-w-md mx-auto mb-6">
                            Our team is analyzing your credit report and building your personalized debt health dashboard. You&apos;ll receive a notification once it&apos;s ready.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Analysis in progress
                        </div>
                    </div>
                )}

                {!loading && error === "fetch_error" && (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-red-100 text-center">
                        <h2 className="text-lg font-bold text-red-600 mb-2">Unable to Load Dashboard</h2>
                        <p className="text-sm text-gray-500 mb-4">Please try again or contact support.</p>
                        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-bold hover:bg-teal-600 transition-all">
                            Retry
                        </button>
                    </div>
                )}

                {!loading && dashboardData && (
                    <>
                        {/* Score + Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                            <div className="lg:col-span-4">
                                <ScoreGauge
                                    score={dashboardData.health_score.score}
                                    label={dashboardData.health_score.label}
                                    color={dashboardData.health_score.color}
                                />
                            </div>
                            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Debt", value: formatINR(dashboardData.debt_summary.total_outstanding), color: "#dc2626" },
                                    { label: "Monthly EMI", value: formatINR(dashboardData.debt_summary.monthly_emi), color: "#ea580c" },
                                    { label: "Active Loans", value: String(dashboardData.debt_summary.active_accounts), color: "#2563eb" },
                                    { label: "Avg Rate", value: `${dashboardData.debt_summary.avg_interest_rate.toFixed(1)}%`, color: "#7c3aed" },
                                ].map((card) => (
                                    <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{card.label}</span>
                                        <span className="text-xl font-bold" style={{ color: card.color }}>{card.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Debt Freedom GPS */}
                        {dashboardData.debt_freedom_gps && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Debt Freedom GPS
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <span className="text-2xl font-bold text-red-500">{dashboardData.debt_freedom_gps.current_months}</span>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Current (months)</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-2xl font-bold text-teal-600">{dashboardData.debt_freedom_gps.optimized_months}</span>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Optimized (months)</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-2xl font-bold text-green-600">{dashboardData.debt_freedom_gps.months_saved}</span>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Months Saved</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accounts Table */}
                        {dashboardData.debt_summary.accounts.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                                <div className="p-5 border-b border-gray-50">
                                    <h3 className="text-sm font-bold text-gray-900">Your Debt Accounts</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="text-left px-5 py-3">Lender</th>
                                                <th className="text-left px-5 py-3">Type</th>
                                                <th className="text-right px-5 py-3">Outstanding</th>
                                                <th className="text-right px-5 py-3">Rate</th>
                                                <th className="text-right px-5 py-3">EMI</th>
                                                <th className="text-center px-5 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {dashboardData.debt_summary.accounts.map((acc, i) => (
                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-3 font-semibold text-gray-900">{acc.lender}</td>
                                                    <td className="px-5 py-3 text-gray-500">{acc.type}</td>
                                                    <td className="px-5 py-3 text-right font-mono font-bold text-gray-900">{formatINR(acc.outstanding)}</td>
                                                    <td className="px-5 py-3 text-right font-mono text-gray-600">{acc.interest_rate}%</td>
                                                    <td className="px-5 py-3 text-right font-mono text-gray-600">{formatINR(acc.emi)}</td>
                                                    <td className="px-5 py-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                            acc.dpd > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                                                        }`}>
                                                            {acc.dpd > 0 ? `${acc.dpd} DPD` : "Current"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Flagged Accounts */}
                        {dashboardData.flagged_accounts.length > 0 && (
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 animate-fadeIn">
                                <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Flagged Accounts ({dashboardData.flagged_accounts.length})
                                </h3>
                                <div className="space-y-2">
                                    {dashboardData.flagged_accounts.map((flag, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-red-100">
                                            <div>
                                                <span className="text-sm font-bold text-gray-900">{flag.lender}</span>
                                                <span className="text-xs text-red-600 ml-2">{flag.reason}</span>
                                            </div>
                                            <span className="font-mono text-sm font-bold text-red-600">{formatINR(flag.outstanding)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0F172A] text-white shadow-xl animate-fadeIn">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Need Expert Help?</h3>
                                <p className="text-gray-400 text-sm font-medium">Activate Shield Plan for dedicated harassment protection and legal negotiation.</p>
                            </div>
                            <a href="/upgrade" className="px-8 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all whitespace-nowrap">
                                Explore Plans →
                            </a>
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <div>© 2026 ExitDebt Technologies Pvt Ltd.</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-teal-600">Privacy Policy</a>
                        <a href="#" className="hover:text-teal-600">Terms of Service</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
