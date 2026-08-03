# Consolidated source of truth

## Product and entity

- Brand: **Jason Sirotin — AI Automation Partner**.
- Business: Jason's independent consulting practice. It is not a SimplSolutions product, division, portal, or endorsed site.
- Canonical origin: `https://automatemejay.com`.
- Redirect origin: `https://aimejay.com` -> `https://automatemejay.com` with a permanent redirect.
- Product shape: one Next.js application with a public one-page marketing site, authenticated client portal, and Jason-only administration area.

## Commercial model

### Guaranteed First Week

- $350 paid once, seven calendar days after activation, no automatic paid conversion.
- Approximately one focused hour.
- One primary contact and one clearly defined automation opportunity.
- Private workspace access.
- Jason explicitly activates the engagement; the activation timestamp starts the seven-day clock.
- Full money-back guarantee on the $350 service fee if requested before the guarantee period ends; approved third-party costs are separate.
- At expiry the client affirmatively chooses the monthly plan or requests the refund. There is no automatic renewal; otherwise work pauses.

### Monthly Partner

- $1,000 charged automatically each month in advance.
- Approximately four hours of substantive work per billing month, generally on a weekly cadence.
- Reasonable asynchronous communication.
- One directing stakeholder and one actively prioritized workstream.
- Cancel anytime through the membership billing portal; cancellation stops the next renewal and service continues through the current paid 30-day period.

### Statements of Work

- Monthly Partner purchases require a plan-specific SOW signed electronically by both parties. Legacy or privately scoped weekly work retains its own SOW but is not a public pricing choice.
- The client reviews and signs the exact version before Stripe checkout. Jason counter-signs that version after payment confirmation.
- Preserve the exact document snapshot, version, SHA-256 hash, signer identity and capacity, timestamps, payment linkage, and a printable executed copy.
- Signature records are server-only; public and ordinary authenticated database roles receive no direct access.

### Common rules

- Client-visible delivery is relationship-based, not a minute-by-minute timecard; Jason can track capacity internally.
- Approved AI, token, API, hosting, software, data, messaging, storage, contractor, and other third-party costs are additional.
- Prefer guided setup calls that place hosting, databases, domains, APIs, software, and other infrastructure in client-owned accounts. The client enters payment details directly with the provider and retains ownership, billing access, credentials, and administrative control.
- If Jason or AutomateMeJay purchases, pays, or administratively manages an approved third-party service on the client’s behalf, bill the actual provider cost plus a 25% convenience charge calculated on that cost. This charge does not apply to client-owned, client-paid accounts.
- Jason builds; the client tests and reports; Jason improves; the cycle continues while active.
- Client retains responsibility for business decisions, access authorization, data rights, realistic testing, production approval, monitoring, compliance, and human review.
- One active workstream is included. Additional ideas may be queued; simultaneous workstreams or independent decision-makers may require more capacity.

## Public site

The public experience is a single server-rendered page with:

1. Minimal navigation and clear Jason identity.
2. Hero: one recurring problem, an ongoing AI partner, and a protected paid start.
3. Problem and capability framing.
4. Five-step build/test/improve loop.
5. Client responsibilities and human-control checkpoints.
6. Two pricing cards only: the $350 guaranteed first week and the $1,000 monthly partnership.
7. Scope, communication, and exclusion language.
8. FAQ answering all required commercial and ownership questions.
9. Final CTA and legal footer.

The public experience must remain easy to reach and navigate across desktop, tablet, and phone browsers. Primary navigation stays available on small screens, interactive controls use touch-friendly targets, keyboard users receive visible focus and a skip link, safe-area insets are respected, and platform metadata supports saving the site to a device home screen.

The portfolio presents 95% agent-produced execution as the current estimated share, with human direction, review, and release approval stated alongside it. Six live featured experiences are SimplSolutions, ECG Productions, DriveOn Protection, SchoolAmplified, SimplDemocracy, and SimplCity for Manchester, New Hampshire.

Primary calls to action are `Start with the guarantee`, `Choose Monthly`, `Book a consultation`, and `Client workspace`.

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
- An ElevenLabs React SDK website assistant, clearly disclosed as AI, grounded in a public-safe knowledge base, and using Jason's existing custom ElevenLabs voice.
- Authenticated calendar webhook tools check `jason@simplsolutions.app` and `sirotin@ecgprod.com` before scheduling a confirmed 30-minute introduction. Material agent actions are audited.
- The public website assistant is ElevenLabs agent `agent_0901kz2twnd6e68vzfyc65ga8njy`, disclosed as AI and published with Jason's saved custom voice. Until Google OAuth credentials are configured for direct tool calls, it directs visitors to the live Google appointment schedule at `/book` rather than claiming to book directly.
- News subscribers are stored server-side in Supabase. Resend schedules five messages: the first four are educational and the fifth may introduce the paid services. Every message includes an unsubscribe path.

## Data model

Core records: profiles, organizations, organization members, trials, subscriptions, workspaces, queued ideas, messages, message reads, notes, files, testing reports, approvals, cost authorizations, agreements/acceptances, bilateral service SOWs, cancellation requests, notification preferences, and activity/audit events.

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
