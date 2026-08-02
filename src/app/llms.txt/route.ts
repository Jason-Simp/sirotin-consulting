const body = `# Jason Sirotin — AI Automation Partner

> Independent AI automation consulting for businesses that need practical workflows built, repaired, connected, and improved.

Canonical URL: https://automatemejay.com
Contact: hello@automatemejay.com

## Service

Jason Sirotin works directly with business owners and operating teams to design, build, troubleshoot, and continuously improve practical AI-enabled workflows.

## Engagement model

- Free first week: $0, approximately one focused hour, no payment card, no automatic conversion.
- Weekly Partner: $350 per week, approximately one substantive hour weekly, seven days' written cancellation notice.
- Monthly Partner: $1,000 per month, approximately four substantive hours monthly, 30 days' written cancellation notice.
- Standard plans support one primary directing stakeholder and one actively prioritized workstream.
- Third-party costs require client approval and are billed separately.

## Working principles

The client tests deliveries, supplies access and accurate information, approves production use, and maintains appropriate human review. Results depend on systems, data, cooperation, third-party services, and technical feasibility.
`;

export function GET() {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
