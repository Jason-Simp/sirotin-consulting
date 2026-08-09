import Link from "next/link";
import { ArrowRight, Check, GitBranch, LayoutDashboard, ShieldCheck } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { createPageMetadata, SITE_URL } from "@/lib/seo";
import { workflowServices } from "@/lib/workflow-services";

export const metadata = createPageMetadata({
  title: "Workflow Automation Consulting for n8n, monday.com, and Connected Systems",
  description: "Choose and build practical workflow automation with Jason Sirotin—from technical n8n integrations to team-facing monday.com operating systems.",
  path: "/workflow-automation",
  image: { url: "/workflow-automation/opengraph-image", alt: "Workflow automation consulting by Jason Sirotin" },
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", "@id": `${SITE_URL}/workflow-automation#webpage`, url: `${SITE_URL}/workflow-automation`, name: "Workflow Automation Consulting", description: "Practical workflow automation consulting for n8n, monday.com, and connected business systems.", isPartOf: { "@id": `${SITE_URL}/#website` }, mainEntity: { "@id": `${SITE_URL}/workflow-automation#services` } },
    { "@type": "ItemList", "@id": `${SITE_URL}/workflow-automation#services`, name: "Workflow automation consulting services", itemListElement: workflowServices.map((service, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/workflow-automation/${service.slug}`, name: service.title })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "AutomateMeJay", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Workflow automation", item: `${SITE_URL}/workflow-automation` }] },
  ],
};

export default function WorkflowAutomationPage() {
  return <main className="subpage workflow-page workflow-hub">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <SubpageHeader />
    <article>
      <header className="workflow-hub-hero"><div><p className="section-label">/ Workflow automation consulting</p><h1>The right automation for <em>the way your business works.</em></h1><p className="workflow-deck">I design, build, repair, and govern workflows across the tools your team already uses. The platform matters, but the process, authority, evidence, ownership, and people operating it matter more.</p><div className="button-row"><Link className="button button-primary" href="/book">Bring me one workflow <ArrowRight size={17} /></Link><Link className="button button-secondary" href="/approach">See my method</Link></div></div><aside><GitBranch size={30} /><span>INTAKE</span><i>→</i><span>DECISION</span><i>→</i><span>ACTION</span><i>→</i><span>EVIDENCE</span></aside></header>

      <section className="workflow-choice"><div className="workflow-heading"><p className="section-label">/ Choose by operating need</p><h2>n8n and monday.com solve different parts of the problem.</h2><p>Some engagements use one. Some use both. Neither should be forced to become the system it is not.</p></div><div className="workflow-choice-grid">
        <article><GitBranch size={25} /><span>TECHNICAL ORCHESTRATION</span><h3>n8n</h3><p>Best when workflows cross APIs, databases, webhooks, AI models, custom logic, and backend systems.</p><ul><li><Check size={15} />Complex branching and transformations</li><li><Check size={15} />API and database integrations</li><li><Check size={15} />AI steps with bounded tools</li><li><Check size={15} />Execution evidence and recovery</li></ul><Link href="/workflow-automation/n8n">Explore n8n consulting <ArrowRight size={16} /></Link></article>
        <article><LayoutDashboard size={25} /><span>VISIBLE TEAM OPERATIONS</span><h3>monday.com</h3><p>Best when the team needs shared boards, accountable handoffs, approvals, status visibility, and operating discipline.</p><ul><li><Check size={15} />Board and workspace architecture</li><li><Check size={15} />Intake, ownership, and handoffs</li><li><Check size={15} />Permissions and automation owners</li><li><Check size={15} />Dashboards and adoption</li></ul><Link href="/workflow-automation/monday-com">Explore monday.com consulting <ArrowRight size={16} /></Link></article>
      </div></section>

      <section className="workflow-combined"><div><p className="section-label">/ When they work together</p><h2>The board can show the work while n8n moves it safely.</h2><p>A monday.com item can hold the visible owner, status, approval, and next action. n8n can perform the deeper integration work across APIs, databases, documents, and providers. The handoff is designed so each system stays responsible for what it does best.</p></div><div>{["monday.com captures and assigns the request", "A human approves consequential work", "n8n validates data and coordinates external systems", "Provider evidence updates the visible record", "Errors return to a named owner with context"].map((item, i) => <span key={item}><b>{String(i + 1).padStart(2, "0")}</b>{item}</span>)}</div></section>

      <section className="workflow-principles"><div className="workflow-heading"><p className="section-label">/ Non-negotiables</p><h2>Automation without control is just faster uncertainty.</h2></div><div>{[{icon: ShieldCheck, title: "Human authority", body: "Consequential actions keep the review and confirmation the risk requires."},{icon: GitBranch, title: "Observable evidence", body: "An external provider or source of truth—not the workflow’s own claim—proves completion."},{icon: LayoutDashboard, title: "Client ownership", body: "You own the accounts, data, credentials, billing, documentation, and recovery path."}].map(({icon: Icon,title,body}) => <article key={title}><Icon size={23}/><h3>{title}</h3><p>{body}</p></article>)}</div></section>

      <section className="workflow-cta"><div><p className="section-label">/ Start with the bottleneck</p><h2>We can choose the platform after the workflow is clear.</h2></div><Link className="button button-primary" href="/book">Book a free consultation <ArrowRight size={17} /></Link></section>
    </article>
  </main>;
}
