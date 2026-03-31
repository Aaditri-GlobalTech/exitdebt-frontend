"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Accounts Page — Soft Launch Redirect
 *
 * Shield/accounts features require KYC and subscription tiers which are
 * not active during the soft launch. Redirect to /get-started instead.
 * [ASSUMPTION] Original page will be restored when Shield tier goes live.
 */
export default function AccountsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/get-started");
  }, [router]);

  return null;
}
