import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Debt Restructuring in India | ExitDebt Guide",
  description: "What is debt restructuring in India? Learn how RBI-compliant restructuring works, who qualifies, and how ExitDebt helps you restructure legally.",
  alternates: {
    canonical: "/debt-restructuring-india",
  },
};

export default function DebtRestructuringIndia() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-[var(--color-bg-soft)] py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/articles" className="text-sm font-medium text-[var(--color-teal)] hover:underline flex items-center gap-1 mb-10 animate-fadeIn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               Back to Guides
            </Link>
            <h1 className="text-5xl sm:text-7xl font-black mb-8 tracking-tight leading-[1.1] text-[var(--color-text-primary)]">
              Debt <span className="text-[var(--color-teal)]">Restructuring</span> in India
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)]">
              <span className="text-[var(--color-teal)]">Legal Relief</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
              <span>6 Min Read</span>
            </div>
          </div>
        </section>

        <article className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg prose-teal max-w-none text-[var(--color-text-secondary)] leading-relaxed">
              
              <div className="p-10 rounded-[3rem] border border-[var(--color-border)] bg-gray-50 my-16">
                 <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-6">Legal & Structured Relief</h2>
                 <p className="text-lg opacity-80 leading-relaxed m-0">
                    Debt restructuring is the formal, legally recognised process of modifying loan terms to make 
                    repayment manageable. It is governed by RBI guidelines and can be initiated <strong>BEFORE</strong> defaulting.
                 </p>
              </div>

              <section className="space-y-12">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">Types of Restructuring</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { title: "Tenure Extension", text: "Extending the loan term to reduce the monthly EMI outgo immediately." },
                    { title: "Interest Rate Reduction", text: "Lenders may temporarily reduce the interest rate in genuine hardship cases." },
                    { title: "Principal Moratorium", text: "A pause on principal repayment for 3–12 months, paying only interest." },
                    { title: "Portfolio Consolidation", text: "Merging multiple loans into a single structured product to simplify." }
                  ].map((type, i) => (
                    <div key={i} className="flex flex-col gap-4 p-8 rounded-[2rem] border border-[var(--color-border)] bg-white hover:shadow-xl hover:shadow-teal-500/5 transition-all">
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{type.title}</h3>
                      <p className="text-base text-gray-500 m-0">{type.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-24 space-y-12">
                 <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">The ExitDebt Advantage</h2>
                 <p>
                    ExitDebt facilitates the entire restructuring process including documentation, creditor
                    negotiation, and implementation across multiple lenders. We ensure you get the best possible 
                    revised terms while protecting your legal rights.
                 </p>
              </section>


            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
