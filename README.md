# ExitDebt

**See your debt clearly. Solve it smartly.**

ExitDebt is a full-spectrum debt platform for salaried Indians. Users enter their PAN and phone number, get an instant CIBIL-powered debt health score with unique intelligence tools, and get 3 months of free access — all in 30 seconds.

---

## 💡 How It Works

```
PAN + Phone  →  CIBIL Pull  →  Full Dashboard (3mo free)  →  Lite/Shield Subscribe
```

1. **Enter PAN + Phone** — Verified via OTP
2. **Instant CIBIL Pull** — All loans and credit cards auto-populated
3. **Debt Health Score** — Proprietary 0–100 score (based on DTI, rates, utilization, history)
4. **Intelligence Tools** — Debt Freedom GPS, Interest Leak Report, Smart Payment Prioritizer, Salary Day Cash Flow, Credit Score Impact Predictor
5. **3-Month Free Trial** — Full Lite dashboard access, then tiered subscriptions

## 💰 Business Model

Tiered subscriptions + debt services:
- **Lite:** ₹499/month or ₹4,999/year (dashboard + 7 tools + monitoring)
- **Shield:** ₹1,999/month or ₹14,999/year (+ harassment protection + creditor negotiation)
- **Settlement:** 10% + GST on settled debt (₹1L+ minimum)
- **Lender Commissions** (Phase 2 — 0.5–3% on consolidation loans via DSA partnerships)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (SSR + SEO) |
| Backend | Python (FastAPI) |
| Database | PostgreSQL |
| CRM | Zoho CRM |
| Payments | UPI via aggregator |
| WhatsApp | WATI |
| Hosting | AWS (specific services TBD with dev team) |

## 📊 Status

| Milestone | Status |
|-----------|--------|
| Strategy & business model | ✅ Complete |
| Product requirements (PRD) | ✅ Complete |
| Dev team handoff | ⬜ Pending |
| Sprint 1 kickoff | ⬜ Pending |

## 🎯 Target

- **Users:** Salaried Indians with 2+ active loans/credit cards
- **GTM:** Organic only — Reddit, X (Twitter), Instagram, chatbot/LLM recommendations
- **Brand:** Zerodha-like — clean, minimal, trust-through-transparency
- **Timeline:** 13 weeks to soft launch

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run
```bash
cd exitdebt-app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## User Flow

```
Landing Page → PAN + Phone → OTP Verify → Income Details → Debt Intelligence Dashboard
```

1. **Landing Page** (`/`) — Enter PAN + phone, verify via OTP, pull mock CIBIL report
2. **Income Details** (`/income`) — Provide monthly salary, salary date, and optional other income
3. **Dashboard** (`/dashboard`) — Full debt intelligence overview with 9 interactive sections
4. **Profile** (`/profile`) — View masked PAN/phone, salary, CIBIL score, logout
5. **Schedule** (`/schedule`) — Book a callback with a debt expert
6. **FAQ** (`/faq`) — Trust & security questions, about ExitDebt

## Features

### Landing Page
- **PAN + Phone Form** — No full name required, instant validation
- **3-Step OTP Flow** — Details → OTP verification → Processing animation → Income
- **Testimonials** — Priya (₹62K saved), Rahul (38→14% rate), Sneha (debt-free in 18mo)
- **FAQ Preview** — Accordion with top questions linking to `/faq`
- **Trust Signals** — "No CIBIL impact", "256-bit encrypted", "Free forever"
- **How It Works** — 3-step process explainer
- **Blog Section** — Financial articles with category badges
- **SEO** — Meta tags, OG tags, Twitter cards, FAQ structured data (JSON-LD)

### Income Details Screen
- **Salary Input** — Required monthly after-tax salary with ₹ prefix
- **Salary Date** — Day of month (1–31) for salary credit
- **Other Income** — Optional additional income source
- **Inline Validation** — Real-time error messages, disabled button until valid

### Debt Intelligence Dashboard
- **Debt Health Score** — Animated SVG gauge (0–100) with 5-factor dynamic scoring
- **Summary Cards** — Total outstanding, monthly EMI, active accounts, avg interest rate
- **Account List** — Sortable by APR with high-rate (>18%) warning badges
- **Debt Freedom GPS** — Current vs. optimized debt-free timeline comparison
- **Interest Leak Report** — Principal/interest split with avoidable interest warning
- **Smart Payment Prioritizer** — Interactive tool: enter extra cash, see optimal allocation via avalanche method
- **Salary Day Cash Flow** — EMI timeline against salary credit with EMI-to-salary ratio
- **Refresh & Share** — Refresh data, download PDF, share on WhatsApp

### Profile Page (`/profile`)
- Masked PAN and phone number
- Salary, salary date, and CIBIL score
- Logout and back-to-dashboard actions

### Schedule a Call (`/schedule`)
- Time slot picker (Morning, Afternoon, Evening)
- Booking confirmation

### FAQ Page (`/faq`)
- Categorized: Trust & Security, About ExitDebt
- Reusable accordion component
- CTA to schedule a call

## Authentication & Data Rules

| Rule | Implementation |
|---|---|
| **Session Persistence** | Cookie-based, 30-day auto-expire |
| **PAN Storage** | SHA-256 hashed via `hashPAN()` — raw PAN never stored |
| **Consent Tracking** | Timestamp + version stored for DPDP compliance |
| **Hydration Guard** | `isReady` flag prevents flash-of-redirect |
| **OTP Verification** | 6-digit code verification on landing page |

## Scoring Model (0–100, higher = healthier)

Dynamic `calculateDebtHealthScore()` with 5 weighted factors:

| Factor | Weight | Scoring |
|---|---|---|
| DTI Ratio | 30% | <30%=30, 30-50%=20, 50-70%=10, >70%=0 |
| Avg Interest Rate | 25% | <12%=25, 12-18%=18, 18-30%=10, >30%=0 |
| Active Accounts | 15% | 1-2=15, 3-4=10, 5-6=5, >6=0 |
| Credit Utilization | 15% | <30%=15, 30-50%=10, 50-75%=5, >75%=0 |
| Payment History | 15% | 0 missed=15, 1-2=10, 3+=0 |

## Savings Calculation

```
savings_per_account = outstanding × (current_rate - optimal_rate) / 100
total_annual_savings = sum(savings for accounts where rate > optimal)
```

Implemented via `calculateTotalAnnualSavings()` — replaces hardcoded values.

## API Endpoints

All 12 core endpoints with input validation. Full docs at `/docs`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/otp/send` | Send OTP to phone |
| `POST` | `/api/otp/verify` | Verify OTP code |
| `POST` | `/api/health-check` | PAN+phone+consent → full report |
| `GET` | `/api/health-check/:id` | Retrieve by ID (30-day expiry) |
| `POST` | `/api/callback` | Book callback with time slot |
| `POST` | `/api/subscription/purchase` | Initiate UPI payment ₹999/yr |
| `GET` | `/api/subscription/status` | Check trial/active/expired |
| `POST` | `/api/aa/consent` | Initiate AA consent flow |
| `GET` | `/api/aa/fetch` | Fetch AA data |
| `GET` | `/api/dashboard/:userId` | Full dashboard data |
| `GET` | `/api/dashboard/sales/:userId` | Sales view + trends + offers |
| `POST` | `/api/prioritizer/calculate` | Payment allocation (avalanche) |

## Design System

Built on Tailwind CSS v4 `@theme` directive:

| Token | Value | Usage |
|---|---|---|
| `--color-purple` | `#7300BE` | Primary accent — buttons, logos, CTAs |
| `--color-blue` | `#00B1FF` | Step numbers, decorative |
| `--color-cyan` | `#00FCFE` | Highlights |
| `--color-danger` | `#DC2626` | High-rate warnings, errors |
| `--color-warning` | `#D97706` | Interest leak alerts |
| `--color-success` | `#059669` | OK badges, savings |
| `--color-bg` | `#FCFCFC` | Page background |
| `--color-bg-card` | `#FFFFFF` | Card surfaces |
| `--color-text-primary` | `#1A1A2E` | Headings |
| `--color-text-secondary` | `#6B7280` | Body text |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Font | Inter (via next/font) |
| State | React Context (`AuthContext`) |
| Auth | Cookie-based sessions + SHA-256 PAN hashing |
| Data | Mock profiles (4 predefined CIBIL profiles) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, SEO, JSON-LD schema
│   ├── page.tsx                # Landing page (OTP flow + testimonials)
│   ├── globals.css             # @theme tokens, animations
│   ├── income/page.tsx         # Income collection screen
│   ├── dashboard/page.tsx      # Debt Intelligence Dashboard
│   ├── profile/page.tsx        # User profile (masked PAN, CIBIL score)
│   ├── schedule/page.tsx       # Book a callback
│   ├── faq/page.tsx            # FAQ with accordion sections
│   ├── docs/page.tsx           # API documentation
│   ├── articles/[slug]/        # Blog article pages (SSG)
│   └── api/
│       ├── otp/                # OTP send + verify
│       ├── health-check/       # CIBIL pull + results
│       ├── callback/           # Callback booking
│       ├── subscription/       # Purchase + status
│       ├── aa/                 # Account Aggregator
│       ├── dashboard/          # User + sales dashboard
│       └── prioritizer/        # Payment allocation
├── components/
│   ├── Navbar.tsx              # Auth-aware nav with profile avatar
│   ├── Footer.tsx              # Footer
│   ├── Form.tsx                # PAN/phone validation
│   ├── FAQAccordion.tsx        # Reusable accordion
│   ├── PrimaryButton.tsx       # Button with loading spinner
│   └── dashboard/
│       ├── DashboardBanner.tsx
│       ├── DashboardScoreGauge.tsx
│       ├── DebtSummaryCards.tsx
│       ├── DashboardAccountList.tsx
│       ├── DebtFreedomGPS.tsx
│       ├── InterestLeakReport.tsx
│       ├── SmartPaymentPrioritizer.tsx
│       ├── SalaryCashFlow.tsx
│       └── RefreshShare.tsx
└── lib/
    ├── AuthContext.tsx          # Cookie auth + SHA-256 + consent tracking
    ├── mockProfiles.ts         # 4 profiles with creditUtilization, missedPayments
    ├── calculations.ts         # Scoring, interest leak, prioritizer, cash flow, savings
    └── utils.ts                # Validation, hashPAN, selectProfile, formatCurrency
```

## Calculations Engine (`lib/calculations.ts`)

| Function | Description |
|---|---|
| `calculateDebtHealthScore()` | 5-factor scoring model (DTI, rate, accounts, utilization, payment history) |
| `calculateTotalAnnualSavings()` | Per-account savings at optimal rate |
| `calculateInterestLeak()` | Splits EMI into principal vs interest, calculates avoidable interest |
| `calculatePaymentPrioritizer()` | Avalanche method payment allocation with per-account savings |
| `calculateCashFlow()` | Salary vs EMI timeline with EMI-to-salary ratio |

## Mock Data

4 predefined profiles with dynamic scoring:

| Profile | PAN Hash | Score | Label |
|---|---|---|---|
| Saurabh | `abcde1234f` | 40 | Needs Attention |
| Priya | `fghij5678k` | 83 | Excellent |
| Rahul | `klmno9012p` | 55 | Fair |
| Meera | `qrstu3456v` | 93 | Excellent |

Enter PAN `ABCDE1234F` with phone `9876543210` to load Saurabh's profile. Any valid PAN gets a deterministic profile.

## SEO

- ✅ Title + meta description on every page
- ✅ Open Graph (Facebook/LinkedIn) tags
- ✅ Twitter Card tags
- ✅ FAQ structured data (JSON-LD) for Google rich results
- ✅ Semantic HTML (`<main>`, `<nav>`, `<section>`, `<footer>`)
- ✅ Static pre-rendering for crawlers
- ✅ `noindex` on auth-protected pages (`/profile`)
- ✅ Font `display: "swap"` for performance

## License

© 2026 ExitDebt Technologies Pvt. Ltd.

---

*Part of [Aaditri Technologies](../README.md)*
