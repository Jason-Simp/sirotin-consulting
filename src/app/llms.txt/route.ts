import { blogPosts } from "@/lib/blog";

const articleIndex = blogPosts
  .map((post) => `- [${post.title}](https://automatemejay.com/blog/${post.slug}): ${post.description}`)
  .join("\n");

const body = `# Jason Sirotin — AI Automation Partner

> Independent AI automation consulting for businesses that need practical workflows built, repaired, connected, and improved.

Canonical URL: https://automatemejay.com
Contact: hello@automatemejay.com
Phone: +1-678-855-5169
Last updated: 2026-08-09

## Service

Jason Sirotin works directly with business owners and operating teams to design, build, troubleshoot, and continuously improve practical AI-enabled workflows.

## Engagement model

- Free consultation: 30 minutes, no card, no obligation, live booking at https://automatemejay.com/book. It is discovery and scoping, not a technical working session.
- Guaranteed first week: $350 one-time, approximately one focused hour during a seven-day period after activation, full $350 service-fee money-back guarantee, no automatic conversion.
- Monthly Partner: $1,000 for each recurring 30-day billing period, approximately four substantive hours monthly, cancel anytime before the next renewal through the membership area.
- The public offer intentionally presents only these two choices. One-off or legacy weekly work is available only through a private written scope from Jason.
- Standard plans support one primary directing stakeholder and one actively prioritized workstream.
- Hosting, databases, domains, APIs, and software should be established in client-owned accounts whenever practical. The client enters payment details directly with the provider and keeps ownership and administrative control.
- If Jason or AutomateMeJay purchases, pays, or administratively manages an approved third-party service on the client's behalf, the actual provider cost plus a 25% convenience charge applies. The convenience charge does not apply when the client owns and pays the provider directly.

## Working principles

The client tests deliveries, supplies access and accurate information, approves production use, and maintains appropriate human review. Results depend on systems, data, cooperation, third-party services, and technical feasibility.

Jason's first-hand build method is documented at https://automatemejay.com/approach. Every engagement begins with a workflow map and authority map, then moves through a bounded first path, representative evaluation cases, and an explicit release and ownership record.

## Expertise

- Business process and workflow automation
- AI agents and governed knowledge systems
- Human approval, testing, security, and exception design
- Email, CRM, document, database, and operations integrations
- Troubleshooting and improving existing automations

## Workflow automation services

- Workflow automation hub: https://automatemejay.com/workflow-automation
- n8n consulting: technical orchestration across APIs, databases, webhooks, AI steps, and custom logic at https://automatemejay.com/workflow-automation/n8n
- monday.com consulting: team-facing boards, handoffs, approvals, permissions, automations, and operating visibility at https://automatemejay.com/workflow-automation/monday-com
- Platform selection follows the operating need. Some engagements use one platform; some use both. Client accounts, data, credentials, billing, documentation, and recovery paths remain client-owned whenever practical.

## Useful links

- Book a free consultation: https://automatemejay.com/book
- Portfolio: https://automatemejay.com/portfolio
- Jason's build and verification method: https://automatemejay.com/approach
- Workflow automation consulting: https://automatemejay.com/workflow-automation
- AI automation news and researched guides: https://automatemejay.com/blog
- Full public knowledge file: https://automatemejay.com/llms-full.txt

## Researched guides

${articleIndex}
`;

export function GET() {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
