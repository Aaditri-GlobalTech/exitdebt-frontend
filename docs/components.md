# Components

All shared components live in `components/`. Pages in `app/` import from here.

---

## Layout

### `Navbar.tsx`
Top navigation bar. Shows logo, main nav links, and auth state (login button or user avatar).

Used on all public and authenticated pages.

### `Footer.tsx`
Site footer with links, compliance text (RBI disclaimers, ISO certification), and contact info.

### `CookieConsent.tsx`
DPDP-compliant cookie consent banner. Appears on first visit. Records consent and hides on acceptance.

---

## Auth & Onboarding

### `onboarding/Step1BasicDetails.tsx`

**Props**: `onNext: (userId: string, token: string) => void`

Collects: full name, mobile, email, city, state.  
Calls `POST /api/onboarding/step-1`.  
Passes `userId` and `token` to parent on success.

### `onboarding/Step2Verification.tsx`

**Props**: `userId: string`, `token: string`, `onNext: () => void`

Collects: PAN number, consent checkboxes.  
Calls `POST /api/onboarding/verify-pan`.  
Optional Aadhar flow via `POST /api/onboarding/aadhar/init` + `/aadhar/verify`.

### `onboarding/Step3BookCall.tsx`

**Props**: `userId: string`, `token: string`, `onComplete: () => void`

Renders a date/time picker of available 10-minute slots.  
Fetches slots from `GET /api/onboarding/consultation/slots`.  
Calls `POST /api/onboarding/consultation/book` on confirmation.

### `OTPInput.tsx`

6-field OTP code input. Renders as masked dots (like a PIN pad).

**Props**:
```ts
{
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;  // called when all 6 digits are entered
}
```

Auto-advances focus to next field on digit entry. Supports paste.

---

## Pricing

### `PricingCard.tsx`

Single subscription plan card.

**Props**:
```ts
{
  tier: "lite" | "shield";
  billingPeriod: "monthly" | "annual";
  highlighted?: boolean;
  onSelect: () => void;
}
```

Displays features list, price, and a CTA button. Highlighted card has a teal border.

### `PricingToggle.tsx`

Monthly / Annual toggle switch with a "save X%" badge on annual.

**Props**:
```ts
{
  value: "monthly" | "annual";
  onChange: (v: "monthly" | "annual") => void;
}
```

---

## Content

### `Hero.tsx`

Hero section for the landing page. Contains headline, sub-headline, and primary CTA.

**Props**: `onCTAClick?: () => void`

### `HowItWorks.tsx`

3-step process section: "1. Check your health", "2. Get your plan", "3. Exit debt".  
Static content, no props.

### `FAQ.tsx`

Full FAQ section. Wraps `FAQAccordion` with a curated list of questions and answers.

### `FAQAccordion.tsx`

Single collapsible FAQ item.

**Props**:
```ts
{
  question: string;
  answer: string;
  defaultOpen?: boolean;
}
```

### `BlogSection.tsx`

Renders 3 blog preview cards on the landing page.

- Fetches latest 3 posts from `GET /api/blogs?limit=3`.
- Falls back to 3 static articles if the API is unreachable.
- Each card links to `/blogs/{slug}`.

---

## Subscription

### `SubscriptionGate.tsx`

Wraps content that requires an active subscription.

**Props**:
```ts
{
  children: React.ReactNode;
  minTier?: "lite" | "shield";  // default: any active tier
}
```

Reads `SubscriptionContext`. Redirects to `/upgrade` if:
- Subscription is expired or cancelled.
- Current tier is below `minTier`.

---

## Callbacks (Legacy)

### `CallbackBooking.tsx`

Legacy inline callback booking form. Replaced by `CallbackModal.tsx` in most flows.

### `CallbackModal.tsx`

Modal overlay for booking a callback. Used when the user wants to speak with a specialist without going through full onboarding.

---

## Utilities

### `PrimaryButton.tsx`

Standard styled button.

**Props**:
```ts
{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;  // shows a spinner and disables click
  variant?: "primary" | "secondary" | "ghost";
}
```

### `Form.tsx`

Flexible form builder for structured multi-field forms.

**Props**:
```ts
{
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  submitLabel?: string;
  loading?: boolean;
}
```

`FormField` shape:
```ts
{
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  required?: boolean;
  options?: { value: string; label: string }[];  // for select fields
  placeholder?: string;
}
```
