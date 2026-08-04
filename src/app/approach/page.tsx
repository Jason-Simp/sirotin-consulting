import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, FileCheck2, KeyRound, Route, ShieldCheck, TestTube2 } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "How Jason Builds AI Automation That Survives Real Use",
  description: "Jason Sirotin’s first-hand method for mapping authority, building a controlled first path, testing exceptions, and handing business-owned AI automation into production.",
  path: "/approach",
});

const artifacts = [
  {
    title: "A workflow map",
    description: "The trigger, systems, handoffs, decisions, exceptions, evidence, and current owner—written before a model or tool is selected.",
    Icon: Route,
  },
  {
    title: "An authority map",
    description: "What the system may read, draft, create, send, change, or never do; whose identity it uses; and which actions require confirmation.",
    Icon: KeyRound,
  },
  {
    title: "A safe first path",
    description: "One narrow end-to-end iteration using representative data, test accounts, bounded tools, and reversible actions.",
    Icon: ShieldCheck,
  },
  {
    title: "An evaluation packet",
    description: "Normal cases, messy cases, forbidden actions, expected refusals, success evidence, and a named person who decides whether each result passes.",
    Icon: TestTube2,
  },
  {
    title: "A release and ownership record",
    description: "Approved access, monitoring, rollback, documentation, provider ownership, credential rotation, and a clear operator after launch.",
    Icon: FileCheck2,
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${SITE_URL}/approach#article`,
      headline: "How Jason Builds AI Automation That Survives Real Use",
      description: "A first-hand field method for controlled, testable, business-owned AI automation.",
      url: `${SITE_URL}/approach`,
      datePublished: "2026-08-04",
      dateModified: "2026-08-04",
      author: { "@id": `${SITE_URL}/#jason` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: `${SITE_URL}/approach`,
      image: `${SITE_URL}/portfolio/simplengine-product.jpg`,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      citation: [
        "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
        "https://www.nist.gov/itl/ai-risk-management-framework",
        "https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/approach#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "AutomateMeJay", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "How Jason builds AI automation", item: `${SITE_URL}/approach` },
      ],
    },
  ],
};

export default function ApproachPage() {
  return (
    <main className="subpage approach-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <SubpageHeader />

      <article>
        <header className="approach-hero">
          <div>
            <p className="section-label">/ Jason’s working method</p>
            <h1>I build AI automation to survive <em>real use.</em></h1>
            <p className="approach-deck">I do not start with an agent, a prompt, or a software brand. I start with the work: who owns it, what can go wrong, what evidence proves success, and where a person must remain in control.</p>
            <div className="button-row"><Link className="button button-primary" href="/book">Bring me one workflow <ArrowRight size={17} /></Link><Link className="button button-secondary" href="/portfolio">See shipped systems</Link></div>
          </div>
          <aside className="approach-author-card">
            <div className="approach-author-photo"><Image src="/jason-sirotin-headshot.png" alt="Jason Sirotin" fill priority sizes="(max-width: 760px) 82vw, 380px" /></div>
            <div><strong>Jason Sirotin</strong><span>AI Automation Partner</span></div>
            <p>Directing the business problem, risk, taste, review, and release while agents handle much of the production execution.</p>
          </aside>
        </header>

        <section className="approach-position">
          <div><p className="section-label">/ The point of view</p><h2>A fast demo is not the same thing as a working system.</h2></div>
          <div><p>I have watched promising automations fail because nobody defined the system of record, a retry created duplicates, a model was allowed to invent tool inputs, or a business granted more access than the job required. The hard part is not making AI produce an answer. The hard part is making the entire workflow safe, observable, recoverable, and useful to the people who operate it.</p><p>That is why I build in short loops: map, build, test, observe, and improve. The client owns its accounts and data. Important actions stay visible. Claims are tied to provider evidence. Exceptions return control to a named person.</p></div>
        </section>

        <section className="approach-artifacts" aria-labelledby="artifacts-title">
          <div className="approach-section-heading"><p className="section-label">/ Five required artifacts</p><h2 id="artifacts-title">What I want to see before I call an automation ready.</h2></div>
          <div className="approach-artifact-grid">
            {artifacts.map(({ title, description, Icon }, index) => <article key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon size={22} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className="approach-proof" aria-labelledby="inside-build-title">
          <div className="approach-section-heading"><p className="section-label">/ Inside the build</p><h2 id="inside-build-title">The interface is only the visible layer.</h2><p>The screenshots are from working systems in the SimplSolutions portfolio. The important work sits underneath them: source ownership, permissions, typed data, tool limits, review states, error handling, and release evidence.</p></div>
          <div className="approach-proof-grid">
            <figure><div><Image src="/portfolio/simplengine-product.jpg" alt="SimplEngine command surface for directing and reviewing agent-assisted work" fill sizes="(max-width: 850px) 100vw, 52vw" /></div><figcaption><strong>SimplEngine</strong><span>A command surface for making agent execution visible, reviewable, and controlled.</span></figcaption></figure>
            <figure><div><Image src="/portfolio/simplbridge.jpg" alt="SimplBridge interface for controlled connections between business systems" fill sizes="(max-width: 850px) 100vw, 40vw" /></div><figcaption><strong>SimplBridge</strong><span>A connection layer that moves approved context through bounded, observable handoffs.</span></figcaption></figure>
          </div>
        </section>

        <section className="approach-control">
          <div><p className="section-label">/ Where the line sits</p><h2>Agents produce. People remain accountable.</h2><p>On selected portfolio projects, agents have performed roughly 95% of production execution across research, structure, content, code, and QA. The share varies by project. It does not mean 95% of judgment is automated.</p></div>
          <ul>
            <li><Check size={17} /><span><strong>Agents are good at</strong> parallel research, structured drafts, repetitive implementation, consistency checks, and test execution.</span></li>
            <li><Check size={17} /><span><strong>People must own</strong> goals, permissions, policy, consequential claims, taste, risk acceptance, and final release.</span></li>
            <li><Check size={17} /><span><strong>Providers must prove</strong> that a message was sent, a meeting was booked, a payment succeeded, or a record actually changed.</span></li>
          </ul>
        </section>

        <section className="approach-release" aria-labelledby="release-title">
          <div><p className="section-label">/ Release gate</p><h2 id="release-title">I would rather delay a launch than hide an unknown.</h2></div>
          <div className="approach-release-grid">
            {["The named owner approves the workflow and boundaries", "Access is least-privilege and belongs to the correct client account", "Normal, messy, duplicate, and forbidden cases have been tested", "Irreversible actions require the right confirmation", "Logs identify the event without leaking unnecessary sensitive data", "A person can pause, recover, export, and take over", "Provider charges and asset ownership are explicit", "Known limitations are documented before production"].map((item) => <span key={item}><Check size={16} />{item}</span>)}
          </div>
        </section>

        <section className="approach-sources">
          <div><p className="section-label">/ Standards I use</p><h2>Experience is stronger when the references are visible.</h2></div>
          <div>
            <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noreferrer"><span>NIST AI Risk Management Framework</span><ExternalLink size={16} /></a>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html" target="_blank" rel="noreferrer"><span>OWASP AI Agent Security Cheat Sheet</span><ExternalLink size={16} /></a>
            <a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" target="_blank" rel="noreferrer"><span>Google Search guidance for generative AI features</span><ExternalLink size={16} /></a>
          </div>
        </section>

        <section className="approach-cta"><div><p className="section-label">/ Start with the work</p><h2>Bring one recurring process. We will make the boundaries clear first.</h2></div><Link className="button button-primary" href="/book">Book a free consultation <ArrowRight size={17} /></Link></section>
      </article>
    </main>
  );
}
