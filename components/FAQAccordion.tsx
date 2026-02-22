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
                    className="rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
                    >
                        <span
                            className="font-medium pr-4 text-sm"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            {item.question}
                        </span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${openIndex === index ? "rotate-180" : ""
                                }`}
                            style={{ color: "var(--color-text-muted)" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        className={`px-5 overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96 pb-4" : "max-h-0"
                            }`}
                    >
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                            {item.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
