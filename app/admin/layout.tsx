/**
 * Admin Panel — Layout Component
 * 
 * PRD Section 9.3: Built-in lead management and sales operations panel.
 * Provides a sidebar navigation for the admin area with links to:
 *  - Dashboard (daily ops overview)
 *  - Leads (filterable lead list)
 * 
 * This layout wraps all /admin/* pages.
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

/** Sidebar navigation items for the admin panel */
const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Leads", href: "/admin/leads", icon: "👥" },
    { label: "Docs", href: "/admin/docs", icon: "📚" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isReady } = useAuth();

    useEffect(() => {
        if (!isReady) return;
        if (!user || user.role !== "admin") {
            router.push("/dashboard");
        }
    }, [user, isReady, router]);

    // Prevent rendering until auth check is complete
    if (!isReady || !user || user.role !== "admin") {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
                {/* Logo / Branding */}
                <div className="px-6 py-6 border-b border-slate-800">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                            ED
                        </div>
                        <div>
                            <p className="text-sm font-bold">ExitDebt</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-teal-500/20 text-teal-400"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800">
                    <Link
                        href="/dashboard"
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ← Back to User Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
