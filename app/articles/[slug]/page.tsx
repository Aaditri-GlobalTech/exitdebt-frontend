import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

const ARTICLES: Record<string, { title: string; category: string; description: string; content: string[] }> = {
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

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = ARTICLES[slug];
    if (!article) return {};
    return {
        title: `${article.title} — ExitDebt`,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            type: "article",
            siteName: "ExitDebt",
        },
        twitter: {
            card: "summary",
            title: article.title,
            description: article.description,
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = ARTICLES[slug];

    if (!article) {
        notFound();
    }

    // Article structured data
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        author: { "@type": "Organization", name: "ExitDebt" },
        publisher: { "@type": "Organization", name: "ExitDebt" },
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* Nav */}
            <nav
                className="sticky top-0 z-50 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(252,252,252,0.92)", borderBottom: "1px solid var(--color-border)" }}
            >
                <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: "var(--color-purple)" }}
                        >
                            E
                        </div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                            ExitDebt
                        </span>
                    </Link>
                    <Link
                        href="/#articles"
                        className="text-sm font-medium transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        ← Back to home
                    </Link>
                </div>
            </nav>

            <article className="max-w-3xl mx-auto px-8 py-14 sm:py-20">
                <div className="mb-8">
                    <span
                        className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: "var(--color-purple)" }}
                    >
                        {article.category}
                    </span>
                    <h1
                        className="text-2xl sm:text-3xl font-bold mt-3 leading-tight"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        {article.title}
                    </h1>
                    <p className="text-sm mt-3" style={{ color: "var(--color-text-muted)" }}>
                        5 min read
                    </p>
                </div>

                <div className="space-y-5">
                    {article.content.map((paragraph, i) => (
                        <p key={i} className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-14 pt-8 text-center" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                        Want to see how much you could save?
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all"
                        style={{ backgroundColor: "var(--color-purple)" }}
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
