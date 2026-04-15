"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, Phone, Check } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
 * Types
 * ═══════════════════════════════════════════════════════════════════════ */

interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  user_state: string | null;
  stage: string;
  priority: string;
  assigned_to: string | null;
  source: string | null;
  tags: string | null;
  follow_up_at: string | null;
  submission_count: number;
  created_at: string;
  updated_at: string | null;
}

interface DevConsoleLog {
  id: string;
  timestamp: string;
  level: "error" | "warn" | "info";
  message: string;
  stack?: string;
}

interface LeadNote {
  id: string;
  user_id: string;
  content: string;
  author: string;
  created_at: string;
}

interface CallbackEntry {
  id: string;
  user_id: string;
  preferred_time: string;
  reason: string | null;
  status: string;
  assigned_to: string | null;
  called_at: string | null;
  outcome: string | null;
  created_at: string;
}

interface TimelineEvent {
  id?: string;
  event_type: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/* ═══════════════════════════════════════════════════════════════════════
 * Constants
 * ═══════════════════════════════════════════════════════════════════════ */

const API_BASE = "/api/admin";
const STAGES = ["new", "contacted", "qualified", "negotiating", "converted", "lost", "spam", "archived"] as const;
const PRIORITIES = ["cold", "warm", "hot", "urgent"] as const;

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  cold:   { bg: "#6B728020", text: "#6B7280" },
  warm:   { bg: "#D9770620", text: "#D97706" },
  hot:    { bg: "#DC262620", text: "#DC2626" },
  urgent: { bg: "#7C3AED20", text: "#7C3AED" },
};

const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  new:         { bg: "#3B82F620", text: "#3B82F6" },
  contacted:   { bg: "#F59E0B20", text: "#F59E0B" },
  qualified:   { bg: "#10B98120", text: "#10B981" },
  negotiating: { bg: "#8B5CF620", text: "#8B5CF6" },
  converted:   { bg: "#05966920", text: "#059669" },
  lost:        { bg: "#9CA3AF20", text: "#9CA3AF" },
  spam:        { bg: "#EF444420", text: "#EF4444" },
  archived:    { bg: "#1F293720", text: "#1F2937" },
};

/* ═══════════════════════════════════════════════════════════════════════
 * Helpers
 * ═══════════════════════════════════════════════════════════════════════ */

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z");
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z");
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function extractDebt(tags: string | null): string {
  if (!tags) return "—";
  try {
    const parsed = JSON.parse(tags);
    if (parsed && parsed.total_debt) {
      const num = Number(parsed.total_debt);
      if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(1)} Cr`;
      if (num >= 100_000) return `₹${(num / 100_000).toFixed(1)} L`;
      if (num >= 1_000) return `₹${(num / 1_000).toFixed(0)}K`;
      return `₹${num.toLocaleString("en-IN")}`;
    }
  } catch {}
  const match = tags.match(/total_debt:(\d+)/);
  if (!match) return "—";
  const num = Number(match[1]);
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(1)} Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(1)} L`;
  if (num >= 1_000) return `₹${(num / 1_000).toFixed(0)}K`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function getColorSet(map: Record<string, { bg: string; text: string }>, key: string) {
  return map[key] ?? { bg: "#6B728020", text: "#6B7280" };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ═══════════════════════════════════════════════════════════════════════
 * Component
 * ═══════════════════════════════════════════════════════════════════════ */

export default function AdminCRMPage() {
  /* ── Auth ── */
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  /* ── Leads ── */
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  /* ── Lead Detail ── */
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  
  /* ── Call Timer ── */
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDurationSecs, setCallDurationSecs] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callStartTime) {
      interval = setInterval(() => {
        setCallDurationSecs(Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000));
      }, 1000);
    } else {
      setCallDurationSecs(0);
    }
    return () => clearInterval(interval);
  }, [callStartTime]);

  /* ── Filters ── */
  const [stageFilter, setStageFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  /* ── Advanced Filters ── */
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minDebt, setMinDebt] = useState("");
  const [maxDebt, setMaxDebt] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("");

  /* ── Logs View ── */
  const [activeTab, setActiveTab] = useState<"leads" | "spam_archive" | "dev_console" | "logs" | "cms">("leads");

  /* ── Blog CMS State ── */
  interface BlogPost {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    tag: string;
    read_time: string;
    is_published: boolean;
    author: string;
    seo_keywords: string | null;
    meta_description: string | null;
    theme_color: string | null;
    featured_image_url: string | null;
    created_at: string;
    updated_at: string;
  }
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    tag: "General",
    read_time: "5 min read",
    is_published: true,
    author: "ExitDebt Team",
    seo_keywords: "",
    meta_description: "",
    theme_color: "#0D9488",
    featured_image_url: "",
  });
  const [blogInputMethod, setBlogInputMethod] = useState<"write" | "markdown" | "upload">("write");
  const [blogSaving, setBlogSaving] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [devLogs, setDevLogs] = useState<DevConsoleLog[]>([]);

  /* ── Error Logger Hook ── */
  useEffect(() => {
    const handleLog = (level: "error"|"warn"|"info", ...args: any[]) => {
      const message = args.map(a => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
      const stack = new Error().stack;
      setDevLogs(prev => [{
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        level,
        message,
        stack
      }, ...prev].slice(0, 100)); // Keep last 100 logs
    };

    const originalError = console.error;
    console.error = (...args) => {
      handleLog("error", ...args);
      originalError.apply(console, args);
    };

    const handleWindowError = (event: ErrorEvent) => {
      handleLog("error", `Uncaught: ${event.message}`, event.filename, event.lineno, event.colno);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleLog("error", `Unhandled Rejection: ${event.reason}`);
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  /* ── Resume saved session & Device ID ── */
  useEffect(() => {
    // Auth Session
    const stored = sessionStorage.getItem("exitdebt_admin_key");
    if (stored) {
      setApiKey(stored);
      setIsAuthenticated(true);
    }
    // Admin Name
    const storedName = sessionStorage.getItem("exitdebt_admin_name");
    if (storedName) {
      setAdminName(storedName);
    }
    // Device ID (persistent across sessions, stored in localStorage)
    let dId = localStorage.getItem("exitdebt_device_id");
    if (!dId) {
      dId = `DEV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      localStorage.setItem("exitdebt_device_id", dId);
    }
    setDeviceId(dId);
  }, []);

  /* ── Auth headers (memoised) ── */
  const authHeaders = useCallback(
    (): HeadersInit => ({
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    }),
    [apiKey],
  );

  /* ── Handle login ── */
  const handleAuth = async () => {
    setAuthError("");
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setAuthError("Please enter the admin API key.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/leads?limit=1`, {
        headers: { "X-API-Key": trimmed },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("exitdebt_admin_key", trimmed);
        fetch(`${API_BASE}/login-log`, { 
          method: "POST",
          headers: { "X-API-Key": trimmed }
        }).catch(() => {});
      } else if (res.status === 403 || res.status === 401) {
        setAuthError("Invalid API key. Please try again.");
      } else {
        setAuthError(`Unexpected response (${res.status}). Contact engineering.`);
      }
    } catch {
      setAuthError("Could not connect to the backend. Is it running?");
    }
  };

  const handleSignOut = () => {
    fetch(`${API_BASE}/logout-log`, { 
      method: "POST",
      headers: authHeaders()
    }).catch(() => {});
    setIsAuthenticated(false);
    setApiKey("");
    setSelectedLead(null);
    setLeads([]);
    sessionStorage.removeItem("exitdebt_admin_key");
  };

  /* ── Fetch leads ── */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (stageFilter) params.set("stage", stageFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      if (searchQuery) params.set("search", searchQuery);
      if (dateFrom) params.set("date_from", new Date(dateFrom).toISOString());
      if (dateTo) params.set("date_to", new Date(dateTo).toISOString());
      if (minDebt) params.set("min_debt", minDebt);
      if (maxDebt) params.set("max_debt", maxDebt);
      if (criticalityFilter) params.set("criticality", criticalityFilter);

      const res = await fetch(`${API_BASE}/leads?${params}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const fetchedLeads = data.items ?? [];
        setLeads(fetchedLeads);
        // Sync selectedLead so it doesn't get stale on refresh
        setSelectedLead(prev => {
            if (!prev) return null;
            const updated = fetchedLeads.find((l: Lead) => l.id === prev.id);
            return updated || prev;
        });
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [stageFilter, priorityFilter, searchQuery, authHeaders]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "leads") fetchLeads();
  }, [isAuthenticated, activeTab, fetchLeads]);

  /* ── Fetch logs ── */
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/logs?limit=100`, { headers: authHeaders() });
      if (res.ok) {
        setAuditLogs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "logs") fetchLogs();
  }, [isAuthenticated, activeTab, fetchLogs]);

  /* ── Fetch blogs when CMS tab is active ── */
  useEffect(() => {
    if (isAuthenticated && activeTab === "cms") {
      setBlogLoading(true);
      fetch(`${API_BASE.replace('/admin', '')}/admin/blogs`, { headers: authHeaders() })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setBlogPosts(data))
        .catch(() => {})
        .finally(() => setBlogLoading(false));
    }
  }, [isAuthenticated, activeTab, authHeaders]);

  /* ── Delete / Archive Lead ── */
  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone here.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        if (selectedLead?.id === id) setSelectedLead(null);
        fetchLeads(); // refresh the list
      } else {
        alert("Failed to delete lead.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lead.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Open lead detail panel ── */
  const openLeadDetail = useCallback(
    async (lead: Lead) => {
      setSelectedLead(lead);
      setNotes([]);
      setCallbacks([]);
      setTimeline([]);
      setShowActions(false);

      const headers = authHeaders();
      const base = `${API_BASE}/leads/${lead.id}`;

      /* Fetch full lead detail (includes notes + callbacks) */
      const [detailRes, tlRes] = await Promise.allSettled([
        fetch(base, { headers }),
        fetch(`${base}/timeline`, { headers }),
      ]);

      if (detailRes.status === "fulfilled" && detailRes.value.ok) {
        const d = await detailRes.value.json();
        setNotes(d.notes ?? []);
        setCallbacks(d.callbacks ?? []);
      }
      if (tlRes.status === "fulfilled" && tlRes.value.ok) {
        const d = await tlRes.value.json();
        setTimeline(d.events ?? []);
      }
    },
    [authHeaders],
  );

  /* ── Add note ── */
  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedLead) return;
    setAddingNote(true);
    try {
      const res = await fetch(`${API_BASE}/leads/${selectedLead.id}/notes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content: newNote.trim(), author: `${adminName || "admin"} (${deviceId})` }),
      });
      if (res.ok) {
        setNewNote("");
        openLeadDetail(selectedLead); // Refresh timeline to reflect new note
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setAddingNote(false);
    }
  };

  /* ── Call Actions ── */
  const handleStartCall = async () => {
    if (!selectedLead) return;
    setCallStartTime(new Date());
    try {
      await fetch(`${API_BASE}/leads/${selectedLead.id}/notes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content: "\u260e\ufe0f Call Started", author: `${adminName || "admin"} (${deviceId})` }),
      });
      openLeadDetail(selectedLead);
    } catch {}
  };

  const handleEndCall = async () => {
    if (!selectedLead || !callStartTime) return;
    const duration = callDurationSecs;
    setCallStartTime(null);
    setCallDurationSecs(0);
    
    const input = prompt("Call Outcome? (answered, no_answer, voicemail, busy, callback_scheduled)") || "answered";
    const comment = prompt("Any call notes/comments?") || "No additional comments";
    const validOutcomes = ["answered", "no_answer", "voicemail", "busy", "callback_scheduled"];
    const outcomeStr = validOutcomes.includes(input.toLowerCase()) ? input.toLowerCase() : "answered";

    try {
      await fetch(`${API_BASE}/leads/${selectedLead.id}/call`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          duration_seconds: duration,
          outcome: outcomeStr,
          notes: `Call Ended (Outcome: ${outcomeStr}, Device: ${deviceId}). Comments: ${comment}`
        })
      });
      openLeadDetail(selectedLead);
    } catch (err) { console.error(err); }
  };

  /* ── Export Lead ── */
  const exportLead = () => {
    if (!selectedLead) return;
    const data = {
      Lead: selectedLead,
      Notes: notes,
      Callbacks: callbacks,
      Timeline: timeline
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExitDebt_Lead_${selectedLead.phone}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowActions(false);
  };

  /* ── Update lead field (stage / priority) ── */
  const updateLeadField = async (leadId: string, field: string, value: string) => {
    try {
      await fetch(`${API_BASE}/leads/${leadId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ [field]: value }),
      });
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, [field]: value } : null));
      }
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    }
  };

  /* ── Log a call outcome ── */
  const logCall = async (callbackId: string, outcome: string) => {
    try {
      await fetch(`${API_BASE}/callbacks/${callbackId}/log`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ outcome, called_at: new Date().toISOString() }),
      });
      if (selectedLead) openLeadDetail(selectedLead);
    } catch (err) {
      console.error("Failed to log call:", err);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
   * RENDER — Auth Gate
   * ═══════════════════════════════════════════════════════════════════ */

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--color-bg)" }}
        role="main"
        aria-label="Admin login"
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          }}
        >
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
            Admin Panel
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
            Enter the admin API key to access the CRM.
          </p>

          <label htmlFor="admin-api-key" className="sr-only">
            Admin API Key
          </label>
          <input
            id="admin-api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="API Key"
            autoComplete="off"
            aria-describedby={authError ? "auth-error" : undefined}
            className="w-full px-4 py-3 rounded-xl text-sm mb-4"
            style={{
              backgroundColor: "var(--color-bg-soft)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          />

          {authError && (
            <p id="auth-error" role="alert" className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">
              {authError}
            </p>
          )}

          <button
            onClick={handleAuth}
            className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-teal)" }}
          >
            Access CRM <ArrowRight className="w-4 h-4 inline" />
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
   * RENDER — CRM Dashboard
   * ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
        role="banner"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
            ExitDebt CRM
          </h1>
          <span
            aria-label={`${leads.length} leads total`}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "var(--color-teal-light)", color: "var(--color-teal)" }}
          >
            {leads.length} leads
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}>
            <button
               onClick={() => setActiveTab("leads")}
               className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${activeTab === "leads" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
               Leads
            </button>
            <button
               onClick={() => setActiveTab("spam_archive")}
               className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${activeTab === "spam_archive" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
               Spam/Archive
            </button>
            <button
               onClick={() => setActiveTab("dev_console")}
               className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${activeTab === "dev_console" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
               Dev Console
            </button>
            <button
               onClick={() => setActiveTab("cms")}
               className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${activeTab === "cms" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
               Blog CMS
            </button>
            <button
               onClick={() => setActiveTab("logs")}
               className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${activeTab === "logs" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
               Admin Logs
            </button>
          </div>
          <button
            onClick={activeTab === "leads" ? fetchLeads : fetchLogs}
            aria-label="Refresh leads list"
            className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
            style={{
              backgroundColor: "var(--color-bg-soft)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleSignOut}
            aria-label="Sign out of admin panel"
            className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer text-red-500 transition-colors hover:bg-red-50"
            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 65px)" }}>
        {activeTab === "leads" || activeTab === "spam_archive" ? (
          <>
            {/* ════════════ Left — Leads List ════════════ */}
            <aside
          className="w-full lg:w-[420px] flex-shrink-0 flex flex-col overflow-hidden"
          style={{ borderRight: "1px solid var(--color-border)" }}
          aria-label="Leads list"
        >
          {/* Filters */}
          <div className="p-4 space-y-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <label htmlFor="lead-search" className="sr-only">Search leads</label>
            <input
              id="lead-search"
              type="search"
              placeholder="Search by name or phone…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--color-bg-soft)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="filter-stage" className="sr-only">Filter by stage</label>
                <select
                  id="filter-stage"
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value="">All Stages</option>
                  {STAGES.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="filter-priority" className="sr-only">Filter by priority</label>
                <select
                  id="filter-priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-bg-soft)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value="">All Priorities</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{capitalize(p)}</option>)}
                </select>
              </div>
            </div>

            <details className="mt-2 group">
              <summary className="text-xs font-semibold cursor-pointer select-none pb-1" style={{ color: "var(--color-text-muted)" }}>
                Advanced Filters <span style={{ color: "var(--color-teal)" }}>▾</span>
              </summary>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex gap-2">
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-2 py-1.5 rounded-lg text-xs" title="From Date" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }} />
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-2 py-1.5 rounded-lg text-xs" title="To Date" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }} />
                </div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min Debt" value={minDebt} onChange={e => setMinDebt(e.target.value)} className="w-full px-2 py-1.5 rounded-lg text-xs" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }} />
                  <input type="number" placeholder="Max Debt" value={maxDebt} onChange={e => setMaxDebt(e.target.value)} className="w-full px-2 py-1.5 rounded-lg text-xs" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }} />
                </div>
                <select value={criticalityFilter} onChange={e => setCriticalityFilter(e.target.value)} className="w-full px-2 py-1.5 rounded-lg text-xs appearance-none cursor-pointer" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
                  <option value="">Any Severity</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
            </details>
          </div>

          {/* Lead card list */}
          <div
            className="flex-1 overflow-y-auto divide-y"
            style={{ borderColor: "var(--color-border)" }}
            role="listbox"
            aria-label="Lead entries"
          >
            {loading ? (
              <div className="p-8 text-center" role="status" aria-label="Loading leads">
                <div className="w-8 h-8 border-[3px] border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Loading leads…</p>
              </div>
            ) : leads.filter(l => (activeTab === "spam_archive") ? ["spam", "archived"].includes(l.stage) : !["spam", "archived"].includes(l.stage)).length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>
                  No leads found
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Try adjusting your filters or wait for new registrations.
                </p>
              </div>
            ) : (
              leads.filter(l => (activeTab === "spam_archive") ? ["spam", "archived"].includes(l.stage) : !["spam", "archived"].includes(l.stage)).map((lead) => {
                const prioColor = getColorSet(PRIORITY_COLORS, lead.priority);
                const stageColor = getColorSet(STAGE_COLORS, lead.stage);
                const isActive = selectedLead?.id === lead.id;

                return (
                  <button
                    key={lead.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => openLeadDetail(lead)}
                    className={`w-full p-4 text-left transition-colors cursor-pointer hover:bg-gray-50 ${
                      isActive ? "bg-teal-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {lead.name}
                        {lead.submission_count > 1 && (
                          <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full inline-block" title="Duplicate Submissions">
                            {lead.submission_count}x inserted
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {lead.assigned_to && (
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                {lead.assigned_to}
                            </span>
                        )}
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                            style={{ backgroundColor: prioColor.bg, color: prioColor.text }}
                        >
                            {lead.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <span>{lead.phone}</span>
                      <span>{[lead.city, lead.user_state].filter(s => s && s.trim().length > 0).join(", ") || "—"}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: stageColor.bg, color: stageColor.text }}
                      >
                        {lead.stage}
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: "var(--color-teal)" }}>
                        {extractDebt(lead.tags)}
                      </span>
                      <time className="text-[10px] ml-auto flex flex-col items-end gap-1" style={{ color: "var(--color-text-muted)" }}>
                        {lead.follow_up_at && (
                          <span className="text-teal-600 font-semibold">Sch: {formatDate(lead.follow_up_at)}</span>
                        )}
                        <span>{formatDate(lead.created_at)}</span>
                      </time>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ════════════ Right — Lead Detail ════════════ */}
        <main className="hidden lg:flex flex-1 overflow-y-auto" aria-label="Lead details">
          {!selectedLead ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center" role="status">
                <p className="text-3xl mb-3" aria-hidden="true"><ArrowLeft className="w-8 h-8" /></p>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  Select a lead to view details
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 space-y-6">
              {/* ── Lead Header Card ── */}
              <section
                className="rounded-xl p-5"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                aria-label={`Lead profile: ${selectedLead.name}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {selectedLead.name}
                      {selectedLead.submission_count > 1 && (
                          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full align-middle font-bold">
                            {selectedLead.submission_count}x inserted
                          </span>
                      )}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {selectedLead.phone} · {[selectedLead.city, selectedLead.user_state].filter(s => s && s.trim().length > 0).join(", ") || "Unknown Location"}
                    </p>
                    {selectedLead.assigned_to && (
                        <p className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-md border border-teal-100 inline-block mt-2 mr-2">
                            Assigned to: {selectedLead.assigned_to}
                        </p>
                    )}
                    {selectedLead.follow_up_at && (
                        <p className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 inline-block mt-2">
                            Scheduled: {formatDate(selectedLead.follow_up_at)}
                        </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold" style={{ color: "var(--color-teal)" }}>
                      {extractDebt(selectedLead.tags)}
                    </p>

                    {/* ── Actions Dropdown ── */}
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(!showActions)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        style={{
                          backgroundColor: "var(--color-bg-soft)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        Actions ▾
                      </button>
                      {showActions && (
                        <div
                          className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg z-50 py-1"
                          style={{
                            backgroundColor: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <button
                            onClick={() => { setShowActions(false); updateLeadField(selectedLead.id, "stage", "spam"); }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 text-gray-700 cursor-pointer"
                          >
                            Mark as Spam
                          </button>
                          <button
                            onClick={() => { setShowActions(false); updateLeadField(selectedLead.id, "stage", "archived"); }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 text-gray-700 cursor-pointer"
                          >
                            Move to Archive
                          </button>
                          <button
                            onClick={() => { setShowActions(false); deleteLead(selectedLead.id); }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 cursor-pointer border-t border-gray-100"
                          >
                            Delete Lead
                          </button>
                          <button
                            onClick={exportLead}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Export Lead Data (JSON)
                          </button>
                          <button
                            onClick={() => { setShowActions(false); window.open(`/admin/intake/${selectedLead.id}`, "_blank"); }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Open Intake Form
                          </button>
                          <button
                            onClick={() => { setShowActions(false); navigator.clipboard.writeText(selectedLead.phone); }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Copy Phone Number
                          </button>
                          <button
                            onClick={() => { setShowActions(false); window.open(`tel:${selectedLead.phone}`); }}
                            className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            Call Lead
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {/* Stage */}
                  <div>
                    <label htmlFor="detail-stage" className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
                      Stage
                    </label>
                    <select
                      id="detail-stage"
                      value={selectedLead.stage}
                      onChange={(e) => updateLeadField(selectedLead.id, "stage", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs appearance-none cursor-pointer font-medium"
                      style={{
                        backgroundColor: getColorSet(STAGE_COLORS, selectedLead.stage).bg,
                        border: `1px solid ${getColorSet(STAGE_COLORS, selectedLead.stage).text}40`,
                        color: getColorSet(STAGE_COLORS, selectedLead.stage).text,
                      }}
                    >
                      {STAGES.map((s) => <option key={s} value={s} style={{ color: "#1a1a1a" }}>{capitalize(s)}</option>)}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label htmlFor="detail-priority" className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
                      Priority
                    </label>
                    <select
                      id="detail-priority"
                      value={selectedLead.priority}
                      onChange={(e) => updateLeadField(selectedLead.id, "priority", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs appearance-none cursor-pointer font-medium"
                      style={{
                        backgroundColor: getColorSet(PRIORITY_COLORS, selectedLead.priority).bg,
                        border: `1px solid ${getColorSet(PRIORITY_COLORS, selectedLead.priority).text}40`,
                        color: getColorSet(PRIORITY_COLORS, selectedLead.priority).text,
                      }}
                    >
                      {PRIORITIES.map((p) => <option key={p} value={p} style={{ color: "#1a1a1a" }}>{capitalize(p)}</option>)}
                    </select>
                  </div>

                  {/* Assign to Admin */}
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
                      Assigned To
                    </span>
                    <div className="flex items-center gap-1.5">
                      {selectedLead.assigned_to ? (
                        <>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ backgroundColor: "#10B98120", color: "#10B981" }}>
                            {selectedLead.assigned_to}
                          </span>
                          <button
                            onClick={() => updateLeadField(selectedLead.id, "assigned_to", "")}
                            className="text-[10px] px-2 py-1 rounded-md cursor-pointer hover:opacity-80"
                            style={{ color: "var(--color-text-muted)" }}
                            title="Unassign"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              let name = adminName;
                              if (!name) {
                                name = prompt("Enter your name (saved for this session):") || "";
                                if (!name) return;
                                setAdminName(name);
                                sessionStorage.setItem("exitdebt_admin_name", name);
                              }
                              updateLeadField(selectedLead.id, "assigned_to", name);
                            }}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors hover:opacity-90"
                            style={{ backgroundColor: "var(--color-teal)", color: "#fff" }}
                          >
                            Assign to myself
                          </button>
                          <button
                            onClick={() => {
                              const name = prompt("Enter team member name:");
                              if (name) updateLeadField(selectedLead.id, "assigned_to", name);
                            }}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-md cursor-pointer transition-colors hover:opacity-80"
                            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                          >
                            Assign to…
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
                      Registered
                    </span>
                    <time className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }} dateTime={selectedLead.created_at ?? ""}>
                      {formatDateTime(selectedLead.created_at)}
                    </time>
                  </div>
                </div>
              </section>

              {/* ── Callbacks ── */}
              <section
                className="rounded-xl p-5"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                aria-label="Scheduled callbacks"
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
                  Scheduled Callbacks
                </h3>

                {callbacks.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No callbacks scheduled.</p>
                ) : (
                  <ul className="space-y-3" role="list">
                    {callbacks.map((cb) => (
                      <li
                        key={cb.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: "var(--color-bg-soft)" }}
                      >
                        <div>
                          <time className="text-xs font-medium block" style={{ color: "var(--color-text-primary)" }} dateTime={cb.preferred_time}>
                            {formatDateTime(cb.preferred_time)}
                          </time>
                          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                            {cb.reason ?? "No reason"} · Status: <strong>{cb.status}</strong>
                          </p>
                        </div>

                        {cb.status === "pending" && (
                          <div className="flex gap-1.5" role="group" aria-label="Call outcome actions">
                            <button
                              onClick={() => logCall(cb.id, "connected")}
                              className="text-[10px] px-2 py-1 rounded-md font-medium cursor-pointer transition-colors hover:opacity-80"
                              style={{ backgroundColor: "#05966915", color: "#059669", border: "1px solid #05966930" }}
                            >
                              <Check className="w-3 h-3 inline" /> Connected
                            </button>
                            <button
                              onClick={() => logCall(cb.id, "no_answer")}
                              className="text-[10px] px-2 py-1 rounded-md font-medium cursor-pointer transition-colors hover:opacity-80"
                              style={{ backgroundColor: "#D9770615", color: "#D97706", border: "1px solid #D9770630" }}
                            >
                              ✗ No Answer
                            </button>
                          </div>
                        )}

                        {cb.outcome && (
                          <span
                            className="text-[10px] font-semibold px-2 py-1 rounded-md"
                            style={{
                              backgroundColor: cb.outcome === "connected" ? "#05966915" : "#D9770615",
                              color: cb.outcome === "connected" ? "#059669" : "#D97706",
                            }}
                            aria-label={`Outcome: ${cb.outcome}`}
                          >
                            {cb.outcome}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* ── Notes ── */}
              <section
                className="rounded-xl p-5"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                aria-label="Lead notes"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Notes
                  </h3>
                  {callStartTime ? (
                    <button
                      onClick={handleEndCall}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1 cursor-pointer transition-colors animate-pulse"
                    >
                      <span className="w-2 h-2 rounded-full bg-white block" />
                      End Call ({Math.floor(callDurationSecs / 60)}:{(callDurationSecs % 60).toString().padStart(2, "0")})
                    </button>
                  ) : (
                    <button
                      onClick={handleStartCall}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded shadow-sm cursor-pointer transition-colors"
                    >
                      ▶ Start Call
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  <label htmlFor="new-note" className="sr-only">Add a note</label>
                  <input
                    id="new-note"
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    placeholder="Add a note…"
                    className="flex-1 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: "var(--color-bg-soft)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote || !newNote.trim()}
                    aria-label="Submit note"
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--color-teal)" }}
                  >
                    {addingNote ? "…" : "Add"}
                  </button>
                </div>

                {notes.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No notes yet.</p>
                ) : (
                  <ul className="space-y-2" role="list">
                    {notes.map((note) => (
                      <li key={note.id} className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-soft)" }}>
                        <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>{note.content}</p>
                        <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                          {note.author} · <time dateTime={note.created_at}>{formatDateTime(note.created_at)}</time>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* ── Timeline ── */}
              <section
                className="rounded-xl p-5"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                aria-label="Lead activity timeline"
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
                  Timeline
                </h3>

                {timeline.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No events yet.</p>
                ) : (
                  <ol className="space-y-2" role="list">
                    {timeline.map((event, i) => (
                      <li key={event.id || `timeline-event-${i}`} className="flex items-start gap-3 p-2">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: "var(--color-teal)" }}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                            {event.event_type.replace(/_/g, " ")}
                          </p>
                          <time className="text-[10px]" style={{ color: "var(--color-text-muted)" }} dateTime={event.timestamp ?? ""}>
                            {formatDateTime(event.timestamp)}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          )}
        </main>
        </>
        ) : activeTab === "cms" ? (
          <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Blog CMS</h2>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>Create, edit, and manage blog posts. Content supports Markdown formatting.</p>
              </div>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setBlogForm({ title: "", slug: "", description: "", content: "", tag: "General", read_time: "5 min read", is_published: true, author: "ExitDebt Team", seo_keywords: "", meta_description: "", theme_color: "#0D9488" });
                  setBlogInputMethod("write");
                  setBlogFormOpen(true);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-teal)" }}
              >
                + New Blog Post
              </button>
            </div>

            {/* ── Blog Form Modal ── */}
            {blogFormOpen && (
              <div className="mb-6 rounded-xl p-6" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                    {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                  </h3>
                  <button
                    onClick={() => setBlogFormOpen(false)}
                    className="text-xs px-3 py-1 rounded-md cursor-pointer hover:opacity-80"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Title</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                        setBlogForm((prev) => ({ ...prev, title, slug }));
                      }}
                      placeholder="Blog post title"
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Slug <span style={{ fontWeight: 400, textTransform: "none" }}>(auto-generated)</span></label>
                    <div
                      className="w-full px-3 py-2 rounded-lg text-sm font-mono"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", minHeight: "38px", display: "flex", alignItems: "center", opacity: 0.75 }}
                    >
                      {blogForm.slug || "type-a-title-above"}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Description</label>
                  <input
                    type="text"
                    value={blogForm.description}
                    onChange={(e) => setBlogForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Short description for the blog listing card"
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Tag / Category</label>
                    <input
                      type="text"
                      value={blogForm.tag}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, tag: e.target.value }))}
                      placeholder="e.g. Credit Cards"
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Read Time</label>
                    <select
                      aria-label="Read Time"
                      value={blogForm.read_time}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, read_time: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={`${m} min read`}>{m} min read</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Author</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="ExitDebt Team"
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Status</label>
                    <select
                      value={blogForm.is_published ? "published" : "draft"}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, is_published: e.target.value === "published" }))}
                      className="w-full px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* ── SEO & Theme Settings (collapsible) ── */}
                <details className="mb-5 rounded-xl" style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}>
                  <summary className="px-4 py-3 cursor-pointer select-none flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-teal)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    SEO & Theme Settings
                  </summary>
                  <div className="px-4 pb-4 pt-2 space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>SEO Keywords</label>
                      <input
                        type="text"
                        value={blogForm.seo_keywords}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, seo_keywords: e.target.value }))}
                        placeholder="debt relief, credit card, EMI management, loan settlement"
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                      />
                      <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>Comma-separated keywords for the &lt;meta name=&quot;keywords&quot;&gt; tag.</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Meta Description <span style={{ fontWeight: 400, textTransform: "none" }}>(SEO)</span></label>
                      <textarea
                        value={blogForm.meta_description}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="A compelling 150-160 character summary for search engine results. Different from the card description."
                        rows={3}
                        maxLength={320}
                        className="w-full px-3 py-2 rounded-lg text-sm resize-y"
                        style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                      />
                      <p className="text-[10px] mt-1 flex justify-between" style={{ color: "var(--color-text-muted)" }}>
                        <span>Shown in Google search results. Falls back to card description if empty.</span>
                        <span style={{ color: blogForm.meta_description.length > 160 ? "#EF4444" : "var(--color-text-muted)" }}>{blogForm.meta_description.length}/160</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Theme Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={blogForm.theme_color || "#0D9488"}
                          onChange={(e) => setBlogForm((prev) => ({ ...prev, theme_color: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                          style={{ backgroundColor: "transparent" }}
                        />
                        <input
                          type="text"
                          value={blogForm.theme_color}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(v) || v === "") {
                              setBlogForm((prev) => ({ ...prev, theme_color: v }));
                            }
                          }}
                          placeholder="#0D9488"
                          maxLength={7}
                          className="w-28 px-3 py-2 rounded-lg text-sm font-mono"
                          style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                        />
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Browser address bar color on mobile</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Featured Image URL</label>
                      <input
                        type="url"
                        value={blogForm.featured_image_url}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, featured_image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 rounded-lg text-sm flex-1"
                        style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                      />
                    </div>
                  </div>
                </details>

                {/* ── Content Input Method Picker ── */}
                <div className="mb-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Content Input Method</label>
                  <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}>
                    <button
                      onClick={() => setBlogInputMethod("write")}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${blogInputMethod === "write" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      ✏️ Write Manually
                    </button>
                    <button
                      onClick={() => setBlogInputMethod("markdown")}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${blogInputMethod === "markdown" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      📝 Markdown
                    </button>
                    <button
                      onClick={() => setBlogInputMethod("upload")}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${blogInputMethod === "upload" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      📁 Upload File
                    </button>
                  </div>
                </div>

                {/* ── Content Area ── */}
                {blogInputMethod === "upload" ? (
                  <div
                    className="mb-5 rounded-xl p-8 text-center transition-colors"
                    style={{ backgroundColor: "var(--color-bg-soft)", border: "2px dashed var(--color-border)" }}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--color-teal)"; }}
                    onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      const file = e.dataTransfer.files[0];
                      if (file && (file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".markdown"))) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const text = ev.target?.result as string;
                          setBlogForm((prev) => ({ ...prev, content: text }));
                          setBlogInputMethod("markdown");
                        };
                        reader.readAsText(file);
                      } else {
                        alert("Please upload a .md, .markdown, or .txt file.");
                      }
                    }}
                  >
                    <p className="text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Drag & drop a Markdown file here</p>
                    <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>Supports .md, .markdown, or .txt files</p>
                    <label className="inline-block px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--color-teal)" }}>
                      Browse Files
                      <input
                        type="file"
                        accept=".md,.markdown,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const text = ev.target?.result as string;
                              setBlogForm((prev) => ({ ...prev, content: text }));
                              setBlogInputMethod("markdown");
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mb-5">
                    <textarea
                      value={blogForm.content}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder={blogInputMethod === "markdown" ? "# My Blog Post\n\nWrite your content in **Markdown** format...\n\n## Section Title\n\nParagraph text here." : "Write your blog post content here...\n\nUse plain text. Each paragraph will be rendered as a separate block."}
                      rows={16}
                      className="w-full px-4 py-3 rounded-xl text-sm font-mono leading-relaxed resize-y"
                      style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    />
                    <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                      {blogInputMethod === "markdown" ? "Content will be rendered as Markdown on the frontend. Supports headings, bold, italic, lists, blockquotes, links, and code blocks." : "Plain text mode. Use Markdown syntax (# headings, **bold**, *italic*, - lists) for richer formatting."}
                    </p>
                  </div>
                )}

                {/* ── Submit ── */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      if (!blogForm.title.trim() || !blogForm.content.trim() || !blogForm.description.trim()) {
                        alert("Please fill in all required fields: Title, Description, and Content.");
                        return;
                      }
                      setBlogSaving(true);
                      try {
                        const url = editingBlog
                          ? `${API_BASE.replace('/admin', '')}/admin/blogs/${editingBlog.id}`
                          : `${API_BASE.replace('/admin', '')}/admin/blogs`;
                        const method = editingBlog ? "PUT" : "POST";
                        const res = await fetch(url, {
                          method,
                          headers: authHeaders(),
                          body: JSON.stringify(blogForm),
                        });
                        if (res.ok) {
                          setBlogFormOpen(false);
                          setEditingBlog(null);
                          // Refresh blog list
                          const listRes = await fetch(`${API_BASE.replace('/admin', '')}/admin/blogs`, { headers: authHeaders() });
                          if (listRes.ok) setBlogPosts(await listRes.json());
                        } else {
                          const err = await res.json().catch(() => ({ detail: "Unknown error" }));
                          alert(`Failed to save: ${err.detail || res.statusText}`);
                        }
                      } catch (err) {
                        console.error("Failed to save blog:", err);
                        alert("Error saving blog post.");
                      } finally {
                        setBlogSaving(false);
                      }
                    }}
                    disabled={blogSaving}
                    className="px-6 py-2.5 rounded-lg text-xs font-bold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--color-teal)" }}
                  >
                    {blogSaving ? "Saving…" : editingBlog ? "Update Post" : "Publish Post"}
                  </button>
                  <button
                    onClick={() => { setBlogFormOpen(false); setEditingBlog(null); }}
                    className="px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors hover:opacity-80"
                    style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── Blog Posts Table ── */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
              <div className="p-4 flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-soft)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>{blogPosts.length} Blog Posts</span>
                <button
                  onClick={async () => {
                    setBlogLoading(true);
                    try {
                      const res = await fetch(`${API_BASE.replace('/admin', '')}/admin/blogs`, { headers: authHeaders() });
                      if (res.ok) setBlogPosts(await res.json());
                    } catch (err) { console.error(err); }
                    finally { setBlogLoading(false); }
                  }}
                  className="text-xs px-3 py-1 bg-white border border-gray-200 rounded font-medium cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ↻ Refresh
                </button>
              </div>

              {blogLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-[3px] border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Loading blog posts…</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead style={{ backgroundColor: "var(--color-bg-soft)", borderBottom: "1px solid var(--color-border)" }}>
                    <tr>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Title</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Slug</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Tag</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Status</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Created</th>
                      <th className="px-4 py-3 font-medium text-right" style={{ color: "var(--color-text-secondary)" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="transition-colors hover:bg-black/5">
                        <td className="px-4 py-3 font-medium max-w-[240px] truncate" style={{ color: "var(--color-text-primary)" }}>{post.title}</td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>{post.slug}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ backgroundColor: "var(--color-teal-light)", color: "var(--color-teal)" }}>
                            {post.tag}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${post.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {post.is_published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "var(--color-text-secondary)" }}>{formatDate(post.created_at)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingBlog(post);
                                setBlogForm({
                                  title: post.title,
                                  slug: post.slug,
                                  description: post.description,
                                  content: post.content,
                                  tag: post.tag,
                                  read_time: post.read_time,
                                  is_published: post.is_published,
                                  author: post.author,
                                  seo_keywords: post.seo_keywords || "",
                                  meta_description: post.meta_description || "",
                                  theme_color: post.theme_color || "#0D9488",
                                  featured_image_url: post.featured_image_url || "",
                                });
                                setBlogInputMethod("markdown");
                                setBlogFormOpen(true);
                              }}
                              className="text-[10px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors hover:opacity-80"
                              style={{ backgroundColor: "var(--color-teal-light)", color: "var(--color-teal)" }}
                            >
                              Edit
                            </button>
                            <a
                              href={`/blogs/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors hover:opacity-80"
                              style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                            >
                              View
                            </a>
                            <button
                              onClick={async () => {
                                if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
                                try {
                                  const res = await fetch(`${API_BASE.replace('/admin', '')}/admin/blogs/${post.id}`, {
                                    method: "DELETE",
                                    headers: authHeaders(),
                                  });
                                  if (res.ok) {
                                    setBlogPosts((prev) => prev.filter((p) => p.id !== post.id));
                                  } else {
                                    alert("Failed to delete blog post.");
                                  }
                                } catch (err) {
                                  console.error(err);
                                  alert("Error deleting blog post.");
                                }
                              }}
                              className="text-[10px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors hover:bg-red-50"
                              style={{ color: "#EF4444", border: "1px solid #EF444430" }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {blogPosts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
                          No blog posts yet. Click &quot;+ New Blog Post&quot; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        ) : activeTab === "dev_console" ? (
          <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "var(--color-bg)" }}>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Developer Error Console</h2>
            <p className="text-xs mb-6" style={{ color: "var(--color-text-secondary)" }}>Frontend errors, warnings, and snapshots are recorded locally during this session.</p>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
              <div className="p-4 flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-soft)" }}>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>{devLogs.length} Events Logged</span>
                  <button onClick={() => setDevLogs([])} className="text-xs px-3 py-1 bg-white border border-gray-200 rounded text-red-600 hover:bg-red-50 font-medium cursor-pointer transition-colors">Clear Logs</button>
              </div>
              <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                {devLogs.map(log => (
                  <li key={log.id} className="p-4" style={{ backgroundColor: log.level === "error" ? "rgba(239, 68, 68, 0.05)" : "transparent" }}>
                    <div className="flex gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${log.level === "error" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`} style={{ alignSelf: "flex-start" }}>
                        {log.level}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>{log.message}</p>
                        {log.stack && (
                           <pre className="text-[10px] p-2 mt-2 rounded overflow-x-auto" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                             {log.stack}
                           </pre>
                        )}
                      </div>
                      <time className="text-xs font-mono whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                        {formatDateTime(log.timestamp)}
                      </time>
                    </div>
                  </li>
                ))}
                {devLogs.length === 0 && (
                   <li className="p-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No errors logged. Keep this tab open to monitor errors from the console.</li>
                )}
              </ul>
            </div>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "var(--color-bg)" }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Admin Activity Logs</h2>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
              <table className="w-full text-left text-sm">
                <thead style={{ backgroundColor: "var(--color-bg-soft)", borderBottom: "1px solid var(--color-border)" }}>
                  <tr>
                    <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Timestamp</th>
                    <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Event Type</th>
                    <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>IP Address</th>
                    <th className="px-4 py-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-black/5">
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--color-text-secondary)" }}>{formatDateTime(log.created_at)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--color-text-primary)" }}>{log.event_type}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>{log.ip_address || "—"}</td>
                      <td className="px-4 py-3">
                        <pre className="text-[10px] p-2 rounded max-w-md overflow-x-auto" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-secondary)" }}>
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>No admin logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
