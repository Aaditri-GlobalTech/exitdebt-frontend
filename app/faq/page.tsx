"use client";

import React from "react";
import Link from "next/link";
import { Lock, Lightbulb, Phone, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";

const trustFaqs = [
    {
        question: "Is ExitDebt a scam?",
        answer: "ExitDebt is a registered debt advisory platform. We don't ask for your bank password. We don't move your money. We only read your credit report to show you where you're overpaying.",
    },
    {
        question: "Will this hurt my Equifax score?",
        answer: "No. We perform a soft credit check. This has zero impact on your Equifax score. Only hard inquiries from loan applications affect your score.",
    },
    {
        question: "Is my PAN safe?",
        answer: "Your PAN is hashed instantly using SHA-256. We never store your raw PAN. All data is encrypted with bank-grade AES-256 encryption and auto-deleted after 30 days.",
    },
    {
        question: "Will my bank find out?",
        answer: "No. We only read your credit report from the bureau. Your bank is never contacted or notified. This is completely private.",
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! Every new user gets a free 3-month trial with full access to the debt health dashboard and all 7 intelligence tools. After the trial, you can choose from Lite (₹499/month), Shield (₹1,999/month), or our one-time Settlement service.",
    },
];

const aboutFaqs = [
    {
        question: "What is debt restructuring?",
        answer: "Debt restructuring is a process where you negotiate with lenders to modify your existing loan terms — typically to lower the interest rate, extend the tenure, or consolidate multiple debts into one manageable EMI. It is a fully legal process recognized by the RBI.",
    },
    {
        question: "How much can I actually save?",
        answer: "It depends on your debt profile. Dashboard users typically save ₹30,000–₹80,000/year through optimized payments. Settlement users can save significantly more — we negotiate directly with creditors to reduce your total outstanding debt.",
    },
    {
        question: "What is a Debt Health Score?",
        answer: "It's a proprietary score (0–100) that measures your overall debt wellness. It considers your debt-to-income ratio, average interest rates, number of active accounts, credit utilization, and payment regularity. Higher is better.",
    },
    {
        question: "What is the Freedom GPS?",
        answer: "Freedom GPS shows you how many months until you're completely debt-free on your current path, and how many months you could save by optimizing your payments. It's your roadmap to ₹0 debt.",
    },
    {
        question: "What happens after I check my debt health?",
        answer: "You'll see your complete dashboard with actionable insights. You can continue with our free trial for 3 months. After that, choose Lite for ongoing dashboard access, Shield for harassment protection and creditor negotiation, or our Settlement service for full debt negotiation.",
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                        style={{ backgroundColor: "rgba(115,0,190,0.08)", color: "var(--color-teal)" }}
                    >
                        <HelpCircle className="w-3.5 h-3.5" /> Help & FAQ
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
                        Frequently Asked Questions
                    </h1>
                    <p className="max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                        No jargon. No fine print. Just clear answers to everything you want to know.
                    </p>
                </div>

                {/* Trust & Security */}
                <div className="mb-12">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                        <Lock className="w-5 h-5" /> Trust &amp; Security
                    </h2>
                    <FAQAccordion items={trustFaqs} />
                </div>

                {/* About ExitDebt */}
                <div className="mb-14">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                        <Lightbulb className="w-5 h-5" /> About ExitDebt
                    </h2>
                    <FAQAccordion items={aboutFaqs} />
                </div>

                {/* Still have questions? */}
                <div
                    className="rounded-2xl p-8 text-center"
                    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                >
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                        Still have questions?
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                        Our experts are happy to answer anything — no obligation, no pressure.
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        <Link
                            href="/get-started"
                            className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "var(--color-teal)" }}
                        >
                            <Phone className="w-4 h-4 inline mr-1" />Schedule a Free Call
                        </Link>
                        <Link
                            href="/get-started"
                            className="px-6 py-2.5 rounded-xl font-medium text-sm transition-colors hover:bg-gray-50"
                            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                        >
                            Check My Debt Health
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
