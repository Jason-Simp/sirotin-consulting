export type SowPlan = "first-week" | "weekly" | "monthly";

export type SowSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type SowDocument = {
  version: string;
  title: string;
  plan: SowPlan;
  effectiveDate: string;
  termsVersion: string;
  fee: string;
  cadence: string;
  summary: string;
  sections: SowSection[];
};

const clientResponsibilities: SowSection = {
  heading: "2. What the client provides",
  bullets: [
    "One primary person to set priorities, answer questions, and approve the work.",
    "Timely access, accurate information, test data, and feedback reasonably needed for the active workstream.",
    "Testing and approval before production use, plus appropriate backups, permissions, and human oversight.",
  ],
};

const costsAndOwnership: SowSection = {
  heading: "3. Costs and ownership",
  paragraphs: [
    "Hosting, databases, domains, APIs, software, storage, messaging, and other third-party charges are not included in the consulting fee and require the Client's approval. The preferred approach is for the Client to own and pay each provider account directly. If the Client asks Consultant to purchase, pay for, or administratively manage an approved third-party service, the provider cost plus a 25% convenience charge applies.",
    "After full payment, the Client owns its data and custom final deliverables created specifically for the Client. Consultant retains pre-existing tools, reusable components, templates, methods, prompts, frameworks, and general know-how.",
  ],
};

const agreementTerms: SowSection = {
  heading: "4. Agreement",
  paragraphs: [
    "AI and automation work requires testing and can be affected by the Client's systems, data, decisions, and third-party services. Consultant does not promise a particular business result or error-free operation. The Client remains responsible for lawful use and production decisions.",
    "This SOW supplements the Terms and Consulting Agreement, Privacy Policy, and Data and Security Notice. Typed names and electronic signature records are intended as signatures. If this SOW conflicts with the Terms, this SOW controls only for the plan, scope, fee, service period, and cancellation terms stated here.",
  ],
};

export const sowDocuments: Record<SowPlan, SowDocument> = {
  "first-week": {
    version: "first-week-sow-2026-08-11-v1",
    title: "Risk-Free First Week Statement of Work",
    plan: "first-week",
    effectiveDate: "August 11, 2026",
    termsVersion: "2026-08-11",
    fee: "$350",
    cadence: "one seven-day trial period",
    summary: "A paid, risk-free first week with a full service-fee money-back guarantee and no automatic conversion.",
    sections: [
      {
        heading: "1. What is included",
        paragraphs: [
          "The Client purchases one seven-day trial period for a one-time $350 consulting fee. The period begins when Jason Sirotin, doing business as AutomateMeJay (Consultant), confirms activation after payment and intake review.",
        ],
        bullets: [
          "Approximately one hour of substantive consulting work during the trial period.",
          "One actively prioritized AI automation workstream for one primary directing stakeholder.",
          "A practical first result, such as a recommendation, workflow plan, prototype, configuration, fix, or initial iteration, selected to fit the available capacity.",
          "Reasonable asynchronous communication about the active workstream.",
          "A full refund of the $350 consulting service fee when requested before the seven-day guarantee period ends. Approved third-party costs are not refundable under this guarantee.",
          "No automatic renewal or conversion. Work pauses after the trial unless the Client affirmatively chooses another plan.",
        ],
      },
      clientResponsibilities,
      costsAndOwnership,
      agreementTerms,
    ],
  },
  weekly: {
    version: "weekly-sow-2026-08-11-v2",
    title: "Weekly AI Automation Partner Statement of Work",
    plan: "weekly",
    effectiveDate: "August 11, 2026",
    termsVersion: "2026-08-11",
    fee: "$350",
    cadence: "one seven-day service period",
    summary: "One paid week of focused AI automation partner access with no automatic renewal.",
    sections: [
      {
        heading: "1. What is included",
        paragraphs: [
          "The Client purchases one seven-day service period for a one-time $350 consulting fee. The period begins when Consultant confirms activation after payment and intake review.",
        ],
        bullets: [
          "Approximately one hour of substantive consulting work during the paid period.",
          "One actively prioritized AI automation workstream for one primary directing stakeholder.",
          "Reasonable asynchronous communication about the active workstream.",
          "No automatic renewal. The Client purchases another week only when both parties choose to continue.",
        ],
      },
      clientResponsibilities,
      costsAndOwnership,
      agreementTerms,
    ],
  },
  monthly: {
    version: "monthly-sow-2026-08-11-v3",
    title: "Monthly AI Automation Partner Statement of Work",
    plan: "monthly",
    effectiveDate: "August 11, 2026",
    termsVersion: "2026-08-11",
    fee: "$1,000",
    cadence: "each 30-day billing period",
    summary: "Ongoing AI automation partner access with clear monthly capacity and simple cancellation.",
    sections: [
      {
        heading: "1. What is included",
        paragraphs: [
          "The Client purchases ongoing service for $1,000 per 30-day billing period. The plan renews automatically every 30 days until canceled.",
        ],
        bullets: [
          "Approximately four hours of substantive consulting work during each paid 30-day period, generally delivered through a weekly cadence.",
          "One actively prioritized AI automation workstream for one primary directing stakeholder.",
          "Reasonable asynchronous communication about the active workstream.",
          "Cancellation at any time through the membership billing portal, including during the first week. Cancellation stops the next renewal, and service continues through the current paid 30-day period.",
          "The current $1,000 payment is not prorated or refunded because of cancellation, except where required by law.",
          "Unused capacity does not roll over. Additional workstreams or material additions require a separately approved quote or SOW.",
        ],
      },
      {
        heading: "2. What is not included",
        bullets: [
          "Emergency, on-call, 24/7, or guaranteed immediate support.",
          "Continuous production monitoring, unconditional maintenance, or a promise that third-party systems will remain available.",
          "Routine scheduled meetings unless the parties agree that a meeting is needed for the active workstream.",
          "A second simultaneous workstream or more than one person directing priorities.",
          "Hosting, databases, domains, APIs, software, storage, messaging, or other third-party provider charges.",
          "Work involving regulated or highly sensitive information unless appropriate safeguards and written scope are approved first.",
          "A guaranteed revenue, savings, ranking, business, or error-free technical outcome.",
        ],
      },
      { ...clientResponsibilities, heading: "3. What the client provides" },
      { ...costsAndOwnership, heading: "4. Costs and ownership" },
      { ...agreementTerms, heading: "5. Agreement" },
    ],
  },
};

export function isSowPlan(value: string): value is SowPlan {
  return value === "first-week" || value === "weekly" || value === "monthly";
}

export function getSowPlanName(plan: SowPlan) {
  if (plan === "first-week") return "Risk-Free First Week";
  if (plan === "weekly") return "Weekly Partner";
  return "Monthly Partner";
}
