import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ExitDebt – Check Your Debt Health in 30 Seconds",
  description:
    "See exactly how much interest you're overpaying and get a personalized plan to become debt-free faster. Trusted by 10,000+ Indians.",
  keywords: ["debt", "credit card", "personal loan", "debt restructuring", "Equifax", "India", "financial health"],
  openGraph: {
    title: "ExitDebt – Check Your Debt Health in 30 Seconds",
    description:
      "See how much you're overpaying in interest. Get a personalized debt-free plan.",
    type: "website",
    locale: "en_IN",
    siteName: "ExitDebt",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExitDebt – Check Your Debt Health",
    description: "See how much you're overpaying in interest.",
  },
};

// FAQ structured data for SEO — matches PRD Section 2.2 Screen 1 FAQ questions
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our Basic dashboard and debt health assessment are 100% free forever. It includes your Debt Health Score, Debt Summary, Interest Leak Report, and Salary Day Cash Flow analysis.",
      },
    },
    {
      "@type": "Question",
      name: "How do you make money?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer premium subscription tiers (Lite and Shield) for advanced intelligence tools, continuous monitoring, and active harassment protection. For complex cases, our Shield+ service provides full debt negotiation for a performance fee.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PAN data safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We use bank-grade AES-256 encryption. We only use your PAN to fetch your credit report once you provide explicit consent, and we never share your raw PAN details.",
      },
    },
    {
      "@type": "Question",
      name: "Will this affect my credit score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, we perform a soft pull on your credit record which does not impact your Equifax or other bureau credit scores in any way.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-white">
        <Providers>{children}</Providers>
        {/* LP-05: DPDP Act compliant cookie consent banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
