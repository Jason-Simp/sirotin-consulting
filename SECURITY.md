# Security policy and operations

## Reporting

Report a suspected vulnerability privately to `hello@automatemejay.com`. Do not include passwords, API keys, customer data, or other secrets in the initial message.

## Production controls

- Supabase Row Level Security protects every Data API table and Storage object.
- Public intake and payments enter through server routes with same-origin checks, bounded bodies, durable rate limits, and redacted structured logs.
- Stripe and Resend webhooks require provider signatures and reject oversized payloads.
- Authentication uses closed registration, leaked-password checks, 12-character minimum passwords, 30-day maximum sessions, seven-day inactivity expiry, and refresh-token replay detection.
- Database connections require SSL. Successful connections and disconnections are logged by Supabase.
- The application emits a strict Content Security Policy, HSTS, frame protection, MIME sniffing protection, a restrictive permissions policy, and request IDs.
- Secrets stay in provider environment settings. Never commit `.env` files or anything under `Keys/`.

## Release gate

Run this before every production release:

```bash
pnpm security:check
```

Review the Supabase Security Advisor after every schema migration. Confirm the live security headers and protected endpoint behavior after every deployment.

## Log handling

Application logs must not contain tokens, request bodies, email addresses, calendar details, payment details, or customer-provided free text. Security-event fingerprints are HMAC digests, not source IP addresses. Retain operational security events only as long as needed for abuse investigation and remove events older than 90 days during routine maintenance.

## Incident response

1. Disable or isolate the affected route or integration.
2. Rotate the exposed provider secret and revoke active sessions when warranted.
3. Review Render request logs, Supabase Auth/Postgres logs, `security_events`, Stripe events, and Resend events using request IDs and timestamps.
4. Preserve necessary evidence without copying customer content into tickets or chat.
5. Notify affected clients promptly when their data or account may be at risk.
6. Patch, test, deploy, and document the root cause and prevention.

## Access safeguards

The only authorized Render team for this repository is Jason's workspace (`tea-d8ujm2po3t8c73drl260`). Never inspect or modify the Savvy workspace (`tea-d8smb5m7r5hc73fmjdu0`). The only authorized Supabase project is `sirotin-consulting` (`ekuogadgwhmfyiolpunj`) in Jason-Simp's Org.
