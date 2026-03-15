import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://exitdebt.com";

/**
 * Dynamic sitemap for SEO.
 * Next.js automatically serves this at /sitemap.xml
 *
 * Includes all public-facing pages. Private routes (dashboard, income,
 * profile, settings, schedule) are excluded intentionally.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString();

    /* ── Static pages ─────────────────────────────────────────────────── */
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/upgrade`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/docs`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    /* ── Article pages (hardcoded for now — dynamic from CMS in future) ── */
    const articleSlugs = [
        "credit-card-mistakes",
        "priya-saved-62k",
        "personal-loan-vs-credit-card",
    ];

    const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
        url: `${BASE_URL}/articles/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...articlePages];
}
