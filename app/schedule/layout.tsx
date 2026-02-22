import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Schedule a Free Call — ExitDebt",
    description: "Book a free consultation with an ExitDebt debt restructuring expert. No fees, no pressure — just clear savings advice.",
};

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
