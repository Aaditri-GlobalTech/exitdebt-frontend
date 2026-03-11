"use client";

import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";
import {
    calculateInterestLeak,
    calculateCashFlow,
} from "@/lib/calculations";
import DashboardScoreGauge from "@/components/dashboard/DashboardScoreGauge";
import DebtSummaryCards from "@/components/dashboard/DebtSummaryCards";
import DebtFreedomGPS from "@/components/dashboard/DebtFreedomGPS";
import InterestLeakReport from "@/components/dashboard/InterestLeakReport";
import SmartPaymentPrioritizer from "@/components/dashboard/SmartPaymentPrioritizer";
import SalaryCashFlow from "@/components/dashboard/SalaryCashFlow";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LiteDashboard({ lastUpdated }: { lastUpdated: Date }) {
    const { user } = useAuth();
    const lastUpdatedStr = lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const { tier } = useSubscription();

    if (!user) return null;

    const interestLeak = calculateInterestLeak(
        user.accounts,
        user.monthlyEmi,
        user.totalOutstanding,
        user.optimalRate
    );

    const cashFlow = calculateCashFlow(
        user.salary,
        user.salaryDate,
        user.accounts
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10 lg:py-12 space-y-10">
                
                {/* Status Banner */}
                <DashboardBanner lastUpdated={lastUpdated} />

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fadeIn">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            Hi, {user.name.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Here is your debt health analysis for today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-teal-100 bg-teal-50/30 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-all">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                            Share on WhatsApp
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 shadow-md shadow-teal-100 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4-4v12" /></svg>
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Top Section: Score & Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-4">
                        <DashboardScoreGauge 
                            score={user.score} 
                            label={user.scoreLabel} 
                            color={user.color} 
                        />
                    </div>
                    <div className="lg:col-span-8">
                        <DebtSummaryCards
                            totalOutstanding={user.totalOutstanding}
                            accounts={user.accounts}
                        />
                    </div>
                </div>

                {/* Mid Section: GPS */}
                <DebtFreedomGPS
                    currentTimeline={user.currentTimeline}
                    optimizedTimeline={user.optimizedTimeline}
                    timelineSaved={user.timelineSaved}
                />

                {/* Reports Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InterestLeakReport leak={interestLeak} />
                    <SmartPaymentPrioritizer accounts={user.accounts} optimalRate={user.optimalRate} />
                </div>

                {/* Timeline Section */}
                <SalaryCashFlow cashFlow={cashFlow} />

                {/* Conditional Tier Banners */}
                {tier === "lite" ? (
                    <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0F172A] text-white shadow-xl shadow-gray-200 animate-slideUp">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold">Activate Shield Plan</h3>
                                    <span className="px-2 py-0.5 rounded-md bg-teal-500 text-[10px] font-bold uppercase tracking-wider text-white">Recommended</span>
                                </div>
                                <p className="text-gray-400 text-sm font-medium opacity-90">Unlock 100% harassment protection and expert legal negotiation today.</p>
                            </div>
                        </div>
                        <Link 
                            href="/upgrade"
                            className="px-8 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all whitespace-nowrap"
                        >
                            Explore Shield →
                        </Link>
                    </div>
                ) : tier === "shield" ? (
                    <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-white border border-teal-100 shadow-sm animate-slideUp">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl">
                                    👨‍💼
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Online" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Your Dedicated Agent</p>
                                <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">Agent Vikram</h3>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +91 98765-43210
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                                Chat with Vikram
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all">
                                Schedule a Call
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Footer Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-teal-500" />
                       Last updated: Today, {lastUpdatedStr}
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-teal-600">Privacy Policy</a>
                        <a href="#" className="hover:text-teal-600">Terms of Service</a>
                        <a href="#" className="hover:text-teal-600">Help Center</a>
                    </div>
                    <div>
                        © 2026 ExitDebt Technologies Pvt Ltd.
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
