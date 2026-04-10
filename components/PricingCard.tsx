"use client";

interface PricingCardProps {
    tier: "lite" | "shield" | "shield_plus";
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
    // Premium style configurations
    cardClass: string;
    badgeClass?: string;
    titleClass: string;
    priceClass: string;
    saveClass: string;
    textClass: string;
    iconBgClass: string;
    iconColorClass: string;
    featureTextClass: string;
    buttonClass: string;
    annualPrice?: string;
    annualMonthlyPrice?: string;
    savePercent?: string;
}> = {
    lite: {
        name: "LITE",
        price: "499",
        annualPrice: "4,999",
        annualMonthlyPrice: "416",
        savePercent: "17%",
        tagline: "Everything you need to take charge of your debt — on your own terms.",
        features: [
            "Debt health dashboard",
            "7 intelligence tools",
            "Interest leak analysis",
            "Smart payment prioritizer",
            "Quarterly bureau refresh",
        ],
        buttonText: "Start Managing My Debt",
        cardClass: "bg-white border-2 border-gray-100 hover:border-[#134E4A]/30 shadow-xl shadow-gray-100/50",
        titleClass: "text-[#134E4A]/60",
        priceClass: "text-[#0F172A]",
        saveClass: "text-[#134E4A]",
        textClass: "text-[#134E4A]/60",
        iconBgClass: "bg-[#134E4A]/10",
        iconColorClass: "text-[#134E4A]",
        featureTextClass: "text-[#1E293B]",
        buttonClass: "border border-[#134E4A] text-[#134E4A] bg-white hover:bg-[#134E4A]/5",
    },
    shield: {
        name: "SHIELD",
        price: "1,999",
        annualPrice: "14,999",
        annualMonthlyPrice: "1,250",
        savePercent: "37%",
        tagline: "Tired of threatening calls? We step in, handle your creditors, and protect your peace of mind.",
        features: [
            "Everything in Lite",
            "Recovery agent harassment shield",
            "We talk to your creditors so you don't have to",
            "RBI-compliant legal notices on your behalf",
            "Priority 24/7 support",
        ],
        buttonText: "Protect Me Now",
        cardClass: "bg-white border-2 border-[#134E4A] animate-shadow-pulse-teal scale-[1.02] z-10",
        badgeClass: "bg-[#134E4A] text-white shadow-md",
        titleClass: "text-[#134E4A]",
        priceClass: "text-[#134E4A]",
        saveClass: "text-[#134E4A]",
        textClass: "text-[#134E4A]/70",
        iconBgClass: "bg-[#134E4A]/10",
        iconColorClass: "text-[#134E4A]",
        featureTextClass: "text-[#1E293B]",
        buttonClass: "bg-[#134E4A] font-bold text-white hover:shadow-lg transition-all",
    },
    shield_plus: {
        name: "SHIELD+",
        price: "10%",
        priceSuffix: "+ GST",
        tagline: "We negotiate directly with your lenders to reduce what you owe. You pay us only after we save you money.",
        features: [
            "Full debt negotiation",
            "Creditor communications",
            "Legal notice handling",
            "Dedicated settlement team",
            "Pay only on success",
        ],
        buttonText: "Talk to a Negotiator",
        cardClass: "bg-white border-2 border-gray-100 hover:border-[#134E4A] shadow-xl shadow-gray-100/50",
        titleClass: "text-[#134E4A]/60",
        priceClass: "text-[#0F172A]",
        saveClass: "text-[#134E4A]",
        textClass: "text-[#134E4A]/60",
        iconBgClass: "bg-[#134E4A]/10",
        iconColorClass: "text-[#134E4A]",
        featureTextClass: "text-[#1E293B]",
        buttonClass: "border border-[#134E4A] text-[#134E4A] bg-white hover:bg-[#134E4A]/5",
    },
};

export default function PricingCard({ tier, isAnnual, onSubscribe, onBookCall, isRecommended }: PricingCardProps) {
    const content = TIER_CONTENT[tier];
    if (!content) return null;
    
    const isShieldPlus = tier === "shield_plus";

    return (
        <div 
            className={`relative rounded-3xl p-8 lg:p-10 flex flex-col h-full transition-all duration-500 ${content.cardClass}`}
        >
            {isRecommended && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase ${content.badgeClass || 'bg-[#134E4A] text-white'}`}>
                    Recommended
                </div>
            )}

            <div className="mb-8">
                <span className={`text-[11px] font-bold tracking-widest uppercase ${content.titleClass}`}>{content.name}</span>
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                    <span className={`text-4xl font-extrabold ${content.priceClass}`}>
                        {isShieldPlus ? "" : "₹"}{isAnnual && content.annualMonthlyPrice ? content.annualMonthlyPrice : content.price}
                    </span>
                    {!isShieldPlus ? (
                        <span className={`font-medium ${content.textClass}`}>/mo</span>
                    ) : (
                        <span className={`font-medium ml-1 ${content.textClass}`}>{content.priceSuffix}</span>
                    )}
                </div>
                {!isShieldPlus && content.annualPrice && (
                    <p className={`text-[11px] font-bold mb-4 h-4 ${content.saveClass}`}>
                        {isAnnual 
                            ? `₹${content.annualPrice} billed annually — save ~${content.savePercent}`
                            : `Save ~${content.savePercent} with annual billing`
                        }
                    </p>
                )}
                {isShieldPlus && (
                    <p className={`text-[11px] font-bold mb-4 h-4 ${content.saveClass}`}>
                        of the amount we save you (min. debt ₹1L) — no savings, no fee
                    </p>
                )}
                <p className={`text-sm font-medium leading-relaxed ${content.textClass}`}>
                    {content.tagline}
                </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {content.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${content.iconBgClass}`}>
                            <svg className={`w-3 h-3 ${content.iconColorClass}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className={`text-sm font-bold ${content.featureTextClass}`}>{feature}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={() => isShieldPlus ? onBookCall?.() : onSubscribe?.(tier as "lite" | "shield", isAnnual ? "annual" : "monthly")}
                className={`w-full py-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${content.buttonClass}`}
            >
                {content.buttonText}
            </button>
        </div>
    );
}
