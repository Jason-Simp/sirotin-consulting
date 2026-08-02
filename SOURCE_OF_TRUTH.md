# Consolidated source of truth

## Product and entity

- Brand: **Jason Sirotin — AI Automation Partner**.
- Business: Jason's independent consulting practice. It is not a SimplSolutions product, division, portal, or endorsed site.
- Canonical origin: `https://automatemejay.com`.
- Redirect origin: `https://aimejay.com` -> `https://automatemejay.com` with a permanent redirect.
- Product shape: one Next.js application with a public one-page marketing site, authenticated client portal, and Jason-only administration area.

## Commercial model

### Free first week

- $0, seven calendar days, no card, no automatic paid conversion.
- Approximately one focused hour.
- One primary contact and one clearly defined automation opportunity.
- Private workspace access.
- Jason explicitly activates the trial; the activation timestamp starts the seven-day clock.
- At expiry the workspace becomes read-only unless Jason extends it or the client chooses a paid plan.

### Weekly Partner

- $350 charged automatically each week in advance.
- Approximately one hour of substantive work per week.
- Reasonable asynchronous communication.
- One directing stakeholder and one actively prioritized workstream.
- Seven days' written cancellation notice.

### Monthly Partner

- $1,000 charged automatically each month in advance.
- Approximately four hours of substantive work per billing month, generally on a weekly cadence.
- Reasonable asynchronous communication.
- One directing stakeholder and one actively prioritized workstream.
- Thirty days' written cancellation notice.

### Common rules

- Client-visible delivery is relationship-based, not a minute-by-minute timecard; Jason can track capacity internally.
- Approved AI, token, API, hosting, software, data, messaging, storage, contractor, and other third-party costs are additional.
- Jason builds; the client tests and reports; Jason improves; the cycle continues while active.
- Client retains responsibility for business decisions, access authorization, data rights, realistic testing, production approval, monitoring, compliance, and human review.
- One active workstream is included. Additional ideas may be queued; simultaneous workstreams or independent decision-makers may require more capacity.

## Public site

The public experience is a single server-rendered page with:

1. Minimal navigation and clear Jason identity.
2. Hero: one recurring problem, an ongoing AI partner, start free.
3. Problem and capability framing.
4. Five-step build/test/improve loop.
5. Client responsibilities and human-control checkpoints.
6. Pricing cards for free, weekly, and monthly options.
7. Scope, communication, and exclusion language.
8. FAQ answering all required commercial and ownership questions.
9. Final CTA and legal footer.

Primary calls to action are `Start Free`, `Choose Weekly`, `Choose Monthly`, and `Sign In`.

## Client portal

- Passwordless or secure email authentication.
- Dashboard with plan, status, active automation, latest update, next action, testing, approval, and activity.
- One active automation workspace plus queued ideas.
- Realtime private conversation with attachments, replies, pins, decisions, testing requests, approvals, unread state, and notification preferences.
- Structured notes, testing reports, approvals, files, billing, account settings, and activity history.
- Clear copy that realtime delivery does not promise an immediate human response.
- Private areas use server-side authorization and `noindex`.

## Jason administration

- Trial review and activation.
- Client and organization records.
- Subscription and payment-failure visibility.
- Workspace priority/status management.
- Unread messages, testing, and approval queues.
- Cancellation request/effective-date management.
- Private internal notes never readable by clients.
- Audit history for material actions.

## Architecture

- Next.js App Router, React, strict TypeScript, Tailwind CSS, accessible primitives.
- Render Node web service, pinned Node runtime, health check, structured logs, and environment validation.
- Supabase Auth, PostgreSQL, RLS, Realtime, and private Storage.
- Stripe Checkout, Billing, Customer Portal for payment method/invoice access, and verified webhooks.
- Resend transactional mail with verified `automatemejay.com` sending domain and signed webhooks where used.
- Zod validation, server-only secrets, rate limiting, idempotency, audit events, and signed file access.
- Provider boundaries for future agent, conversation, voice, and transcription integrations; ElevenLabs is not in MVP.

## Data model

Core records: profiles, organizations, organization members, trials, subscriptions, workspaces, queued ideas, messages, message reads, notes, files, testing reports, approvals, cost authorizations, agreements/acceptances, cancellation requests, notification preferences, and activity/audit events.

Authorization is organization/workspace membership-based. Administrative authority is stored in trusted server-controlled/app metadata and database records, never user-editable metadata.

## SEO and discovery

- One H1 and logical headings; factual, visible answers for every commercial FAQ.
- Self-referencing canonical, Open Graph/Twitter metadata, sitemap, robots, and `noindex` private routes.
- Person, Service, Offer, and FAQ JSON-LD exactly matching visible text.
- Optional `llms.txt`; no special crawler permissions beyond public content.
- No fabricated testimonials, case studies, guarantees, affiliations, or client metrics.

## Design direction

- Personal, premium, intelligent, dynamic, practical, and visibly human-controlled.
- Original identity distinct from SimplSolutions.
- Use the supplied headshot as the human anchor; design original workflow/approval visuals rather than copying supplied product art.
- Motion explains state changes and handoffs, respects reduced motion, and remains mobile/performance safe.
