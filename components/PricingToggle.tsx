"use client";

interface PricingToggleProps {
    isAnnual: boolean;
    onChange: (isAnnual: boolean) => void;
}

export default function PricingToggle({ isAnnual, onChange }: PricingToggleProps) {
    return (
        <div
            className="inline-flex items-center rounded-full p-1 mx-auto"
            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}
        >
            <button
                onClick={() => onChange(false)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                    backgroundColor: !isAnnual ? "var(--color-purple)" : "transparent",
                    color: !isAnnual ? "#fff" : "var(--color-text-secondary)",
                    boxShadow: !isAnnual ? "0 2px 8px rgba(115,0,190,0.25)" : "none",
                }}
            >
                Monthly
            </button>
            <button
                onClick={() => onChange(true)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2"
                style={{
                    backgroundColor: isAnnual ? "var(--color-purple)" : "transparent",
                    color: isAnnual ? "#fff" : "var(--color-text-secondary)",
                    boxShadow: isAnnual ? "0 2px 8px rgba(115,0,190,0.25)" : "none",
                }}
            >
                Annual
                <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                        backgroundColor: isAnnual ? "rgba(255,255,255,0.2)" : "rgba(115,0,190,0.1)",
                        color: isAnnual ? "#fff" : "var(--color-purple)",
                    }}
                >
                    Save up to 37%
                </span>
            </button>
        </div>
    );
}
