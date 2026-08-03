export type SowPlan = "weekly" | "monthly";

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

const sharedSections: SowSection[] = [
  {
    heading: "1. Parties and purpose",
    paragraphs: [
      "This Statement of Work (SOW) is between Jason Sirotin, doing business as AutomateMeJay (Consultant), and the client identified in the electronic signature record (Client). It describes the specific service plan selected by Client and supplements the Terms and Consulting Agreement.",
    ],
  },
  {
    heading: "2. Working model and scope",
    paragraphs: [
      "Consultant will provide practical AI automation consulting directed toward one actively prioritized workstream for one primary directing stakeholder. Work may include strategy, research, workflow design, configuration, coding, testing, troubleshooting, documentation, and recommendations.",
      "The stated hours are capacity guidelines, not a promise that every request can be completed within a particular period. Deliverables and timing depend on complexity, access, decisions, testing, and third-party systems.",
    ],
  },
  {
    heading: "3. Client responsibilities",
    bullets: [
      "Provide accurate requirements, timely feedback, and the access or test data reasonably needed for the work.",
      "Review and approve consequential outputs before production use.",
      "Maintain appropriate backups, credentials, permissions, and human oversight.",
      "Do not provide regulated, highly sensitive, or restricted data unless the parties first agree in writing to suitable safeguards.",
    ],
  },
  {
    heading: "4. Third-party services and expenses",
    paragraphs: [
      "Hosting, databases, domains, APIs, software, storage, messaging, and other third-party charges are separate from the consulting fee and require Client approval. The preferred approach is for Client to own and pay each provider account directly.",
      "If Client asks Consultant to purchase, pay for, or administratively manage an approved third-party service on Client’s behalf, the provider cost plus a 25% convenience charge applies. There is no convenience charge when Client owns and pays the provider account directly.",
    ],
  },
  {
    heading: "5. Ownership and reusable know-how",
    paragraphs: [
      "After full payment, Client owns custom final deliverables created specifically for Client, excluding Consultant’s pre-existing tools, templates, methods, generalized know-how, open-source components, and third-party materials. Consultant retains those underlying materials and may reuse generalized skills and non-confidential patterns.",
    ],
  },
  {
    heading: "6. Testing, risk, and no guaranteed outcome",
    paragraphs: [
      "Automation and AI outputs can be incomplete, inaccurate, interrupted, or affected by third-party changes. Client remains responsible for testing, approval, lawful use, and production decisions. Consultant does not guarantee a particular business, revenue, savings, ranking, or technical outcome.",
    ],
  },
  {
    heading: "7. Relationship to the Terms",
    paragraphs: [
      "The Terms and Consulting Agreement, Privacy Policy, and Data and Security Notice are incorporated by reference. If this SOW expressly conflicts with the Terms, this SOW controls only for the plan-specific scope, fee, billing cadence, and cancellation terms described here. All other Terms remain in effect.",
    ],
  },
  {
    heading: "8. Electronic signatures and counterparts",
    paragraphs: [
      "The parties agree to transact electronically. Typed names and electronic signature records are intended as signatures. This SOW may be signed in counterparts, each of which is treated as an original and together form one agreement. Each party may print or save an electronic copy.",
    ],
  },
];

export const sowDocuments: Record<SowPlan, SowDocument> = {
  weekly: {
    version: "weekly-sow-2026-08-03-v1",
    title: "Weekly AI Automation Partner Statement of Work",
    plan: "weekly",
    effectiveDate: "August 3, 2026",
    termsVersion: "2026-08-03",
    fee: "$350",
    cadence: "one paid seven-day service period",
    summary: "Flexible, non-renewing access for one focused week of AI automation consulting.",
    sections: [
      sharedSections[0],
      {
        heading: "2. Weekly plan, term, and fee",
        paragraphs: [
          "Client purchases one seven-day service period for a one-time $350 consulting fee. The period begins when Consultant confirms activation after payment and intake review.",
          "The plan includes approximately one hour of substantive consulting work during the paid period, reasonable asynchronous communication related to the active workstream, one primary directing stakeholder, and one actively prioritized workstream.",
          "This purchase does not renew automatically. Service ends after the paid seven-day period. Client may purchase another week if both parties wish to continue. No additional weekly fee is charged unless Client affirmatively purchases another period.",
        ],
      },
      ...sharedSections.slice(2),
    ],
  },
  monthly: {
    version: "monthly-sow-2026-08-03-v1",
    title: "Monthly AI Automation Partner Statement of Work",
    plan: "monthly",
    effectiveDate: "August 3, 2026",
    termsVersion: "2026-08-03",
    fee: "$1,000",
    cadence: "each 30-day billing period",
    summary: "Ongoing AI automation partner access with a clear monthly capacity and simple cancellation.",
    sections: [
      sharedSections[0],
      {
        heading: "2. Monthly plan, renewal, and fee",
        paragraphs: [
          "Client purchases ongoing service for $1,000 per 30-day billing period. The plan includes approximately four hours of substantive consulting work per paid period, generally delivered through a weekly cadence, reasonable asynchronous communication, one primary directing stakeholder, and one actively prioritized workstream.",
          "The plan renews automatically every 30 days until canceled. Client may cancel anytime through the membership billing portal. Cancellation stops the next renewal; service continues through the end of the current paid period, and no further monthly fee is charged after that period.",
          "Unused capacity does not roll over unless the parties agree otherwise in writing. Material additions or a second simultaneous workstream require a separately approved quote or SOW.",
        ],
      },
      ...sharedSections.slice(2),
    ],
  },
};

export function isSowPlan(value: string): value is SowPlan {
  return value === "weekly" || value === "monthly";
}
