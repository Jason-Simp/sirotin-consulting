# Decision log

## Resolved decisions

| Topic | Conflict or ambiguity | Decision | Basis |
| --- | --- | --- | --- |
| Hosting | Older plans specify Vercel; Jason explicitly specified Render in the current request | Deploy the full Next.js application as a Render Node web service | Current explicit user direction outranks older technical recommendations |
| Primary domain | Older master content contains `YOURDOMAIN.com` placeholders | Use `https://automatemejay.com` everywhere public | `00_START_HERE.md` final domain instruction |
| Secondary domain | Older files do not define a secondary domain | Permanently redirect `aimejay.com` to `automatemejay.com`, preserving path and query when practical | `00_START_HERE.md` final domain instruction |
| Email | Older files leave provider open (Resend/Postmark/other) | Use Resend for transactional email | Current explicit user direction |
| Database | Earlier material recommends Supabase and the current request says a database is required | Use a dedicated Supabase project for Auth, Postgres, Storage, and Realtime | Current request plus master architecture |
| Merchant model | Materials mention paying Jason personally and explicitly reject Stripe Connect | Use a standard Stripe account configured as Jason's individual/sole-proprietor merchant, not Connect | Current request and master brief; Stripe supports US individual/sole-proprietor accounts subject to identity/tax verification |
| First-week billing | Older requirements offered a free week or weekly subscription | Charge $350 once for a seven-day engagement with a full service-fee money-back guarantee; never auto-convert | Jason's August 2, 2026 explicit direction |
| Paid pricing | Earlier sources used free and weekly offers | Guaranteed First Week is $350 once; monthly continuation is $1,000 | Jason's August 2, 2026 explicit direction |
| Third-party assets | Earlier language said only that outside costs were additional | Default to client-owned, client-paid accounts established together on a call; if Jason or AutomateMeJay purchases, pays, or administratively manages an approved third-party service, charge the provider cost plus 25% | Jason's August 2, 2026 explicit direction |
| Cross-platform access | Small-screen navigation previously disappeared and the site had no install metadata | Keep full navigation available on phones and tablets, support keyboard and touch access, respect device safe areas, and publish home-screen metadata and icons | Jason's August 2, 2026 explicit direction |
| Guarantee UX | A refund must be simple without silently moving money on an AI agent's say-so | Verify the Stripe session and checkout email, record one binding refund request, notify Jason for processing to the original payment method, or create an affirmative monthly checkout | Current guarantee plus action-safety protocol |
| Voice agent | Older scope deferred voice | Embed the current ElevenLabs React SDK at bottom right; disclose AI identity; use a curated public-safe KB and Jason's saved custom voice | Jason's current explicit direction |
| Calendar actions | The assistant must see two calendars before booking | Check both connected Google calendars, require an exact 30-minute slot and explicit guest confirmation, re-check immediately before event creation, and audit every material action | Jason's current explicit direction and SimplSite protocols |
| Branding | Portfolio includes extensive Simpl-branded material | Build a new independent Jason Sirotin identity; treat all Simpl assets as reference-only | Critical brand instruction and `00_START_HERE.md` |
| Public case studies | Portfolio images appear to include client and product work | Do not publish work samples until Jason confirms rights, client permission, and factual captions | Trust, confidentiality, and asset requirements |
| Runtime | Render defaults can change and Supabase dropped Node 20 support in 2026 | Pin a Node 22+ compatible range with an upper bound; prefer Node 24 for the new service | Current Render and Supabase guidance |
| Supabase keys | Older examples commonly use legacy anon/service-role keys | Use a publishable key in browser/server session clients and a secret key only in tightly scoped server code; never expose it to clients | Current Supabase key guidance |
| Supabase API exposure | New tables are no longer automatically exposed to Data/GraphQL APIs | Explicitly grant only required privileges and enable RLS on every exposed table | Supabase 2026 breaking change and security guidance |

## Launch confirmations still required

These are not safe to invent and do not block local foundation work.

1. Final contracting/payee identity: `Jason Sirotin` personally, a registered sole proprietorship/DBA, or another legal entity.
2. Governing state, county/venue, legal notice address, and privacy contact.
3. Attorney approval of the agreement, clickwrap presentation, recurring-payment disclosures, nonrefundability, cancellation notice, liability, indemnity, and privacy terms.
4. Accountant confirmation of tax treatment and the Stripe account/bank payout identity.
5. Which Render workspace to use: `Jason's workspace` or `Savvy's workspace`.
6. Which Supabase organization should own the new project, plus approval of the displayed project cost before creation.
7. Stripe connector reauthentication, followed by confirmation that the connected account is the intended merchant account.
8. Written permission and captions for any portfolio item that may become a public case study.
9. Production sender addresses (recommended: `hello@automatemejay.com` and `notifications@automatemejay.com`) and the administrative inbox that receives client alerts.
