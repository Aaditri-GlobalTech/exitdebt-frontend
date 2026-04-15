# State Management

The frontend uses React Context for global state, supplemented by local `useState` for page-level state. There is no Redux or Zustand.

---

## AuthContext (`lib/AuthContext.tsx`)

The central authentication context. Wraps the entire app via `AuthProvider` in `app/layout.tsx`.

### State Shape

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboardingStep: number;  // 0–4
}
```

### User Shape

```ts
interface User {
  id: string;            // UUID
  name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  is_pan_verified: boolean;
  is_aadhar_verified: boolean;
  onboarding_step: number;
}
```

### Exposed Functions

```ts
// Returns the context value
const auth = useAuth();

// Log in via PAN + OTP
auth.login(pan: string, phone: string): Promise<LoginResult>

// Register a new user (onboarding step 1)
auth.onboardUser(details: OnboardingStep1): Promise<{ userId: string; token: string }>

// Complete onboarding — moves JWT from sessionStorage to cookie
auth.completeOnboarding(): void

// Update income data
auth.updateIncome(salary: number, salaryDate: number, otherIncome: number): Promise<void>

// Clear all auth state and cookies
auth.logout(): void
```

### Storage

| State | Storage | Expiry |
|-------|---------|--------|
| JWT token (during onboarding) | `sessionStorage` | Session |
| JWT token (post-onboarding) | Cookie `exidebt_session` | 30 days |
| User object | Cookie `exidebt_session` | 30 days |

The token is moved from `sessionStorage` to a cookie when `completeOnboarding()` is called (after step 3). This prevents users who abandon onboarding from being treated as fully authenticated.

### PAN Hashing

The `login()` function hashes the PAN on the client before sending it to the backend:

```ts
// lib/utils.ts
export async function hashPan(pan: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pan.toUpperCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
```

The raw PAN is never sent over the wire. The backend applies an additional server-side pepper to the received hash.

---

## SubscriptionContext (`lib/SubscriptionContext.tsx`)

Tracks the user's current subscription tier and status.

### State Shape

```ts
interface SubscriptionState {
  tier: "lite" | "shield" | null;
  status: "trial" | "active" | "expired" | "cancelled" | null;
  trialEndsAt: Date | null;
  expiresAt: Date | null;
  daysRemaining: number;
  isLoading: boolean;
}
```

### Usage

```ts
const sub = useSubscription();

if (sub.status === "trial") {
  // Show trial banner with days remaining
}

if (sub.tier === "shield") {
  // Show Shield-exclusive features
}
```

### Storage

Subscription state is cached in a cookie (`exidebt_subscription`, 1-year expiry) to avoid fetching it on every page load. It is refreshed from the API after login and after a successful payment.

---

## Local State Patterns

For page-level state, components use `useState` and `useEffect` directly. Common patterns:

### Data fetching

```tsx
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/...");
      if (res.ok) {
        setData(await res.json());
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### Multi-step forms

Onboarding and admin forms use a `step` integer to track which panel is visible:

```tsx
const [step, setStep] = useState(1);
// ...
{step === 1 && <Step1 onNext={() => setStep(2)} />}
{step === 2 && <Step2 onNext={() => setStep(3)} />}
{step === 3 && <Step3 onComplete={handleComplete} />}
```

---

## Mock Profiles (`lib/mockProfiles.ts`)

Development-only mock data for testing the dashboard without a real backend. Provides:
- 2–3 sample user profiles with different debt situations
- Realistic debt account arrays
- Pre-computed health scores

Used by the dashboard in development when the API is unreachable.
