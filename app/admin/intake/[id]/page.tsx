"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════════
 * Types & Constants
 * ═══════════════════════════════════════════════════════════════════════ */

interface LeadDetail {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  user_state: string | null;
  stage: string;
  priority: string;
  tags: string | null;
  salary: number | null;
  salary_date: number | null;
  other_income: number | null;
  created_at: string;
}

interface CustomField {
  key: string;
  value: string;
}

const API_BASE = "/api/admin";
const STAGES = ["new", "contacted", "qualified", "negotiating", "converted", "lost"] as const;
const PRIORITIES = ["cold", "warm", "hot", "urgent"] as const;

const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  new:         { bg: "#3B82F620", text: "#3B82F6" },
  contacted:   { bg: "#F59E0B20", text: "#F59E0B" },
  qualified:   { bg: "#10B98120", text: "#10B981" },
  negotiating: { bg: "#8B5CF620", text: "#8B5CF6" },
  converted:   { bg: "#05966920", text: "#059669" },
  lost:        { bg: "#9CA3AF20", text: "#9CA3AF" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  cold:   { bg: "#6B728020", text: "#6B7280" },
  warm:   { bg: "#D9770620", text: "#D97706" },
  hot:    { bg: "#DC262620", text: "#DC2626" },
  urgent: { bg: "#7C3AED20", text: "#7C3AED" },
};

/* ═══════════════════════════════════════════════════════════════════════
 * Helpers
 * ═══════════════════════════════════════════════════════════════════════ */

function parseCustomFields(tags: string | null): CustomField[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    // Legacy comma-separated format — show as single field
    return tags.includes(":") ? [{ key: tags.split(":")[0], value: tags.split(":").slice(1).join(":") }] : [];
  }
}

function serializeCustomFields(fields: CustomField[], existingTags: string | null): string {
  // Preserve legacy tags (like total_debt:500000) and add custom fields
  const legacyParts: string[] = [];
  if (existingTags) {
    try {
      JSON.parse(existingTags);
      // It's already JSON — the custom fields ARE the tags
    } catch {
      // Legacy format — preserve as-is
      legacyParts.push(existingTags);
    }
  }

  const customJson = JSON.stringify(fields.filter(f => f.key.trim()));
  return legacyParts.length > 0 ? `${legacyParts.join(",")}\n${customJson}` : customJson;
}

/* ═══════════════════════════════════════════════════════════════════════
 * Component
 * ═══════════════════════════════════════════════════════════════════════ */

export default function AdminIntakePage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // Auth
  const [apiKey, setApiKey] = useState("");
  const [authed, setAuthed] = useState(false);

  // Lead data
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editable fields
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [userState, setUserState] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryDate, setSalaryDate] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [stage, setStage] = useState("");
  const [priority, setPriority] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--color-bg-soft)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border)",
  };

  const headers = useCallback(() => ({
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  }), [apiKey]);

  // Fetch lead
  const fetchLead = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, { headers: headers() });
      if (res.status === 401 || res.status === 403) {
        setAuthed(false);
        setError("Invalid API key.");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch lead.");
      const data = await res.json();
      setLead(data);
      setEmail(data.email || "");
      setCity(data.city || "");
      setUserState(data.user_state || "");
      setSalary(data.salary?.toString() || "");
      setSalaryDate(data.salary_date?.toString() || "");
      setOtherIncome(data.other_income?.toString() || "");
      setStage(data.stage || "new");
      setPriority(data.priority || "medium");
      setCustomFields(parseCustomFields(data.tags));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [leadId, headers]);

  useEffect(() => {
    if (authed && leadId) fetchLead();
  }, [authed, leadId, fetchLead]);

  // Save
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload: Record<string, unknown> = {};
      if (email !== (lead?.email || "")) payload.email = email;
      if (city !== (lead?.city || "")) payload.city = city;
      if (userState !== (lead?.user_state || "")) payload.user_state = userState;
      if (salary && salary !== (lead?.salary?.toString() || "")) payload.salary = Number(salary);
      if (salaryDate && salaryDate !== (lead?.salary_date?.toString() || "")) payload.salary_date = Number(salaryDate);
      if (otherIncome && otherIncome !== (lead?.other_income?.toString() || "")) payload.other_income = Number(otherIncome);
      if (stage !== lead?.stage) payload.stage = stage;
      if (priority !== lead?.priority) payload.priority = priority;

      // Custom fields → tags
      const serialized = serializeCustomFields(customFields, lead?.tags || null);
      if (serialized !== (lead?.tags || "")) payload.tags = serialized;

      if (Object.keys(payload).length === 0) {
        setError("No changes to save.");
        setSaving(false);
        return;
      }

      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save.");
      }

      // Save note if provided
      if (noteContent.trim()) {
        await fetch(`${API_BASE}/leads/${leadId}/notes`, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({
            author: "Admin",
            content: noteContent.trim(),
            note_type: "call_log",
          }),
        });
        setNoteContent("");
      }

      setSuccess("Changes saved successfully!");
      fetchLead(); // Refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // Custom field handlers
  const addCustomField = () => setCustomFields(prev => [...prev, { key: "", value: "" }]);
  const removeCustomField = (idx: number) => setCustomFields(prev => prev.filter((_, i) => i !== idx));
  const updateCustomField = (idx: number, field: "key" | "value", val: string) =>
    setCustomFields(prev => prev.map((f, i) => i === idx ? { ...f, [field]: val } : f));

  /* ─── Auth Gate ─── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="w-full max-w-sm rounded-2xl p-8" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
          <h1 className="text-lg font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Admin Intake</h1>
          <input
            type="password"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg text-sm mb-3"
            style={inputStyle}
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={() => { if (apiKey.trim()) setAuthed(true); }}
            className="w-full py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer hover:opacity-90"
            style={{ backgroundColor: "var(--color-teal)" }}
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  if (loading || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-teal)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--color-bg-card)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin")}
            className="text-sm cursor-pointer hover:opacity-70"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ← Back to CRM
          </button>
          <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
            Intake: {lead.name}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="py-2 px-5 rounded-lg text-sm font-bold text-white cursor-pointer hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "var(--color-teal)" }}
        >
          {saving ? "Saving…" : "💾 Save All"}
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">{success}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          {/* ─── Personal Info ───────────────────────────────────────── */}
          <section className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Personal Info</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Name</label>
                <input value={lead.name} disabled className="w-full py-2 px-3 rounded-lg text-sm opacity-60" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Phone</label>
                <input value={lead.phone} disabled className="w-full py-2 px-3 rounded-lg text-sm opacity-60" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm" style={inputStyle} placeholder="customer@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>State</label>
                  <input value={userState} onChange={(e) => setUserState(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm" style={inputStyle} />
                </div>
              </div>
            </div>
          </section>

          {/* ─── Financial Info ──────────────────────────────────────── */}
          <section className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Financial</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Monthly Salary (₹)</label>
                <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm" style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Salary Credit Date (1-31)</label>
                <input type="number" min={1} max={31} value={salaryDate} onChange={(e) => setSalaryDate(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm" style={inputStyle} placeholder="1" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Other Monthly Income (₹)</label>
                <input type="number" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="w-full py-2 px-3 rounded-lg text-sm" style={inputStyle} placeholder="0" />
              </div>
            </div>
          </section>

          {/* ─── Pipeline ────────────────────────────────────────────── */}
          <section className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Pipeline</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Stage</label>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((s) => {
                    const colors = STAGE_COLORS[s] || { bg: "#eee", text: "#666" };
                    return (
                      <button
                        key={s}
                        onClick={() => setStage(s)}
                        className="py-1 px-3 rounded-full text-xs font-medium cursor-pointer transition-all"
                        style={{
                          backgroundColor: stage === s ? colors.text : colors.bg,
                          color: stage === s ? "white" : colors.text,
                          border: `1px solid ${stage === s ? colors.text : "transparent"}`,
                        }}
                        type="button"
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>Priority</label>
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => {
                    const colors = PRIORITY_COLORS[p] || { bg: "#eee", text: "#666" };
                    return (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className="py-1 px-3 rounded-full text-xs font-medium cursor-pointer transition-all"
                        style={{
                          backgroundColor: priority === p ? colors.text : colors.bg,
                          color: priority === p ? "white" : colors.text,
                          border: `1px solid ${priority === p ? colors.text : "transparent"}`,
                        }}
                        type="button"
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ─── Custom Fields (dynamic key-value) ───────────────────── */}
          <section className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Custom Fields</h2>
              <button
                onClick={addCustomField}
                className="text-xs font-medium cursor-pointer hover:opacity-70"
                style={{ color: "var(--color-teal)" }}
                type="button"
              >
                + Add Field
              </button>
            </div>
            <div className="space-y-2">
              {customFields.length === 0 && (
                <p className="text-xs py-4 text-center" style={{ color: "var(--color-text-muted)" }}>
                  No custom fields yet. Click &quot;+ Add Field&quot; to add e.g. &quot;Credit Cards: 5&quot;
                </p>
              )}
              {customFields.map((f, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    value={f.key}
                    onChange={(e) => updateCustomField(idx, "key", e.target.value)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm"
                    style={inputStyle}
                    placeholder="Field name (e.g. Credit Cards)"
                  />
                  <input
                    value={f.value}
                    onChange={(e) => updateCustomField(idx, "value", e.target.value)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm"
                    style={inputStyle}
                    placeholder="Value (e.g. 5)"
                  />
                  <button
                    onClick={() => removeCustomField(idx)}
                    className="w-8 h-8 rounded-lg text-sm cursor-pointer hover:bg-red-50 flex items-center justify-center"
                    style={{ color: "#DC2626" }}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ─── Call Notes ──────────────────────────────────────────── */}
        <section className="mt-6 rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Call Notes</h2>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={4}
            className="w-full py-2.5 px-3 rounded-lg text-sm"
            style={{ ...inputStyle, resize: "none" as const }}
            placeholder="Notes from the call — debt breakdown, customer concerns, action items..."
          />
          <p className="text-right text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{noteContent.length}/5000</p>
        </section>

        {/* Bottom save bar */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => router.push("/admin")}
            className="py-2.5 px-6 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="py-2.5 px-8 rounded-lg text-sm font-bold text-white cursor-pointer hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: "var(--color-teal)" }}
            type="button"
          >
            {saving ? "Saving…" : "💾 Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
