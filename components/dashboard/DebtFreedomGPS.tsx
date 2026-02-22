"use client";

interface DebtFreedomGPSProps { currentTimeline: string; optimizedTimeline: string; timelineSaved: string; }

export default function DebtFreedomGPS({ currentTimeline, optimizedTimeline, timelineSaved }: DebtFreedomGPSProps) {
    return (
        <div className="rounded-2xl p-6 sm:p-8 animate-slideUp" style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 2px 24px rgba(0,0,0,0.05)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-purple)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Debt Freedom GPS</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Current Path</p>
                    <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{currentTimeline}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>At your current payment rate</p>
                </div>

                <div className="rounded-xl p-5 relative overflow-hidden" style={{ backgroundColor: "rgba(115,0,190,0.04)", border: "1px solid rgba(115,0,190,0.15)" }}>
                    <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-[10px] font-bold uppercase text-white" style={{ backgroundColor: "var(--color-purple)" }}>Optimized</div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-purple)" }}>With Restructuring</p>
                    <p className="text-2xl font-bold" style={{ color: "var(--color-purple)" }}>{optimizedTimeline}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-purple-light)" }}>{timelineSaved}</p>
                </div>
            </div>

            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Based on your current payments vs. optimized interest rate. Restructuring could accelerate your debt-free date significantly.</p>
        </div>
    );
}
