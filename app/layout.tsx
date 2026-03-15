import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://exitdebt.com";

/* ─── Metadata ───────────────────────────────────────────────────────────── */

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0F1729",
};

export const metadata: Metadata = {
    metadataBase: new URL(APP_URL),
    title: {
        default: "ExitDebt – Check Your Debt Health in 30 Seconds | Free",
        template: "%s | ExitDebt",
    },
    description:
        "See exactly how much interest you're overpaying on your loans and credit cards. Get a personalized plan to become debt-free faster. Free 3-month trial for salaried Indians.",
    keywords: [
        "debt health check",
        "credit card debt India",
        "personal loan EMI calculator",
        "debt restructuring",
        "CIBIL score impact",
        "debt freedom",
        "interest overpayment",
        "loan repayment plan",
        "financial health India",
        "debt management platform",
    ],
    authors: [{ name: "ExitDebt", url: APP_URL }],
    creator: "Aaditri Technologies",
    publisher: "Aaditri Technologies",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: APP_URL,
    },
    openGraph: {
        title: "ExitDebt – Check Your Debt Health in 30 Seconds",
        description:
            "Most salaried Indians overpay ₹30,000–₹1,50,000/year on loans. Check yours free — see exactly where your money is going.",
        type: "website",
        locale: "en_IN",
        siteName: "ExitDebt",
        url: APP_URL,
    },
    twitter: {
        card: "summary_large_image",
        title: "ExitDebt – Free Debt Health Check for Indians",
        description:
            "See how much you're overpaying in interest. Get a personalized debt-free plan.",
        creator: "@exitdebt",
    },
    category: "Finance",
};

/* ─── Structured Data (SEO + AEO) ───────────────────────────────────────── */

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Is ExitDebt really free?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every new user gets a free 3-month trial with full dashboard access including all 7 intelligence tools. After the trial, plans start at ₹499/month (Lite). We also offer Shield protection (₹1,999/month) and Settlement services (10% + GST on settled debt).",
            },
        },
        {
            "@type": "Question",
            name: "How does ExitDebt make money?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "ExitDebt offers tiered subscription plans: Lite (₹499/month or ₹4,999/year) for full debt intelligence, Shield (₹1,999/month or ₹14,999/year) for harassment protection and creditor negotiation, and a one-time Settlement service (10% + GST on settled amount, ₹1L minimum). We may also earn referral fees from lending partners in future phases.",
            },
        },
        {
            "@type": "Question",
            name: "Is my PAN data safe with ExitDebt?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. Your PAN is hashed instantly using SHA-256 — we never store your raw PAN. All credit bureau data is encrypted with bank-grade AES-256 encryption and raw data auto-deletes after 30 days. We are fully compliant with the DPDP Act 2023.",
            },
        },
        {
            "@type": "Question",
            name: "Will checking my debt health affect my CIBIL score?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. ExitDebt performs a soft pull of your credit report, which has absolutely zero impact on your CIBIL score. Only hard inquiries from actual loan applications affect your score.",
            },
        },
        {
            "@type": "Question",
            name: "What is a Debt Health Score?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The Debt Health Score is ExitDebt's proprietary 0–100 score that measures how well-structured your debt is. It factors in your debt-to-income ratio (30%), average interest rate (25%), number of active accounts (15%), credit utilization (15%), and payment history (15%). A higher score means healthier debt management.",
            },
        },
    ],
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ExitDebt",
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    description:
        "Full-spectrum debt platform for salaried Indians. Debt health scoring, intelligence tools, and settlement services.",
    founder: {
        "@type": "Person",
        name: "Kumar R Anand",
    },
    parentOrganization: {
        "@type": "Organization",
        name: "Aaditri Technologies",
    },
    sameAs: [
        "https://twitter.com/exitdebt",
        "https://www.linkedin.com/company/exitdebt",
        "https://www.instagram.com/exitdebt",
    ],
};

const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ExitDebt",
    url: APP_URL,
    description:
        "Check your debt health in 30 seconds. See exactly how much interest you're overpaying.",
    potentialAction: {
        "@type": "SearchAction",
        target: `${APP_URL}/faq?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ExitDebt",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: [
        {
            "@type": "Offer",
            name: "Lite Plan",
            price: "499",
            priceCurrency: "INR",
            description: "Full debt health dashboard with 7 intelligence tools",
        },
        {
            "@type": "Offer",
            name: "Shield Plan",
            price: "1999",
            priceCurrency: "INR",
            description:
                "Everything in Lite plus harassment protection and creditor negotiation",
        },
    ],
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1200",
        bestRating: "5",
    },
};

/* ─── Layout ─────────────────────────────────────────────────────────────── */

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const schemas = [
        faqSchema,
        organizationSchema,
        webSiteSchema,
        softwareAppSchema,
    ];

    return (
        <html lang="en" className={inter.variable}>
            <head>
                {schemas.map((schema, i) => (
                    <script
                        key={i}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schema),
                        }}
                    />
                ))}
            </head>
            <body className="font-sans antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
