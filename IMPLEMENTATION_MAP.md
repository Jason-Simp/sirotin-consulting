# Implementation map

## Release sequence

### 1. Foundation

- Initialize Next.js App Router with strict TypeScript, Tailwind, ESLint, pnpm lockfile, Node runtime pin, and Render configuration.
- Add environment schema and server/client secret boundaries.
- Add CI checks: lint, typecheck, unit tests, build, and migration validation.
- Create Supabase migrations with explicit grants, RLS, storage policies, realtime configuration, and seed-safe test helpers.
- Implement Supabase SSR clients, session refresh, server authorization helpers, and role/membership checks.

### 2. Public website

- Build sections: hero, problem, capabilities, process, collaboration, human control, two-choice pricing, scope, communication, FAQ, final CTA, footer.
- Use master-brief copy normalized to the final domain and commercial rules.
- Add original animated workflow/approval visual, reduced-motion behavior, responsive imagery, and accessible interactions.
- Add trial application, plan selection, registration/sign-in, and legal acceptance.
- Add metadata, JSON-LD, sitemap, robots, `llms.txt`, and analytics events.

### 3. Trial and onboarding

- Create account/organization/workspace transactionally.
- Store agreement version, disclosure version, IP, user agent, and acceptance timestamp.
- Create `trial_pending`; notify Jason through Resend.
- Jason activates; server sets `activated_at` and `expires_at`; client receives welcome email.
- Expiry makes the workspace read-only without initiating payment.

### 4. Billing

- Keep the public offer to a $350 one-time protected first week and a $1,000 monthly partnership. Legacy weekly and one-off checkout infrastructure remains private and is not indexed or promoted.
- Create Checkout Sessions server-side only after authentication and agreement acceptance.
- Verify Stripe signatures using the raw request body; make processing idempotent by event ID.
- Handle checkout completion, subscription create/update/delete, invoice paid/failed, and payment-method events.
- Provide Stripe Customer Portal sessions for invoices/payment methods; keep cancellation in the application.
- Record notice, calculate eligible effective date, notify both parties, and schedule cancellation without accidental prorations.

### 5. Client portal

- Dashboard and active workspace overview, exposed through the public `Client workspace` navigation link.
- Realtime conversation, unread state, replies, pins, decision/testing/approval message types.
- Notes with client-visible vs Jason-private separation.
- Private file upload/download with metadata, allowlist/size checks, and signed access.
- Structured testing reports and approval decisions.
- Billing summary, cancellation request, account, and notification settings.

### 6. Jason administration

- Client/trial/subscription/workspace lists and filters.
- Trial activation and extension.
- Status/priority/next-action management.
- Unread, testing, approval, past-due, and cancellation queues.
- Private notes and complete activity/audit history.

### 7. Email and notifications

- Resend domain verification and sender identities.
- Templates: verification, welcome, Jason trial alert, new message digest, testing request, approval request, payment failure, cancellation received/effective, trial ending/ended, and a five-message News education sequence.
- News messages 1–4 teach AI automation fundamentals without a sales offer; message 5 may introduce the protected first week and monthly partnership.
- Store notification events and respect per-user preferences; portal remains source of truth.

### 8. Domains and deployment

- Render web service: `pnpm install --frozen-lockfile && pnpm build`; start with `pnpm start`; health endpoint; Node runtime pin.
- Add `automatemejay.com` and `www.automatemejay.com` to the service.
- Point GoDaddy DNS to Render and verify TLS.
- Attach `aimejay.com`/`www.aimejay.com`; application-level 308 redirect preserves path and query.
- Configure Supabase redirect URLs, Resend links/webhook, Stripe success/cancel/customer-portal URLs, and canonical origin.

## Route map

| Route | Purpose | Indexing |
| --- | --- | --- |
| `/` | One-page public marketing site | Index |
| `/start` | Guaranteed-first-week intake | Noindex |
| `/checkout/weekly`, `/checkout/monthly` | Protected first-week and monthly Stripe checkout launch | Noindex |
| `/guarantee` | Verified monthly-or-refund choice | Noindex |
| `/sign-in`, `/auth/callback` | Authentication | Noindex |
| `/portal` | Client workspace: conversation, notes, files, testing, approvals, and billing | Noindex |
| `/contact` | Email, click-to-call, consultation, and client workspace entry points | Index |
| `/blog` | News index and newsletter signup | Index |
| `/legal/privacy`, `/legal/terms`, `/legal/service-agreement`, `/legal/payment-cancellation` | Legal content | Index where appropriate |
| `/api/webhooks/stripe`, `/api/webhooks/resend` | Verified provider events | Never index |
| `/api/agent/calendar/availability`, `/api/agent/calendar/book` | Authenticated ElevenLabs scheduling tools | Never index |
| `/api/health` | Render health check | Never index |

## Analytics events

`cta_first_week`, `cta_monthly`, `sign_in_started`, `trial_application_started`, `trial_application_submitted`, `trial_activated`, `checkout_started`, `checkout_completed`, `newsletter_subscribed`, `message_sent`, `file_uploaded`, `testing_submitted`, `approval_submitted`, and `billing_portal_opened`.

Do not send message content, file names, client data, credentials, or sensitive intake responses to analytics.

## Verification gates

- Unit tests for pricing/cancellation dates, role checks, webhook idempotency, and validation.
- Integration tests for trial creation/activation/expiry and Stripe event state transitions.
- RLS tests proving cross-client isolation for every exposed table and storage path.
- Browser tests for public CTAs, auth, portal, admin, mobile, reduced motion, keyboard navigation, and error/empty/loading states.
- Accessibility, structured-data, sitemap/robots, performance, security headers, dependency, and production smoke checks.
