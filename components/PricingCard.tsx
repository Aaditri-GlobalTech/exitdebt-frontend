"use client";

interface PricingCardProps {
    tier: "lite" | "shield" | "shield_plus" | "settlement";
    isAnnual: boolean;
    onSubscribe?: (tier: "lite" | "shield" | "shield_plus", period: "monthly" | "annual") => void;
    onBookCall?: () => void;
    isRecommended?: boolean;
}

const TIER_CONTENT: Record<string, {
    name: string;
    price: string;
    priceSuffix?: string;
    tagline: string;
    features: string[];
    buttonText: string;
    buttonStyle: string;
    annualPrice?: string;
}> = {
    lite: {
        name: "LITE",
        price: "499",
        annualPrice: "4,799",
        tagline: "Essential tools for independent debt management and tracking.",
        features: [
            "Debt health dashboard",
            "7 intelligence tools",
            "Interest leak analysis",
            "Smart payment prioritizer",
            "Quarterly bureau refresh",
        ],
        buttonText: "Get Started",
        buttonStyle: "border border-teal-500 text-teal-600 bg-white hover:bg-teal-50",
    },
    shield: {
        name: "SHIELD",
        price: "1,999",
        annualPrice: "14,999",
        tagline: "Active protection against harassment and direct bank coordination.",
        features: [
            "Everything in Lite",
            "Harassment protection",
            "Creditor communications",
            "Legal notice drafting",
            "Priority 24/7 support",
        ],
        buttonText: "Protect Me Now",
        buttonStyle: "bg-teal-500 text-white hover:bg-teal-600",
    },
    shield_plus: {
        name: "SHIELD+",
        price: "3,499",
        annualPrice: "29,999",
        tagline: "Premium protection with dedicated case manager and legal team.",
        features: [
            "Everything in Shield",
            "Dedicated case manager",
            "Full legal representation",
            "Court hearing support",
            "Monthly bureau refresh",
            "Direct creditor negotiation",
        ],
        buttonText: "Get Shield+",
        buttonStyle: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600",
    },
    settlement: {
        name: "SETTLEMENT",
        price: "10%",
        priceSuffix: "+ GST",
        tagline: "End-to-end legal and negotiation support for closing your debts.",
        features: [
            "Full debt negotiation",
            "Creditor communications",
            "Legal notice handling",
            "Dedicated settlement team",
            "Pay only on success",
        ],
        buttonText: "Book a Call",
        buttonStyle: "border border-gray-800 text-gray-800 bg-white hover:bg-gray-50",
    },
};

export default function PricingCard({ tier, isAnnual, onSubscribe, onBookCall, isRecommended }: PricingCardProps) {
    const content = TIER_CONTENT[tier];
    if (!content) return null;
    
    const isSettlement = tier === "settlement";

    return (
        <div 
            className={`relative rounded-3xl p-8 lg:p-10 flex flex-col h-full transition-all duration-500 ${
                isRecommended 
                    ? "border-2 border-teal-500 scale-[1.02] shadow-2xl shadow-teal-100 z-10" 
                    : "border border-gray-100 shadow-xl shadow-gray-100/50"
            }`}
        >
            {isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-teal-500 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                    Recommended
                </div>
            )}

            <div className="mb-8">
                <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">{content.name}</span>
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                    <span className="text-4xl font-extrabold text-[#0F172A]">
                        {isSettlement ? "" : "₹"}{content.price}
                    </span>
                    {!isSettlement ? (
                        <span className="text-gray-400 font-medium">/mo</span>
                    ) : (
                        <span className="text-gray-400 font-medium ml-1">{content.priceSuffix}</span>
                    )}
                </div>
                {!isSettlement && content.annualPrice && (
                    <p className="text-[11px] font-bold text-teal-600 mb-4">
                        {isAnnual 
                            ? `₹${content.annualPrice} billed annually — save up to 20%`
                            : `or ₹${content.annualPrice}/year and save`
                        }
                    </p>
                )}
                {isSettlement && (
                    <p className="text-[11px] font-bold text-teal-600 mb-4">
                        calculated on settled amount
                    </p>
                )}
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    {content.tagline}
                </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {content.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-[#1E293B]">{feature}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={() => isSettlement ? onBookCall?.() : onSubscribe?.(tier as "lite" | "shield" | "shield_plus", isAnnual ? "annual" : "monthly")}
                className={`w-full py-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${content.buttonStyle}`}
            >
                {content.buttonText}
            </button>
        </div>
    );
}
