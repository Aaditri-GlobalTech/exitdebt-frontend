"use client";

import { useState } from "react";

const FAQ_ITEMS = [
    {
        question: "Is there a free trial?",
        answer:
            "Yes. Every new user gets a free 3-month trial with full access to the debt health dashboard and all 7 intelligence tools. After the trial, you can choose a plan starting at just ₹499/month (Lite).",
    },
    {
        question: "How do you make money?",
        answer:
            "We offer tiered subscription plans: Lite (₹499/month) for dashboard access, Shield (₹1,999/month) for harassment protection and creditor negotiation, and a one-time Settlement service (10% + GST on settled amount). We may also earn referral fees from lending partners in the future.",
    },
    {
        question: "Is my PAN data safe?",
        answer:
            "Absolutely. We use bank-grade 256-bit encryption. Your PAN is used solely to fetch your credit report and is never stored on our servers or shared with third parties without your explicit consent.",
    },
    {
        question: "Will this affect my CIBIL score?",
        answer:
            "No. We perform a 'soft pull' of your credit report, which does not impact your CIBIL score in any way. Only hard inquiries (like applying for a loan) can affect your score.",
    },
    {
        question: "What happens during the callback?",
        answer:
            "A certified debt specialist will review your report with you, explain your options — including our Shield protection and Settlement services — and answer any questions. There's no obligation to proceed.",
    },
    {
        question: "How much can I actually save?",
        answer:
            "Savings depend on your debt profile. Dashboard users typically save ₹15,000–₹80,000/year through smarter payments. Settlement users can save significantly more — we negotiate directly with creditors to reduce your total debt.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    function toggle(index: number) {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
        <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-500 mt-2 text-sm">Everything you need to know before getting started</p>
            </div>

            <div className="space-y-3">
                {FAQ_ITEMS.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-100 rounded-xl overflow-hidden bg-white transition-shadow duration-200 hover:shadow-sm"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                            <svg
                                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            id={`faq-answer-${index}`}
                            role="region"
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
