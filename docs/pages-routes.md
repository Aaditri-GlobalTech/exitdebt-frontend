# Pages & Routes

## Route Map

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/` | `app/page.tsx` | Public | Landing page |
| `/about` | `app/about/page.tsx` | Public | Company info |
| `/faq` | `app/faq/page.tsx` | Public | FAQ |
| `/terms` | `app/terms/page.tsx` | Public | Terms of service |
| `/privacy` | `app/privacy/page.tsx` | Public | Privacy policy |
| `/blogs` | `app/blogs/page.tsx` | Public | Blog listing |
| `/blogs/[slug]` | `app/blogs/[slug]/page.tsx` | Public | Individual blog post |
| `/how-to-get-out-of-debt-india` | `app/how-to-get-out-of-debt-india/page.tsx` | Public | SEO content page |
| `/how-to-reduce-emi-burden` | `app/how-to-reduce-emi-burden/page.tsx` | Public | SEO content page |
| `/credit-card-debt-help-india` | `app/credit-card-debt-help-india/page.tsx` | Public | SEO content page |
| `/debt-restructuring-india` | `app/debt-restructuring-india/page.tsx` | Public | SEO content page |
| `/manage-multiple-loans-india` | `app/manage-multiple-loans-india/page.tsx` | Public | SEO content page |
| `/get-started` | `app/get-started/page.tsx` | Public | Soft-launch lead form |
| `/get-started/thank-you` | `app/get-started/thank-you/page.tsx` | Public | Confirmation after registration |
| `/login` | `app/login/page.tsx` | Public | PAN + phone login |
| `/onboarding` | `app/onboarding/page.tsx` | JWT (step 1+) | 3-step onboarding |
| `/dashboard` | `app/dashboard/page.tsx` | JWT + subscription | Main user dashboard |
| `/profile` | `app/profile/page.tsx` | JWT | Profile management |
| `/accounts` | `app/accounts/page.tsx` | JWT | Debt account listing |
| `/schedule` | `app/schedule/page.tsx` | JWT | Consultation scheduling |
| `/income` | `app/income/page.tsx` | JWT | Update income details |
| `/checkout` | `app/checkout/page.tsx` | JWT | Payment checkout |
| `/settings` | `app/settings/page.tsx` | JWT | User settings |
| `/upgrade` | `app/upgrade/page.tsx` | JWT | Subscription upgrade |
| `/admin` | `app/admin/page.tsx` | Admin API key | Admin CMS (blogs + leads) |
| `/admin/leads` | `app/admin/leads/page.tsx` | Admin API key | Lead management |
| `/admin/leads/[id]` | `app/admin/leads/[id]/page.tsx` | Admin API key | Lead detail |
| `/admin/intake/[id]` | `app/admin/intake/[id]/page.tsx` | Admin API key | Settlement intake |

---

## Page Details

### `/` — Landing Page

The primary marketing page. Sections:
- **Hero**: headline, CTA to `/get-started`
- **How It Works**: 3-step process
- **Dashboard preview**: screenshot/demo of the dashboard tools
- **Pricing**: monthly/annual toggle with Lite and Shield cards
- **Blog section**: latest 3 posts (fetched from API, falls back to 3 static articles)
- **FAQ**: collapsible FAQ section
- **Footer**

---

### `/get-started` — Soft Launch Lead Form

A simplified registration that captures:
- Name, phone, city, state
- Total debt amount
- Criticality level (self-reported severity)

No KYC or PAN required. Sends `POST /api/leads/register`.  
On success, redirects to `/get-started/thank-you`.

---

### `/login` — Login

Two-step login:
1. Enter PAN + phone → `POST /api/auth/login`
2. Verify OTP → `POST /api/otp/verify`

On success, JWT is stored in cookies and user is redirected to `/dashboard`.

---

### `/onboarding` — 3-Step Onboarding

Multi-step form rendered by a single page component with internal step state.

**Step 1 — Basic Details** (`components/onboarding/Step1BasicDetails.tsx`)
- Full name, mobile, email, city, state
- Calls `POST /api/onboarding/step-1`
- Issues a JWT on success (stored in `sessionStorage` during onboarding)

**Step 2 — Verification** (`components/onboarding/Step2Verification.tsx`)
- PAN number input
- DPDP consent checkboxes
- Calls `POST /api/onboarding/verify-pan`
- Optional: Aadhar OTP verification (`/onboarding/aadhar/init` + `/aadhar/verify`)

**Step 3 — Book Call** (`components/onboarding/Step3BookCall.tsx`)
- Consultation slot picker (7-day rolling calendar)
- Criticality selector
- Calls `POST /api/onboarding/consultation/book`
- On success, JWT is moved from `sessionStorage` to cookies

---

### `/dashboard` — Main Dashboard

**Auth requirement**: Valid JWT + active subscription (trial or paid).

Displays the 7 debt intelligence tools returned by `GET /api/dashboard/{user_id}`:

1. **Debt Health Score** — Radial gauge (0–100) with colour-coded category
2. **Debt Summary** — Cards showing total outstanding, total EMI, avg rate
3. **Debt Freedom GPS** — Timeline comparing current vs. optimised payoff
4. **Interest Leak Report** — Doughnut chart of principal vs. interest
5. **Smart Payment Prioritizer** — Interactive allocation tool (avalanche/snowball)
6. **Salary Day Cash Flow** — Calendar view of EMIs vs. salary date
7. **Credit Score Impact** — Predicted CIBIL score trajectory

The dashboard checks subscription status on mount. If expired, it shows an upgrade prompt.

---

### `/blogs` — Blog Listing

Fetches published blogs from `GET /api/blogs` (via proxy).

**Merge strategy**: Dynamic blogs from the API are shown first, followed by static SEO articles that are not already in the API response (deduped by slug).

**Static SEO articles** (always shown):
- `how-to-get-out-of-debt-india`
- `credit-card-debt-help-india`
- `how-to-reduce-emi-burden`
- `manage-multiple-loans-india`
- `debt-restructuring-india`

These static slugs link to top-level routes (`/how-to-get-out-of-debt-india`), not `/blogs/slug`.

---

### `/blogs/[slug]` — Blog Detail

Fetches a single post from `GET /api/blogs/{slug}` (via proxy).

**Fallback**: Three legacy static articles are hard-coded in the component and served from memory if the slug matches:
- `credit-card-mistakes`
- `priya-saved-62k`
- `personal-loan-vs-credit-card`

Content is rendered as Markdown using `react-markdown` with custom component overrides for consistent typography.

SEO meta tags (title, description, keywords, og:*) are injected dynamically via `document.head` manipulation.

---

### `/admin` — Admin Panel (CMS)

**Auth**: Sends `X-API-Key` header (value entered at login prompt on first visit, stored in `localStorage`).

Two sections:
1. **Blog CMS** — Create, edit, publish/unpublish, and delete blog posts. Rich form with all fields including SEO metadata.
2. **Lead Management** (links to `/admin/leads`)

---

### `/admin/leads` — Lead Management

Paginated lead list with filters:
- Stage, priority, assigned team member, source
- Search by name/phone/email
- Date range, debt range, health score range

---

### `/admin/leads/[id]` — Lead Detail

Full lead profile showing:
- Contact info and CRM fields (editable)
- Debt account breakdown
- Health score with metric breakdown
- Subscription status
- Timeline of all interactions
- Notes (with add-note form)
