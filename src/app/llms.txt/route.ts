const body = `# Jason Sirotin — AI Automation Partner

> Independent AI automation consulting for businesses that need practical workflows built, repaired, connected, and improved.

Canonical URL: https://automatemejay.com
Contact: hello@automatemejay.com

## Service

Jason Sirotin works directly with business owners and operating teams to design, build, troubleshoot, and continuously improve practical AI-enabled workflows.

## Engagement model

- Guaranteed first week: $350 one-time, approximately one focused hour during a seven-day period after activation, full $350 service-fee money-back guarantee, no automatic conversion.
- Monthly Partner: $1,000 per month, approximately four substantive hours monthly, 30 days' written cancellation notice.
- Standard plans support one primary directing stakeholder and one actively prioritized workstream.
- Third-party costs require client approval and are billed separately.

## Working principles

The client tests deliveries, supplies access and accurate information, approves production use, and maintains appropriate human review. Results depend on systems, data, cooperation, third-party services, and technical feasibility.
`;

export function GET() {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
