"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════
 * Types
 * ═══════════════════════════════════════════════════════════════════════ */

interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  tag: string;
  read_time: string;
  author: string;
  seo_keywords?: string | null;
  meta_description?: string | null;
  created_at: string;
}

/* ═══════════════════════════════════════════════════════════════════════
 * Static SEO articles (always shown alongside dynamic blogs)
 * ═══════════════════════════════════════════════════════════════════════ */

const STATIC_ARTICLES: BlogListItem[] = [
  {
    id: "static-1",
    slug: "how-to-get-out-of-debt-india",
    title: "How to Get Out of Debt in India",
    description: "A step-by-step master guide to structured repayment planning and becoming debt-free.",
    tag: "Master Guide",
    read_time: "8 min read",
    author: "ExitDebt Team",
    created_at: "",
  },
  {
    id: "static-2",
    slug: "credit-card-debt-help-india",
    title: "Credit Card Debt Help India",
    description: "Stop the 42% interest trap. Learn about EMI conversion and balance transfers.",
    tag: "Credit Cards",
    read_time: "6 min read",
    author: "ExitDebt Team",
    created_at: "",
  },
  {
    id: "static-3",
    slug: "how-to-reduce-emi-burden",
    title: "How to Reduce EMI Burden",
    description: "Discover legal strategies like tenure extension and rate renegotiation to lower monthly outgo.",
    tag: "Strategy",
    read_time: "5 min read",
    author: "ExitDebt Team",
    created_at: "",
  },
  {
    id: "static-4",
    slug: "manage-multiple-loans-india",
    title: "Manage Multiple Loans",
    description: "Stop decision fatigue. Centralize your portfolio and prioritize high-interest debt.",
    tag: "Management",
    read_time: "7 min read",
    author: "ExitDebt Team",
    created_at: "",
  },
  {
    id: "static-5",
    slug: "debt-restructuring-india",
    title: "Debt Restructuring Guide",
    description: "Learn about RBI-compliant restructuring and how to apply for legal relief before defaulting.",
    tag: "Legal",
    read_time: "6 min read",
    author: "ExitDebt Team",
    created_at: "",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
 * Helpers
 * ═══════════════════════════════════════════════════════════════════════ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function isStaticSlug(slug: string): boolean {
  return [
    "how-to-get-out-of-debt-india",
    "credit-card-debt-help-india",
    "how-to-reduce-emi-burden",
    "manage-multiple-loans-india",
    "debt-restructuring-india",
  ].includes(slug);
}

function getBlogHref(article: BlogListItem): string {
  if (isStaticSlug(article.slug)) {
    return `/${article.slug}`;
  }
  return `/blogs/${article.slug}`;
}

/* ═══════════════════════════════════════════════════════════════════════
 * Component
 * ═══════════════════════════════════════════════════════════════════════ */

export default function BlogsListing() {
  const [dynamicBlogs, setDynamicBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_URL}/api/blogs`);
        if (res.ok) {
          const data: BlogListItem[] = await res.json();
          setDynamicBlogs(data);
        }
      } catch {
        // Backend unreachable — show static articles only
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Merge: dynamic blogs first, then static articles (deduped by slug)
  const dynamicSlugs = new Set(dynamicBlogs.map((b) => b.slug));
  const allArticles = [
    ...dynamicBlogs,
    ...STATIC_ARTICLES.filter((a) => !dynamicSlugs.has(a.slug)),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-[var(--color-bg-soft)] py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-[1.1] animate-slideUp">
                <span className="text-[var(--color-teal)]">Blog</span>
              </h1>
              <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl animate-fadeIn">
                Debt feels overwhelming when you don&apos;t know your options. Our guides give you the knowledge banks never share — your legal rights, proven repayment strategies, and negotiation tools — so you can face your finances with confidence and find your way out.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-[420px] animate-fadeIn">
              <Image src="/blog.svg" alt="Blog illustration" width={420} height={420} className="w-full h-auto" />
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-[3px] border-teal-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allArticles.map((article, i) => (
                  <Link
                    key={article.id}
                    href={getBlogHref(article)}
                    className="group flex flex-col p-8 rounded-[2.5rem] border border-[var(--color-border)] hover:border-[var(--color-teal)] hover:shadow-2xl hover:shadow-teal-500/5 transition-all animate-slideUp"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-4 py-1.5 rounded-full bg-[var(--color-bg-soft)] text-[var(--color-teal)] text-xs font-bold tracking-widest uppercase">
                        {article.tag}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)] font-medium">
                        {article.read_time}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-teal)] transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8 flex-grow line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-2 text-[var(--color-teal)] font-bold text-sm uppercase tracking-wider">
                      Read Post
                      <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
