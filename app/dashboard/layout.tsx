import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Debt Intelligence Dashboard — ExitDebt",
    description:
        "Your complete debt health overview — score gauge, account analysis, interest leak report, smart payment prioritizer, salary cash flow, and debt-free timeline.",
    robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
