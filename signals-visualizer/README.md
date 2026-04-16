# Signals Visualizer

Interactive web application for learning core Signals and Systems concepts with visual modules for:

- Signal types and decomposition
- Time/amplitude operations
- System properties and LTI behavior
- Convolution intuition
- Fourier analysis
- Laplace transform basics

## Tech Stack

- React 18
- React Router 6
- Vite 5
- Supabase Auth + Edge Functions
- Razorpay subscriptions
- Plotly.js via react-plotly.js
- ESLint + Prettier
- Vitest for unit tests
- GitHub Actions CI

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_BILLING_STATUS_FUNCTION` (default: `billing-status`)
- `VITE_RAZORPAY_CHECKOUT_FUNCTION` (default: `create-razorpay-checkout`)
- `VITE_RAZORPAY_MANAGE_FUNCTION` (default: `get-razorpay-manage-link`)

Optional temporary links before Edge Functions are deployed:

- `VITE_RAZORPAY_CHECKOUT_LINK`
- `VITE_RAZORPAY_MANAGE_LINK`

Optional demo Pro login for classroom/sales demos:

- `VITE_DEMO_PRO_EMAIL`
- `VITE_DEMO_PRO_PASSWORD`

When configured:

- Auth page shows a `Demo Pro Login` button
- The configured demo email is treated as `pro` tier in-app for gated modules

### Run Development Server

```bash
npm run dev
```

### Build and Preview

```bash
npm run build
npm run preview
```

## Quality Gates

### Lint

```bash
npm run lint
```

### Format Check

```bash
npm run format
```

### Test

```bash
npm run test
```

### Coverage

```bash
npm run coverage
```

### Full Local Validation

```bash
npm run check
```

## Authentication and Monetization

Implemented in the app:

- Email/password sign in and sign up via Supabase
- Auth-aware navigation and account actions
- Premium route guards for `/convolution`, `/fourier`, `/laplace`
- Pricing gate at `/pricing`
- Billing page at `/billing` with checkout + subscription management actions

Demo account behavior:

- Sign in with the configured demo credentials to access premium modules for demonstrations
- Demo Pro access is determined client-side by matching `VITE_DEMO_PRO_EMAIL`

Expected backend behavior (Supabase + Razorpay):

- `billing-status` should return JSON with `tier` and `status`
- `create-razorpay-checkout` should return JSON with `url`
- `get-razorpay-manage-link` should return JSON with `url`

Example `billing-status` response:

```json
{
  "tier": "pro",
  "status": "active"
}
```

Example checkout/management response:

```json
{
  "url": "https://rzp.io/rzp/your-payment-link"
}
```

## Supabase Edge Functions (JavaScript)

This repository includes JavaScript Edge Functions in `supabase/functions`:

- `billing-status`
- `create-razorpay-checkout`
- `get-razorpay-manage-link`
- `razorpay-webhook`

### 1) Run the SQL migration

Apply `supabase/migrations/20260416_create_user_subscriptions.sql` in your Supabase project.

### 2) Set function secrets

Use Supabase CLI to set secrets (do not store these in frontend `.env`):

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxx
supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
supabase secrets set APP_BASE_URL=https://your-domain.com
supabase secrets set RAZORPAY_SUCCESS_REDIRECT=https://your-domain.com/billing
supabase secrets set RAZORPAY_PRO_PRICE_PAISE=19900
supabase secrets set RAZORPAY_CURRENCY=INR
supabase secrets set RAZORPAY_MANAGE_URL=https://your-domain.com/account/billing
```

Optional:

```bash
supabase secrets set BILLING_SUBSCRIPTIONS_TABLE=user_subscriptions
```

### 3) Deploy functions

```bash
supabase functions deploy billing-status
supabase functions deploy create-razorpay-checkout
supabase functions deploy get-razorpay-manage-link
supabase functions deploy razorpay-webhook --no-verify-jwt
```

### 4) Configure Razorpay webhook

Create a webhook in Razorpay dashboard pointing to:

`https://<PROJECT-REF>.functions.supabase.co/razorpay-webhook`

Recommended events:

- `payment_link.paid`
- `payment.captured`
- `subscription.authenticated`
- `subscription.charged`
- `subscription.activated`
- `subscription.cancelled`

Important:

- Include `notes.user_id` in checkout payloads (already implemented in function) so webhook can map payments to users.
- Keep JWT verification disabled only for the webhook function.

## Project Structure

```text
src/
  components/        # Reusable UI building blocks
  hooks/             # Shared hooks for signal and graph data
  modules/           # Domain-specific teaching modules
  pages/             # Route-level pages
  styles/            # Theme tokens and global styles
  utils/             # Pure math/utility helpers (unit-tested)
```

## CI

The repository includes a GitHub Actions workflow at .github/workflows/ci.yml that validates:

- Lint rules
- Test suite with coverage
- Production build

## Contribution Guidelines

1. Create a feature branch.
2. Keep changes scoped and documented.
3. Ensure npm run check passes before creating a pull request.
4. Add tests for any changes to src/utils logic.
