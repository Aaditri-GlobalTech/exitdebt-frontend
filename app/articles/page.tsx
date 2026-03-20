import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Expert Debt Management Guides | ExitDebt India",
  description: "Comprehensive guides on credit card debt, EMI reduction, loan management, and legal debt restructuring in India.",
  alternates: {
    canonical: "/articles",
  },
};

const articles = [
  {
    slug: "how-to-get-out-of-debt-india",
    title: "How to Get Out of Debt in India",
    description: "A step-by-step master guide to structured repayment planning and becoming debt-free.",
    tag: "Master Guide",
    readTime: "8 min read"
  },
  {
    slug: "credit-card-debt-help-india",
    title: "Credit Card Debt Help India",
    description: "Stop the 42% interest trap. Learn about EMI conversion and balance transfers.",
    tag: "Credit Cards",
    readTime: "6 min read"
  },
  {
    slug: "how-to-reduce-emi-burden",
    title: "How to Reduce EMI Burden",
    description: "Discover legal strategies like tenure extension and rate renegotiation to lower monthly outgo.",
    tag: "Strategy",
    readTime: "5 min read"
  },
  {
    slug: "manage-multiple-loans-india",
    title: "Manage Multiple Loans",
    description: "Stop decision fatigue. Centralize your portfolio and prioritize high-interest debt.",
    tag: "Management",
    readTime: "7 min read"
  },
  {
    slug: "debt-restructuring-india",
    title: "Debt Restructuring Guide",
    description: "Learn about RBI-compliant restructuring and how to apply for legal relief before defaulting.",
    tag: "Legal",
    readTime: "6 min read"
  }
];

export default function ArticlesListing() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-[var(--color-bg-soft)] py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-8 text-center sm:text-left">
            <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-[1.1] animate-slideUp">
              Expert <span className="text-[var(--color-teal)]">Guides</span>
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl animate-fadeIn">
              Empowering you with the knowledge to handle debt legally and regain your financial freedom.
            </p>
          </div>
        </section>

        {/* Article Grid */}
        <section className="py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <Link 
                  key={article.slug} 
                  href={`/${article.slug}`}
                  className="group flex flex-col p-8 rounded-[2.5rem] border border-[var(--color-border)] hover:border-[var(--color-teal)] hover:shadow-2xl hover:shadow-teal-500/5 transition-all animate-slideUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-teal)] text-xs font-bold tracking-widest uppercase">
                      {article.tag}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] font-medium">
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-teal)] transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8 flex-grow line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                    Read Guide 
                    <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
