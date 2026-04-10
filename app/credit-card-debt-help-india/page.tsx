import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Credit Card Debt Help India | ExitDebt",
  description: "Trapped in credit card debt in India? Get expert help with repayment strategies, EMI conversion, and debt restructuring through ExitDebt.",
  alternates: {
    canonical: "/credit-card-debt-help-india",
  },
};

export default function CreditCardDebtHelpIndia() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-[var(--color-bg-soft)] py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/blogs" className="text-sm font-medium text-[var(--color-teal)] hover:underline flex items-center gap-1 mb-10 animate-fadeIn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               Back to Blog
            </Link>
            <h1 className="text-5xl sm:text-7xl font-black mb-8 tracking-tight leading-[1.1] text-[var(--color-text-primary)]">
              Credit Card <span className="text-[var(--color-teal)]">Debt Help</span> India
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)]">
              <span className="text-[var(--color-teal)]">Credit Cards</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
              <span>6 Min Read</span>
            </div>
          </div>
        </section>

        <article className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg prose-teal max-w-none text-[var(--color-text-secondary)] leading-relaxed">
              
              <div className="bg-rose-50 border-l-4 border-rose-500 p-8 my-12 rounded-r-[2rem]">
                <p className="text-xl italic font-medium m-0 text-rose-900">
                  &quot;Credit card debt in India carries interest rates up to 42% annually. Without a structured repayment plan, 
                  minimum payments trap borrowers in a cycle where interest grows faster than principal is reduced.&quot;
                </p>
              </div>

              <section className="space-y-8">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">The Compounding Trap</h2>
                <p>
                  India&apos;s credit card base has grown to over 100 million active cards. The revolving credit structure 
                  and high interest rates (36–42% per annum) create a &quot;treadmill effect&quot; where borrowers are servicing 
                  their debt but not clearing it.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10 text-sm">
                   <div className="p-6 bg-[var(--color-bg-soft)] rounded-3xl border border-[var(--color-border)]">
                      <h4 className="font-bold text-[var(--color-text-primary)] mb-2">Compounding Interest</h4>
                      <p>Interest is calculated daily; minimum payments barely touch the principal balances.</p>
                   </div>
                   <div className="p-6 bg-[var(--color-bg-soft)] rounded-3xl border border-[var(--color-border)]">
                      <h4 className="font-bold text-[var(--color-text-primary)] mb-2">Late Fee Spiral</h4>
                      <p>Missing one payment triggers fees of ₹500–₹1,300 plus high penal interest rates.</p>
                   </div>
                </div>
              </section>

              <section className="mt-24 space-y-12">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">How to Clear Your Balance</h2>
                <div className="space-y-4">
                  {[
                    { title: "Stop the Bleeding", text: "Freeze all new credit card expenses. Remove saved cards from apps like Swiggy, Amazon, and Uber." },
                    { title: "EMI Conversion", text: "Convert revolving debt into long-term EMIs at 12–21% interest rates to lower your monthly outgo." },
                    { title: "Balance Transfer", text: "Move your debt to a lower-interest card or a 0% interest product for 3–6 months." },
                    { title: "Personal Loan", text: "If your CIBIL allows, use a personal loan at 12–15% to pay off 40% interest card debts." }
                  ].map((strategy, i) => (
                    <div key={i} className="flex gap-6 items-start p-8 rounded-[2rem] border border-[var(--color-border)] shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center font-black flex-shrink-0 mt-1">{i+1}</div>
                      <div>
                         <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">{strategy.title}</h3>
                         <p className="text-base">{strategy.text}</p>
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
