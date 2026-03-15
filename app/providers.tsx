"use client";

import { AuthProvider } from "@/lib/AuthContext";
import { SubscriptionProvider } from "@/lib/SubscriptionContext";
import CookieConsent from "@/components/CookieConsent";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SubscriptionProvider>
                {children}
                <CookieConsent />
            </SubscriptionProvider>
        </AuthProvider>
    );
}
