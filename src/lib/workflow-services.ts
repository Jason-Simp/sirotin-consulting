export type WorkflowService = {
  slug: "n8n" | "monday-com";
  platform: string;
  shortLabel: string;
  title: string;
  description: string;
  hero: string;
  heroAccent: string;
  lede: string;
  proof: string;
  fit: Array<{ title: string; body: string }>;
  services: Array<{ title: string; body: string }>;
  examples: Array<{ title: string; flow: string; result: string }>;
  steps: Array<{ title: string; body: string }>;
  ownership: string[];
  faqs: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; url: string }>;
};

export const workflowServices: WorkflowService[] = [
  {
    slug: "n8n",
    platform: "n8n",
    shortLabel: "Technical workflow orchestration",
    title: "n8n Automation Consulting, Integration, and Workflow Repair",
    description: "Work directly with Jason Sirotin to design, repair, secure, document, and operate n8n workflows that connect real business systems.",
    hero: "n8n workflows that keep working",
    heroAccent: "after the demo.",
    lede: "I help teams turn fragile n8n experiments into controlled business workflows—with clear triggers, typed data, bounded credentials, human approvals, error paths, and evidence that every external action actually completed.",
    proof: "n8n is a strong fit when the work crosses APIs, databases, webhooks, AI models, and custom logic. The value comes from engineering the whole operating path—not from adding the largest possible number of nodes.",
    fit: [
      { title: "Systems must talk to each other", body: "Connect a CRM, inbox, database, document store, forms, calendars, internal APIs, and third-party services through one observable flow." },
      { title: "The logic is more than trigger-action", body: "Use branching, transformations, validation, loops, sub-workflows, code, queues, and controlled AI reasoning where a simple recipe no longer fits." },
      { title: "A workflow already exists—but nobody trusts it", body: "Trace missed triggers, duplicate writes, stale credentials, bad mappings, silent failures, retry behavior, and workflows that only one person understands." },
      { title: "AI needs boundaries", body: "Let a model classify, extract, or draft while deterministic rules, allowlisted tools, and human review control consequential actions." },
      { title: "The team needs deployment discipline", body: "Separate development and production, document configuration, define release evidence, and create a rollback and recovery path." },
      { title: "Volume or reliability is increasing", body: "Plan execution data, concurrency, queue behavior, alerting, pruning, and capacity around the actual business load." },
    ],
    services: [
      { title: "Workflow discovery and architecture", body: "Map the trigger, identities, data contracts, systems of record, decisions, exceptions, approvals, and evidence before building." },
      { title: "New n8n workflow builds", body: "Create focused integrations and automations using native nodes, HTTP APIs, webhooks, database operations, and carefully bounded custom logic." },
      { title: "Audit, repair, and simplification", body: "Review existing workflows, reproduce failures, remove accidental complexity, repair mappings and credentials, and make ownership visible." },
      { title: "AI-enabled workflow design", body: "Add classification, extraction, summarization, or agent steps without letting untrusted model output become unchecked authority." },
      { title: "Security and credential review", body: "Reduce credential scope, protect webhooks, review risky nodes and community nodes, rotate secrets, and use n8n’s available security controls." },
      { title: "Operations and handoff", body: "Add error workflows, execution identifiers, alerts, runbooks, retention, release notes, and a client-owned path for maintenance and recovery." },
    ],
    examples: [
      { title: "Qualified lead routing", flow: "Form or inbox → normalize → deduplicate → evidence-based scoring → human review → CRM and assigned follow-up", result: "A visible lead path that avoids duplicate contacts and keeps uncertain prospects out of automatic rejection." },
      { title: "Document-to-system workflow", flow: "Secure upload → classify → extract → validate → exception review → database or operations record", result: "Less manual entry without treating a confident extraction as proof that the value is correct." },
      { title: "Client communication workflow", flow: "Business event → gather approved context → draft → policy checks → approval → send → store provider message ID", result: "Faster follow-up with clear sending authority, duplicate protection, and evidence of delivery." },
    ],
    steps: [
      { title: "Map the workflow and authority", body: "Identify the real source of truth, who owns each decision, and exactly what n8n may read, create, change, send, or never do." },
      { title: "Build one safe path", body: "Use test accounts and representative data to prove the trigger, transformations, approvals, destination writes, and recovery behavior." },
      { title: "Test normal, messy, and forbidden cases", body: "Exercise duplicates, missing fields, timeouts, stale records, expired credentials, prompt injection, denied approvals, and partial provider failures." },
      { title: "Release with evidence and a runbook", body: "Activate the production workflow only after ownership, credentials, alerting, rollback, documentation, and client approval are explicit." },
    ],
    ownership: [
      "The n8n account or self-hosted instance and its billing",
      "Production credentials, encryption keys, domains, and infrastructure",
      "Workflow exports, source repository, documentation, and runbooks",
      "Business data, execution records, retention choices, and deletion controls",
      "Administrator access and a recovery path that does not depend on Jason’s personal account",
    ],
    faqs: [
      { question: "Can Jason build a new n8n workflow from scratch?", answer: "Yes. The work begins with the business process and authority boundaries, then moves into a narrow first implementation using the client’s systems and accounts." },
      { question: "Can you repair an n8n workflow someone else built?", answer: "Yes. I can audit the current workflow, reproduce the failure, review credentials and data mappings, simplify the design, add error handling, and document what changed. Repair depends on access, provider behavior, and the condition of the existing system." },
      { question: "Do I need n8n Cloud or a self-hosted instance?", answer: "Not automatically. The decision depends on operating capacity, data requirements, integrations, support needs, security responsibilities, and the features required. The client owns the selected account and infrastructure." },
      { question: "Can n8n run AI agents safely?", answer: "n8n can orchestrate AI steps and supports human review for tool calls. Safe operation still requires narrow tool permissions, validated inputs and outputs, approval for consequential actions, monitoring, and a tested recovery path." },
      { question: "Will the workflow be completely autonomous?", answer: "Only where the consequence and evidence justify it. Reversible, low-risk actions may run automatically after testing. Financial, legal, access, destructive, or customer commitments keep the level of human approval they require." },
      { question: "Who owns the n8n workflows?", answer: "The client owns its data and paid client-specific deliverables. The client should also own the n8n account, infrastructure, production credentials, and billing. Jason retains preexisting reusable methods, components, and general know-how as described in the consulting agreement." },
    ],
    sources: [
      { label: "n8n Docs: View and retry workflow executions", url: "https://docs.n8n.io/workflows/executions/all-executions/" },
      { label: "n8n Docs: Security audit", url: "https://docs.n8n.io/hosting/securing/security-audit/" },
      { label: "n8n Docs: Source control and environments", url: "https://docs.n8n.io/source-control-environments/create-environments/" },
      { label: "n8n Docs: Manage execution data", url: "https://docs.n8n.io/hosting/scaling/execution-data/" },
      { label: "n8n Docs: Human review for AI tool calls", url: "https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/" },
    ],
  },
  {
    slug: "monday-com",
    platform: "monday.com",
    shortLabel: "Visible team operations",
    title: "monday.com Workflow Consulting, Automation, and Integration",
    description: "Work directly with Jason Sirotin to design monday.com boards, workflows, automations, permissions, and integrations that teams can actually operate.",
    hero: "monday.com workflows your team can trust",
    heroAccent: "and actually use.",
    lede: "I help teams turn scattered boards and manual handoffs into a clear operating system—one with understandable statuses, responsible owners, useful automations, appropriate permissions, and connections to the systems that still need to remain the source of truth.",
    proof: "monday.com works best when the board reflects the real work. The goal is not to recreate every spreadsheet or automate every click. It is to make ownership, decisions, exceptions, and next actions visible to the people responsible for them.",
    fit: [
      { title: "Work disappears between departments", body: "Create a visible handoff from intake to qualification, production, review, approval, delivery, or follow-up without relying on private memory." },
      { title: "Boards have multiplied without a system", body: "Simplify duplicated boards, inconsistent columns, unclear statuses, broken mirrors, and dashboards that no longer answer useful questions." },
      { title: "The team is doing repetitive updates", body: "Use board automations or multi-step workflows for assignments, reminders, status changes, record creation, notifications, and cross-board movement." },
      { title: "monday.com must connect to other tools", body: "Link forms, email, CRM, file storage, calendars, databases, or custom services through supported integrations, webhooks, and the platform API." },
      { title: "Permissions and ownership are unclear", body: "Align account, workspace, board, column, automation, integration, and API access with the people who actually need it." },
      { title: "Automations fail when someone leaves", body: "Review automation ownership, connected accounts, transfer behavior, run history, and administrator recovery before a user is deactivated." },
    ],
    services: [
      { title: "Board and workspace architecture", body: "Define what belongs on each board, which fields carry meaning, how items move, who owns structure, and where external guests belong." },
      { title: "Workflow and automation design", body: "Build understandable trigger-condition-action rules or multi-step workflows with branches, delays, cross-board actions, and deliberate stopping points." },
      { title: "Forms, intake, and request routing", body: "Turn incoming requests into complete, assigned work with required fields, duplicate checks, priority logic, acknowledgments, and review paths." },
      { title: "Integrations and API connections", body: "Connect monday.com to approved third-party systems through native integrations, authenticated API calls, and verified webhook endpoints." },
      { title: "Permissions and governance", body: "Review board type, roles, guests, column restrictions, automation creation, API-token access, ownership, and administrative controls." },
      { title: "Cleanup, adoption, and documentation", body: "Reduce clutter, standardize names and statuses, train the responsible operators, document automations, and create a practical maintenance routine." },
    ],
    examples: [
      { title: "Client request intake", flow: "WorkForm or email → completeness check → owner assignment → acknowledgment → service board → approval and closeout", result: "Every request has a visible owner and status instead of disappearing in inboxes or chat." },
      { title: "Production handoff", flow: "Approved opportunity → project item → standardized subtasks → reminders → review gate → delivery notification", result: "Sales, operations, and delivery teams share the same definition of ready, blocked, and complete." },
      { title: "Executive operating view", flow: "Controlled source boards → mirrored metrics → exception flags → accountable updates → decision-ready dashboard", result: "Leadership sees current bottlenecks and ownership without asking people to rebuild a weekly status report." },
    ],
    steps: [
      { title: "Observe the real work", body: "Map the request, people, decisions, handoffs, exceptions, and source systems before changing a board or adding an automation." },
      { title: "Design the smallest useful operating model", body: "Choose boards, fields, statuses, roles, and views that make the workflow understandable without burying the team in administration." },
      { title: "Build and test with the operators", body: "Run representative work through forms, automations, permissions, integrations, notifications, and failure cases with the people who will use it." },
      { title: "Release ownership—not dependence", body: "Confirm administrators, automation owners, connected accounts, documentation, training, support boundaries, and a clean way to change or stop the workflow." },
    ],
    ownership: [
      "The monday.com account, subscription, workspaces, boards, and billing",
      "Administrator roles, board owners, automation owners, and connected accounts",
      "API credentials, app installations, integrations, and webhook endpoints",
      "Board data, exports, permission choices, retention, and audit access",
      "Templates, documentation, training material, and an offboarding path for owners and integrations",
    ],
    faqs: [
      { question: "Can Jason organize an existing monday.com account?", answer: "Yes. I can inventory the current boards, automations, integrations, permissions, ownership, and reporting; then propose a smaller, clearer structure before making approved changes." },
      { question: "Should we use board automations or the workflow builder?", answer: "It depends on the process and the plan available. Board automations are useful for focused rules tied to a board. monday.com’s workflow builder supports broader multi-step and cross-board logic. The simplest tool that clearly represents the work is usually the better starting point." },
      { question: "Can monday.com connect to our CRM, email, forms, or database?", answer: "Often, yes—through native integrations, marketplace apps, webhooks, or the monday platform API. The exact path depends on the systems, permissions, data model, rate limits, and approved source of truth." },
      { question: "Can you stop automations from breaking when an employee leaves?", answer: "The risk can be reduced by documenting and transferring automation ownership before deactivation, reviewing connected integrations, establishing administrators, and testing recovery. monday.com notes that some transferred integrations disconnect until the new owner reconnects them." },
      { question: "Will you rebuild our whole business in monday.com?", answer: "No. monday.com should coordinate the work it is suited to coordinate. Accounting, identity, regulated records, or another specialized system may need to remain authoritative. The workflow should connect those systems without pretending one board replaces them all." },
      { question: "Who owns the monday.com system?", answer: "The client owns and pays for its account, keeps administrative control, and owns its data and paid client-specific deliverables. Jason retains preexisting reusable methods, components, and general know-how as described in the consulting agreement." },
    ],
    sources: [
      { label: "monday.com: Get started with automations", url: "https://support.monday.com/hc/en-us/articles/360001222900-Get-started-with-monday-automations" },
      { label: "monday.com: Workflow builder compared with automations", url: "https://support.monday.com/hc/en-us/articles/18382067611410-Comparing-the-workflow-builder-and-automations" },
      { label: "monday.com: Manage board automations and ownership", url: "https://support.monday.com/hc/en-us/articles/15485449493394-Managing-your-board-Automations" },
      { label: "monday.com: Permissions", url: "https://support.monday.com/hc/en-us/articles/360019222479-Permissions-on-monday-com" },
      { label: "monday developer: API authentication", url: "https://developer.monday.com/api-reference/docs/authentication" },
      { label: "monday developer: Webhooks and retry policy", url: "https://developer.monday.com/api-reference/reference/webhooks" },
    ],
  },
];

export function getWorkflowService(slug: WorkflowService["slug"]) {
  return workflowServices.find((service) => service.slug === slug)!;
}
