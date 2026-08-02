import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bot, Check, Eye, Globe2, Sparkles } from "lucide-react";
import { PortfolioGallery } from "./portfolio-gallery";
import { MobileNavigation } from "@/components/mobile-navigation";

const mobileNavigation = [
  { href: "/", label: "Home" },
  { href: "/portfolio#featured-work", label: "Featured work" },
  { href: "/portfolio#all-work", label: "All work" },
  { href: "/#pricing", label: "Plans" },
  { href: "/sign-in", label: "Client sign in" },
];

export const metadata: Metadata = {
  title: "Portfolio — Agent-Built Websites & Systems",
  description: "Explore websites, AI products, internal systems, and go-to-market experiences built through Jason Sirotin’s agent-assisted delivery system.",
  alternates: { canonical: "/portfolio" },
};

const featured = [
  {
    name: "SimplSolutions",
    href: "https://www.simplsolutions.app/",
    image: "/portfolio/simplsolutions.jpg",
    sector: "Business automation",
    summary: "A complete Business Brain platform story spanning positioning, product architecture, conversion paths, and governed AI.",
  },
  {
    name: "ECG Productions",
    href: "https://www.ecgprod.com/",
    image: "/portfolio/ecg-productions.jpg",
    sector: "Film & video production",
    summary: "A cinematic, service-rich website that organizes a deep creative portfolio without losing speed, clarity, or personality.",
  },
  {
    name: "DriveOn Protection",
    href: "https://driveonprotection.com/",
    image: "/portfolio/driveon-protection.jpg",
    sector: "Vehicle protection",
    summary: "A conversion-led customer journey that explains coverage clearly and moves eligible drivers into a guided quote flow.",
  },
  {
    name: "SchoolAmplified",
    href: "https://schoolamplified.ai/",
    image: "/portfolio/school-amplified.jpg",
    sector: "K–12 intelligence",
    summary: "A district-ready platform narrative built around governance, public trust, operational continuity, and pilot adoption.",
  },
  {
    name: "SimplDemocracy",
    href: "https://simpldemocracy.app/",
    image: "/portfolio/simpldemocracy.jpg",
    sector: "Civic intelligence",
    summary: "A public-facing civic information platform designed to make complex issues understandable, source-grounded, and easier to explore.",
  },
  {
    name: "SimplCity — Manchester, NH",
    href: "https://simplsite.app/cities/manchester-new-hampshire#ask",
    image: "/portfolio/simplcity.jpg",
    sector: "Municipal AI experience",
    summary: "A Manchester-focused city guide that gives residents and visitors a conversational way to explore local information and services.",
  },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Jason Sirotin agent-built website portfolio",
  itemListElement: featured.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: item.href,
    name: item.name,
  })),
};

export default function PortfolioPage() {
  return (
    <main className="portfolio-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <header className="portfolio-header">
        <Link className="wordmark" href="/" aria-label="Jason Sirotin home"><span>JS</span><strong>Jason Sirotin</strong></Link>
        <Link className="portfolio-back" href="/"><ArrowLeft size={15} /> Back to the site</Link>
        <MobileNavigation items={mobileNavigation} />
        <Link className="button button-small button-light" href="/start">Get started <ArrowRight size={15} /></Link>
      </header>

      <section className="portfolio-hero section-pad">
        <div className="portfolio-hero-copy">
          <p className="section-label">/ Selected work + working systems</p>
          <h1>Proof that agents can ship <em>real work.</em></h1>
          <p>This is a working portfolio of custom websites, AI products, internal platforms, and go-to-market systems—built through an agent-assisted process and directed by people who remain accountable for what ships.</p>
          <div className="button-row">
            <a className="button button-primary" href="#featured-work">Explore the work <ArrowRight size={17} /></a>
            <Link className="button button-ghost" href="/start">Bring me a project</Link>
          </div>
        </div>
        <div className="agent-proof-card">
          <div className="agent-proof-value" aria-label="95 percent agent-produced execution">95<span>%</span></div>
          <p>agent-produced execution</p>
          <div className="agent-proof-line"><span /><i /></div>
          <ul>
            <li><Bot size={15} /> Research, structure, content, code, and QA</li>
            <li><Eye size={15} /> Human direction, judgment, review, and approval</li>
          </ul>
          <small>Share of production work varies by project. Humans remain responsible for final decisions and release.</small>
        </div>
      </section>

      <section className="featured-work section-pad" id="featured-work">
        <div className="portfolio-section-heading">
          <div><p className="section-label">/ Custom-built websites</p><h2>Six live examples.<br /><em>Six different problems.</em></h2></div>
          <p>These are not templates with a new logo. Each site was shaped around a different audience, business model, conversion path, and operating reality.</p>
        </div>
        <div className="featured-site-links">
          {featured.map((item, index) => (
            <a className="featured-site-link" href={item.href} target="_blank" rel="noreferrer" aria-label={`Visit ${item.name}`} key={item.name}>
              <span>0{index + 1}</span>
              <Globe2 size={21} aria-hidden="true" />
              <div><p>{item.sector}</p><h3>{item.name}</h3><small>{item.summary}</small></div>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="agent-method section-pad">
        <div className="agent-method-intro">
          <p className="section-label">/ What the number means</p>
          <h2>Agents do the production work. People own the outcome.</h2>
          <p>The point is not to remove human judgment. It is to give a small, experienced team enough leverage to research, build, test, and improve at a pace that used to require a much larger production operation.</p>
        </div>
        <div className="agent-method-steps">
          {[
            ["01", "Direct", "A human defines the business problem, the audience, the standard, and the boundaries."],
            ["02", "Produce", "Specialized agents handle research, information architecture, drafts, code, and repetitive implementation."],
            ["03", "Verify", "The system checks behavior, responsive layouts, links, consistency, and production readiness."],
            ["04", "Approve", "A person reviews claims, taste, risk, and final fit before the work goes live."],
          ].map(([number, title, description]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
        <div className="method-principle"><Sparkles size={19} /><p><strong>The advantage:</strong> more finished work, tighter feedback loops, and less production overhead—without pretending that accountability can be automated away.</p></div>
      </section>

      <section className="all-work section-pad" id="all-work">
        <div className="portfolio-section-heading">
          <div><p className="section-label">/ Project index</p><h2>The complete<br /><em>working portfolio.</em></h2></div>
            <p>Open a category to explore public websites, AI product experiences, campaign systems, and private operational tools.</p>
        </div>
        <PortfolioGallery />
      </section>

      <section className="portfolio-cta section-pad">
        <p className="section-label">/ Your workflow could be next</p>
        <h2>Bring the problem.<br /><em>I’ll build the system.</em></h2>
        <p>Start with one paid, guaranteed week and one focused automation opportunity.</p>
        <div className="button-row centered-buttons"><Link className="button button-primary" href="/start">Start with the guarantee <ArrowRight size={18} /></Link><Link className="button button-ghost-light" href="/#pricing">View plans</Link></div>
        <div className="portfolio-cta-notes"><span><Check size={14} /> Full $350 service-fee guarantee</span><span><Check size={14} /> No automatic conversion</span><span><Check size={14} /> Human approval built in</span></div>
      </section>

      <footer>
        <div className="footer-brand"><span>JS</span><div><strong>Jason Sirotin</strong><p>AI Automation Partner</p></div></div>
        <div className="footer-links"><Link href="/">Home</Link><Link href="/portfolio">Portfolio</Link><Link href="/one-off">One-off work</Link><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/security">Data &amp; Security</Link><Link href="/sign-in">Client sign in</Link></div>
        <div className="footer-bottom"><p>Independent AI automation consulting</p><p>© 2026 Jason Sirotin. All rights reserved.</p></div>
      </footer>
    </main>
  );
}
