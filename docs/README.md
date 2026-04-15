# ExitDebt Frontend — Documentation Index

Next.js 14+ (App Router) frontend for the ExitDebt debt-management platform.

---

## Table of Contents

| Doc | What it covers |
|-----|---------------|
| [Architecture](architecture.md) | App Router structure, data flow, proxy setup |
| [Pages & Routes](pages-routes.md) | Every route, its purpose, and auth requirements |
| [Components](components.md) | Reusable components and their props |
| [State Management](state-management.md) | AuthContext, SubscriptionContext, local state |
| [API Integration](api-integration.md) | How the frontend talks to the backend |
| [Environment Variables](environment-variables.md) | Config keys, build-time vs runtime, Vercel setup |
| [Deployment](../DEPLOYMENT.md) | Build, preview, and production deployment |

---

## Quick Start (local dev)

```bash
# 1. Install dependencies
npm install

# 2. Create env file (leave NEXT_PUBLIC_API_URL empty for proxy mode)
echo "NEXT_PUBLIC_API_URL=" > .env.local

# 3. Start the dev server
npm run dev
```

The app is available at `http://localhost:3000`.

> The backend must be running at `http://localhost:8000` for API calls to work.  
> See [API Integration](api-integration.md) for how the proxy works.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| React | v19 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Icons | Lucide React |
| Animation | Framer Motion, DotLottie |
| Markdown | react-markdown + remark-gfm |
| Testing | Jest + React Testing Library |
