# Frontend Architecture

## Directory Structure

```
exitdebt-frontend/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, global providers)
│   ├── page.tsx                # Landing page (/)
│   ├── about/
│   ├── blogs/
│   │   ├── page.tsx            # Blog listing (/blogs)
│   │   └── [slug]/page.tsx     # Individual post (/blogs/:slug)
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell (auth gate)
│   │   └── page.tsx            # Main dashboard (/dashboard)
│   ├── admin/
│   │   ├── page.tsx            # Admin CMS (/admin)
│   │   ├── leads/
│   │   │   ├── page.tsx        # Lead list (/admin/leads)
│   │   │   └── [id]/page.tsx   # Lead detail (/admin/leads/:id)
│   │   └── intake/
│   │       └── [id]/page.tsx   # Settlement intake (/admin/intake/:id)
│   ├── login/
│   ├── onboarding/
│   ├── get-started/
│   │   ├── page.tsx
│   │   └── thank-you/page.tsx
│   ├── checkout/
│   ├── profile/
│   ├── accounts/
│   ├── settings/
│   ├── upgrade/
│   ├── schedule/
│   ├── income/
│   ├── faq/
│   ├── terms/
│   ├── privacy/
│   ├── how-to-get-out-of-debt-india/
│   ├── how-to-reduce-emi-burden/
│   ├── credit-card-debt-help-india/
│   ├── debt-restructuring-india/
│   └── manage-multiple-loans-india/
│
├── components/                 # Shared React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BlogSection.tsx
│   ├── CookieConsent.tsx
│   ├── SubscriptionGate.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── FAQ.tsx
│   ├── FAQAccordion.tsx
│   ├── PricingCard.tsx
│   ├── PricingToggle.tsx
│   ├── OTPInput.tsx
│   ├── PrimaryButton.tsx
│   ├── Form.tsx
│   ├── CallbackBooking.tsx
│   ├── CallbackModal.tsx
│   └── onboarding/
│       ├── Step1BasicDetails.tsx
│       ├── Step2Verification.tsx
│       └── Step3BookCall.tsx
│
├── lib/                        # Context, utilities, and business logic
│   ├── AuthContext.tsx         # Global auth state
│   ├── SubscriptionContext.tsx # Global subscription state
│   ├── calculations.ts         # Financial calculations
│   ├── mockProfiles.ts         # Dev/demo mock data
│   └── utils.ts                # PAN hashing and helpers
│
├── public/                     # Static assets (SVGs, images)
├── next.config.ts              # Next.js config (rewrites proxy)
├── tailwind.config.ts          # Tailwind theme
├── tsconfig.json
└── package.json
```

---

## Rendering Model

The app uses **Next.js App Router** with React Server Components (RSC) as the default.

However, nearly every page that involves auth, user state, or data fetching uses `"use client"` at the top. This is because:

1. Auth state lives in cookies and `sessionStorage` — only accessible in the browser.
2. Most pages fetch data from the backend in `useEffect` hooks (client-side fetching).
3. The subscription gate uses React context.

### Server vs Client components

| Component / Page | Rendering |
|------------------|-----------|
| Root `layout.tsx` | Server (static shell) |
| All dashboard pages | Client (`"use client"`) |
| All auth pages | Client (`"use client"`) |
| Blog listing / detail | Client (`"use client"`) |
| SEO content pages | Server (static content) |
| Landing page | Mix (hero is server, dynamic sections are client) |

---

## API Proxy Architecture

All API calls flow through the **Next.js rewrite proxy** defined in `next.config.ts`:

```ts
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${BACKEND_URL}/api/:path*`,
    },
  ];
}
```

**How it works**:

```
Browser                    Next.js server              FastAPI backend
   │                            │                            │
   │  fetch("/api/blogs")       │                            │
   │ ─────────────────────────► │                            │
   │                            │  fetch(`${BACKEND_URL}/api/blogs`)
   │                            │ ──────────────────────────►│
   │                            │  Response                  │
   │                            │ ◄──────────────────────────│
   │  Response                  │                            │
   │ ◄───────────────────────── │                            │
```

**Key benefit**: The browser never needs to know the backend's real URL. This means:
- No CORS issues in production.
- The backend URL can change without updating the frontend bundle.
- Works identically on localhost and Vercel.

**Configuration**:
- `BACKEND_URL` (server-side env var, no `NEXT_PUBLIC_` prefix) — set in Vercel dashboard.
- `NEXT_PUBLIC_API_URL` — leave **empty** in all environments so all fetches use relative URLs and go through the proxy.

See [API Integration](api-integration.md) for more detail.

---

## Theme System

Colors are defined as CSS custom properties in the global stylesheet and consumed by both Tailwind utilities and inline styles:

```css
:root {
  --color-teal: #0D9488;
  --color-bg: #FAFAFA;
  --color-bg-soft: #F4F5F7;
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted: #9CA3AF;
  --color-border: #E5E7EB;
}
```

This allows components to reference theme values via `style={{ color: "var(--color-teal)" }}` without needing Tailwind's JIT engine for dynamic values.

---

## Context Providers

Two React contexts wrap the entire application:

```tsx
// app/layout.tsx (simplified)
<AuthProvider>
  <SubscriptionProvider>
    {children}
  </SubscriptionProvider>
</AuthProvider>
```

| Context | File | Stores |
|---------|------|--------|
| `AuthContext` | `lib/AuthContext.tsx` | user object, JWT token, onboarding step, login/logout functions |
| `SubscriptionContext` | `lib/SubscriptionContext.tsx` | tier, status, days remaining |

Both contexts persist state in **cookies** (`js-cookie`) so page refreshes don't log the user out.

---

## Subscription Gate

`components/SubscriptionGate.tsx` wraps any page that requires an active subscription. It:
1. Reads the subscription tier and status from `SubscriptionContext`.
2. If `status === "expired"` or `status === "cancelled"`, redirects to `/upgrade`.
3. Optionally checks for a minimum tier (`minTier` prop) for Shield-only features.

```tsx
// Usage
<SubscriptionGate minTier="shield">
  <SettlementPage />
</SubscriptionGate>
```
