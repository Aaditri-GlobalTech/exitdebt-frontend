import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Profile — ExitDebt",
    description: "View and manage your ExitDebt profile, personal details, and financial summary.",
    robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
