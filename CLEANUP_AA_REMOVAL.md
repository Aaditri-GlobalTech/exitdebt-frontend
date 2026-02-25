# Task: Remove Account Aggregator (AA) Integration

**Priority:** High | **Estimated effort:** ~15 min | **Date:** 2026-02-25

## Context

Per strategy decision, AA integration is deferred indefinitely. The data strategy for Phase 1 is **CIBIL-only**. All AA-related API routes and documentation references must be removed from this repo.

---

## Checklist

### 1. Delete Files & Directories

- [ ] `app/api/aa/consent/route.ts` — AA consent route handler (65 lines)
- [ ] `app/api/aa/fetch/route.ts` — AA data fetch route handler (66 lines)
- [ ] `app/api/aa/consent/` — Empty directory after file deletion
- [ ] `app/api/aa/fetch/` — Empty directory after file deletion
- [ ] `app/api/aa/` — Empty parent directory

### 2. Modify `app/docs/page.tsx`

Remove **7 AA endpoint entries** from the `API_ENDPOINTS` array:

- [ ] **Lines 299–326** — Remove 2 frontend AA entries:
  ```diff
  -    {
  -        method: "POST",
  -        path: "/api/aa/consent",
  -        desc: "Initiate Account Aggregator consent flow...",
  -        ...
  -    },
  -    {
  -        method: "GET",
  -        path: "/api/aa/fetch",
  -        desc: "Fetch latest data from Account Aggregator...",
  -        ...
  -    },
  ```

- [ ] **Lines 501–564** — Remove 5 backend AA entries:
  ```diff
  -    { method: "POST", path: "/aa/consent", desc: "Create an Account Aggregator consent request..." ... },
  -    { method: "GET",  path: "/aa/consent/:consentId", desc: "Check the current status..." ... },
  -    { method: "POST", path: "/aa/consent/:consentId/approve", desc: "Mock-approve a consent..." ... },
  -    { method: "GET",  path: "/aa/data/:consentId", desc: "Fetch financial data..." ... },
  -    { method: "POST", path: "/aa/webhook", desc: "Receive Setu AA notifications..." ... },
  ```

  > **Tip:** Search for `/aa/` in the file — there should be exactly 7 objects to remove. After removal, no `/aa/` references should remain.

### 3. `README.md` — ✅ ALREADY DONE

> README has already been updated: AA endpoints removed from API table, old `₹999/yr` pricing replaced with current tiered model, `aa/` directory removed from project structure.

---

## Verification

### Build check (no broken imports)

```bash
npm run build
```

### Dev server

```bash
npm run dev
```
Visit `/docs` page — confirm no AA endpoints are listed.

### Grep scan (must return 0 results)

```bash
grep -riI "account.aggregat\|/aa/\|aa.*consent\|aa.*fetch" --include="*.ts" --include="*.tsx" --include="*.md" .
```

---

*Once complete, delete this file.*
