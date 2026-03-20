"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";
import SubscriptionGate from "@/components/SubscriptionGate";
import LiteDashboard from "@/components/dashboard/LiteDashboard";

export default function DashboardPage() {
    const { isLoggedIn, isReady, user, onboardingComplete } = useAuth();
    const router = useRouter();
    const [lastUpdated] = useState(new Date());

    useEffect(() => {
        if (!isReady) return;

        /* Unauthenticated → send to home */
        if (!isLoggedIn) {
            router.push("/");
            return;
        }

        /* Authenticated but onboarding not finished → send back to complete it.
           This prevents users from skipping PAN verification (Step 2). */
        if (!onboardingComplete) {
            router.push("/onboarding");
            return;
        }
    }, [isLoggedIn, isReady, onboardingComplete, router]);

    if (!isReady || !isLoggedIn || !user || !onboardingComplete) return null;

    return (
        <SubscriptionGate>
            <LiteDashboard lastUpdated={lastUpdated} />
        </SubscriptionGate>
    );
}

