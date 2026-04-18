"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Types — matches backend DashboardResponse exactly
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface HealthScoreBlock {
    score: number | null;
    category: string | null;
    dti_ratio: number | null;
    avg_rate: number | null;
    savings_est: number | null;
    calculated_at: string | null;
}

interface DebtSummaryBlock {
    total_outstanding: number;
    total_emi: number;
    avg_interest_rate: number;
    active_account_count: number;
    overdue_count: number;
}

interface DebtAccountItem {
    id: string;
    lender_name: string;
    account_type: string;
    outstanding: number;
    interest_rate: number | null;
    emi_amount: number | null;
    status: string;
}

interface FreedomGPSBlock {
    current_months: number;
    optimized_months: number;
    months_saved: number;
    current_debt_free_date: string | null;
    optimized_debt_free_date: string | null;
}

interface InterestLeakBlock {
    total_emi: number;
    to_principal: number;
    to_interest: number;
    avoidable_interest: number;
    interest_ratio: number;
}

interface SalaryCashFlowBlock {
    salary_date: number;
    salary_amount: number;
    total_emi: number;
    after_all_emis: number;
    emi_to_salary_ratio: number;
}

interface ScoreImpactItem {
    lender_name: string;
    account_type: string;
    action: string;
    estimated_score_change: number;
    priority: string;
}

interface FlaggedAccountItem {
    lender_name: string;
    account_type: string;
    outstanding: number;
    interest_rate: number | null;
    reason: string;
}

interface SubscriptionBlock {
    tier: string | null;
    status: string | null;
    billing_period: string | null;
    days_remaining: number;
    expires_at: string | null;
}

interface DashboardData {
    user_id: string;
    user_name: string;
    health_score: HealthScoreBlock;
    credit_score: number | null;
    debt_summary: DebtSummaryBlock;
    debt_accounts: DebtAccountItem[];
    freedom_gps: FreedomGPSBlock;
    interest_leak: InterestLeakBlock;
    salary_cash_flow: SalaryCashFlowBlock;
    score_impact: ScoreImpactItem[];
    flagged_accounts: FlaggedAccountItem[];
    subscription: SubscriptionBlock | null;
    last_updated: string | null;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Helpers
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function formatINR(amount: number | null | undefined): string {
    if (amount == null || isNaN(amount)) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
}

function formatINRFull(amount: number | null | undefined): string {
    if (amount == null || isNaN(amount)) return "₹0";
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function getScoreBand(score: number): { label: string; color: string; bg: string; textColor: string } {
    if (score <= 25) return { label: "Manageable", color: "#059669", bg: "#ecfdf5", textColor: "#065f46" };
    if (score <= 50) return { label: "Stressed", color: "#ca8a04", bg: "#fefce8", textColor: "#854d0e" };
    if (score <= 75) return { label: "At Risk", color: "#ea580c", bg: "#fff7ed", textColor: "#9a3412" };
    return { label: "Critical", color: "#dc2626", bg: "#fef2f2", textColor: "#991b1b" };
}

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Sub-Components
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ScoreGauge({ score, dtiRatio, salaryAmount, totalEmi }: {
    score: number; dtiRatio: number | null; salaryAmount: number; totalEmi: number;
}) {
    const band = getScoreBand(score);
    const percent = Math.min(100, Math.max(0, score));
    const foir = salaryAmount > 0 ? Math.round((totalEmi / salaryAmount) * 100) : null;

    return (
        <div className="db-card p-8 flex flex-col items-center text-center">
            <div className="relative w-40 h-40 mb-5">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 gauge-animate">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={band.color} strokeWidth="7"
                        strokeDasharray={`${percent * 2.64} 264`} strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center counter-reveal">
                    <span className="text-4xl font-black tracking-tight" style={{ color: band.color }}>{score}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/100</span>
                </div>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider"
                style={{ backgroundColor: band.bg, color: band.textColor }}>
                {band.label}
            </span>
            <p className="text-[11px] text-gray-400 font-semibold mt-3 uppercase tracking-wider">Debt Risk Score</p>

            {/* PRD DB-02: FOIR plain-language line */}
            {foir !== null && salaryAmount > 0 && (
                <div className="foir-strip mt-5 text-left w-full">
                    <span className="font-bold">Your EMIs are {formatINRFull(totalEmi)}/month</span> on {formatINRFull(salaryAmount)} income.
                    {" "}FOIR: <span className="font-bold" style={{ color: foir >= 70 ? "#dc2626" : foir >= 50 ? "#ea580c" : "#059669" }}>{foir}%</span>
                    {foir >= 70 && " — most of your income goes to debt."}
                    {foir >= 50 && foir < 70 && " — this is stretching your finances."}
                    {foir < 50 && " — manageable debt load."}
                </div>
            )}

            {dtiRatio != null && (
                <p className="text-xs text-gray-400 mt-2">DTI Ratio: <span className="font-bold text-gray-600">{(dtiRatio * 100).toFixed(0)}%</span></p>
            )}
        </div>
    );
}

function AddLoanPopup({ onClose, userId, token, onSuccess }: {
    onClose: () => void; userId: string; token: string; onSuccess: () => void;
}) {
    const [lender, setLender] = useState("");
    const [outstanding, setOutstanding] = useState("");
    const [emi, setEmi] = useState("");
    const [rate, setRate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lender || !outstanding || !emi) { setError("Lender, outstanding, and EMI are required."); return; }
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/user/app-loans`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    user_id: userId,
                    lender_name: lender,
                    outstanding: parseFloat(outstanding),
                    monthly_emi: parseFloat(emi),
                    interest_rate: rate ? parseFloat(rate) : null,
                }),
            });
            if (!res.ok) throw new Error("Failed to add loan");
            onSuccess();
            onClose();
        } catch {
            setError("Could not add loan. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-black text-gray-900 mb-1">Add an Unlisted Loan</h2>
                <p className="text-sm text-gray-500 mb-6">App loans and unregulated lenders not in your credit report.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Lender / App Name</label>
                        <input type="text" placeholder="e.g. KreditBee, mPokket" value={lender} onChange={e => setLender(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Outstanding (₹)</label>
                            <input type="number" placeholder="50,000" value={outstanding} onChange={e => setOutstanding(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Monthly EMI (₹)</label>
                            <input type="number" placeholder="5,000" value={emi} onChange={e => setEmi(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Interest Rate % (optional)</label>
                        <input type="number" step="0.1" placeholder="Leave blank if unknown" value={rate} onChange={e => setRate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                    </div>
                    {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-all disabled:opacity-50">
                            {submitting ? "Adding..." : "Add Loan — Recalculate Score"}
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UpdateIncomePopup({ onClose, token, onSuccess, currentSalary }: {
    onClose: () => void; token: string; onSuccess: () => void; currentSalary: number;
}) {
    const [income, setIncome] = useState(currentSalary > 0 ? String(currentSalary) : "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(income);
        if (!val || val < 1000) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/user/income`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ monthly_income: val }),
            });
            if (!res.ok) throw new Error("Failed");
            onSuccess();
            onClose();
        } catch {
            /* silent */
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-black text-gray-900 mb-1">Update Monthly Income</h2>
                <p className="text-sm text-gray-500 mb-6">What is your monthly take-home salary? (after taxes and deductions)</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Monthly Salary (₹)</label>
                        <input type="number" min="1000" placeholder="50,000" value={income} onChange={e => setIncome(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500" />
                    </div>
                    <p className="text-xs text-gray-400">This is used only to calculate your Debt Risk Score. Not stored with your lenders.</p>
                    <button type="submit" disabled={submitting}
                        className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-all disabled:opacity-50">
                        {submitting ? "Updating..." : "Continue →"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Dashboard — PRD Screen 6
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function DashboardPage() {
    const { isLoggedIn, isReady, user, userId, token, onboardingComplete } = useAuth();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddLoan, setShowAddLoan] = useState(false);
    const [showUpdateIncome, setShowUpdateIncome] = useState(false);

    useEffect(() => {
        if (!isReady) return;
        if (!isLoggedIn) { router.push("/"); return; }
        if (!onboardingComplete) { router.push("/get-started"); return; }
    }, [isLoggedIn, isReady, onboardingComplete, router]);

    const fetchDashboard = useCallback(async () => {
        if (!userId || !token) return;
        setLoading(true);
        try {
            const salary = user?.salary || 0;
            const salaryDate = user?.salaryDate || 1;
            const res = await fetch(
                `${API_BASE}/api/dashboard/${userId}?salary_amount=${salary}&salary_date=${salaryDate}`,
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
    }, [userId, token, user?.salary, user?.salaryDate]);

    useEffect(() => {
        if (!isReady || !isLoggedIn || !userId || !token) return;
        fetchDashboard();
    }, [isReady, isLoggedIn, userId, token, fetchDashboard]);

    if (!isReady || !isLoggedIn || !user) return null;

    const d = dashboardData;
    const scoreVal = d?.health_score?.score ?? 0;
    const band = getScoreBand(scoreVal);

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Navbar />
            <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 lg:py-12 space-y-7">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fadeIn">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            Hi, {user.name?.split(" ")[0] || "there"}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Here&apos;s your complete debt health analysis.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowUpdateIncome(true)}
                            className="text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-all">
                            Update Income
                        </button>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                            {d?.last_updated ? new Date(d.last_updated).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-sm text-gray-400 font-medium">Loading your dashboard...</p>
                    </div>
                )}

                {!loading && error === "no_data" && (
                    <div className="db-card p-12 text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Dashboard is Being Prepared</h2>
                        <p className="text-sm text-gray-500 font-medium max-w-md mx-auto mb-6">
                            Our team is analyzing your credit report and building your personalized debt health dashboard.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                            Analysis in progress
                        </div>
                    </div>
                )}

                {!loading && error === "fetch_error" && (
                    <div className="db-card p-12 text-center border-red-100">
                        <h2 className="text-lg font-bold text-red-600 mb-2">Unable to Load Dashboard</h2>
                        <p className="text-sm text-gray-500 mb-4">Please try again or contact support.</p>
                        <button onClick={() => fetchDashboard()} className="px-5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-bold hover:bg-teal-600 transition-all">
                            Retry
                        </button>
                    </div>
                )}

                {!loading && d && (
                    <>
                        {/* ━━ Section 1: Score + Summary Stats ━━ */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
                            <div className="lg:col-span-5">
                                <ScoreGauge
                                    score={scoreVal}
                                    dtiRatio={d.health_score.dti_ratio}
                                    salaryAmount={d.salary_cash_flow?.salary_amount ?? 0}
                                    totalEmi={d.debt_summary.total_emi}
                                />
                            </div>
                            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                                {[
                                    { label: "Total Outstanding", value: formatINR(d.debt_summary.total_outstanding), sub: "across all accounts", color: "#dc2626", icon: "📊" },
                                    { label: "Monthly EMI", value: formatINR(d.debt_summary.total_emi), sub: "total obligation", color: "#ea580c", icon: "📅" },
                                    { label: "Active Accounts", value: String(d.debt_summary.active_account_count), sub: `${d.debt_summary.overdue_count} overdue`, color: "#2563eb", icon: "🏦" },
                                    { label: "Avg Interest Rate", value: `${(d.debt_summary.avg_interest_rate ?? 0).toFixed(1)}%`, sub: "weighted average", color: "#7c3aed", icon: "📈" },
                                ].map((card, i) => (
                                    <div key={card.label} className={`db-card p-5 flex flex-col stagger-${i + 1} animate-fadeIn`}>
                                        <span className="text-lg mb-2">{card.icon}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                                        <span className="text-2xl font-black tracking-tight mt-1 stat-value" style={{ color: card.color }}>{card.value}</span>
                                        <span className="text-[11px] text-gray-400 font-medium mt-1">{card.sub}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ━━ Section 2: Debt Summary Table (PRD DB-03) ━━ */}
                        {(d.debt_accounts || []).length > 0 && (
                            <div className="db-card overflow-hidden animate-fadeIn stagger-2">
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                    <div className="db-section-header" style={{ marginBottom: 0 }}>
                                        <div className="db-section-icon bg-blue-50 text-blue-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        </div>
                                        <div>
                                            <div className="db-section-title text-gray-900">Your Debt Accounts</div>
                                            <div className="db-section-subtitle">{d.debt_accounts.length} accounts found in your credit report</div>
                                        </div>
                                    </div>
                                    {/* PRD DB-06: Add Unlisted Loan */}
                                    <button onClick={() => setShowAddLoan(true)}
                                        className="text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-all flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                        Add Unlisted Loan
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="text-left px-5 py-3">Lender</th>
                                                <th className="text-left px-5 py-3">Type</th>
                                                <th className="text-right px-5 py-3">Outstanding</th>
                                                <th className="text-right px-5 py-3">Rate</th>
                                                <th className="text-right px-5 py-3">EMI</th>
                                                <th className="text-center px-5 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {d.debt_accounts.map((acc) => (
                                                <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-5 py-3.5 font-bold text-gray-900">{acc.lender_name}</td>
                                                    <td className="px-5 py-3.5 text-gray-500 capitalize">{acc.account_type.replace(/_/g, " ")}</td>
                                                    <td className="px-5 py-3.5 text-right font-mono font-bold text-gray-900">{formatINRFull(acc.outstanding)}</td>
                                                    <td className="px-5 py-3.5 text-right font-mono text-gray-600">{acc.interest_rate != null ? `${acc.interest_rate}%` : "—"}</td>
                                                    <td className="px-5 py-3.5 text-right font-mono text-gray-600">{formatINRFull(acc.emi_amount)}</td>
                                                    <td className="px-5 py-3.5 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                            acc.status === "overdue" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                                        }`}>
                                                            {acc.status === "overdue" ? "⚠️ Overdue" : "✓ Current"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ━━ Section 3: Interest Leak (PRD DB-04) ━━ */}
                        {d.interest_leak && d.interest_leak.total_emi > 0 && (
                            <div className="db-card p-6 animate-fadeIn stagger-3">
                                <div className="db-section-header">
                                    <div className="db-section-icon bg-amber-50 text-amber-600">💸</div>
                                    <div>
                                        <div className="db-section-title text-gray-900">Interest Leak (This Month)</div>
                                        <div className="db-section-subtitle">How your EMI payments are split</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">EMIs Paid</p>
                                        <p className="text-xl font-black text-gray-900">{formatINRFull(d.interest_leak.total_emi)}</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">To Principal</p>
                                        <p className="text-xl font-black text-emerald-700">{formatINRFull(d.interest_leak.to_principal)}</p>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-4 text-center">
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">To Interest</p>
                                        <p className="text-xl font-black text-red-600">{formatINRFull(d.interest_leak.to_interest)}</p>
                                    </div>
                                </div>
                                {/* Stacked bar */}
                                <div className="interest-bar">
                                    <div className="flex h-full">
                                        <div className="interest-bar-fill bg-emerald-500" style={{ width: `${((d.interest_leak.to_principal / d.interest_leak.total_emi) * 100).toFixed(1)}%` }} />
                                        <div className="interest-bar-fill bg-red-400" style={{ width: `${((d.interest_leak.to_interest / d.interest_leak.total_emi) * 100).toFixed(1)}%` }} />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold mt-2">
                                    <span className="text-emerald-600">Principal ({((d.interest_leak.to_principal / d.interest_leak.total_emi) * 100).toFixed(0)}%)</span>
                                    <span className="text-red-500">Interest ({((d.interest_leak.to_interest / d.interest_leak.total_emi) * 100).toFixed(0)}%)</span>
                                </div>
                                {d.interest_leak.avoidable_interest > 0 && (
                                    <div className="alert-card mt-4 flex items-start gap-3">
                                        <span className="text-lg">⚠️</span>
                                        <div>
                                            <p className="text-sm font-bold text-red-800">
                                                {formatINRFull(d.interest_leak.avoidable_interest)} of that interest was avoidable
                                            </p>
                                            <p className="text-xs text-red-600 mt-0.5">Based on consolidation at 12% benchmark rate</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ━━ Section 4: Salary Day Cash Flow (PRD DB-05) ━━ */}
                        {d.salary_cash_flow && d.salary_cash_flow.salary_amount > 0 && (
                            <div className="db-card p-6 animate-fadeIn stagger-4">
                                <div className="db-section-header">
                                    <div className="db-section-icon bg-blue-50 text-blue-600">💰</div>
                                    <div>
                                        <div className="db-section-title text-gray-900">Salary Day Cash Flow</div>
                                        <div className="db-section-subtitle">What happens to your salary each month</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm font-semibold text-gray-600">Monthly Income</span>
                                        <span className="text-lg font-black text-gray-900">{formatINRFull(d.salary_cash_flow.salary_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                                        <span className="text-sm font-semibold text-red-500">Total EMIs</span>
                                        <span className="text-lg font-black text-red-600">-{formatINRFull(d.salary_cash_flow.total_emi)}</span>
                                    </div>
                                    <div className="cashflow-meter">
                                        <div className={`cashflow-fill ${d.salary_cash_flow.emi_to_salary_ratio > 0.7 ? "bg-red-500" : d.salary_cash_flow.emi_to_salary_ratio > 0.5 ? "bg-amber-500" : "bg-emerald-500"}`}
                                            style={{ width: `${Math.min(100, d.salary_cash_flow.emi_to_salary_ratio * 100).toFixed(0)}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-900">
                                        <span className="text-sm font-bold text-gray-900">Left to Live</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xl font-black ${d.salary_cash_flow.after_all_emis < 10000 ? "text-red-600" : "text-emerald-600"}`}>
                                                {formatINRFull(d.salary_cash_flow.after_all_emis)}
                                            </span>
                                            {d.salary_cash_flow.after_all_emis < 10000 && <span className="text-red-500">⚠️</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ━━ Section 5: Debt Freedom GPS ━━ */}
                        {d.freedom_gps && d.freedom_gps.current_months > 0 && (
                            <div className="db-card p-6 animate-fadeIn stagger-5">
                                <div className="db-section-header">
                                    <div className="db-section-icon bg-teal-50 text-teal-600">🗺️</div>
                                    <div>
                                        <div className="db-section-title text-gray-900">Debt Freedom GPS</div>
                                        <div className="db-section-subtitle">Your path to becoming debt-free</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-red-50 rounded-xl p-4 text-center">
                                        <span className="text-3xl font-black text-red-600">{d.freedom_gps.current_months}</span>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Current Path (months)</p>
                                        {d.freedom_gps.current_debt_free_date && (
                                            <p className="text-[10px] text-gray-400 mt-1">{formatDate(d.freedom_gps.current_debt_free_date)}</p>
                                        )}
                                    </div>
                                    <div className="bg-teal-50 rounded-xl p-4 text-center">
                                        <span className="text-3xl font-black text-teal-700">{d.freedom_gps.optimized_months}</span>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Optimized (months)</p>
                                        {d.freedom_gps.optimized_debt_free_date && (
                                            <p className="text-[10px] text-gray-400 mt-1">{formatDate(d.freedom_gps.optimized_debt_free_date)}</p>
                                        )}
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                        <span className="text-3xl font-black text-emerald-600">{d.freedom_gps.months_saved}</span>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Months Saved</p>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">with restructuring</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ━━ Section 6: Credit Score Impact Predictor ━━ */}
                        {(d.score_impact || []).length > 0 && (
                            <div className="db-card p-6 animate-fadeIn">
                                <div className="db-section-header">
                                    <div className="db-section-icon bg-violet-50 text-violet-600">🎯</div>
                                    <div>
                                        <div className="db-section-title text-gray-900">Credit Score Impact Predictor</div>
                                        <div className="db-section-subtitle">Actions ranked by estimated score improvement</div>
                                    </div>
                                </div>
                                {d.credit_score != null && (
                                    <div className="flex items-center gap-2 mb-4 text-sm">
                                        <span className="text-gray-500 font-medium">Current Credit Score:</span>
                                        <span className="font-black text-lg text-gray-900">{d.credit_score}</span>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {d.score_impact.slice(0, 5).map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                                            <span className={`impact-${item.priority} px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase`}>
                                                {item.priority}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.action}</p>
                                                <p className="text-xs text-gray-400">{item.lender_name} · {item.account_type.replace(/_/g, " ")}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="text-lg font-black text-emerald-600">+{item.estimated_score_change}</span>
                                                <p className="text-[10px] text-gray-400 font-bold">pts est.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ━━ Section 7: Flagged Accounts (PRD DB-07) ━━ */}
                        {(d.flagged_accounts || []).length > 0 && (
                            <div className="alert-card animate-fadeIn">
                                <div className="db-section-header">
                                    <span className="text-xl">⚠️</span>
                                    <div>
                                        <div className="db-section-title text-red-800">Flagged Accounts ({d.flagged_accounts.length})</div>
                                        <div className="db-section-subtitle text-red-600/70">Requires immediate attention</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {d.flagged_accounts.map((flag, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-red-100">
                                            <div>
                                                <span className="text-sm font-bold text-gray-900">{flag.lender_name}</span>
                                                <span className="text-xs text-red-600 ml-2">{flag.reason}</span>
                                            </div>
                                            <span className="font-mono text-sm font-bold text-red-600">{formatINR(flag.outstanding)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ━━ PRD DB-08: Schedule a Free Call CTA ━━ */}
                        <div className="db-card p-6 text-center animate-fadeIn border-teal-100" style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)" }}>
                            <div className="text-3xl mb-3">📞</div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">Schedule a Free Call with a Debt Advisor</h3>
                            <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto mb-5">
                                Talk to an expert who will look at your numbers and tell you exactly what your options are. No obligation.
                            </p>
                            <a href="/schedule" className="inline-flex px-8 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">
                                Schedule a Free Call →
                            </a>
                        </div>

                        {/* ━━ PRD DB-09: Lite/Shield Upgrade CTA ━━ */}
                        <div className="cta-gradient p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white animate-fadeIn">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-1">Unlock More Intelligence</h3>
                                <p className="text-gray-300 text-sm font-medium max-w-md">
                                    Get Debt Freedom GPS, Smart Payment Prioritizer, Credit Score Impact Predictor, and quarterly bureau refreshes.
                                </p>
                            </div>
                            <div className="flex gap-3 relative z-10 flex-shrink-0">
                                <a href="/upgrade?plan=lite" className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all backdrop-blur">
                                    Lite ₹499/mo
                                </a>
                                <a href="/upgrade?plan=shield" className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/30 hover:bg-teal-400 transition-all">
                                    Shield ₹1,999/mo
                                </a>
                            </div>
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <div>© 2026 ExitDebt Technologies Pvt Ltd.</div>
                    <div className="flex gap-6">
                        <a href="/privacy" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-teal-600 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </main>
            <Footer />

            {/* ── Popups ── */}
            {showAddLoan && userId && token && (
                <AddLoanPopup
                    onClose={() => setShowAddLoan(false)}
                    userId={userId}
                    token={token}
                    onSuccess={fetchDashboard}
                />
            )}
            {showUpdateIncome && token && (
                <UpdateIncomePopup
                    onClose={() => setShowUpdateIncome(false)}
                    token={token}
                    currentSalary={user?.salary || 0}
                    onSuccess={() => { fetchDashboard(); }}
                />
            )}
        </div>
    );
}
