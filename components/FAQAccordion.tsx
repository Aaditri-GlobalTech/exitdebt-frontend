"use client";

import React, { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 mb-3 last:mb-0"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        boxShadow: openIndex === index ? "0 4px 20px rgba(0,0,0,0.04)" : "none",
                        borderColor: openIndex === index ? "var(--color-teal)" : "var(--color-border)",
                    }}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group"
                    >
                        <span
                            className={`font-semibold pr-4 text-sm transition-colors ${openIndex === index ? "text-teal-600" : "text-gray-900"}`}
                        >
                            {item.question}
                        </span>
                        <div className={`p-1 rounded-full transition-all ${openIndex === index ? "bg-teal-50 text-teal-600 rotate-180" : "text-gray-400"}`}>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                    <div
                        className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 pb-6 pt-0" : "max-h-0"
                            }`}
                    >
                        <p className="text-sm leading-relaxed text-gray-500">
                            {item.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
