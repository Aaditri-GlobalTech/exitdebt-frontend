# Environment Variables

## Variable Reference

| Variable | Required | Build-time? | Description |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | No | **Yes** | Backend API base URL. Leave empty in all environments. |
| `BACKEND_URL` | Production | No | Backend URL for the server-side rewrite proxy. |

---

## `NEXT_PUBLIC_API_URL`

**Always leave this empty.**

```env
NEXT_PUBLIC_API_URL=
```

`NEXT_PUBLIC_*` variables are baked into the JavaScript bundle at build time. If this is set to any non-empty URL, the browser will call that URL directly, bypassing the Next.js rewrite proxy.

The correct setup is to leave it empty so all `fetch("/api/...")` calls use relative URLs and flow through the proxy.

---

## `BACKEND_URL`

**Set this in Vercel for production. The backend runs on AWS EC2.**

```env
# With a domain (recommended — requires HTTPS/SSL on EC2):
BACKEND_URL=https://api.exitdebt.in

# With raw EC2 address (HTTP, port 8000):
BACKEND_URL=http://<ec2-public-ip-or-dns>:8000
```

This is a server-side variable (no `NEXT_PUBLIC_` prefix). It is read by `next.config.ts` at startup to configure the rewrite rule:

```ts
destination: `${process.env.BACKEND_URL}/api/:path*`
```

It is **not** embedded in the browser bundle and is not visible to users.

**Local development default**: `http://127.0.0.1:8000` (hardcoded in `next.config.ts` as fallback).

### EC2 requirements

For Vercel → EC2 calls to succeed:
- **Security Group**: EC2 must allow inbound TCP on port `8000` (or `443` if using HTTPS) from all IPs (`0.0.0.0/0`), since Vercel's outbound IPs are not fixed.
- **Uvicorn/Gunicorn**: Must be listening on `0.0.0.0`, not `127.0.0.1`. Example: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **HTTPS (recommended)**: Use an Nginx reverse proxy + Let's Encrypt certificate in front of Uvicorn so `BACKEND_URL` can use `https://`.

---

## Local Development Setup

```bash
# .env.local  (gitignored, never committed)
NEXT_PUBLIC_API_URL=
```

That's all you need locally. The proxy defaults to `http://127.0.0.1:8000` via `next.config.ts`.

---

## Vercel Production Setup

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:

| Name | Value | Environment |
|------|-------|-------------|
| `BACKEND_URL` | `http://<ec2-ip>:8000` or `https://api.exitdebt.in` | Production, Preview |

3. Redeploy (Vercel does not apply new env vars to existing deployments).

> Do **not** add `NEXT_PUBLIC_API_URL` to Vercel unless you have a specific reason. Leaving it absent means it defaults to `""` in the bundle, which is the correct proxy-compatible behaviour.

---

## How Next.js Handles These Variables

| Variable prefix | When resolved | Where available | Visible to users? |
|-----------------|---------------|-----------------|-------------------|
| `NEXT_PUBLIC_*` | Build time | Browser + Server | **Yes** (in JS bundle) |
| (no prefix) | Runtime | Server only | No |

This is why `BACKEND_URL` (no prefix) is used for the proxy — it stays on the server. And `NEXT_PUBLIC_API_URL` is left empty — any value would be exposed in the browser bundle.
