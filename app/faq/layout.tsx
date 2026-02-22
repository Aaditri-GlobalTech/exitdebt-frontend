import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ — ExitDebt",
    description: "Frequently asked questions about ExitDebt's debt health check, data security, CIBIL impact, and how debt restructuring works.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
