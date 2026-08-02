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
| Trial billing | Potential temptation to use a Stripe trial | The free week lives entirely in the application and requires no card; it never auto-converts | Final commercial rules |
| Paid pricing | Earlier Savvy source used $300 weekly | Weekly is $350; monthly is $1,000 | Later explicit pricing controls |
| Cancellation UX | Stripe Customer Portal default cancellation does not enforce the written 7/30-day notice model | Disable self-serve subscription cancellation in the Stripe portal for MVP; accept cancellation requests in the app, calculate the effective date, record notice, and schedule Stripe cancellation server-side | Final cancellation rules and Stripe cancellation behavior |
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
