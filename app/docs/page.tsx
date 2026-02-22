import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation — ExitDebt",
    description: "Technical documentation for the ExitDebt platform — architecture, design system, data models, and user flow.",
};

/* ───── Sections Data ───── */

const USER_FLOW = [
    { step: "01", title: "Landing Page", route: "/", desc: "User enters PAN card number and phone. The app validates inputs and selects a mock CIBIL profile." },
    { step: "02", title: "Income Details", route: "/income", desc: "User provides monthly salary, salary date, and optional other income. Data is stored in AuthContext." },
    { step: "03", title: "Dashboard", route: "/dashboard", desc: "Full Debt Intelligence Dashboard with 9 interactive sections powered by the calculations engine." },
];

const DESIGN_TOKENS = [
    { token: "--color-purple", value: "#7300BE", usage: "Primary accent — buttons, logos, CTAs" },
    { token: "--color-purple-light", value: "#9333EA", usage: "Secondary purple highlights" },
    { token: "--color-blue", value: "#00B1FF", usage: "Step numbers, decorative elements" },
    { token: "--color-cyan", value: "#00FCFE", usage: "Accent highlights" },
    { token: "--color-danger", value: "#DC2626", usage: "High-rate warnings, errors, overpaying" },
    { token: "--color-warning", value: "#D97706", usage: "Interest leak, caution badges" },
    { token: "--color-success", value: "#059669", usage: "OK badges, savings indicators" },
    { token: "--color-bg", value: "#FCFCFC", usage: "Page background" },
    { token: "--color-bg-soft", value: "#F5F5F7", usage: "Section & input backgrounds" },
    { token: "--color-bg-card", value: "#FFFFFF", usage: "Card surfaces" },
    { token: "--color-text-primary", value: "#1A1A2E", usage: "Headings, primary content" },
    { token: "--color-text-secondary", value: "#6B7280", usage: "Body text" },
    { token: "--color-text-muted", value: "#9CA3AF", usage: "Captions, labels, placeholders" },
    { token: "--color-border", value: "#E5E7EB", usage: "All borders & dividers" },
    { token: "--color-border-focus", value: "#7300BE", usage: "Focus ring on interactive elements" },
];

const COMPONENTS = [
    { name: "DashboardBanner", file: "dashboard/DashboardBanner.tsx", desc: "Shows free trial status and last-updated timestamp." },
    { name: "DashboardScoreGauge", file: "dashboard/DashboardScoreGauge.tsx", desc: "Animated SVG circular gauge (0–100) with color-coded severity levels." },
    { name: "DebtSummaryCards", file: "dashboard/DebtSummaryCards.tsx", desc: "4 metric cards: total outstanding, monthly EMI, active accounts, avg interest rate." },
    { name: "DashboardAccountList", file: "dashboard/DashboardAccountList.tsx", desc: "Responsive account table sorted by APR with high-rate (>18%) warning badges." },
    { name: "DebtFreedomGPS", file: "dashboard/DebtFreedomGPS.tsx", desc: "Side-by-side comparison of current vs. optimized debt-free timeline." },
    { name: "InterestLeakReport", file: "dashboard/InterestLeakReport.tsx", desc: "Splits EMI into principal vs. interest with avoidable interest warning." },
    { name: "SmartPaymentPrioritizer", file: "dashboard/SmartPaymentPrioritizer.tsx", desc: "Interactive tool: enter extra cash, see optimal allocation via avalanche method." },
    { name: "SalaryCashFlow", file: "dashboard/SalaryCashFlow.tsx", desc: "Visualizes salary credit vs. ordered EMI outflows with ratio warning." },
    { name: "RefreshShare", file: "dashboard/RefreshShare.tsx", desc: "Refresh data, download PDF (placeholder), share on WhatsApp." },
];

const CALCULATIONS = [
    { name: "calculateInterestLeak()", params: "accounts, totalEmi, totalOutstanding, optimalRate", returns: "InterestLeak { totalEmi, principal, interest, avoidable }", desc: "Splits monthly EMI into principal vs interest components. Calculates avoidable interest by comparing current rates against an optimal rate." },
    { name: "calculatePaymentPrioritizer()", params: "extraAmount, accounts, optimalRate", returns: "PaymentAllocation[]", desc: "Allocates extra payments using the avalanche method (highest APR first). Returns per-account amounts and estimated annual savings." },
    { name: "calculateCashFlow()", params: "salary, salaryDate, accounts", returns: "CashFlowResult", desc: "Orders EMIs by due date against salary credit. Computes remaining balance and EMI-to-salary ratio." },
];

const DATA_MODELS = [
    {
        name: "MockProfile",
        fields: [
            "name: string", "panHash: string", "score: number (0–100)", "scoreLabel: string",
            "color: 'red' | 'orange' | 'yellow' | 'green'", "totalOutstanding: number",
            "monthlyEmi: number", "activeAccounts: number", "avgInterestRate: number",
            "accounts: Account[]", "overpayment: number", "optimalRate: number",
            "salary: number", "salaryDate: number (1–31)", "otherIncome: number",
            "currentTimeline: string", "optimizedTimeline: string", "timelineSaved: string",
        ],
    },
    {
        name: "Account",
        fields: [
            "lender: string", "outstanding: number", "apr: number",
            "type: 'credit_card' | 'loan' | 'emi'", "emi: number", "dueDate: number (1–31)",
        ],
    },
];

const API_ENDPOINTS = [
    {
        method: "POST",
        path: "/api/otp/send",
        desc: "Send OTP to an Indian mobile number. In production, integrates with SMS gateway (MSG91/Twilio).",
        body: `{
  "phone": "9876543210"
}`,
        response: `{
  "success": true,
  "message": "OTP sent successfully.",
  "expiresIn": 300
}`,
    },
    {
        method: "POST",
        path: "/api/otp/verify",
        desc: "Verify the 6-digit OTP code sent to the phone number.",
        body: `{
  "phone": "9876543210",
  "otp": "123456"
}`,
        response: `{
  "success": true,
  "verified": true,
  "message": "Phone number verified successfully."
}`,
    },
    {
        method: "POST",
        path: "/api/health-check",
        desc: "Submit PAN + phone → trigger CIBIL pull → return parsed debt health results with score breakdown, savings, interest leak, and cash flow.",
        body: `{
  "pan": "ABCDE1234F",
  "phone": "9876543210",
  "consent": {
    "timestamp": "2026-02-19T16:52:00Z",
    "version": "1.0"
  }
}`,
        response: `{
  "success": true,
  "id": "hc_1708367520_abc123",
  "profile": {
    "name": "Saurabh",
    "score": 40,
    "scoreLabel": "Needs Attention",
    "scoreBreakdown": { "dti": 20, "interestRate": 10, ... }
  },
  "savings": { "totalAnnual": 87120, "breakdown": [...] },
  "interestLeak": { "totalEmi": 28400, "avoidable": 5217 },
  "cashFlow": { "remaining": 31600, "ratio": 47 }
}`,
    },
    {
        method: "GET",
        path: "/api/health-check/:id",
        desc: "Get results for a completed health check by ID. Results auto-expire after 30 days.",
        body: null,
        response: `{
  "success": true,
  "id": "hc_1708367520_abc123",
  "createdAt": "2026-02-19T16:52:00Z",
  "expiresAt": "2026-03-21T16:52:00Z",
  "profile": { ... },
  "savings": { ... }
}`,
    },
    {
        method: "POST",
        path: "/api/callback",
        desc: "Book a callback with time preference and optional reason (e.g. 'Settlement inquiry'). Creates a CRM lead in production.",
        body: `{
  "user_id": "uuid",
  "preferred_time": "2026-02-22T10:00:00Z",
  "reason": "Settlement inquiry"
}`,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "preferred_time": "2026-02-22T10:00:00Z",
  "status": "pending",
  "message": "Callback scheduled successfully."
}`,
    },
    {
        method: "GET",
        path: "/api/subscription/plans",
        desc: "Returns all available subscription plans with pricing. Public endpoint — no auth required.",
        body: null,
        response: `{
  "lite": { "monthly": 499, "annual": 4999, "annual_savings_pct": 17 },
  "shield": { "monthly": 1999, "annual": 14999, "annual_savings_pct": 37 },
  "settlement": { "fee": "10% + GST", "min_debt": 100000 }
}`,
    },
    {
        method: "GET",
        path: "/api/subscription/status/:userId",
        desc: "Get current subscription status — tier, billing period, trial/active/expired, days remaining.",
        body: null,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "tier": "lite",
  "status": "active",
  "billing_period": "monthly",
  "trial_ends_at": "2026-05-21T00:00:00Z",
  "expires_at": "2026-03-21T00:00:00Z",
  "days_remaining": 28,
  "created_at": "2026-02-21T00:00:00Z"
}`,
    },
    {
        method: "POST",
        path: "/api/subscription/upgrade",
        desc: "Upgrade subscription tier or change billing period. Handles trial → paid, Lite → Shield, and period changes. Shield requires prior consent.",
        body: `{
  "user_id": "uuid",
  "tier": "shield",
  "billing_period": "annual"
}`,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "tier": "shield",
  "status": "active",
  "billing_period": "annual",
  "amount_paid": 14999,
  "expires_at": "2027-02-21T00:00:00Z",
  "message": "Successfully upgraded to Shield (annual)."
}`,
    },
    {
        method: "POST",
        path: "/api/subscription/shield-consent",
        desc: "Record explicit Shield consent: 'I authorize ExitDebt to communicate with my creditors on my behalf.' Must be called before upgrading to Shield tier.",
        body: `{
  "user_id": "uuid"
}`,
        response: `{
  "message": "Shield consent recorded.",
  "consent_id": "uuid",
  "timestamp": "2026-02-21T12:00:00Z"
}`,
    },
    {
        method: "POST",
        path: "/api/settlement/intake",
        desc: "Start a settlement case. Validates debt ≥ ₹1,00,000. Prevents duplicate active cases. Creates CRM record.",
        body: `{
  "user_id": "uuid",
  "total_debt": 500000,
  "target_amount": 300000
}`,
        response: `{
  "case": {
    "id": "uuid",
    "user_id": "uuid",
    "total_debt": 500000,
    "target_amount": 300000,
    "status": "intake",
    "settled_amount": null,
    "fee_amount": null,
    "assigned_to": null,
    "started_at": "2026-02-21T12:00:00Z",
    "settled_at": null
  },
  "message": "Settlement case created. Our team will contact you within 24 hours."
}`,
    },
    {
        method: "GET",
        path: "/api/settlement/:userId",
        desc: "Get the latest settlement case for a user. Returns status, amounts, assigned team member.",
        body: null,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "total_debt": 500000,
  "status": "negotiating",
  "settled_amount": null,
  "fee_amount": null,
  "assigned_to": "Ravi S.",
  "started_at": "2026-02-21T12:00:00Z"
}`,
    },
    {
        method: "POST",
        path: "/api/service-request",
        desc: "Create a service request (Shield users only). Types: 'harassment' or 'creditor_comms'. Requires active Shield subscription.",
        body: `{
  "user_id": "uuid",
  "type": "harassment",
  "details": "Receiving threatening calls from HDFC recovery agents"
}`,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "type": "harassment",
  "status": "open",
  "details": "Receiving threatening calls from HDFC recovery agents",
  "assigned_to": null,
  "created_at": "2026-02-21T12:00:00Z",
  "resolved_at": null
}`,
    },
    {
        method: "GET",
        path: "/api/service-request/:userId",
        desc: "List all service requests for a user, ordered by creation date (newest first).",
        body: null,
        response: `{
  "requests": [
    {
      "id": "uuid",
      "type": "harassment",
      "status": "active",
      "assigned_to": "Legal Team",
      "created_at": "2026-02-21T12:00:00Z"
    }
  ],
  "total": 1
}`,
    },
    {
        method: "POST",
        path: "/api/aa/consent",
        desc: "Initiate Account Aggregator consent flow for data linking. Integrates with Setu/OneMoney/Finvu in production.",
        body: `{
  "userId": "user_123",
  "phone": "9876543210"
}`,
        response: `{
  "success": true,
  "consentId": "aa_1708367520_xyz",
  "status": "PENDING",
  "redirectUrl": "https://aa.exitdebt.com/consent/...",
  "dataTypes": ["DEPOSIT", "CREDIT_CARD", "LOAN"]
}`,
    },
    {
        method: "GET",
        path: "/api/aa/fetch",
        desc: "Fetch latest data from Account Aggregator after consent is approved.",
        body: null,
        response: `{
  "success": true,
  "status": "NO_CONSENT",
  "data": null,
  "message": "Initiate consent via POST /api/aa/consent first."
}`,
    },
    {
        method: "GET",
        path: "/api/dashboard/:userId",
        desc: "Get full dashboard data — Freedom GPS, Interest Leak, Payment Prioritizer, Cash Flow, Health Score, accounts, and subscription status.",
        body: null,
        response: `{
  "success": true,
  "profile": { "name": "Saurabh", "score": 40, ... },
  "subscription": { "tier": "lite", "status": "active", "daysRemaining": 28 },
  "freedomGPS": { ... },
  "interestLeak": { ... },
  "cashFlow": { ... }
}`,
    },
    {
        method: "GET",
        path: "/api/dashboard/sales/:userId",
        desc: "Sales-only: full dashboard + 12-month trends + subscription history + service history. Internal use only (requires X-API-Key).",
        body: null,
        response: `{
  "success": true,
  "salesView": true,
  "profile": { ... },
  "subscription": { "tier": "shield", "upgrade_history": [...] },
  "trends": [
    { "month": "Jan", "outstanding": 624000, "interestPaid": 5217 }
  ],
  "serviceHistory": [
    { "type": "harassment", "status": "resolved", ... }
  ]
}`,
    },
    {
        method: "POST",
        path: "/api/prioritizer/calculate",
        desc: "Calculate optimal payment allocation for a given extra amount using the avalanche method (highest APR first).",
        body: `{
  "extraAmount": 10000,
  "accounts": [...],
  "optimalRate": 12
}`,
        response: `{
  "success": true,
  "method": "avalanche",
  "allocations": [
    { "lender": "HDFC Credit Card", "amount": 6000, "savings": 2160 },
    { "lender": "Bajaj Finserv", "amount": 4000, "savings": 1440 }
  ],
  "totalSavings": 3600
}`,
    },
    {
        method: "POST",
        path: "/api/pan/verify",
        desc: "Verify a PAN card number using Setu PAN API. In mock mode, returns synthetic data. Sandbox values: ABCDE1234A (valid), ABCDE1234B (invalid).",
        body: `{
  "pan": "ABCDE1234F",
  "consent": "Y",
  "reason": "Debt health check for ExitDebt user"
}`,
        response: `{
  "verification": "success",
  "message": "PAN is valid",
  "data": {
    "full_name": "Saurabh Mehta",
    "category": "Individual",
    "aadhaar_seeding_status": "Y"
  }
}`,
    },
    {
        method: "POST",
        path: "/api/payment/create-link",
        desc: "Create a UPI payment link for subscription upgrade. In mock mode, returns a simulated link. In production, calls Setu UPI API.",
        body: `{
  "user_id": "user_123",
  "tier": "shield",
  "billing_period": "annual"
}`,
        response: `{
  "id": "pay_abc123",
  "user_id": "user_123",
  "tier": "shield",
  "billing_period": "annual",
  "amount": 14999,
  "currency": "INR",
  "status": "CREATED",
  "payment_link": "https://pay.setu.co/...",
  "upi_link": "upi://pay?pa=exitdebt@ybl&am=14999",
  "created_at": "2026-02-21T12:00:00Z"
}`,
    },
    {
        method: "GET",
        path: "/api/payment/status/:paymentId",
        desc: "Check the current status of a payment by its ID.",
        body: null,
        response: `{
  "id": "pay_abc123",
  "status": "PAYMENT_SUCCESSFUL",
  "amount": 14999,
  "currency": "INR"
}`,
    },
    {
        method: "POST",
        path: "/api/payment/confirm/:paymentId",
        desc: "Mock-confirm a payment (development only). In production, payments are confirmed via Setu webhooks.",
        body: null,
        response: `{
  "message": "Payment confirmed",
  "payment": { "id": "pay_abc123", "status": "paid", "amount": 14999 }
}`,
    },
    {
        method: "POST",
        path: "/api/payment/webhook",
        desc: "Receive Setu UPI payment notifications. In production, webhook signature is verified before processing.",
        body: `{
  "type": "PAYMENT_SUCCESSFUL",
  "paymentLinkId": "pay_abc123"
}`,
        response: `{
  "success": true,
  "message": "Webhook received"
}`,
    },
    {
        method: "POST",
        path: "/api/advisory/purchase",
        desc: "Initiate an advisory plan purchase via UPI. Tiers: basic (₹499), standard (₹1,499), premium (₹2,999).",
        body: `{
  "user_id": "uuid",
  "tier": "standard"
}`,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "tier": "standard",
  "price": 1499.0,
  "status": "pending",
  "plan_data": { "features": [...], "order_id": "MOCK_ORDER_..." },
  "payment_url": "upi://pay?...",
  "message": "Advisory plan (standard) created. Complete payment to activate."
}`,
    },
    {
        method: "GET",
        path: "/api/advisory/:advisoryId",
        desc: "Get advisory plan details by ID, including status, tier, price, and plan data.",
        body: null,
        response: `{
  "id": "uuid",
  "user_id": "uuid",
  "tier": "standard",
  "price": 1499.0,
  "status": "active",
  "plan_data": { "features": [...] },
  "message": "Advisory plan (standard) — Status: active"
}`,
    },
    {
        method: "DELETE",
        path: "/api/user/delete-request",
        desc: "Request user data deletion (GDPR/DPDPA compliance). Soft-deletes personal data while preserving audit trail.",
        body: `{
  "user_id": "uuid",
  "phone": "9876543210"
}`,
        response: `{
  "success": true,
  "message": "Your data deletion request has been processed. Personal data has been removed."
}`,
    },
    {
        method: "POST",
        path: "/aa/consent",
        desc: "Create an Account Aggregator consent request. Returns a redirect URL for user to approve data sharing.",
        body: `{
  "phone": "9876543210",
  "fi_types": ["DEPOSIT", "CREDIT_CARD", "TERM_DEPOSIT"]
}`,
        response: `{
  "id": "consent_abc123",
  "url": "https://anumati.setu.co/consent/...",
  "status": "PENDING"
}`,
    },
    {
        method: "GET",
        path: "/aa/consent/:consentId",
        desc: "Check the current status of an Account Aggregator consent request.",
        body: null,
        response: `{
  "id": "consent_abc123",
  "status": "APPROVED",
  "fi_types": ["DEPOSIT", "CREDIT_CARD"],
  "created_at": "2026-02-21T12:00:00Z"
}`,
    },
    {
        method: "POST",
        path: "/aa/consent/:consentId/approve",
        desc: "Mock-approve a consent (development only). In production, users approve via Setu's consent screens.",
        body: null,
        response: `{
  "message": "Consent approved",
  "consent": { "id": "consent_abc123", "status": "APPROVED" }
}`,
    },
    {
        method: "GET",
        path: "/aa/data/:consentId",
        desc: "Fetch financial data from Account Aggregator after consent approval. Returns parsed debt accounts from bank statements.",
        body: null,
        response: `{
  "consent_id": "consent_abc123",
  "status": "COMPLETED",
  "accounts": [
    { "type": "CREDIT_CARD", "issuer": "HDFC", "balance": 182000, "limit": 300000 }
  ],
  "raw_fi_count": 3
}`,
    },
    {
        method: "POST",
        path: "/aa/webhook",
        desc: "Receive Setu AA notifications (consent status updates, FI data ready). Webhook signature is verified in production.",
        body: `{
  "type": "CONSENT_STATUS_UPDATE",
  "consentId": "consent_abc123",
  "data": { "status": "APPROVED" }
}`,
        response: `{
  "success": true,
  "message": "Webhook received"
}`,
    },
];

/* ───── Page Component ───── */

export default function DocsPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            {/* Header */}
            <nav style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "var(--color-purple)" }}>E</div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>ExitDebt</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(115,0,190,0.08)", color: "var(--color-purple)" }}>Docs</span>
                        <Link href="/" className="text-sm font-medium transition-colors" style={{ color: "var(--color-text-secondary)" }}>← Back to app</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
                {/* Title */}
                <div className="mb-14">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Documentation</h1>
                    <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>Technical reference for the ExitDebt platform — architecture, design system, data models, and calculations engine.</p>
                </div>

                {/* Table of Contents */}
                <div className="rounded-2xl p-6 mb-12" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>On this page</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {["User Flow", "API Endpoints", "Design System", "Components", "Calculations", "Data Models", "Tech Stack"].map((s) => (
                            <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-medium px-3 py-2 rounded-lg transition-colors" style={{ color: "var(--color-purple)" }}>
                                {s}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── User Flow ── */}
                <section id="user-flow" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>User Flow</h2>
                    <div className="space-y-4">
                        {USER_FLOW.map((item) => (
                            <div key={item.step} className="rounded-xl p-5 flex items-start gap-4" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <span className="text-3xl font-black shrink-0" style={{ color: "var(--color-blue)" }}>{item.step}</span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{item.title}</h3>
                                        <code className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>{item.route}</code>
                                    </div>
                                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Design System ── */}
                <section id="design-system" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Design System</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>Built on Tailwind CSS v4 <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>@theme</code> directive. All tokens are CSS custom properties.</p>

                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-muted)" }}>
                            <div className="col-span-1"></div>
                            <div className="col-span-3">Token</div>
                            <div className="col-span-2">Value</div>
                            <div className="col-span-6">Usage</div>
                        </div>
                        {DESIGN_TOKENS.map((t) => (
                            <div key={t.token} className="grid grid-cols-12 gap-4 px-5 py-3 items-center" style={{ borderTop: "1px solid var(--color-border)" }}>
                                <div className="col-span-1">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: t.value, borderColor: "var(--color-border)" }} />
                                </div>
                                <div className="col-span-3">
                                    <code className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{t.token}</code>
                                </div>
                                <div className="col-span-2">
                                    <code className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.value}</code>
                                </div>
                                <div className="col-span-6">
                                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{t.usage}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Components ── */}
                <section id="components" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Dashboard Components</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>9 modular components compose the Debt Intelligence Dashboard.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {COMPONENTS.map((c) => (
                            <div key={c.name} className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <h3 className="text-sm font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>{c.name}</h3>
                                <code className="text-[10px] px-1.5 py-0.5 rounded block mb-2 w-fit" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-muted)" }}>{c.file}</code>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Calculations ── */}
                <section id="calculations" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Calculations Engine</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                        Located in <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>lib/calculations.ts</code>. Pure functions with no side effects.
                    </p>

                    <div className="space-y-4">
                        {CALCULATIONS.map((fn) => (
                            <div key={fn.name} className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <code className="text-sm font-bold" style={{ color: "var(--color-purple)" }}>{fn.name}</code>
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Parameters</p>
                                        <code className="text-xs block" style={{ color: "var(--color-text-secondary)" }}>{fn.params}</code>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Returns</p>
                                        <code className="text-xs block" style={{ color: "var(--color-text-secondary)" }}>{fn.returns}</code>
                                    </div>
                                </div>
                                <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{fn.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Data Models ── */}
                <section id="data-models" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Data Models</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>TypeScript interfaces from <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>lib/mockProfiles.ts</code></p>

                    <div className="space-y-4">
                        {DATA_MODELS.map((model) => (
                            <div key={model.name} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                                <div className="px-5 py-3" style={{ backgroundColor: "var(--color-bg-soft)" }}>
                                    <code className="text-sm font-bold" style={{ color: "var(--color-purple)" }}>interface {model.name}</code>
                                </div>
                                <div className="px-5 py-3 space-y-1" style={{ backgroundColor: "var(--color-bg-card)" }}>
                                    {model.fields.map((f) => (
                                        <div key={f} className="flex items-start gap-2">
                                            <span className="text-xs mt-0.5" style={{ color: "var(--color-purple)" }}>•</span>
                                            <code className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{f}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── API Endpoints ── */}
                <section id="api-endpoints" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>API Endpoints</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                        Next.js Route Handlers at <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>app/api/</code>. All responses are JSON.
                    </p>

                    <div className="space-y-4">
                        {API_ENDPOINTS.map((ep) => (
                            <div key={ep.method + ep.path} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                                <div className="flex items-center gap-3 px-5 py-3" style={{ backgroundColor: "var(--color-bg-soft)" }}>
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                                        style={{ backgroundColor: ep.method === "GET" ? "var(--color-blue)" : ep.method === "DELETE" ? "var(--color-danger)" : "var(--color-purple)" }}
                                    >
                                        {ep.method}
                                    </span>
                                    <code className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{ep.path}</code>
                                </div>
                                <div className="px-5 py-4 space-y-3" style={{ backgroundColor: "var(--color-bg-card)" }}>
                                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{ep.desc}</p>
                                    {ep.body && (
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Request Body</p>
                                            <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-primary)" }}>{ep.body}</pre>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Response</p>
                                        <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-primary)" }}>{ep.response}</pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Tech Stack ── */}
                <section id="tech-stack" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Tech Stack</h2>

                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                        {[
                            { layer: "Framework", tech: "Next.js 16 (App Router, Turbopack)" },
                            { layer: "Language", tech: "TypeScript" },
                            { layer: "Styling", tech: "Tailwind CSS v4 (@theme tokens)" },
                            { layer: "Typography", tech: "Inter (via next/font)" },
                            { layer: "State", tech: "React Context (AuthContext)" },
                            { layer: "Data", tech: "Mock profiles (no API calls)" },
                        ].map((row, i) => (
                            <div key={row.layer} className="grid grid-cols-12 gap-4 px-5 py-3" style={{ borderTop: i > 0 ? "1px solid var(--color-border)" : undefined, backgroundColor: i === 0 ? "var(--color-bg-soft)" : "var(--color-bg-card)" }}>
                                <div className="col-span-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: i === 0 ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>{row.layer}</span>
                                </div>
                                <div className="col-span-9">
                                    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.tech}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mock Data Note */}
                <section className="rounded-xl p-6 mb-12" style={{ backgroundColor: "rgba(115,0,190,0.04)", border: "1px solid rgba(115,0,190,0.15)" }}>
                    <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-purple)" }}>Testing with Mock Data</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                        The app includes 4 predefined profiles. Use PAN <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>ABCDE1234F</code> with
                        phone <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>9876543210</code> to
                        load Saurabh&apos;s critical debt profile (score: 38). Any other valid PAN gets a deterministic profile.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid var(--color-border)" }}>
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>© {new Date().getFullYear()} ExitDebt Technologies Pvt. Ltd.</p>
                </div>
            </footer>
        </div>
    );
}
