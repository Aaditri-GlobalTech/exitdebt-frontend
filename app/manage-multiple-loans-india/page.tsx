import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Manage Multiple Loans in India | ExitDebt",
  description: "Juggling multiple loans and EMIs in India? Learn how to consolidate, prioritise, and manage multiple loans without missing payments or damaging your CIBIL score.",
  alternates: {
    canonical: "/manage-multiple-loans-india",
  },
};

export default function ManageMultipleLoansIndia() {
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
              Manage <span className="text-[var(--color-teal)]">Multiple Loans</span> in India
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)]">
              <span className="text-[var(--color-teal)]">Management</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
              <span>7 Min Read</span>
            </div>
          </div>
        </section>

        <article className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg prose-teal max-w-none text-[var(--color-text-secondary)] leading-relaxed">
              
              <section className="space-y-8">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">The Decision Fatigue Cycle</h2>
                <p>
                  The availability of instant credit through apps and digital NBFCs has made it easier than ever for 
                  Indian borrowers to accumulate 3–5 active loan products. The complexity of different due dates, 
                  interest rates, and penalty structures often leads to &quot;decision fatigue.&quot;
                </p>
                <div className="bg-[var(--color-bg-soft)] p-10 rounded-[3rem] border border-[var(--color-border)] my-12">
                   <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Prioritisation Strategy</h3>
                   <ul className="space-y-6 m-0 p-0 list-none">
                      <li className="flex gap-4">
                         <span className="w-6 h-6 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center font-bold text-xs mt-1">1</span>
                         <div>
                            <p className="font-bold text-[var(--color-text-primary)] m-0">Unified Loan Register</p>
                            <p className="m-0 text-sm opacity-80">List every lender, balance, and interest rate in one document.</p>
                         </div>
                      </li>
                      <li className="flex gap-4">
                         <span className="w-6 h-6 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center font-bold text-xs mt-1">2</span>
                         <div>
                            <p className="font-bold text-[var(--color-text-primary)] m-0">Automate Minimums</p>
                            <p className="m-0 text-sm opacity-80">Set auto-debits for 3 days after salary to avoid bounce charges.</p>
                         </div>
                      </li>
                      <li className="flex gap-4">
                         <span className="w-6 h-6 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center font-bold text-xs mt-1">3</span>
                         <div>
                            <p className="font-bold text-[var(--color-text-primary)] m-0">Aggressive Avalanche</p>
                            <p className="m-0 text-sm opacity-80">Focus all surplus on the highest-interest loan first.</p>
                         </div>
                      </li>
                   </ul>
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
