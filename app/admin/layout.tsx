/**
 * Admin Panel Layout — Soft Launch
 *
 * Bypasses the standard useAuth() role check (which relies on KYC/OTP login).
 * Uses X-API-Key based authentication for the soft launch period.
 * Renders children directly — auth is handled per-page.
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
