import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Income Details — ExitDebt",
    description:
        "Provide your monthly salary and income details to power your personalized Debt Intelligence Dashboard. Your data is encrypted and never shared.",
    robots: { index: false, follow: false },
};

export default function IncomeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
