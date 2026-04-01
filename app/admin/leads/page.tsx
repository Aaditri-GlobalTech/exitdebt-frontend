/**
 * Admin Lead List — Filterable Lead Management
 * 
 * PRD Section 9.3: Lead list with filters by stage, priority, source, 
 * assignment, and date range.
 * 
 * Connects to: GET /api/admin/leads
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/** Lead shape from the backend */
interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    city: string | null;
    user_state: string | null;
    score: number;
    stage: string;
    priority: string;
    source: string;
    assigned_to: string;
    follow_up_at: string | null;
    created_at: string;
}

/** Available pipeline stages for filtering */
const STAGES = ["All", "New", "Contacted", "Qualified", "Consultation Done", "Subscribed", "Shield Active", "Settlement", "Won", "Lost"];

/** Priority levels for filtering */
const PRIORITIES = ["All", "Hot", "Warm", "Cold"];

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* Filter state */
    const [stageFilter, setStageFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const token = sessionStorage.getItem("access_token") || "";
                const res = await fetch("/api/admin/leads", {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load leads.");
                const data = await res.json();
                setLeads(data.leads || []);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load.");
                /* Mock data for development */
                setLeads([
                    { id: "1", name: "Saurabh Kapoor", phone: "9876543210", email: "saurabh@example.com", city: "Mumbai", user_state: "Maharashtra", score: 38, stage: "New", priority: "Hot", source: "Organic", assigned_to: "Kumar", follow_up_at: "2026-03-24T10:00:00Z", created_at: "2026-03-19" },
                    { id: "2", name: "Priya Sharma", phone: "9876543211", email: "priya@example.com", city: "Delhi", user_state: "Delhi", score: 52, stage: "Contacted", priority: "Warm", source: "Reddit", assigned_to: "Vikram", follow_up_at: "2026-03-22T14:30:00Z", created_at: "2026-03-18" },
                    { id: "3", name: "Anil Mehta", phone: "9876543212", email: "anil@example.com", city: "Pune", user_state: "Maharashtra", score: 24, stage: "Qualified", priority: "Hot", source: "X", assigned_to: "Kumar", follow_up_at: null, created_at: "2026-03-17" },
                    { id: "4", name: "Kavitha Reddy", phone: "9876543213", email: "kavitha@example.com", city: "Hyderabad", user_state: "Telangana", score: 67, stage: "Consultation Done", priority: "Cold", source: "Organic", assigned_to: "Vikram", follow_up_at: null, created_at: "2026-03-16" },
                    { id: "5", name: "Rajesh Kumar", phone: "9876543214", email: "rajesh@example.com", city: "Bengaluru", user_state: "Karnataka", score: 41, stage: "Subscribed", priority: "Warm", source: "Organic", assigned_to: "Kumar", follow_up_at: null, created_at: "2026-03-15" },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    /* Apply client-side filters */
    const filteredLeads = leads.filter((lead) => {
        if (stageFilter !== "All" && lead.stage !== stageFilter) return false;
        if (priorityFilter !== "All" && lead.priority !== priorityFilter) return false;
        if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.phone.includes(searchQuery)) return false;
        return true;
    });

    /** Priority badge color mapping */
    const priorityColor = (p: string) => {
        switch (p) {
            case "Hot": return "bg-red-100 text-red-700";
            case "Warm": return "bg-amber-100 text-amber-700";
            case "Cold": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Leads</h1>
                    <p className="text-sm text-gray-400">{filteredLeads.length} leads found</p>
                    {error && <p className="text-xs text-amber-600 mt-1">(Using mock data — {error})</p>}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 w-64"
                />
                <select
                    title="Filter by Stage"
                    aria-label="Filter by Stage"
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-200"
                >
                    {STAGES.map((s) => <option key={s} value={s}>{s === "All" ? "All Stages" : s}</option>)}
                </select>
                <select
                    title="Filter by Priority"
                    aria-label="Filter by Priority"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-200"
                >
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p === "All" ? "All Priorities" : p}</option>)}
                </select>
            </div>

            {/* Lead Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Score</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Stage</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Priority</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Assigned</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Scheduled</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <Link href={`/admin/leads/${lead.id}`} className="font-bold text-gray-900 hover:text-teal-600 transition-colors">
                                        {lead.name}
                                    </Link>
                                    <p className="text-xs text-gray-400">{lead.phone}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {[lead.city, lead.user_state].filter(s => s && s.trim().length > 0).join(", ") || "—"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-bold ${lead.score < 40 ? "text-red-600" : lead.score < 60 ? "text-amber-600" : "text-green-600"}`}>
                                        {lead.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                        {lead.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityColor(lead.priority)}`}>
                                        {lead.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{lead.assigned_to || "—"}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {lead.follow_up_at 
                                        ? new Date(lead.follow_up_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                                        : "—"}
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">
                                    No leads match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
