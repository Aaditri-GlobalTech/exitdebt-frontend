import Link from "next/link";

const ARTICLES = [
    {
        id: 1,
        slug: "credit-card-mistakes",
        title: "5 mistakes people make with credit cards",
        excerpt: "Most Indians don't realize these common pitfalls are costing them thousands every year.",
        category: "Credit Cards",
    },
    {
        id: 2,
        slug: "priya-saved-62k",
        title: "How Priya saved ₹62K/year by restructuring her debt",
        excerpt: "A simple switch from high-interest cards to a consolidated loan changed everything.",
        category: "Success Story",
    },
    {
        id: 3,
        slug: "personal-loan-vs-credit-card",
        title: "Personal loan vs. credit card debt: which to pay first?",
        excerpt: "The debt avalanche method isn't always the best choice. Here's what experts recommend.",
        category: "Strategy",
    },
];

export default function BlogSection() {
    return (
        <section id="articles" className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Debt Insights</h2>
                <p className="text-gray-500 mt-2 text-sm">Tips and stories to help you take control of your finances</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {ARTICLES.map((article, i) => (
                    <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slideUp"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Minimal icon area */}
                        <div className="bg-gray-50 h-32 flex items-center justify-center group-hover:bg-teal-50 transition-colors duration-300">
                            <svg className="w-8 h-8 text-gray-300 group-hover:text-teal-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div className="p-5">
                            <span className="text-xs font-medium text-teal-600 uppercase tracking-wide">
                                {article.category}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 mt-1.5 leading-snug group-hover:text-teal-700 transition-colors duration-200">
                                {article.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{article.excerpt}</p>
                            <span className="inline-block mt-3 text-xs font-medium text-teal-600 group-hover:translate-x-1 transition-transform duration-200">
                                Read more →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
