import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* ── Security Headers ────────────────────────────────────────────── */
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },

    /* ── Environment Validation ──────────────────────────────────────── */
    env: {
        NEXT_PUBLIC_DATA_SOURCE:
            process.env.NEXT_PUBLIC_DATA_SOURCE || "mock",
    },

    /* ── Performance ─────────────────────────────────────────────────── */
    reactStrictMode: true,
    poweredByHeader: false, // Remove "X-Powered-By: Next.js"
};

export default nextConfig;
