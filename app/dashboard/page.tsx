"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useSubscription } from "@/lib/SubscriptionContext";
import SubscriptionGate from "@/components/SubscriptionGate";
import LiteDashboard from "@/components/dashboard/LiteDashboard";

export default function DashboardPage() {
    const { isLoggedIn, isReady, user } = useAuth();
    const router = useRouter();
    const [lastUpdated] = useState(new Date());

    useEffect(() => {
        if (isReady && !isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, isReady, router]);

    if (!isReady || !isLoggedIn || !user) return null;

    return (
        <SubscriptionGate>
            <LiteDashboard lastUpdated={lastUpdated} />
        </SubscriptionGate>
    );
}
