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
  keywords: string[];
  intro: string[];
  sections: BlogSection[];
  takeaway: string;
  sources?: { label: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-automate-repetitive-business-tasks-with-ai",
    title: "How to automate repetitive business tasks with AI",
    description: "A practical method for choosing, designing, testing, and improving an AI-enabled business workflow without automating the wrong work.",
    category: "AI automation strategy",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "8 min read",
    image: "/automation-workflow-social.png",
    keywords: ["automate repetitive business tasks", "AI workflow automation", "business process automation"],
    intro: [
      "The best first AI automation is rarely the flashiest idea. It is usually a recurring task with clear inputs, an understandable decision path, and an output a person can review.",
      "A useful automation removes friction while preserving judgment. The goal is not to eliminate people from a process. The goal is to stop asking people to perform the same mechanical steps every day.",
    ],
    sections: [
      {
        heading: "Start with evidence, not a tool",
        paragraphs: ["Write down what happens today from trigger to completion. Include where information arrives, who touches it, what gets copied, which decisions require judgment, and where mistakes occur. This becomes the baseline for deciding whether automation is worthwhile."],
        bullets: ["How often does the task happen?", "How long does one cycle take?", "Which inputs are predictable?", "Where is human approval necessary?", "What would a successful output look like?"],
      },
      {
        heading: "Choose a narrow first version",
        paragraphs: ["Do not begin by automating an entire department. Choose one trigger and one useful outcome. An example might be turning a completed intake form into a structured summary, a draft follow-up, and a task for human review."],
      },
      {
        heading: "Build review into the workflow",
        paragraphs: ["AI output can be incomplete or wrong. Consequential messages, approvals, financial actions, account changes, and customer-facing claims should include an appropriate review step. Keep source material, output, reviewer, and final action visible."],
      },
      {
        heading: "Measure the process after launch",
        paragraphs: ["Track cycle time, correction rate, adoption, exceptions, and the number of manual touches. If the automation saves time but creates more cleanup, it is not finished. Treat the first release as a tested iteration, not a permanent final state."],
      },
    ],
    takeaway: "Bring one recurring task with a clear owner and outcome. Map it, automate the mechanical steps, preserve human approval, and improve it from real use.",
    sources: [{ label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" }],
  },
  {
    slug: "ai-automation-cost-for-small-business",
    title: "How much does AI automation cost for a small business?",
    description: "Understand the real cost of AI automation: discovery, implementation, software, usage, maintenance, and the internal time needed to make it work.",
    category: "Budgeting",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "7 min read",
    image: "/portfolio/simplengine-product.jpg",
    keywords: ["AI automation cost", "small business automation pricing", "AI consultant cost"],
    intro: [
      "AI automation does not have one universal price. A workflow that summarizes a form is different from a customer-facing system connected to billing, identity, private data, and multiple business applications.",
      "The most reliable estimate starts with the process, not the model or software brand.",
    ],
    sections: [
      {
        heading: "The five cost categories",
        paragraphs: ["A complete budget includes more than build time."],
        bullets: ["Discovery and process mapping", "Implementation and integration", "Provider charges for hosting, APIs, storage, email, or messaging", "Testing, documentation, and training", "Monitoring, maintenance, and future changes"],
      },
      {
        heading: "Complexity changes the estimate",
        paragraphs: ["Costs rise when a process has inconsistent inputs, several systems of record, complex permissions, regulated information, high transaction volume, or actions that are difficult to reverse. A narrow internal workflow is usually less expensive than a public autonomous agent."],
      },
      {
        heading: "Keep infrastructure in your name",
        paragraphs: ["Whenever practical, the business should own its domain, hosting, database, API accounts, and billing relationships. This keeps control of data and assets with the client and makes provider costs visible. Management convenience can be offered separately, but ownership should never be ambiguous."],
      },
      {
        heading: "Compare cost to the current process",
        paragraphs: ["Estimate monthly hours, delay, rework, missed follow-up, and error exposure in the existing process. A workflow is financially sensible when the expected operational value comfortably exceeds its build and ongoing cost, with room for maintenance and exceptions."],
      },
    ],
    takeaway: "Ask for a scoped workflow estimate that separates service fees from third-party expenses and explains who owns every account and asset.",
  },
  {
    slug: "ai-automation-consultant-vs-software",
    title: "AI automation consultant vs. software subscription: which do you need?",
    description: "A decision guide for choosing packaged automation software, an implementation consultant, an internal hire, or a blended approach.",
    category: "Buying guide",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "7 min read",
    image: "/jason-sirotin-headshot.png",
    keywords: ["AI automation consultant", "automation software vs consultant", "hire AI consultant"],
    intro: [
      "A software subscription gives you a product. A consultant helps translate the way your business operates into a working system. Many businesses need both, but they should not pay for custom work when a standard feature already solves the problem.",
    ],
    sections: [
      {
        heading: "Choose software when the process is standard",
        paragraphs: ["Packaged software is usually the better answer for established jobs such as accounting, scheduling, basic email marketing, or customer support ticketing. If the business can adapt to the product's workflow, configuration may be enough."],
      },
      {
        heading: "Choose consulting when the process crosses systems",
        paragraphs: ["A consultant becomes useful when the real process lives across inboxes, spreadsheets, documents, databases, and informal decisions. The work is not merely connecting applications; it is deciding which information is authoritative and how exceptions should be handled."],
      },
      {
        heading: "Choose an internal hire when demand is continuous",
        paragraphs: ["If several departments have a permanent queue of automation work, an internal owner may be the right long-term choice. That person still needs business stakeholders, security support, and clear governance."],
      },
      {
        heading: "Use a short consultation to decide",
        paragraphs: ["A focused consultation should identify one process, the systems involved, the likely risk, and whether the next step is configuration, custom implementation, or no project at all. A good recommendation can be to use an existing product."],
      },
    ],
    takeaway: "Buy software for standard work, use consulting for business-specific integration and judgment, and hire internally when the workload is truly continuous.",
  },
  {
    slug: "best-business-processes-to-automate-with-ai",
    title: "The best business processes to automate with AI first",
    description: "Rank automation opportunities using frequency, predictability, value, reversibility, and the amount of human judgment required.",
    category: "Process design",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "8 min read",
    image: "/portfolio/simplcity.jpg",
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
        paragraphs: ["Score each idea from one to five for frequency, manual effort, input consistency, output reviewability, reversibility, and business value. Reduce the score when data access or consequences are high. The highest responsible score becomes the first candidate."],
      },
      {
        heading: "Do not automate a broken policy",
        paragraphs: ["If the team cannot agree on what should happen, automation will reproduce the disagreement faster. Resolve ownership, rules, and exceptions before building."],
      },
    ],
    takeaway: "Prioritize a frequent, reviewable, reversible process with one owner. Avoid starting with your most consequential decision simply because it is painful.",
    sources: [{ label: "NIST AI RMF Core", url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/" }],
  },
  {
    slug: "connect-gmail-crm-spreadsheets-with-ai",
    title: "How to connect Gmail, a CRM, and spreadsheets with AI",
    description: "A safe architecture for turning incoming messages into structured records, drafts, tasks, and human-approved CRM updates.",
    category: "Workflow architecture",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "9 min read",
    image: "/portfolio/simplbridge.jpg",
    keywords: ["connect Gmail CRM AI", "email automation workflow", "spreadsheet CRM automation"],
    intro: ["Email, a CRM, and spreadsheets often contain overlapping versions of the same customer story. AI can help structure and summarize that information, but the workflow needs one declared system of record."],
    sections: [
      {
        heading: "Declare the source of truth",
        paragraphs: ["Choose which system owns contact identity, opportunity status, consent, and completed actions. A spreadsheet can support analysis, but it should not silently override the CRM unless that is the explicit design."],
      },
      {
        heading: "Separate extraction from action",
        paragraphs: ["First extract fields and confidence from the message. Then validate required values. Only after validation should the workflow draft a response, create a task, or propose a CRM update. This separation makes errors easier to see and recover."],
      },
      {
        heading: "Use least-privilege access",
        paragraphs: ["Give each integration only the permissions it needs. A process that reads a labeled inbox and drafts messages should not automatically receive permission to delete mail, change account settings, or export unrelated conversations."],
      },
      {
        heading: "Log the business event",
        paragraphs: ["Keep a request ID, source message reference, proposed change, reviewer, final result, and timestamp. Avoid copying complete sensitive messages into general application logs."],
      },
    ],
    takeaway: "Choose one system of record, separate AI extraction from consequential actions, use narrow permissions, and preserve an auditable approval trail.",
  },
  {
    slug: "ai-automation-mistakes-small-business",
    title: "10 AI automation mistakes small businesses can avoid",
    description: "Common failures that create fragile, expensive, or unsafe automations—and the practical controls that prevent them.",
    category: "Implementation",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "8 min read",
    image: "/portfolio/simplengine.jpg",
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
        paragraphs: ["Define what happens when a provider is unavailable, an input is missing, a duplicate request arrives, or confidence is low. A safe workflow pauses or routes the exception instead of inventing a successful result."],
      },
      {
        heading: "Make success observable",
        paragraphs: ["Use structured status, request IDs, alerts, and a small set of business metrics. Observability should explain whether the workflow completed, not expose the sensitive content it processed."],
      },
    ],
    takeaway: "A reliable automation has a defined owner, constrained access, test data, human review, exception handling, monitoring, and a recovery plan.",
    sources: [{ label: "CISA secure AI development guidance", url: "https://www.cisa.gov/news-events/alerts/2023/11/26/cisa-and-uk-ncsc-unveil-joint-guidelines-secure-ai-system-development" }],
  },
  {
    slug: "secure-ai-automation-customer-data",
    title: "How to secure AI automation that uses customer data",
    description: "Practical controls for identity, permissions, data minimization, logging, vendor access, human review, and incident response.",
    category: "Security",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "10 min read",
    image: "/portfolio/simplwiki-2.jpg",
    keywords: ["secure AI automation", "AI customer data security", "AI workflow privacy"],
    intro: ["Security starts before a model receives data. The workflow needs to know who is asking, which records they may access, why the data is needed, and what actions are allowed afterward."],
    sections: [
      {
        heading: "Minimize the data path",
        paragraphs: ["Send only the fields required for the task. Avoid using production secrets, entire mailboxes, or complete customer histories when a narrower approved context will work."],
      },
      {
        heading: "Enforce identity at the data layer",
        paragraphs: ["Application checks are helpful, but database and storage policies should independently restrict records by authenticated user, organization, and role. Server-only tables should not inherit public access by default."],
      },
      {
        heading: "Protect every external action",
        paragraphs: ["Verify signed webhooks, bound payload size, rate-limit public routes, use idempotency for retries, and require confirmation for irreversible actions. Keep credentials in provider secret stores rather than source code."],
      },
      {
        heading: "Prepare for incidents",
        paragraphs: ["Document how to disable the workflow, rotate credentials, revoke sessions, preserve necessary evidence, identify affected records, notify stakeholders, and deploy a verified fix."],
      },
    ],
    takeaway: "Secure the whole workflow: identity, data access, integrations, actions, logs, and recovery—not only the model request.",
    sources: [
      { label: "NIST Generative AI Profile", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" },
      { label: "CISA secure AI system development guidance", url: "https://www.cisa.gov/news-events/alerts/2023/11/26/cisa-and-uk-ncsc-unveil-joint-guidelines-secure-ai-system-development" },
    ],
  },
  {
    slug: "build-ai-knowledge-base-for-business",
    title: "How to build an AI knowledge base for your business",
    description: "Turn scattered documents into a governed knowledge system with sources, ownership, freshness rules, access controls, and useful retrieval.",
    category: "Knowledge systems",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "9 min read",
    image: "/portfolio/simplwiki-product.jpg",
    keywords: ["AI knowledge base", "business knowledge management AI", "RAG knowledge base"],
    intro: ["An AI knowledge base is not a folder uploaded to a chatbot. It is a maintained collection of approved sources with clear ownership, access rules, and a way to show where an answer came from."],
    sections: [
      {
        heading: "Inventory sources before ingestion",
        paragraphs: ["List policies, service descriptions, procedures, product facts, templates, contracts, training materials, and frequently answered questions. Mark the owner, audience, sensitivity, and last review date for each source."],
      },
      {
        heading: "Resolve contradictions",
        paragraphs: ["Older documents often disagree with current pricing or policy. Do not ask retrieval software to decide which source is correct. Establish a source-of-truth hierarchy and archive superseded material."],
      },
      {
        heading: "Design answers around evidence",
        paragraphs: ["A useful system can cite the approved source, distinguish fact from inference, acknowledge missing context, and route sensitive or uncertain questions to a person."],
      },
      {
        heading: "Make freshness operational",
        paragraphs: ["Assign review dates and owners. Monitor questions that return no answer or conflicting evidence. Update the source rather than repeatedly patching a prompt around incorrect knowledge."],
      },
    ],
    takeaway: "Quality comes from governed sources and ownership. Retrieval technology cannot repair contradictory, stale, or unapproved business information by itself.",
  },
  {
    slug: "ai-agents-vs-chatbots-for-business",
    title: "AI agents vs. chatbots: what is the difference for a business?",
    description: "Understand the difference between answering, recommending, and taking action—and the safeguards each level requires.",
    category: "AI agents",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "7 min read",
    image: "/portfolio/simplvoice.jpg",
    keywords: ["AI agents vs chatbots", "AI agent for business", "business chatbot automation"],
    intro: ["A chatbot primarily exchanges messages. An agent may also retrieve private information, choose tools, and take actions. The practical difference is authority, not personality."],
    sections: [
      {
        heading: "Level one: answer",
        paragraphs: ["A public assistant can explain approved services, summarize public information, and route a visitor. Its knowledge should be limited to public-safe sources and it should disclose that it is AI."],
      },
      {
        heading: "Level two: recommend",
        paragraphs: ["A recommendation system uses context to propose a next step, draft, classification, or schedule. A person can review the proposal before anything consequential happens."],
      },
      {
        heading: "Level three: act",
        paragraphs: ["An action agent can create records, schedule meetings, send approved messages, or update systems. Each tool needs narrow authorization, validated inputs, rate limits, confirmation rules, and an auditable result."],
      },
      {
        heading: "Choose the least authority that solves the problem",
        paragraphs: ["Do not grant write access simply to make a demo feel impressive. Start with answers or recommendations, measure accuracy, and add actions only when the business can control exceptions and recovery."],
      },
    ],
    takeaway: "The more an AI system can do, the more deliberately its identity, permissions, confirmations, logging, and failure behavior must be designed.",
  },
  {
    slug: "how-long-ai-automation-implementation-takes",
    title: "How long does an AI automation project take?",
    description: "A realistic implementation timeline from consultation and process mapping through testing, launch, documentation, and iteration.",
    category: "Project planning",
    published: "2026-08-03",
    updated: "2026-08-03",
    readTime: "7 min read",
    image: "/portfolio/simplsolutions.jpg",
    keywords: ["AI automation timeline", "how long AI implementation takes", "automation project plan"],
    intro: ["A first useful workflow can sometimes be demonstrated quickly, but production readiness depends on access, data quality, risk, integration behavior, and how fast the business can test decisions."],
    sections: [
      {
        heading: "Phase 1: consultation and definition",
        paragraphs: ["Define the problem, owner, current process, systems, sensitive information, outcome, constraints, and the test that will show whether the idea works. A clear narrow scope shortens every later phase."],
      },
      {
        heading: "Phase 2: first working iteration",
        paragraphs: ["Build the smallest end-to-end path using representative data and safe test accounts. The purpose is to expose assumptions early, not to present a polished final system."],
      },
      {
        heading: "Phase 3: business testing",
        paragraphs: ["Users test normal cases and exceptions. Corrections often reveal missing business rules rather than coding defects. The project timeline depends heavily on the speed and quality of this feedback."],
      },
      {
        heading: "Phase 4: controlled release",
        paragraphs: ["Complete permissions, logging, backups, documentation, rollback, alerts, and ownership. Release to a limited audience, monitor results, and expand only when the workflow behaves as expected."],
      },
    ],
    takeaway: "Estimate by risk and integration complexity, not by the speed of the first demo. A small tested workflow is more valuable than a broad unfinished system.",
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
