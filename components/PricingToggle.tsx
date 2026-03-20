"use client";

interface PricingToggleProps {
    isAnnual: boolean;
    onChange: (isAnnual: boolean) => void;
}

export default function PricingToggle({ isAnnual, onChange }: PricingToggleProps) {
    return (
        <div className="bg-[#F8FAFC] border border-gray-100 p-1.5 rounded-2xl inline-flex gap-1.5 shadow-inner">
            <button
                onClick={() => onChange(false)}
                className={`px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isAnnual ? 'bg-white text-[#0F172A] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Monthly
            </button>
            <button
                onClick={() => onChange(true)}
                className={`px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? 'bg-white text-[#0F172A] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Annual
                <span className="text-[10px] font-extrabold text-[var(--color-teal)] uppercase tracking-wider bg-[var(--color-teal-light)]/10 px-2 py-0.5 rounded ml-1">
                    Save up to 37%
                </span>
            </button>
        </div>
    );
}
