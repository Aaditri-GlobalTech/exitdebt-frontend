import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How to Get Out of Debt in India | ExitDebt",
  description: "Struggling with loans and credit card debt in India? Learn proven strategies to get out of debt fast with ExitDebt's structured repayment planning.",
  alternates: {
    canonical: "/how-to-get-out-of-debt-india",
  },
  openGraph: {
    title: "How to Get Out of Debt in India — Step-by-Step Guide",
    description: "Learn proven strategies to get out of debt fast with structured repayment planning.",
  },
};

export default function HowToGetOutOfDebtIndia() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[var(--color-bg-soft)] py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/articles" className="text-sm font-medium text-[var(--color-teal)] hover:underline flex items-center gap-1 mb-10 animate-fadeIn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               Back to Guides
            </Link>
            <h1 className="text-5xl sm:text-7xl font-black mb-8 tracking-tight leading-[1.1] animate-slideUp text-[var(--color-text-primary)]">
              How to Get Out of Debt in <span className="text-[var(--color-teal)]">India</span>
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)] animate-fadeIn">
              <span className="text-[var(--color-teal)]">Master Guide</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
              <span>8 Min Read</span>
            </div>
          </div>
        </section>

        <article className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg prose-teal max-w-none text-[var(--color-text-secondary)] leading-relaxed">
              
              <div className="bg-[var(--color-bg-soft)] border-l-4 border-[var(--color-teal)] p-8 my-12 rounded-r-[2rem] animate-fadeIn">
                <p className="text-xl italic font-medium m-0 text-slate-700">
                  &quot;Getting out of debt in India requires a structured approach: listing all outstanding liabilities, calculating your
                  total interest burden, and following a disciplined repayment strategy such as the Debt Avalanche or Debt
                  Snowball method.&quot;
                </p>
              </div>

              <section className="space-y-8 animate-slideUp stagger-1">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">Understanding Your Debt Situation</h2>
                <p>
                  Millions of Indians today carry debt across multiple financial products — credit cards with interest rates of
                  36–42% per annum, personal loans at 12–24%, vehicle EMIs, and home loan repayments. When total
                  monthly EMI payments exceed 40–50% of net monthly income, the household enters a zone of financial
                  stress where even a minor income disruption can trigger missed payments, penalties, and a downward CIBIL
                  spiral.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="text-[var(--color-teal)] font-black">01</span>
                    <span><strong>Credit card interest compounds daily;</strong> minimum payments barely reduce the principal.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--color-teal)] font-black">02</span>
                    <span><strong>Personal loan pre-closure charges</strong> can trap borrowers in unfavourable loans.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--color-teal)] font-black">03</span>
                    <span><strong>Having 4+ active EMIs</strong> creates cognitive overload and increases the risk of missed payments.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[var(--color-teal)] font-black">04</span>
                    <span><strong>Collection calls</strong> and late-payment notices add psychological pressure that worsens decision-making.</span>
                  </li>
                </ul>
              </section>

              <section className="mt-24 space-y-12 animate-slideUp stagger-2">
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">Proven Strategies to Recover</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: "Conduct a Full Debt Audit", text: "List every debt: lender name, outstanding principal, interest rate, monthly EMI, and remaining tenure. This single step creates the clarity needed to make informed restructuring decisions." },
                    { title: "Apply the Debt Avalanche Method", text: "Rank all debts by interest rate, highest first. direct every extra rupee toward the highest-rate debt. Mathematically, this is the fastest way to reduce total interest paid." },
                    { title: "Consider Debt Consolidation", text: "If you carry 3+ loans, consolidating them into a single personal loan at a lower blended interest rate simplifies repayment and often reduces monthly outgo." },
                    { title: "Negotiate EMI Restructuring", text: "Contact your lenders and request a loan restructuring under RBI guidelines. Extending tenure reduces the monthly EMI, freeing up cash for higher-priority repayments." },
                    { title: "Stop New Debt Accumulation", text: "Freeze all non-essential credit card usage. Remove saved card details from shopping apps. A spending freeze for 90 days can free up significant cash." },
                    { title: "Build an Emergency Buffer", text: "Build a ₹10,000–₹25,000 emergency buffer before aggressively paying down debt to break the debt cycle." }
                  ].map((strategy, i) => (
                    <div key={i} className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-white hover:border-[var(--color-teal)] transition-colors">
                      <h3 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">{i+1}. {strategy.title}</h3>
                      <p className="text-base">{strategy.text}</p>
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
