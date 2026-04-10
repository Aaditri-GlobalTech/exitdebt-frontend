"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ═══════════════════════════════════════════════════════════════════════
 * Types
 * ═══════════════════════════════════════════════════════════════════════ */

interface BlogDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tag: string;
  read_time: string;
  author: string;
  created_at: string;
  updated_at: string;
}

/* ═══════════════════════════════════════════════════════════════════════
 * Static fallback articles (legacy content still at these slugs)
 * ═══════════════════════════════════════════════════════════════════════ */

const STATIC_ARTICLES: Record<string, { title: string; category: string; description: string; content: string[] }> = {
  "credit-card-mistakes": {
    title: "5 mistakes people make with credit cards",
    category: "Credit Cards",
    description: "Most people don't realise how much revolving credit actually costs them. Learn the 5 most common credit card mistakes and how to avoid them.",
    content: [
      "Credit cards can be powerful financial tools when used wisely. However, most Indians fall into common traps that cost them thousands of rupees every year without even realizing it.",
      "1. Paying only the minimum due — When you pay just the minimum amount, you're charged interest on the remaining balance at rates as high as 42% per annum. On a balance of ₹1,00,000, that's nearly ₹3,500 in interest every month.",
      "2. Ignoring the billing cycle — Understanding when your billing cycle starts and ends can help you maximize your interest-free period. Most cards offer 20-50 days of interest-free credit if you time your purchases right.",
      "3. Using credit cards for cash withdrawals — ATM withdrawals on credit cards attract immediate interest (no grace period) plus a transaction fee of 2.5-3%. It's one of the most expensive ways to access cash.",
      "4. Having too many cards — While multiple cards can offer different rewards, they also make it harder to track spending and increase the temptation to overspend. Two to three well-chosen cards are usually optimal.",
      "5. Not reviewing statements — Billing errors, unauthorized charges, and subscription renewals you've forgotten about can silently drain your finances. Review every statement carefully and dispute any discrepancies immediately.",
      "The good news is that awareness is the first step. By avoiding these mistakes, you can turn your credit card from a debt trap into a genuine financial advantage.",
    ],
  },
  "priya-saved-62k": {
    title: "How Priya saved ₹62K/year by restructuring her debt",
    category: "Success Story",
    description: "A real story of someone who turned their finances around in 3 months by using debt restructuring to cut ₹62,400 in annual interest.",
    content: [
      "Priya, a 32-year-old marketing manager from Mumbai, was carrying ₹3.2 lakh in debt across two accounts — an SBI credit card with ₹85,000 outstanding at 24% APR and an HDFC personal loan of ₹2,35,000 at 13.5%.",
      "Like many salaried professionals, Priya was paying her EMIs and minimum dues on time, but she'd never stopped to calculate exactly how much she was paying in interest every year.",
      "When Priya used ExitDebt's debt health check, she discovered her Debt Health Score was 72 out of 100 — 'Fair' — and that she was overpaying ₹62,400 per year compared to what she could be paying with optimally structured debt.",
      "The analysis showed that her credit card balance alone was costing her ₹20,400 per year in excess interest. By consolidating it into a personal loan at 12%, she could cut that interest cost dramatically.",
      "After speaking with an ExitDebt debt specialist, Priya took two simple steps: She applied for a balance transfer to a card offering 0% on transfers for 6 months, and she accelerated payments on the high-interest balance using the debt avalanche method.",
      "Within 18 months, Priya had cleared her credit card debt entirely and refinanced her personal loan at a lower rate. Her total annual interest payments dropped from ₹78,400 to ₹16,000.",
      "Today, Priya's Debt Health Score is 91 — 'Excellent.' She's on track to be completely debt-free within two years, three years ahead of her original schedule.",
    ],
  },
  "personal-loan-vs-credit-card": {
    title: "Personal loan vs. credit card debt: which to pay first?",
    category: "Strategy",
    description: "The answer isn't always obvious. Here's a framework to decide whether to pay off your personal loan or credit card debt first.",
    content: [
      "When you owe money on both a personal loan and credit cards, deciding which to pay off first can feel overwhelming. Two popular strategies — the debt avalanche and debt snowball methods — offer different approaches, and the right one depends on your situation.",
      "The debt avalanche method says: pay off the highest interest rate debt first. Since credit cards typically charge 24-42% APR versus personal loans at 10-16%, the math strongly favors paying off credit card debt first. You'll save more money in total interest.",
      "The debt snowball method says: pay off the smallest balance first, regardless of interest rate. This gives you quick psychological wins and builds momentum. If motivation is your biggest challenge, this approach can be more effective in practice.",
      "However, there's a third option that many people overlook: consolidation. If you're carrying high-interest credit card debt, you may be able to consolidate it into a personal loan at a much lower rate. This instantly reduces your interest burden without requiring you to find extra money.",
      "For example, consolidating ₹2,00,000 in credit card debt at 36% APR into a personal loan at 12% APR saves you ₹48,000 per year in interest — money that can go toward paying down the principal faster.",
      "The key factors to consider: your total debt amount, the interest rate differential, your monthly cash flow, and your psychological relationship with debt. There's no universal answer, but understanding the numbers helps you make the right choice.",
      "Whatever strategy you choose, the most important step is to start. Use a debt health check to see exactly where you stand, and then take action with a clear plan.",
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 * Constants
 * ═══════════════════════════════════════════════════════════════════════ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ═══════════════════════════════════════════════════════════════════════
 * Component
 * ═══════════════════════════════════════════════════════════════════════ */

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Unwrap the params Promise
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    // Check if this is a legacy static article
    const staticArticle = STATIC_ARTICLES[slug];
    if (staticArticle) {
      setBlog({
        id: `static-${slug}`,
        slug,
        title: staticArticle.title,
        description: staticArticle.description,
        content: staticArticle.content.join("\n\n"),
        tag: staticArticle.category,
        read_time: "5 min read",
        author: "ExitDebt Team",
        created_at: "",
        updated_at: "",
      });
      setLoading(false);
      return;
    }

    // Fetch dynamic blog from API
    async function fetchBlog() {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${slug}`);
        if (res.ok) {
          setBlog(await res.json());
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="w-8 h-8 border-[3px] border-teal-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Blog post not found</h1>
        <Link href="/blogs" className="text-sm font-medium" style={{ color: "var(--color-teal)" }}>
          ← Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(252,252,252,0.92)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: "var(--color-teal)" }}
            >
              E
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
              ExitDebt
            </span>
          </Link>
          <Link
            href="/blogs"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            ← Back to blog
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-8 py-14 sm:py-20">
        <div className="mb-8">
          <span
            className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--color-teal)" }}
          >
            {blog.tag}
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold mt-3 leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {blog.read_time}
            </p>
            {blog.author && (
              <>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {blog.author}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Render content as Markdown */}
        <div className="prose prose-lg prose-teal max-w-none blog-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="text-base leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>
                  {children}
                </p>
              ),
              h1: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 my-4 pl-6 list-disc" style={{ color: "var(--color-text-secondary)" }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2 my-4 pl-6 list-decimal" style={{ color: "var(--color-text-secondary)" }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="bg-[var(--color-bg-soft)] border-l-4 border-[var(--color-teal)] p-6 my-8 rounded-r-2xl italic" style={{ color: "var(--color-text-secondary)" }}>
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-bold" style={{ color: "var(--color-text-primary)" }}>
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a href={href} className="underline font-medium" style={{ color: "var(--color-teal)" }} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-teal)" }}>
                  {children}
                </code>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        <div className="mt-14 pt-8 text-center" style={{ borderTop: "1px solid var(--color-border)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Want to see how much you could save?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all"
            style={{ backgroundColor: "var(--color-teal)" }}
          >
            Check your debt health
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
