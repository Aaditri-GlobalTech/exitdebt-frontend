/**
 * Admin Dashboard — Daily Ops Overview
 * 
 * PRD Section 9.3: Daily ops dashboard showing:
 *  - Hot lead count (high-priority leads needing immediate attention)
 *  - Pipeline funnel (leads by stage)
 *  - Overdue follow-ups
 *  - Won this week (converted leads)
 * 
 * Connects to: GET /api/admin/dashboard
 */
"use client";

import { useState, useEffect } from "react";

/** Shape of the admin dashboard stats from the backend */
interface DashboardStats {
    hot_count: number;
    total_leads: number;
    pipeline: { stage: string; count: number }[];
    overdue_followups: number;
    won_this_week: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = sessionStorage.getItem("access_token") || "";
                const res = await fetch("/api/admin/dashboard", {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load dashboard stats.");
                const data = await res.json();
                setStats(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load.");
                /* Fallback mock data for dev environment */
                setStats({
                    hot_count: 12,
                    total_leads: 247,
                    pipeline: [
                        { stage: "New", count: 48 },
                        { stage: "Contacted", count: 63 },
                        { stage: "Qualified", count: 35 },
                        { stage: "Consultation Done", count: 28 },
                        { stage: "Subscribed", count: 42 },
                        { stage: "Shield Active", count: 18 },
                        { stage: "Settlement", count: 8 },
                        { stage: "Won", count: 5 },
                    ],
                    overdue_followups: 7,
                    won_this_week: 3,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Daily operations overview</p>
                {error && <p className="text-xs text-amber-600 mt-1">(Using mock data — {error})</p>}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Hot Leads", value: stats?.hot_count || 0, color: "bg-red-50 text-red-600", icon: "🔥" },
                    { label: "Total Leads", value: stats?.total_leads || 0, color: "bg-blue-50 text-blue-600", icon: "👥" },
                    { label: "Overdue Follow-ups", value: stats?.overdue_followups || 0, color: "bg-amber-50 text-amber-600", icon: "⏰" },
                    { label: "Won This Week", value: stats?.won_this_week || 0, color: "bg-green-50 text-green-600", icon: "🏆" },
                ].map((m, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center text-lg`}>
                                {m.icon}
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{m.label}</p>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Pipeline Funnel */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Pipeline Funnel</h2>
                <div className="space-y-3">
                    {stats?.pipeline.map((stage, i) => {
                        const maxCount = Math.max(...(stats?.pipeline.map((s) => s.count) || [1]));
                        const widthPercent = Math.max(8, (stage.count / maxCount) * 100);
                        return (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-500 w-40 text-right shrink-0">{stage.stage}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                                        style={{ width: `${widthPercent}%` }}
                                    >
                                        <span className="text-xs font-bold text-white">{stage.count}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
