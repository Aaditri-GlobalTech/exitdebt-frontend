# ExitDebt Frontend — Architecture & Deployment Guide

## 1. System Overview

The ExitDebt Frontend is a modern **Next.js (App Router)** Server-Side Rendered (SSR) application, styled with TailwindCSS. It provides both the consumer-facing unauthenticated onboarding flow and the secure internal CRM administration dashboard.

## 2. Core Structure & Routing
All pages are located within the `app/` directory, following Next.js 14+ conventions:
- `app/page.tsx`: The primary landing page and get-started hook.
- `app/get-started/page.tsx`: The multi-stage, high-conversion onboarding funnel.
- `app/profile/page.tsx`: The soft-launch post-registration success page.
- `app/admin/page.tsx`: The secure Unified Operations CRM Dashboard (Lead lists, Audit Logs).
- `app/admin/leads/[id]/page.tsx`: The detailed Lead Profile view (Timeline, Call Timers, Debt Info).

## 3. CRM Data Flow & State Management

The frontend connects directly to the backend Python REST API, governed by the `NEXT_PUBLIC_API_URL` variable.

### Authentication
- Consumer authentication is handled via `httpOnly` JWT cookies.
- Admin authentication checks the session for `exitdebt_admin_name`. Crucially, calls to `/api/internal/*` are authenticated by passing the `X-API-Key` header, allowing the backend to map actions securely.

### CRM Timeline & Call Logging Logic
- **Device ID:** On first load, `localStorage` generates a UUID ensuring the specific machine's footprint is attached to all notes and call logs, solving the dynamic IP spoofing issue.
- **Timeline Hydration:** The backend serves heterogeneous events (Notes, Calls, Callbacks). Because Next.js renders on the server initially, we strictly wrap `sessionStorage` references inside `useEffect` logic to prevent hydration mismatch errors.
- **Timezone Management:** All native dates are parsed into `en-IN` local representations to ensure the UI clearly reflects real-world shifts.
- **JSON Exporting:** Employs a Blob construction allowing admins to package and stringify the precise local React state of the lead timeline into a downloadable `.json` file for portability.

---

## 4. Deployment Architecture

The frontend is built statically via Node.js and hosted on the same EC2 web server as the backend.

### Infrastructure
- **Host**: AWS EC2 `ap-south-1`.
- **Port Management**: The Next.js binary binds to port `3000`. Nginx acts as a reverse proxy alongside Certbot to expose the frontend safely over `HTTPS (443)`.
- **Process Manager**: Governed by PM2 `ecosystem.config.js`.

### Continuous Deployment (CI/CD)
The `.github/workflows/deploy.yml` pipeline reliably promotes changes:
1. Triggers on pushes to `main`.
2. Provisions a temporary Node 20 environment in GitHub Actions.
3. Automatically sets `NEXT_PUBLIC_DATA_SOURCE: backend` to prevent regression into Mock mode in production.
4. Executes `npm run build`, packaging the `.next` artifacts into a `frontend-build.tar.gz` archive.
5. Uses `scp-action` to directly upload the artifact to the EC2 `/tmp/` directory.
6. SSHs into the server, extracts the new build directly over the `~/apps/exitdebt-frontend` directory, reinstalls production boundaries, and reloads PM2 gracefully (`pm2 reload exitdebt-web`).
