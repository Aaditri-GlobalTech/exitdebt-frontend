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
  title: {
    default: "ExitDebt – Check Your Debt Health in 30 Seconds",
    template: "%s | ExitDebt",
  },
  description:
    "See exactly how much interest you're overpaying and get a personalized plan to become debt-free faster. Trusted by 10,000+ Indians.",
  keywords: [
    "ExitDebt",
    "Debt Restructuring India",
    "Credit Card Debt Relief India",
    "debt management India",
    "debt relief India",
    "loan settlement India",
    "debt restructuring",
    "financial health",
    "CIBIL score impact",
    "debt free faster",
    "credit card debt relief",
    "personal loan settlement",
    "EMI management",
    "debt health analysis",
    "loan repayment strategy",
    "interest burden",
    "creditor negotiation",
    "Equifax",
    "India",
  ],
  metadataBase: new URL("https://exitdebt.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ExitDebt – Check Your Debt Health in 30 Seconds",
    description:
      "See how much you're overpaying in interest. Get a personalized debt-free plan.",
    type: "website",
    locale: "en_IN",
    siteName: "ExitDebt",
    url: "https://exitdebt.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExitDebt – Check Your Debt Health",
    description: "See how much you're overpaying in interest.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// SEO Structured Data - Merged from Waitlist and Frontend
const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ExitDebt",
    "alternateName": "ExitDebt India",
    "url": "https://exitdebt.in",
    "logo": "https://exitdebt.in/logo.png",
    "description": "ExitDebt is India's structured debt management and restructuring platform for individuals with credit card debt, personal loans, and EMI obligations.",
    "foundingOrganization": "Aaditri GlobalTech Private Limited",
    "areaServed": "IN",
    "serviceType": ["Debt Restructuring", "Debt Management", "Financial Planning", "Credit Counselling"],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@exitdebt.in",
      "contactType": "customer support"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "brand": {
      "@type": "Brand",
      "name": "ExitDebt"
    },
    name: "ExitDebt – Debt Management Platform",
    url: "https://exitdebt.in",
    description:
      "ExitDebt is India's smartest debt management platform. We help users perform a comprehensive Debt Health Analysis, build a Personalized Strategy, and become debt-free faster through EMI restructuring and professional debt relief.",
    feesAndCommissionsSpecification: "100% free for users",
    serviceType: ["Debt Management", "Debt Restructuring", "Credit Counseling", "Debt Health Analysis", "EMI Management"],
    areaServed: "IN",
    provider: {
      "@type": "Organization",
      name: "Aaditri GlobalTech Private Limited",
      url: "https://exitdebt.in",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get Out of Credit Card Debt in India",
    "description": "A step-by-step process to clear credit card debt and become debt-free in India.",
    "step": [
      { "@type": "HowToStep", "name": "Audit your debt", "text": "List all outstanding balances, interest rates, and minimum payments." },
      { "@type": "HowToStep", "name": "Stop adding new debt", "text": "Avoid new credit card purchases while repaying existing balances." },
      { "@type": "HowToStep", "name": "Choose a repayment strategy", "text": "Use the Avalanche or Snowball method based on your financial situation." },
      { "@type": "HowToStep", "name": "Negotiate with creditors", "text": "Request EMI conversion or restructuring from your bank or card issuer." },
      { "@type": "HowToStep", "name": "Create a structured plan", "text": "Use ExitDebt to build a personalised debt exit roadmap." }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our Basic dashboard and debt health assessment are 100% free forever. It includes your Debt Health Score, Debt Summary, Interest Leak Report, and Salary Day Cash Flow analysis."
        }
      },
      {
        "@type": "Question",
        "name": "How do you make money?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer premium subscription tiers (Lite and Shield) for advanced intelligence tools, continuous monitoring, and active harassment protection. For complex cases, our Shield+ service provides full debt negotiation for a performance fee."
        }
      },
      {
        "@type": "Question",
        "name": "Is my PAN data safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We use bank-grade AES-256 encryption. We only use your PAN to fetch your credit report once you provide explicit consent, and we never share your raw PAN details."
        }
      },
      {
        "@type": "Question",
        "name": "Will this affect my credit score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, we perform a soft pull on your credit record which does not impact your Equifax or other bureau credit scores in any way."
        }
      },
      {
        "@type": "Question",
        "name": "What is debt restructuring in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Debt restructuring in India is the process of modifying the terms of an existing loan or credit obligation to make repayment more manageable. This can include extending the loan tenure, reducing the interest rate, or consolidating multiple debts. It is legally recognised in India under RBI guidelines."
        }
      },
      {
        "@type": "Question",
        "name": "Is debt restructuring legal in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, debt restructuring is completely legal in India. The Reserve Bank of India (RBI) has established guidelines allowing banks, NBFCs, and other lenders to restructure loans for borrowers experiencing financial stress."
        }
      },
      {
        "@type": "Question",
        "name": "How to get out of credit card debt in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To get out of credit card debt in India: (1) Stop adding new charges. (2) List all outstanding balances and interest rates. (3) Prioritise paying off high-interest cards. (4) Consider EMI conversion. (5) Use a debt management platform like ExitDebt."
        }
      },
      {
        "@type": "Question",
        "name": "How to reduce EMI burden in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To reduce EMI burden, consider: (1) Requesting loan tenure extension. (2) Refinancing at lower rates. (3) Consolidating multiple loans. (4) Making partial prepayments. ExitDebt can analyze your situation and recommend the most effective strategy."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between debt consolidation and debt settlement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Debt consolidation combines multiple debts into a single lower-interest loan without reducing principal. Debt settlement involves negotiating a lower payment, which negatively impacts CIBIL scores. Consolidation is generally preferred for stable borrowers."
        }
      },
      {
        "@type": "Question",
        "name": "What is a Debt Health Score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Debt Health Score assesses your debt profile condition, considering outstanding debt, EMI-to-income ratio, repayment history, and more. ExitDebt uses this score to identify the most effective path to being debt-free."
        }
      },
      {
        "@type": "Question",
        "name": "Does debt restructuring affect CIBIL score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Debt restructuring can be flagged on credit reports, but it is far less damaging than defaults or settlements. Proactively restructuring before missing EMIs is better for long-term credit health."
        }
      },
      {
        "@type": "Question",
        "name": "What is ExitDebt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ExitDebt is a fintech platform based in India providing structured debt management and restructuring services for credit card debt, personal loans, and EMIs. It is operated by Aaditri GlobalTech Private Limited."
        }
      },
      {
        "@type": "Question",
        "name": "Can I manage multiple loans with one plan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ExitDebt coordinate multiple loan obligations—including credit cards, personal loans, and vehicle EMIs—into a single repayment strategy to reduce your overall interest burden."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to become debt-free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Timeline varies by debt amount and income, but ExitDebt's strategy is designed to accelerate the process. Many users reduce their debt-free timeline by 30-50% compared to uncoordinated minimum payments."
        }
      }
    ]
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="font-sans antialiased text-gray-900 bg-white">
        <Providers>{children}</Providers>
        {/* LP-05: DPDP Act compliant cookie consent banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
