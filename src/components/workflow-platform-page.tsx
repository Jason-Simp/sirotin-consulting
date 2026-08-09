import Link from "next/link";
import { ArrowRight, Check, ExternalLink, GitBranch, KeyRound, ShieldCheck, Wrench } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import type { WorkflowService } from "@/lib/workflow-services";
import { workflowServiceSchema } from "@/lib/workflow-schema";

const icons = [GitBranch, Wrench, ShieldCheck, KeyRound];

export function WorkflowPlatformPage({ service }: { service: WorkflowService }) {
  return (
    <main className="subpage workflow-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workflowServiceSchema(service)) }} />
      <SubpageHeader />
      <article>
        <header className="workflow-hero">
          <div><p className="section-label">/ {service.platform} automation consulting</p><h1>{service.hero} <em>{service.heroAccent}</em></h1><p className="workflow-deck">{service.lede}</p><div className="button-row"><Link className="button button-primary" href="/book">Map one workflow <ArrowRight size={17} /></Link><Link className="button button-secondary" href="/workflow-automation">Compare approaches</Link></div></div>
          <aside className="workflow-signal" aria-label={`${service.platform} workflow operating model`}><span>{service.platform}</span><div>{["Trigger", "Rules", "Review", "Evidence"].map((item, i) => <div key={item}><b>{String(i + 1).padStart(2, "0")}</b><strong>{item}</strong>{i < 3 && <i>→</i>}</div>)}</div><p>Built in client-owned accounts. Tested before consequential actions go live.</p></aside>
        </header>

        <section className="workflow-thesis"><p className="section-label">/ The right fit</p><div><h2>Use {service.platform} when it fits the work—not because it is fashionable.</h2><p>{service.proof}</p></div></section>

        <section className="workflow-card-section"><div className="workflow-heading"><p className="section-label">/ Problems this can solve</p><h2>Start with the operating problem.</h2></div><div className="workflow-fit-grid">{service.fit.map((item, i) => <article key={item.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

        <section className="workflow-services"><div className="workflow-heading"><p className="section-label">/ What I can do</p><h2>Build, repair, govern, and hand it over.</h2></div><div>{service.services.map((item, i) => { const Icon = icons[i % icons.length]; return <article key={item.title}><Icon size={21} aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.body}</p></div></article>; })}</div></section>

        <section className="workflow-examples"><div className="workflow-heading"><p className="section-label">/ Example workflows</p><h2>Concrete paths, with a useful result.</h2></div><div>{service.examples.map((item) => <article key={item.title}><h3>{item.title}</h3><code>{item.flow}</code><p>{item.result}</p></article>)}</div></section>

        <section className="workflow-method"><div className="workflow-heading"><p className="section-label">/ The working method</p><h2>No black box. No mystery handoff.</h2></div><ol>{service.steps.map((step, i) => <li key={step.title}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol></section>

        <section className="workflow-ownership"><div><p className="section-label">/ Your accounts, your assets</p><h2>The system should remain operable without me.</h2><p>I prefer to configure providers with you, in accounts you own and pay directly. That keeps billing, credentials, data, administrators, and the exit path under your control.</p></div><ul>{service.ownership.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>

        <section className="workflow-faq"><div className="workflow-heading"><p className="section-label">/ Plain answers</p><h2>{service.platform} consulting FAQ</h2></div><div>{service.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

        <section className="workflow-sources"><div><p className="section-label">/ Primary references</p><h2>Platform claims should be verifiable.</h2><p>These official sources support the capabilities and operating considerations described on this page.</p></div><div>{service.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={15} /></a>)}</div></section>

        <p className="workflow-disclaimer">AutomateMeJay is an independent consulting service and is not affiliated with or endorsed by {service.platform}. Platform names and trademarks belong to their respective owners.</p>
        <section className="workflow-cta"><div><p className="section-label">/ Bring one workflow</p><h2>Let’s find the smallest useful path and make it reliable.</h2></div><Link className="button button-primary" href="/book">Book a free consultation <ArrowRight size={17} /></Link></section>
      </article>
    </main>
  );
}
