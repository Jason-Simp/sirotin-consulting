# Jason Sirotin — AI Automation Partner

Independent consulting website and private client-workspace foundation for `automatemejay.com`.

## Stack

- Next.js 16 / React 19
- Supabase Auth, Postgres, Storage, and Realtime
- Stripe Standard account for paid subscriptions
- Resend for transactional email and delivery events
- Render web service
- GoDaddy-managed DNS

## Local development

Requirements: Node.js 22 or newer and pnpm.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The public site builds without provider secrets. Intake, authentication, payment, and webhook actions remain unavailable until their corresponding environment variables are present.

## Checks

```bash
pnpm check
```

## Supabase

The initial versioned schema is in `supabase/migrations`. After a dedicated project is created and linked:

```bash
pnpm dlx supabase@2.111.0 link --project-ref YOUR_PROJECT_REF
pnpm dlx supabase@2.111.0 db push
```

Do not expose `SUPABASE_SECRET_KEY` to the client. The public app uses the current publishable-key format.

## Render

Create a Node web service from this repository with:

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Start command: `pnpm start`
- Health check path: `/api/health`
- Node version: 22 or newer

Set the values from `.env.example` in the Render environment. Configure `automatemejay.com` as the canonical domain; `aimejay.com` is redirected by the application after both domains point at the service.

## Project documents

Start with `00_START_HERE.md`, then read `SOURCE_OF_TRUTH.md`, `DECISION_LOG.md`, `IMPLEMENTATION_MAP.md`, and `ASSET_MANIFEST.md`.
