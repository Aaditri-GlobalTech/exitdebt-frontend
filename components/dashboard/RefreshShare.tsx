"use client";

import { useState } from "react";

interface RefreshShareProps { onRefresh: () => void; }

export default function RefreshShare({ onRefresh }: RefreshShareProps) {
    const [refreshing, setRefreshing] = useState(false);

    function handleRefresh() {
        setRefreshing(true);
        setTimeout(() => { onRefresh(); setRefreshing(false); }, 1000);
    }

    /**
     * RS-11: Download PDF of debt summary.
     * Phase 1 uses browser print-to-PDF. Server-side generation deferred to Phase 2.
     */
    function handlePDF() { window.print(); }

    return (
        <div className="rounded-2xl p-6 sm:p-8 animate-fadeIn" style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)", border: "1px solid var(--color-border)" }}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button onClick={handleRefresh} disabled={refreshing} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer disabled:opacity-50" style={{ backgroundColor: "var(--color-teal)" }}>
                    {refreshing ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                            Refreshing…
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Refresh Data
                        </>
                    )}
                </button>

                <button onClick={handlePDF} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer" style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download PDF
                </button>
            </div>
        </div>
    );
}
