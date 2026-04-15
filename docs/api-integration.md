# API Integration

## How the Proxy Works

The frontend never calls the backend directly. All `/api/*` requests are routed through Next.js's **rewrite proxy** defined in `next.config.ts`:

```ts
// next.config.ts
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${BACKEND_URL}/api/:path*`,
    },
  ];
}
```

**Request flow**:

```
Browser
  │  fetch("/api/blogs")     ← relative URL
  ▼
Next.js server
  │  Rewrites to: ${BACKEND_URL}/api/blogs
  ▼
FastAPI backend
  │  Responds with JSON
  ▼
Next.js server
  │  Forwards response
  ▼
Browser
```

**Why this matters**:
- The backend URL is only known to the Next.js server, never exposed to the browser.
- No CORS configuration needed on the backend for browser requests.
- Works identically in development (`http://127.0.0.1:8000`) and production (Railway, Render, etc.).

---

## Environment Variable Rules

| Variable | Where set | Baked in at | Purpose |
|----------|-----------|-------------|---------|
| `BACKEND_URL` | Vercel dashboard / `.env.local` | Server runtime | Points the proxy at the real backend |
| `NEXT_PUBLIC_API_URL` | `.env.local` | **Build time** | Frontend override (leave empty!) |

### Critical: Keep `NEXT_PUBLIC_API_URL` empty

`NEXT_PUBLIC_*` variables are embedded into the JavaScript bundle at build time. If you set `NEXT_PUBLIC_API_URL=https://mybackend.com`, the browser will call that URL **directly**, bypassing the Next.js proxy.

This causes:
- CORS errors in production (unless you configure CORS on the backend).
- The backend URL leaking to users via browser DevTools.
- Loss of the server-side proxy security layer.

**Always leave it empty**:
```env
# .env.local
NEXT_PUBLIC_API_URL=
```

All API calls in the codebase follow this pattern:
```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
// API_URL is "" → fetch("/api/blogs") → goes through Next.js proxy ✓
```

---

## Making API Calls

### Unauthenticated (public endpoints)

```ts
const res = await fetch(`${API_URL}/api/blogs`);
if (res.ok) {
  const data = await res.json();
}
```

### Authenticated (JWT)

```ts
const { token } = useAuth();

const res = await fetch(`${API_URL}/api/dashboard/${userId}`, {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Admin (API key)

```ts
const res = await fetch(`${API_URL}/api/admin/blogs`, {
  headers: {
    "X-API-Key": adminApiKey,
    "Content-Type": "application/json",
  },
});
```

The admin API key is entered once in the admin panel login prompt and stored in `localStorage`.

---

## Error Handling Pattern

All data-fetching components follow this pattern:

```tsx
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [fetchError, setFetchError] = useState(false);

useEffect(() => {
  async function load() {
    try {
      const res = await fetch("/api/...");
      if (res.ok) {
        setData(await res.json());
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);

// In JSX:
{loading && <Spinner />}
{fetchError && <ErrorBanner />}
{data && <Content data={data} />}
```

The `/blogs` listing page additionally shows a visible amber warning banner when the backend is unreachable, so the problem is surfaced to the user/developer instead of silently showing only static content.

---

## Blog Content: Static vs Dynamic

The blog system uses a hybrid approach to maintain SEO content while enabling a live CMS:

### Dynamic content (from API)
Posts created via the admin panel at `/admin`. Stored in the database with `is_published = true`. Served by `GET /api/blogs`.

### Static fallbacks (hard-coded)
Three legacy posts are hard-coded in `app/blogs/[slug]/page.tsx` and served from memory if the slug matches:
- `credit-card-mistakes`
- `priya-saved-62k`
- `personal-loan-vs-credit-card`

The static article is checked first. If matched, no API call is made. This ensures these posts are always available even if the backend is down.

### SEO articles (top-level routes)
Five high-value SEO pages have their own dedicated routes at the top level (e.g. `/how-to-get-out-of-debt-india`). These are static Next.js pages — no API call, no dynamic content. They are listed on `/blogs` but link to `/{slug}`, not `/blogs/{slug}`.

---

## Admin Panel API Calls

The admin panel at `/admin` uses a slightly different URL pattern. It calls:

```ts
const API_BASE = "/api/admin";

// e.g.
fetch(`${API_BASE}/blogs`)           // GET /api/admin/blogs
fetch(`${API_BASE}/blogs/${id}`)     // PUT /api/admin/blogs/:id
fetch(`${API_BASE.replace('/admin', '')}/admin/leads`)
// → "/api/admin/leads"             // GET /api/admin/leads
```

All admin calls include the API key header:
```ts
headers: { "X-API-Key": storedApiKey }
```
