export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  published: string;
  updated: string;
  readTime: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  keywords: string[];
  intro: string[];
  sections: BlogSection[];
  takeaway: string;
  sources?: { label: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "automate-invoice-processing-with-ai",
    title: "How to automate invoice processing with AI without losing control",
    description: "A practical accounts-payable workflow for extracting invoice data, stopping duplicates, verifying vendor changes, routing approvals, and preserving an audit trail.",
    category: "Finance operations",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "13 min read",
    image: "/portfolio/simplupload.jpg",
    imageAlt: "SimplUpload document intake interface used in Jason Sirotin's agent-assisted systems",
    imageCaption: "A controlled intake surface from the SimplSolutions product portfolio. The original document remains visible while structured work moves through review.",
    keywords: ["AI invoice processing", "automate accounts payable", "invoice automation workflow", "prevent duplicate invoice payments"],
    intro: [
      "Yes, AI can remove a large amount of manual invoice work. It can read documents, propose structured fields, detect missing information, and prepare an approval packet. It should not quietly decide that a vendor is legitimate or that money should move.",
      "The safest design separates document understanding from financial authority. AI prepares the evidence. Deterministic controls check the transaction. Named people approve exceptions and payments.",
    ],
    sections: [
      {
        heading: "Define the job before choosing a parser",
        paragraphs: [
          "Map one invoice from arrival to payment. Record every system, handoff, decision, exception, and piece of evidence. Decide which system owns the vendor record, purchase order, receipt, approval, accounting entry, and payment confirmation. If two systems can independently change the same fact, fix that ownership problem before adding AI.",
          "A useful first boundary is: when an invoice reaches the approved intake address or upload page, the workflow will preserve the original, extract proposed fields, run duplicate and policy checks, and prepare a review packet. It will not change vendor banking details, approve its own exception, or release payment.",
        ],
        bullets: [
          "Trigger: one controlled inbox or upload route",
          "Output: a reviewable invoice record with the original attached",
          "System of record: one accounting or AP platform",
          "Owner: one person accountable for the workflow",
          "Excluded authority: vendor-master changes and payment release",
        ],
      },
      {
        heading: "Extract a typed record, not a paragraph",
        paragraphs: [
          "Invoice tools can extract header and line-item fields such as supplier name, invoice number, dates, totals, tax, purchase-order number, and line amounts. Ask the model or document processor for a defined schema, then validate every field by type, format, range, and business rule. Structured output makes downstream software easier to control; it does not prove the extracted value is true.",
          "Keep the original file beside the proposed record. A reviewer should be able to select any important field and see the source page or region that produced it. Route unreadable documents, missing invoice numbers, conflicting totals, and unsupported currencies to an exception queue rather than guessing.",
        ],
        bullets: [
          "Vendor identity and approved vendor ID",
          "Invoice number, issue date, due date, and currency",
          "Subtotal, tax, freight, credits, and total",
          "Purchase-order and receiving references",
          "Line description, quantity, unit price, and line total",
          "Source location and validation status for every critical field",
        ],
      },
      {
        heading: "Stop duplicate invoices before approval",
        paragraphs: [
          "A retry, forwarded email, slightly renamed attachment, or second upload must not create a second payable item. Build a stable fingerprint from normalized vendor ID, invoice number, currency, and amount. Enforce a unique database rule for the exact key, not merely a warning in the interface.",
          "Also look for near-duplicates: the same vendor and amount with a slightly different invoice number, the same document hash from another sender, or the same purchase-order balance billed twice. Near-duplicates belong in review. Exact duplicates should be rejected or linked to the existing record. Every external write should use a stable request key so a timeout and retry cannot create a second accounting entry or payment instruction.",
        ],
      },
      {
        heading: "Treat payment-detail changes as a separate security event",
        paragraphs: [
          "Never update a vendor's bank account, mailing address, or payment method merely because new instructions appear on an invoice or in the email carrying it. The FBI specifically warns that business-email-compromise schemes impersonate known vendors and alter invoice or payment instructions.",
          "Freeze the invoice workflow when payment details differ from the approved vendor master. Verify the change through a known contact and a channel already on file—not a phone number or link supplied in the suspicious message. Require a second authorized person to approve the vendor-master change, then keep that approval separate from the invoice approval.",
        ],
        bullets: [
          "Flag look-alike sender domains and reply-to mismatches",
          "Never accept bank changes from invoice text alone",
          "Call a previously verified number or use an established vendor portal",
          "Require two people for vendor-master and payment-procedure changes",
          "Escalate urgency, secrecy, and last-minute instruction changes",
        ],
      },
      {
        heading: "Use deterministic matching before human approval",
        paragraphs: [
          "Match the proposed invoice to approved business records. For purchase-order work, compare the purchase order, receiving evidence, and invoice. Exact rules should evaluate vendor, currency, quantities, unit prices, tax treatment, remaining PO balance, and configured tolerances. AI may explain a mismatch, but it should not invent a receipt or waive a policy.",
          "Route clean matches through the normal approval chain and exceptions to the person who can resolve them. Approval limits should come from identity and role data, not from a model prompt. The person approving should see the original invoice, match results, prior invoices, vendor status, proposed accounting treatment, and exactly what the next action will do.",
        ],
      },
      {
        heading: "Preserve records and an audit trail",
        paragraphs: [
          "The IRS identifies invoices, paid bills, receipts, account statements, and canceled checks as supporting documents for business records. Your automation should make those records easier to retrieve, not replace them with an AI summary. Preserve the original document, the extracted version, validation results, approvals, overrides, accounting record ID, and payment confirmation according to your accountant's and legal counsel's retention requirements.",
          "Log who changed what, when, and why. Store model and parser versions, but keep sensitive invoice contents out of ordinary application logs. The client should own the storage, accounting, and provider accounts whenever practical so access, billing, export, and retention remain under the client's control.",
        ],
        bullets: [
          "Original immutable invoice and a document hash",
          "Extracted fields with source locations",
          "Duplicate, vendor, match, and policy check results",
          "Every edit, approval, rejection, and override reason",
          "Accounting and payment-provider record identifiers",
          "Retention, export, backup, and deletion ownership",
        ],
      },
      {
        heading: "Launch in shadow mode and measure the exceptions",
        paragraphs: [
          "Run the workflow beside the current process before it can create accounting entries. Use representative invoices: normal purchases, credit memos, partial shipments, recurring bills, foreign currency, tax variations, missing purchase orders, duplicates, modified bank details, unreadable scans, and totals that do not reconcile.",
          "Compare proposed fields and routing with the result approved by the AP team. Track field-level correction rate, duplicate catches, exception rate, false alarms, review time, cycle time, and any record created twice. Release one reversible write action at a time. Payment release should remain behind the business's existing banking controls and authorized people.",
        ],
        bullets: [
          "Can every critical value be traced to the invoice?",
          "Does an exact duplicate fail safely?",
          "Does a near-duplicate reach a reviewer?",
          "Does a vendor-bank change stop the workflow?",
          "Does a retry reuse the existing record?",
          "Can the team disable the automation without stopping AP work?",
        ],
      },
    ],
    takeaway: "Automate invoice intake, extraction, matching, and evidence preparation. Keep vendor changes, exception approval, and payment authority behind deterministic controls and named people.",
    sources: [
      { label: "FBI: Business Email Compromise", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/business-email-compromise" },
      { label: "IRS Publication 583: Starting a Business and Keeping Records", url: "https://www.irs.gov/publications/p583" },
      { label: "Google Cloud Document AI: Invoice Parser fields", url: "https://docs.cloud.google.com/document-ai/docs/processors-list" },
      { label: "NIST AI Risk Management Framework Core", url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/" },
      { label: "OpenAI API: strict JSON-schema structured outputs", url: "https://platform.openai.com/docs/api-reference/responses-streaming/response/output_item" },
    ],
  },
  {
    slug: "how-to-automate-repetitive-business-tasks-with-ai",
    title: "How to automate repetitive business tasks with AI",
    description: "A practical method for choosing, designing, testing, and improving an AI-enabled business workflow without automating the wrong work.",
    category: "AI automation strategy",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "12 min read",
    image: "/automation-workflow-social.png",
    imageAlt: "AI automation workflow moving from a recurring task through review and improvement",
    imageCaption: "The working model Jason uses: define one bottleneck, build a narrow path, test it with real examples, and improve from evidence.",
    keywords: ["automate repetitive business tasks", "AI workflow automation", "business process automation"],
    intro: [
      "The best first AI automation is rarely the flashiest idea. It is usually a recurring task with clear inputs, an understandable decision path, and an output a person can review.",
      "A useful automation removes friction while preserving judgment. The goal is not to eliminate people from a process. The goal is to stop asking people to perform the same mechanical steps every day.",
    ],
    sections: [
      {
        heading: "Start with evidence, not a tool",
        paragraphs: ["Observe five to ten real examples before designing anything. Write down what happens from trigger to completion: where information arrives, who touches it, what gets copied, which decisions require judgment, which exceptions appear, and where evidence of completion lives. NIST's AI RMF calls this mapping: the task, context, people, impacts, and system boundaries must be understood before risk can be measured or managed.", "Capture a baseline you can compare later. If a task occurs 80 times a month, takes nine minutes, and needs correction 12% of the time, the baseline is 12 labor hours plus correction time—not a vague claim that the process is 'slow.'"],
        bullets: ["Trigger: what observable event starts the work?", "Inputs: which fields or documents are required, and who owns them?", "Decision: which rule or judgment changes the next step?", "Action: what is drafted, created, sent, or updated?", "Evidence: where can a reviewer prove the right action occurred?", "Exceptions: which real examples do not follow the normal path?"],
      },
      {
        heading: "Choose a narrow first version",
        paragraphs: ["Do not begin by automating an entire department. Choose one trigger and one useful outcome. A defensible first version might turn a completed intake form into a structured summary and a draft follow-up, then stop for human review. It should not simultaneously qualify the lead, change pricing, send the message, update five systems, and close the record.", "Use a boundary statement: 'When X arrives, the system will produce Y for Z to review; it will not perform A, B, or C.' This sentence prevents a prototype from quietly becoming an uncontrolled production system."],
      },
      {
        heading: "Build review into the workflow",
        paragraphs: ["AI output can be incomplete, unsupported, or wrong. Separate preparation from authority: the model may extract, summarize, classify, or draft, while a named person approves consequential messages, money movement, access changes, employment decisions, contractual language, and production releases.", "A useful review screen shows the source, proposed output, confidence or validation failures, what will happen after approval, and how to reject or edit it. A generic 'Approve' button without that context is not meaningful human control."],
      },
      {
        heading: "Test normal cases, boundaries, and failure paths",
        paragraphs: ["Create a test sheet before launch. Include ordinary examples, incomplete inputs, duplicates, stale information, contradictory instructions, unsupported file types, provider timeouts, revoked permissions, and low-confidence output. For each case record the expected result, actual result, reviewer, and change required.", "Retries deserve special attention. If a timeout occurs after a CRM update but before the workflow receives confirmation, a retry must not create a second record or send a second email. Use a stable request ID and idempotent writes."],
        bullets: ["Five representative normal cases", "Two incomplete or malformed inputs", "One duplicate submission", "One provider outage or timeout", "One permission failure", "One case that must be handed to a person"],
      },
      {
        heading: "Measure the process after launch",
        paragraphs: ["Track median cycle time, manual touches, correction rate, exception rate, adoption, and completed outcomes. Compare the same measurement window before and after release. If the automation saves eight minutes upfront but creates ten minutes of cleanup, it has moved the work rather than removed it.", "Review results after enough cycles to see variation. Record which failures came from code, model behavior, data quality, unclear policy, or user training; each category needs a different fix."],
      },
    ],
    takeaway: "Bring one recurring task with a clear owner and outcome. Map it, automate the mechanical steps, preserve human approval, and improve it from real use.",
    sources: [
      { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { label: "NIST AI RMF Core: Govern, Map, Measure, Manage", url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/" },
      { label: "OpenAI: A practical guide to building agents", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
    ],
  },
  {
    slug: "ai-automation-cost-for-small-business",
    title: "How much does AI automation cost for a small business?",
    description: "Understand the real cost of AI automation: discovery, implementation, software, usage, maintenance, and the internal time needed to make it work.",
    category: "Budgeting",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "11 min read",
    image: "/portfolio/simplengine-product.jpg",
    imageAlt: "SimplEngine command surface for planning and reviewing agent-assisted work",
    imageCaption: "SimplEngine is an example of the operational layer behind an AI system—the planning, review, testing, and release work that sits beyond model usage fees.",
    keywords: ["AI automation cost", "small business automation pricing", "AI consultant cost"],
    intro: [
      "AI automation does not have one universal price. A workflow that summarizes a form is different from a customer-facing system connected to billing, identity, private data, and multiple business applications.",
      "The most reliable estimate starts with the process, not the model or software brand.",
    ],
    sections: [
      {
        heading: "The five cost categories",
        paragraphs: ["A complete budget includes more than build time. Separate one-time implementation, recurring provider charges, recurring service or maintenance, and internal staff time. Otherwise an inexpensive API can disguise an expensive operating process."],
        bullets: ["Discovery: observation, process mapping, risk and access decisions", "Implementation: interface, integration, data model, prompts or rules", "Infrastructure: hosting, database, APIs, storage, email, voice, and monitoring", "Readiness: test data, security checks, documentation, training, and rollback", "Operations: review time, exception handling, maintenance, and future changes"],
      },
      {
        heading: "Complexity changes the estimate",
        paragraphs: ["Costs rise when inputs are inconsistent, several systems claim to be authoritative, permissions differ by role, information is regulated, volume is high, or actions are difficult to reverse. A narrow internal drafting workflow is usually less expensive than a public agent with identity, payments, calendar access, and write permissions.", "Ask what must be true for the workflow to be production-ready. Authentication, audit evidence, signed webhooks, rate limits, backups, error queues, data retention, and incident response are real work even when the first demo took one afternoon."],
      },
      {
        heading: "Keep infrastructure in your name",
        paragraphs: ["Whenever practical, the business should own its domain, hosting, database, API accounts, and billing relationships. This keeps control of data and assets with the client and makes provider costs visible. Management convenience can be offered separately, but ownership should never be ambiguous."],
      },
      {
        heading: "Compare cost to the current process",
        paragraphs: ["Use one shared model: monthly current cost = volume × minutes per case ÷ 60 × loaded hourly cost, plus measurable rework, delay, and error cost. Expected monthly benefit = time actually removed × loaded cost, plus conservatively valued recovered outcomes. Do not count time that employees cannot realistically redeploy.", "Example: 300 requests × 8 minutes at $36 per loaded hour is $1,440 per month. If a reviewed workflow safely removes five minutes from 70% of cases, gross labor capacity is $630 per month—not $1,440. Compare that conservative benefit with implementation, provider, review, and maintenance costs."],
      },
      {
        heading: "Use a 12-month total-cost worksheet",
        paragraphs: ["Write one-time implementation in month zero, then forecast monthly software, usage, support, review labor, and contingency. Model low, expected, and high usage rather than one precise guess. Include an exit cost: data export, credential rotation, and handoff documentation.", "A credible proposal identifies assumptions and shows which provider charges go directly to the client. Price certainty comes from a narrow scope and visible assumptions, not from pretending future volume and exceptions are known."],
        bullets: ["One-time build and setup", "Monthly fixed providers", "Usage-based low / expected / high", "Human review and exception time", "Maintenance or partner service", "10–20% contingency for unknowns", "Ownership and exit plan"],
      },
    ],
    takeaway: "Ask for a 12-month estimate that separates implementation, providers, internal review, maintenance, assumptions, and asset ownership—then compare it with a measured baseline.",
    sources: [
      { label: "OpenAI business leader’s guide: establish time, cost, and accuracy baselines", url: "https://cdn.openai.com/business-guides-and-resources/a-business-leaders-guide-to-working-with-agents.pdf" },
      { label: "NIST Secure Software Development Framework", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
    ],
  },
  {
    slug: "ai-automation-consultant-vs-software",
    title: "AI automation consultant vs. software subscription: which do you need?",
    description: "A decision guide for choosing packaged automation software, an implementation consultant, an internal hire, or a blended approach.",
    category: "Buying guide",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "10 min read",
    image: "/jason-sirotin-headshot.png",
    imageAlt: "Jason Sirotin, independent AI automation consultant",
    imageCaption: "Jason Sirotin works directly with business owners and operating teams to define, build, test, and improve practical automations.",
    keywords: ["AI automation consultant", "automation software vs consultant", "hire AI consultant"],
    intro: [
      "A software subscription gives you a product. A consultant helps translate the way your business operates into a working system. Many businesses need both, but they should not pay for custom work when a standard feature already solves the problem.",
    ],
    sections: [
      {
        heading: "Choose software when the process is standard",
        paragraphs: ["Packaged software is usually the better answer for established jobs such as accounting, scheduling, basic email marketing, or support ticketing. If 80–90% of the requirement matches a mature product and the business can adopt its workflow, configuration is usually cheaper, faster, and easier to maintain than custom code.", "Test the product with five real cases before buying an annual plan. Verify export, permissions, audit history, integration limits, usage pricing, and what happens when you leave."],
      },
      {
        heading: "Choose consulting when the process crosses systems",
        paragraphs: ["A consultant becomes useful when the real process crosses inboxes, spreadsheets, documents, databases, and informal decisions. The hard part is not merely connecting applications; it is deciding which information is authoritative, translating policy into testable rules, limiting access, and handling exceptions.", "The deliverable should include more than a working demo: a process map, boundary statement, permission list, test evidence, owner, operating instructions, asset inventory, and recovery path."],
      },
      {
        heading: "Choose an internal hire when demand is continuous",
        paragraphs: ["If several departments have a permanent queue of automation work, an internal owner may be the right long-term choice. That person still needs business stakeholders, security support, and clear governance."],
      },
      {
        heading: "Use a short consultation to decide",
        paragraphs: ["A focused consultation should identify one process, the systems involved, the likely risk, and whether the next step is configuration, custom implementation, or no project at all. A credible advisor should be willing to recommend an existing product or no automation when those are the better choices."],
      },
      {
        heading: "Use this decision matrix",
        paragraphs: ["Score each statement from zero to two. Favor software when the process is standard, the team can change its habits, and the product already meets security and integration needs. Favor consulting when the process is differentiating, crosses several systems, includes non-obvious exceptions, or requires tailored controls. Favor an internal hire when demand is continuous across multiple teams and the organization can support product ownership.", "A blended path is common: buy the system of record, then use focused consulting to configure it, connect it safely, migrate data, document decisions, and build only the missing pieces."],
        bullets: ["Can a mature product solve at least 80% without custom code?", "Will the team adopt the product's process?", "Does the workflow create strategic differentiation?", "Are exceptions or permissions business-specific?", "Is there a permanent backlog for one full-time owner?", "Who maintains the result after launch?"],
      },
    ],
    takeaway: "Buy software for standard work, use consulting for business-specific integration and controls, and hire internally when the backlog and ownership needs are truly continuous.",
    sources: [
      { label: "OpenAI: when an agent is appropriate—and when deterministic automation may suffice", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
      { label: "NIST SSDF: a common vocabulary for producers and purchasers", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
    ],
  },
  {
    slug: "best-business-processes-to-automate-with-ai",
    title: "The best business processes to automate with AI first",
    description: "Rank automation opportunities using frequency, predictability, value, reversibility, and the amount of human judgment required.",
    category: "Process design",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "11 min read",
    image: "/portfolio/simplcity.jpg",
    imageAlt: "SimplCity Manchester public information experience",
    imageCaption: "SimplCity Manchester shows how a broad information problem can be narrowed into clear user journeys, governed sources, and visible actions.",
    keywords: ["best processes to automate", "AI automation ideas", "business automation opportunities"],
    intro: ["The strongest first projects are valuable enough to matter and controlled enough to test. High frequency alone is not enough; the workflow also needs understandable inputs and a safe recovery path."],
    sections: [
      {
        heading: "Good first candidates",
        paragraphs: ["Start with work that is repetitive, document-heavy, and easy to review."],
        bullets: ["Structuring form or email intake", "Drafting follow-up from approved templates", "Summarizing internal documents", "Moving approved data between systems", "Preparing recurring reports", "Classifying requests for human routing"],
      },
      {
        heading: "Projects that need more control",
        paragraphs: ["Healthcare, legal, employment, lending, safety, financial movement, and access-control decisions deserve additional expertise and oversight. The presence of AI does not remove existing responsibilities."],
      },
      {
        heading: "Use a simple scoring model",
        paragraphs: ["Score each idea from one to five for frequency, manual effort, input consistency, output reviewability, reversibility, and business value. Then score consequence, data sensitivity, permission breadth, and exception variability from one to five.", "Use a transparent formula: opportunity = frequency + effort + consistency + reviewability + reversibility + value. Risk = consequence + sensitivity + permission breadth + variability. Rank by opportunity minus risk, but treat any consequence score of five as a required governance review rather than something an average can erase."],
      },
      {
        heading: "Do not automate a broken policy",
        paragraphs: ["If the team cannot agree on what should happen, automation will reproduce the disagreement faster. Resolve ownership, authoritative data, rules, and exceptions before building. If people repeatedly override the stated procedure for legitimate reasons, study those overrides; they contain the real policy."],
      },
      {
        heading: "Run a 45-minute opportunity workshop",
        paragraphs: ["Invite the process owner, one frequent user, and the person accountable for risk or customer impact. List no more than ten candidates, score them independently, then discuss the disagreements. The disagreement is useful: it exposes hidden effort, risk, and exception knowledge.", "Select one workflow and write a one-page charter: trigger, inputs, output, owner, human checkpoint, excluded actions, representative test data, success metrics, and stop condition. Do not select a second active workstream until the first produces credible evidence."],
        bullets: ["10 minutes: list recurring work", "10 minutes: score opportunity", "10 minutes: score risk", "10 minutes: discuss score disagreements", "5 minutes: name one owner and next evidence-gathering step"],
      },
    ],
    takeaway: "Prioritize a frequent, reviewable, reversible process with one owner. Avoid starting with your most consequential decision simply because it is painful.",
    sources: [
      { label: "NIST AI RMF Core", url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/" },
      { label: "OpenAI: use-case criteria for agents", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
    ],
  },
  {
    slug: "connect-gmail-crm-spreadsheets-with-ai",
    title: "How to connect Gmail, a CRM, and spreadsheets with AI",
    description: "A safe architecture for turning incoming messages into structured records, drafts, tasks, and human-approved CRM updates.",
    category: "Workflow architecture",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "12 min read",
    image: "/portfolio/simplbridge.jpg",
    imageAlt: "SimplBridge integration interface for connecting approved business systems",
    imageCaption: "SimplBridge represents the connection layer: typed data, bounded actions, and visible handoffs between systems instead of free-form model output.",
    keywords: ["connect Gmail CRM AI", "email automation workflow", "spreadsheet CRM automation"],
    intro: ["Email, a CRM, and spreadsheets often contain overlapping versions of the same customer story. AI can help structure and summarize that information, but the workflow needs one declared system of record."],
    sections: [
      {
        heading: "Declare the source of truth",
        paragraphs: ["Create a field-level ownership table before connecting anything. The CRM may own contact identity and opportunity status; Gmail owns the original message; the spreadsheet may own temporary analysis; an email platform may own marketing consent. A spreadsheet should never silently override the CRM unless that is an explicit, approved rule.", "Assign a stable external ID across systems. Names and email addresses can change; row numbers and message positions are not durable identifiers."],
      },
      {
        heading: "Separate extraction from action",
        paragraphs: ["Use a staged pipeline: receive an event, store a minimal reference, extract into a fixed schema, validate required fields and allowed values, compare with the system of record, prepare proposed actions, request review when required, then commit and record the result. Each stage gets its own status.", "Do not let free-form model text become an API request. Convert it to a typed object and reject unknown fields, invalid identifiers, unsupported actions, or changes outside the user's organization."],
      },
      {
        heading: "Use least-privilege access",
        paragraphs: ["Give each integration only the permissions it needs. Google explicitly advises using the narrowest OAuth scope possible. A process that only sends email can use gmail.send; it should not receive full mailbox access. Broad Gmail scopes are restricted, can require verification, and—when restricted data is stored or transmitted by a server—may trigger a security assessment.", "Use a dedicated mailbox label or alias when possible. Keep test and production credentials separate, document who can revoke access, and handle token expiration without silently skipping steps."],
      },
      {
        heading: "Log the business event",
        paragraphs: ["Keep a request ID, source message reference, proposed change, reviewer, provider response, final status, and timestamp. Avoid copying full sensitive messages into general logs. Store enough evidence to diagnose what happened, not an unnecessary duplicate of every customer's content."],
      },
      {
        heading: "Reference architecture for a safe first release",
        paragraphs: ["A practical first flow is: Gmail label → event queue → extraction schema → validation → review queue → CRM write → confirmation log. The spreadsheet receives a reporting view only after the CRM write succeeds. Failed or ambiguous items go to an exception queue with a named owner.", "Use a stable idempotency key derived from the source message and workflow version. Before writing, check whether that key already completed. This prevents duplicate records when providers retry webhooks or workers restart."],
        bullets: ["One declared owner for each field", "Typed extraction schema", "Allowlisted CRM actions", "Human approval for customer-facing drafts", "Idempotent writes and retry limits", "Exception queue and alert owner", "Minimal event log with correlation ID"],
      },
    ],
    takeaway: "Choose field-level systems of record, stage and validate every action, request the narrowest Google scopes, and make retries, review, and exceptions explicit.",
    sources: [
      { label: "Google: Choose Gmail API scopes", url: "https://developers.google.com/workspace/gmail/api/auth/scopes" },
      { label: "Google OAuth 2.0 policies", url: "https://developers.google.com/identity/protocols/oauth2/policies" },
      { label: "Google: Restricted scope verification", url: "https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification" },
    ],
  },
  {
    slug: "ai-automation-mistakes-small-business",
    title: "10 AI automation mistakes small businesses can avoid",
    description: "Common failures that create fragile, expensive, or unsafe automations—and the practical controls that prevent them.",
    category: "Implementation",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "11 min read",
    image: "/portfolio/simplengine.jpg",
    imageAlt: "SimplEngine review interface for agent-assisted implementation",
    imageCaption: "A real implementation surface needs review, testing, and release controls—not only an impressive first response from a model.",
    keywords: ["AI automation mistakes", "small business AI risks", "automation implementation problems"],
    intro: ["Most automation failures are not caused by one bad prompt. They come from unclear ownership, inconsistent data, missing exception handling, and systems that act without enough review."],
    sections: [
      {
        heading: "The ten mistakes",
        paragraphs: ["These problems appear repeatedly in early automation projects."],
        bullets: ["Choosing a tool before defining the process", "Automating several departments at once", "Using production data before testing", "Giving integrations excessive permissions", "Treating AI output as fact", "Skipping a human approval step", "Ignoring duplicate and retry behavior", "Logging secrets or customer content", "Failing to assign an owner", "Launching without a rollback and maintenance plan"],
      },
      {
        heading: "Build failure paths deliberately",
        paragraphs: ["Define what happens when a provider is unavailable, an input is missing, a duplicate request arrives, credentials expire, or confidence is low. A safe workflow pauses or routes the exception instead of inventing a successful result. Document a maximum retry count and a dead-letter or exception queue.", "Make destructive or external actions harder than drafts. CISA's secure-by-design guidance emphasizes ownership of customer security outcomes; responsibility cannot be shifted to users through a warning after an unsafe default."],
      },
      {
        heading: "Make success observable",
        paragraphs: ["Use structured status, correlation IDs, alerts, and a small set of business metrics. Observability should explain whether the workflow completed, not expose the sensitive content it processed. Monitor the rate of completion, exception, retry, human edit, and reversal by workflow version.", "Write a stop rule before launch. Examples: disable automatic sending if the correction rate exceeds 5%, if unauthorized data appears, if a required provider loses authentication, or if duplicate actions are detected."],
      },
      {
        heading: "Turn the list into a release gate",
        paragraphs: ["A checklist matters only when it changes the release decision. Assign an owner and evidence to each control: a screenshot of permission scopes, a test report for duplicate handling, a link to the rollback runbook, or an alert demonstration. Mark unresolved items as accepted risk with a named approver and review date.", "Before each material workflow change, rerun the cases most likely to break. Model upgrades, prompt changes, provider API changes, and new data sources can alter behavior even when the interface looks unchanged."],
        bullets: ["Process owner signs off on expected behavior", "Security owner reviews data and permissions", "Tester verifies normal and exception cases", "Operator demonstrates disable and recovery", "Business owner approves production scope and metrics"],
      },
    ],
    takeaway: "A reliable automation has a defined owner, constrained access, test data, human review, exception handling, monitoring, and a recovery plan.",
    sources: [
      { label: "CISA secure AI development guidance", url: "https://www.cisa.gov/news-events/alerts/2023/11/26/cisa-and-uk-ncsc-unveil-joint-guidelines-secure-ai-system-development" },
      { label: "NIST Secure Software Development Framework", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
      { label: "OpenAI: guardrails and agent design", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
    ],
  },
  {
    slug: "secure-ai-automation-customer-data",
    title: "How to secure AI automation that uses customer data",
    description: "Practical controls for identity, permissions, data minimization, logging, vendor access, human review, and incident response.",
    category: "Security",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "14 min read",
    image: "/portfolio/simplwiki-2.jpg",
    imageAlt: "SimplWiki governed knowledge interface with source-aware information",
    imageCaption: "SimplWiki illustrates a governed knowledge layer where approved context, access boundaries, and source visibility are part of the product.",
    keywords: ["secure AI automation", "AI customer data security", "AI workflow privacy"],
    intro: ["Security starts before a model receives data. The workflow needs to know who is asking, which records they may access, why the data is needed, and what actions are allowed afterward."],
    sections: [
      {
        heading: "Minimize the data path",
        paragraphs: ["Draw the data path from source to deletion. For each hop, record purpose, fields, sensitivity, legal or contractual constraint, processor, region if relevant, retention, and deletion method. Send only the fields required for the task; do not use production secrets, whole mailboxes, or complete customer histories when a narrower approved context will work.", "Replace direct identifiers with internal IDs where possible. Keep secrets and authentication tokens outside prompts, model context, analytics, and error messages."],
      },
      {
        heading: "Enforce identity at the data layer",
        paragraphs: ["Application checks are helpful, but database and storage policies should independently restrict records by authenticated user, organization, and role. Test isolation using two organizations and attempt cross-tenant reads, writes, file access, signed URLs, and realtime subscriptions.", "Server-only tables should not inherit public API access. Authentication answers who the user is; authorization decides whether that identity can read this record or perform this action. Both must be tested."],
      },
      {
        heading: "Protect every external action",
        paragraphs: ["Verify signed webhooks before parsing business data, bound payload size, rate-limit public routes, validate schema, and use idempotency for retries. Require confirmation for irreversible actions. Keep credentials in provider secret stores rather than source code, scope them narrowly, and rehearse rotation.", "Treat retrieved documents, emails, web pages, and tool output as untrusted data. Prompt injection can arrive indirectly inside content. Do not let instructions found in a customer document expand the agent's permissions or modify its governing policy."],
      },
      {
        heading: "Prepare for incidents",
        paragraphs: ["Document how to disable the workflow, rotate credentials, revoke sessions, preserve necessary evidence, identify affected records, notify stakeholders, and deploy a verified fix. Assign an incident owner and an out-of-band contact method before the system is needed.", "Run a tabletop exercise: a malicious document causes an agent to propose sending customer data to an unknown URL. Verify that allowlisted destinations, action validation, human approval, and logging prevent the action and produce useful evidence."],
      },
      {
        heading: "A minimum production security review",
        paragraphs: ["Use this as a starting review, not a claim of compliance. Higher-risk or regulated work needs qualified legal, privacy, and security advice. NIST's AI RMF organizes ongoing work into govern, map, measure, and manage; security is a lifecycle activity, not a launch-day scan."],
        bullets: ["Data inventory and purpose limitation", "Tenant and role isolation tests", "Least-privilege provider scopes", "Secret storage and rotation runbook", "Prompt-injection and untrusted-content tests", "Signed webhook and replay protection", "Idempotency and duplicate-action tests", "Human confirmation for consequential actions", "Redacted logs with correlation IDs", "Backup, disable, recovery, and notification exercise"],
      },
    ],
    takeaway: "Secure the whole workflow: identity, data access, integrations, actions, logs, and recovery—not only the model request.",
    sources: [
      { label: "NIST Generative AI Profile", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" },
      { label: "CISA secure AI system development guidance", url: "https://www.cisa.gov/news-events/alerts/2023/11/26/cisa-and-uk-ncsc-unveil-joint-guidelines-secure-ai-system-development" },
      { label: "OWASP: LLM Prompt Injection Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html" },
      { label: "NIST Secure Software Development Framework", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
    ],
  },
  {
    slug: "build-ai-knowledge-base-for-business",
    title: "How to build an AI knowledge base for your business",
    description: "Turn scattered documents into a governed knowledge system with sources, ownership, freshness rules, access controls, and useful retrieval.",
    category: "Knowledge systems",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "12 min read",
    image: "/portfolio/simplwiki-product.jpg",
    imageAlt: "SimplWiki product interface for organized business knowledge",
    imageCaption: "A business knowledge system is useful when people can see what is approved, where it came from, who owns it, and when it needs review.",
    keywords: ["AI knowledge base", "business knowledge management AI", "RAG knowledge base"],
    intro: ["An AI knowledge base is not a folder uploaded to a chatbot. It is a maintained collection of approved sources with clear ownership, access rules, and a way to show where an answer came from."],
    sections: [
      {
        heading: "Inventory sources before ingestion",
        paragraphs: ["List policies, service descriptions, procedures, product facts, templates, contracts, training materials, and frequently answered questions. For every source record the owner, intended audience, sensitivity, authority, effective date, last review date, and next review date.", "Start with the questions people actually ask and the decisions they need to make. A smaller collection that answers 50 important questions with traceable sources is more useful than thousands of unreviewed files."],
      },
      {
        heading: "Resolve contradictions",
        paragraphs: ["Older documents often disagree with current pricing or policy. Do not ask retrieval software to decide which source is correct. Establish a source-of-truth hierarchy, add effective dates, and archive superseded material outside the active index.", "Create a contradiction queue during ingestion. When two authoritative-looking sources disagree, retrieval should not blend them; the content owner must choose or document the condition under which each applies."],
      },
      {
        heading: "Design answers around evidence",
        paragraphs: ["A useful system cites the approved source and relevant section, distinguishes sourced fact from inference, acknowledges missing context, and routes sensitive or uncertain questions to a person. Test whether citations actually support the answer rather than merely discussing the same topic.", "Permissions must apply before retrieval. Filtering the final answer is weaker than preventing unauthorized documents from entering the model context."],
      },
      {
        heading: "Make freshness operational",
        paragraphs: ["Assign review dates and owners. Monitor questions that return no answer, low confidence, unsupported citations, or conflicting evidence. Update the source rather than repeatedly patching a prompt around incorrect knowledge.", "Version the index and retain a reproducible evaluation set. Before publishing an update, rerun the same questions and compare answer support, refusal behavior, and access isolation."],
      },
      {
        heading: "Build a 30-question evaluation set",
        paragraphs: ["Use ten straightforward questions, ten questions requiring more than one source, five questions the system should refuse because of permissions, and five questions with no approved answer. For each, write the expected sources, acceptable answer boundaries, and reviewer.", "Track grounded answer rate, correct refusal rate, citation support, unauthorized retrieval attempts, and unanswered-question trends. A single overall 'accuracy' number hides the failures that matter."],
        bullets: ["Answer supported by an approved source", "Citation supports the exact claim", "Correct source version used", "Restricted source not retrieved", "Unanswered question is acknowledged", "Human escalation includes useful context"],
      },
    ],
    takeaway: "A trustworthy knowledge system combines approved sources, field-level access, contradiction handling, citations, freshness ownership, and a repeatable evaluation set.",
    sources: [
      { label: "NIST Generative AI Profile", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" },
      { label: "OWASP: prompt injection and RAG poisoning guidance", url: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html" },
    ],
  },
  {
    slug: "ai-agents-vs-chatbots-for-business",
    title: "AI agents vs. chatbots: what is the difference for a business?",
    description: "Understand the difference between answering, recommending, and taking action—and the safeguards each level requires.",
    category: "AI agents",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "11 min read",
    image: "/portfolio/simplvoice.jpg",
    imageAlt: "SimplVoice AI call-handling product interface",
    imageCaption: "SimplVoice is an example of the difference between conversation and authority: routing, capture, escalation, and confirmed actions must be explicit.",
    keywords: ["AI agents vs chatbots", "AI agent for business", "business chatbot automation"],
    intro: ["A chatbot primarily exchanges messages. An agent may also retrieve private information, choose tools, and take actions. The practical difference is authority, not personality."],
    sections: [
      {
        heading: "Level one: answer",
        paragraphs: ["A public assistant can explain approved services, summarize public information, and route a visitor. Its knowledge should be limited to public-safe sources, it should disclose that it is AI, and it should say when the approved material does not answer the question. Conversation alone does not make it an agent."],
      },
      {
        heading: "Level two: recommend",
        paragraphs: ["A recommendation system uses context to propose a next step, draft, classification, or schedule. A person reviews the source and proposed result before anything consequential happens. This is often the best first operating model because it creates evidence without granting write authority."],
      },
      {
        heading: "Level three: act",
        paragraphs: ["An action agent can create records, schedule meetings, send approved messages, or update systems. OpenAI's practical definition emphasizes that an agent uses a model to manage workflow execution and tools to gather context or take action within guardrails. Each tool needs narrow authorization, typed and validated inputs, allowlisted actions, rate limits, confirmation rules, and an auditable result.", "Keep the agent's words separate from tool authority. Saying 'I booked it' is not evidence; the calendar provider's confirmed event ID is. On tool failure the agent must report the failure and preserve control rather than invent success."],
      },
      {
        heading: "Choose the least authority that solves the problem",
        paragraphs: ["Do not grant write access simply to make a demo feel impressive. Start with answers or recommendations, measure accuracy, and add one action at a time only when the business can control exceptions and recovery. If deterministic rules solve the workflow, an agent may add cost and unpredictability without adding value."],
      },
      {
        heading: "Use an authority ladder for every tool",
        paragraphs: ["Document each tool on an authority ladder: read public data; read private data; draft; create reversible records; communicate externally; change money, access, legal status, or production. Require stronger authentication, confirmation, logging, and review as authority rises.", "Tool descriptions should state purpose, permitted inputs, prohibited actions, expected output, timeout behavior, and escalation. Capture edge cases in instructions and tests rather than relying on the model to infer policy."],
        bullets: ["What identity is acting?", "Which organization's records are in scope?", "What is the narrowest required permission?", "Can the result be reversed?", "What evidence proves success?", "Which failure returns control to a person?", "How is the tool disabled immediately?"],
      },
    ],
    takeaway: "Classify the system by authority, not personality. Add tools one at a time, require provider evidence, and increase controls as actions become harder to reverse.",
    sources: [
      { label: "OpenAI: A practical guide to building agents", url: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/" },
      { label: "OWASP: AI Agent Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html" },
      { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    ],
  },
  {
    slug: "how-long-ai-automation-implementation-takes",
    title: "How long does an AI automation project take?",
    description: "A realistic implementation timeline from consultation and process mapping through testing, launch, documentation, and iteration.",
    category: "Project planning",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "10 min read",
    image: "/portfolio/simplsolutions.jpg",
    imageAlt: "SimplSolutions product portfolio showing connected AI automation systems",
    imageCaption: "A production system is a connected portfolio of decisions, interfaces, safeguards, and operating responsibilities—not a single demo.",
    keywords: ["AI automation timeline", "how long AI implementation takes", "automation project plan"],
    intro: ["A first useful workflow can sometimes be demonstrated quickly, but production readiness depends on access, data quality, risk, integration behavior, and how fast the business can test decisions."],
    sections: [
      {
        heading: "Phase 1: consultation and definition",
        paragraphs: ["Define the problem, owner, current process, systems, sensitive information, outcome, constraints, excluded actions, and the test that will show whether the idea works. A clear narrow scope shortens every later phase. Access approval and representative data are often the actual schedule drivers."],
      },
      {
        heading: "Phase 2: first working iteration",
        paragraphs: ["Build the smallest end-to-end path using representative data and safe test accounts. The purpose is to expose assumptions early, not to present a polished final system. Keep irreversible actions disabled or redirected to a sandbox."],
      },
      {
        heading: "Phase 3: business testing",
        paragraphs: ["Users test normal cases and exceptions. Corrections often reveal missing business rules rather than coding defects. The schedule depends heavily on how quickly a named tester can provide specific evidence: source, expected result, actual result, and priority."],
      },
      {
        heading: "Phase 4: controlled release",
        paragraphs: ["Complete permissions, logging, backups, documentation, rollback, alerts, and ownership. Release to a limited audience, monitor results, and expand only when the workflow behaves as expected. Production readiness is a set of verified controls, not a date on a proposal."],
      },
      {
        heading: "Estimate using gates, not optimistic days",
        paragraphs: ["A useful plan has exit criteria. Definition ends when owner, boundaries, data, and success measures are approved. Build ends when the smallest path runs with representative data. Testing ends when agreed cases pass and known risks have owners. Release ends when access, monitoring, recovery, and handoff are verified.", "Use ranges tied to dependencies: a narrow internal workflow with ready access may reach a useful test in days; cross-system or customer-facing work may take weeks; regulated or high-consequence systems may take longer because review and evidence are part of the product. Treat any estimate without access, testing, and decision-owner assumptions as incomplete."],
        bullets: ["Who approves access, and by what date?", "Who supplies representative data?", "Who returns test results?", "What must pass before production?", "Which provider or legal review is outside the builder's control?", "Who owns operations after release?"],
      },
    ],
    takeaway: "Plan around evidence gates and named dependencies. The speed of a demo says little about the time needed for permissions, exceptions, security, review, and a controlled release.",
    sources: [
      { label: "NIST AI RMF Core", url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/" },
      { label: "NIST Secure Software Development Framework", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
      { label: "OpenAI business leader’s guide to agent performance and iteration", url: "https://cdn.openai.com/business-guides-and-resources/a-business-leaders-guide-to-working-with-agents.pdf" },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

function topicTokens(post: BlogPost) {
  const ignored = new Set(["with", "from", "that", "this", "your", "what", "when", "where", "which", "into", "about", "business", "automation"]);
  return new Set(`${post.title} ${post.category} ${post.keywords.join(" ")}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !ignored.has(token)));
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const currentTokens = topicTokens(post);
  return blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate, index) => {
      const sharedTokens = [...topicTokens(candidate)].filter((token) => currentTokens.has(token)).length;
      const categoryMatch = candidate.category === post.category ? 4 : 0;
      return { candidate, score: sharedTokens + categoryMatch, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
