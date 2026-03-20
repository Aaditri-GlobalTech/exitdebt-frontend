import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How to Reduce EMI Burden in India | ExitDebt",
  description: "Overwhelmed by multiple EMIs every month? Discover legal, effective strategies to reduce your EMI burden and manage loan repayments in India.",
  alternates: {
    canonical: "/how-to-reduce-emi-burden",
  },
};

export default function HowToReduceEMIBurden() {
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
              How to Reduce <span className="text-[var(--color-teal)]">EMI Burden</span> in India
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-mono">
              <span className="text-[var(--color-teal)]">Strategy</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
              <span>5 Min Read</span>
            </div>
          </div>
        </section>

        <article className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg prose-teal max-w-none text-[var(--color-text-secondary)] leading-relaxed">
              
              <div className="p-10 rounded-[3rem] bg-[var(--color-teal)] text-white shadow-2xl shadow-teal-500/20 my-16">
                 <h2 className="text-2xl font-bold mb-4">The Stress Zone</h2>
                 <p className="text-lg opacity-90 leading-relaxed m-0">
                    When monthly EMI payments exceed 40–50% of net monthly income, your financial health is at risk. 
                    Most Indian borrowers today carry 2–5 simultaneous EMIs across home, vehicle, and personal loans.
                 </p>
              </div>

              <section className="space-y-12">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">7 Strategies to Lower Your EMIs</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: "Loan Tenure Extension", text: "Extending a 3-year personal loan to 5 years can save you ₹10,000+ per month." },
                    { title: "Interest Rate Renegotiation", text: "Request a lower rate if your CIBIL has improved since the loan was taken." },
                    { title: "Debt Consolidation Loan", text: "Combine multiple 18-24% interest loans into a single 12-14% EMI." },
                    { title: "Partial Prepayment", text: "Use bonuses or windfall income to pay down principal and reduce subsequent EMIs." },
                    { title: "Balance Transfer", text: "Move your outstanding balance to a lender offering a more competitive rate." },
                    { title: "RBI Restructuring Guidelines", text: "Lenders can offer moratoriums or interest-into-principal conversions under RBI circulars." },
                    { title: "Surrender Non-Essential Assets", text: "Consider closing consumer durable or vehicle loans that don't add net value." }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-teal)] transition-all">
                      <div className="font-bold text-lg text-[var(--color-text-primary)]">{s.title}</div>
                      <div className="w-8 h-8 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-[var(--color-teal)] font-black text-xs">
                        {i+1}
                      </div>
                    </div>
                  ))}
                </div>
              </section>


            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
