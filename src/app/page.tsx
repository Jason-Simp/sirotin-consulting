import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MobileNavigation } from "@/components/mobile-navigation";

const mobileNavigation = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Plans" },
  { href: "/#faq", label: "FAQ" },
  { href: "/sign-in", label: "Client sign in" },
];

const problems = [
  "Repetitive research",
  "Manual data entry",
  "Client follow-up",
  "Internal knowledge retrieval",
  "Document processing",
  "Content operations",
  "Approval workflows",
  "Moving information between systems",
  "Troubleshooting existing automations",
];

const capabilities = [
  "Designing new automations",
  "Improving existing automations",
  "Debugging problems",
  "Connecting tools",
  "Evaluating automation opportunities",
  "Creating practical AI workflows",
  "Documenting decisions",
  "Maintaining systems",
];

const steps = [
  ["Choose the problem", "Identify one recurring task, bottleneck, or process that is consuming time or creating inconsistency."],
  ["Build the first iteration", "I design and build the first practical version around the real way your business operates."],
  ["Test it", "You test the work, report what happened, and explain what needs to change."],
  ["Improve it", "I use your feedback to refine the automation and move it closer to the result your business needs."],
  ["Keep moving", "Once the active workstream is stable, we improve it further or move the next idea into the queue."],
];

const plans = [
  {
    name: "Guaranteed first week",
    price: "$350",
    cadence: "one-time payment",
    description: "A practical, paid introduction with the risk taken off your shoulders.",
    features: [
      "Seven-day working period after activation",
      "Approximately one hour of focused work",
      "One automation opportunity",
      "Private workspace access",
      "One initial recommendation, prototype, iteration, or improvement",
      "Full $350 service-fee money-back guarantee",
      "No automatic paid conversion",
    ],
    href: "/start",
    action: "Start with the guarantee",
    featured: true,
  },
  {
    name: "Monthly partner",
    price: "$1,000",
    cadence: "per month",
    description: "The best value for an ongoing working relationship.",
    features: [
      "Ongoing partner access",
      "Approximately four hours of substantive work monthly",
      "Work generally delivered through a weekly cadence",
      "Reasonable asynchronous communication",
      "One primary directing stakeholder",
      "One actively prioritized workstream",
      "Thirty days’ cancellation notice",
    ],
    href: "/checkout/monthly",
    action: "Choose monthly",
    featured: false,
  },
];

const faqs = [
  ["How does the first-week guarantee work?", "You pay $350 for the seven-day introductory engagement. If it is not the right fit, request your full $350 service-fee refund before the guarantee period ends. Approved third-party expenses are separate and are not part of the refund."],
  ["Does the first week automatically become a subscription?", "No. At the end of the guarantee period, you choose whether to continue on the $1,000 monthly plan or request your money back."],
  ["When does the seven-day period start?", "It begins when Jason confirms that your engagement is activated—not simply when you submit the intake form."],
  ["Can I purchase the monthly plan immediately?", "Yes. You may select the monthly plan directly if you are ready for an ongoing relationship."],
  ["What does “approximately one hour” mean?", "The service is priced around approximately one hour of substantive work per week. Research, planning, building, debugging, documentation, and substantive consulting use the available working capacity."],
  ["Is chat included?", "Reasonable asynchronous communication related to the active workstream is included."],
  ["Does real-time chat mean an immediate response?", "No. Messages appear immediately in the workspace, but Jason responds asynchronously based on workload, complexity, priority, and availability."],
  ["Can multiple employees use the workspace?", "Other employees may test or provide information, but one primary person must direct priorities and approve work."],
  ["Can we work on multiple automations?", "Multiple ideas may be added to the queue. One automation workstream is actively prioritized under each standard subscription."],
  ["Can I book an introduction meeting?", "Yes. The site assistant can check Jason’s connected calendars and schedule a 30-minute introduction when calendar booking is available. The guaranteed first week is still a paid service."],
  ["Who pays for software, hosting, and AI usage?", "You approve and pay third-party providers directly whenever practical. We prefer to set up hosting, databases, domains, APIs, and other services together on a call so you can enter your payment details directly and keep ownership and administrative control of every account."],
  ["What if I want Jason to manage third-party services for me?", "That is available by prior agreement. You pay the actual approved provider costs plus a 25% convenience charge on the third-party costs Jason or AutomateMeJay purchases, pays, or administratively manages on your behalf. The charge does not apply when you own and pay the provider directly."],
  ["Who owns the finished work?", "The client owns its data and paid client-specific deliverables. Jason retains ownership of preexisting technology, reusable components, templates, methods, prompts, frameworks, tools, and general know-how."],
  ["Can Jason build something similar for another company?", "Yes. The relationship is nonexclusive. Jason may provide similar services to others as long as client confidential information is protected."],
  ["Is the automation guaranteed to work perfectly?", "No. Automations require testing, monitoring, appropriate human review, and iteration. Outcomes depend on the client’s systems, data, cooperation, third-party services, and technical feasibility."],
  ["Can I cancel?", "The monthly plan requires 30 days’ written notice. The guaranteed first week does not renew automatically."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://automatemejay.com/#jason",
      name: "Jason Sirotin",
      url: "https://automatemejay.com",
      jobTitle: "Independent AI Automation Consultant",
    },
    {
      "@type": "Service",
      "@id": "https://automatemejay.com/#service",
      name: "AI Automation Partner",
      provider: { "@id": "https://automatemejay.com/#jason" },
      description: "Ongoing consulting to design, build, troubleshoot, and improve practical AI-enabled workflows.",
      offers: plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price.replace(/[$,]/g, ""),
        priceCurrency: "USD",
        url: `https://automatemejay.com${plan.href}`,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">/ {children}</p>;
}

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Jason Sirotin home">
          <span>JS</span>
          <strong>Jason Sirotin</strong>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/portfolio">Portfolio</Link>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Plans</a>
          <a href="#faq">FAQ</a>
        </nav>
        <MobileNavigation items={mobileNavigation} />
        <Link className="button button-small button-light" href="/start">
          Get started <ArrowRight size={15} />
        </Link>
      </header>

      <section className="hero section-pad">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> Independent AI automation consulting</div>
            <h1>Build better business automations with an ongoing <em>AI partner.</em></h1>
            <p className="hero-lede">I work directly with business owners and operating teams to design, build, troubleshoot, and continuously improve practical AI automations.</p>
            <p className="hero-promise">Bring me one recurring problem. We will turn it into a working process.</p>
            <div className="button-row">
              <Link className="button button-primary" href="/start">Start with the guarantee <ArrowRight size={18} /></Link>
              <a className="button button-ghost" href="#pricing">View plans <ArrowDownRight size={18} /></a>
            </div>
            <p className="fine-print">$350 · Seven days after activation · Full service-fee money-back guarantee · No automatic conversion</p>
          </div>

          <div className="hero-visual" aria-label="A workflow moving from a business bottleneck to a tested automation">
            <div className="portrait-wrap">
              <Image src="/jason-sirotin-headshot.png" alt="Jason Sirotin, independent AI automation consultant" fill sizes="(max-width: 800px) 80vw, 38vw" priority />
              <div className="portrait-caption"><span>Direct collaboration</span><strong>Jason Sirotin</strong></div>
            </div>
            <div className="workflow-card workflow-one"><span>01</span><p>Find the friction</p></div>
            <div className="workflow-card workflow-two"><span>02</span><p>Build + test</p></div>
            <div className="workflow-card workflow-three"><Check size={15} /><p>Working process</p></div>
          </div>
        </div>
        <div className="identity-strip">
          <span>Strategy</span><i /> <span>Build</span><i /> <span>Troubleshoot</span><i /> <span>Improve</span>
        </div>
      </section>

      <section className="problem section-pad" id="problems">
        <div className="section-intro">
          <SectionLabel>Start with the bottleneck</SectionLabel>
          <h2>Bring me the work your team keeps <em>repeating.</em></h2>
          <p>Most businesses already know where time is being lost. The hard part is turning that frustration into a reliable workflow people can actually use.</p>
        </div>
        <div className="problem-cloud">
          {problems.map((problem, index) => <span key={problem}><b>{String(index + 1).padStart(2, "0")}</b>{problem}</span>)}
        </div>
      </section>

      <section className="relationship section-pad">
        <div className="relationship-grid">
          <div className="sticky-copy">
            <SectionLabel>The relationship</SectionLabel>
            <h2>An automation partner, not another software subscription.</h2>
            <p>This is an ongoing working relationship for businesses that want to use AI and automation without hiring a full-time automation specialist.</p>
            <p>You have someone to contact when a process needs to be built, repaired, connected, or improved.</p>
          </div>
          <div className="capability-list">
            {capabilities.map((item, index) => (
              <div key={item} className="capability-item"><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><ArrowDownRight size={22} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="process section-pad" id="how-it-works">
        <div className="section-intro light">
          <SectionLabel>How it works</SectionLabel>
          <h2>Start with one workflow.</h2>
          <p>Focused building, real-world testing, clear feedback, and repeated improvement.</p>
        </div>
        <div className="steps">
          {steps.map(([title, description], index) => (
            <article key={title} className="step">
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-portfolio-proof section-pad">
        <div className="home-proof-metric"><span>95%</span><p>agent-produced execution</p></div>
        <div className="home-proof-copy">
          <SectionLabel>Selected work</SectionLabel>
          <h2>Real websites. Real systems. <em>Built differently.</em></h2>
          <p>SimplSolutions, ECG Productions, DriveOn Protection, SchoolAmplified, SimplDemocracy, and SimplCity Manchester are six live web experiences built through the same agent-assisted delivery system—directed, reviewed, and approved by people.</p>
          <Link className="button button-primary" href="/portfolio">Explore the portfolio <ArrowRight size={17} /></Link>
        </div>
        <div className="home-proof-names"><span>SimplSolutions</span><span>ECG Productions</span><span>DriveOn Protection</span><span>SchoolAmplified</span><span>SimplDemocracy</span><span>SimplCity Manchester</span></div>
      </section>

      <section className="working-model section-pad" id="working-model">
        <div className="working-model-card">
          <div className="model-statement">
            <SectionLabel>The working model</SectionLabel>
            <h2>I build.<br />You test.<br /><em>Together, we improve.</em></h2>
          </div>
          <div className="model-detail">
            <div className="model-icon"><MessageSquareText size={30} /></div>
            <p>AI and automation systems rarely become perfect on the first attempt. Strong results come from practical testing and clear communication.</p>
            <ul>
              <li><Check size={16} /> Test each delivery</li>
              <li><Check size={16} /> Explain what worked and what failed</li>
              <li><Check size={16} /> Provide screenshots or examples</li>
              <li><Check size={16} /> Prioritize requested changes</li>
              <li><Check size={16} /> Approve production use</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="human-control section-pad">
        <div className="control-card">
          <div className="control-icon"><ShieldCheck size={30} /></div>
          <div><SectionLabel>Human control</SectionLabel><h2>Automation should support your judgment, not replace it.</h2></div>
          <p>You remain responsible for how the automation is used inside your business. Important outputs and changes should include the level of human review appropriate for the situation.</p>
          <div className="control-principles"><span>Test before production</span><span>Maintain backups</span><span>Review consequential outputs</span><span>Monitor results</span></div>
        </div>
      </section>

      <section className="pricing section-pad" id="pricing">
        <div className="section-intro centered">
          <SectionLabel>Pricing</SectionLabel>
          <h2>Start protected. Continue only when the relationship is valuable.</h2>
        </div>
        <div className="plans">
          {plans.map((plan) => (
            <article className={`plan ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <div className="plan-badge"><Sparkles size={13} /> Money-back guarantee</div>}
              <p className="plan-name">{plan.name}</p>
              <div className="plan-price"><strong>{plan.price}</strong><span>{plan.cadence}</span></div>
              <p className="plan-description">{plan.description}</p>
              <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} /> {feature}</li>)}</ul>
              <Link className={`button ${plan.featured ? "button-primary" : "button-dark"}`} href={plan.href}>{plan.action} <ArrowRight size={17} /></Link>
            </article>
          ))}
        </div>
        <div className="asset-control-card">
          <div className="asset-control-intro">
            <SectionLabel>Your accounts, your assets</SectionLabel>
            <h3>You own the infrastructure. We help you set it up.</h3>
            <p>Our preference is a guided setup call where you create the accounts, enter your payment details directly with each provider, and keep full administrative control.</p>
          </div>
          <ol className="asset-control-steps">
            <li><span>01</span><div><strong>Set up together</strong><p>We guide the database, hosting, domain, API, or software setup on a call.</p></div></li>
            <li><span>02</span><div><strong>Pay providers directly</strong><p>Your card stays with the provider. Jason does not need your card number.</p></div></li>
            <li><span>03</span><div><strong>Stay in control</strong><p>You retain ownership, billing access, credentials, and administrator rights.</p></div></li>
          </ol>
          <aside className="managed-services-note">
            <span>Optional managed setup</span>
            <strong>25% convenience charge</strong>
            <p>If you ask Jason or AutomateMeJay to purchase, pay, or administratively manage a third-party service on your behalf, the approved provider cost plus a 25% convenience charge applies. There is no convenience charge when you own and pay the account directly.</p>
          </aside>
        </div>
        <p className="pricing-note">All third-party services require your approval. Actual provider charges are separate from consulting fees and from the first-week service-fee guarantee.</p>
      </section>

      <section className="boundaries section-pad">
        <div className="boundary-number">01</div>
        <div><SectionLabel>Simple boundaries</SectionLabel><h2>One contact. One active workstream. Clear priorities.</h2></div>
        <div className="boundary-copy"><p>Each standard subscription supports one primary person directing the work and one actively prioritized automation. Other employees may participate in testing and review.</p><strong>If the relationship grows, we discuss options before additional work begins. No surprise invoices.</strong></div>
      </section>

      <section className="communication section-pad">
        <div className="communication-grid">
          <div><SectionLabel>Communication</SectionLabel><h2>Real communication without unnecessary meetings.</h2><p>Messages appear in your private workspace immediately, but this is an asynchronous service. Real-time technology does not mean immediate human availability.</p></div>
          <div className="not-included"><p>Not included</p><span>Emergency support</span><span>24/7 support</span><span>Guaranteed immediate responses</span><span>Continuous production monitoring</span><span>Routine scheduled meetings</span></div>
        </div>
      </section>

      <section className="faq section-pad" id="faq">
        <div className="faq-title"><SectionLabel>FAQ</SectionLabel><h2>Questions, answered plainly.</h2></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<b>+</b></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta section-pad">
        <SectionLabel>Get started</SectionLabel>
        <h2>Bring me one<br /><em>business problem.</em></h2>
        <p>Start with a paid first week, approximately one hour of focused automation work, and a full service-fee money-back guarantee.</p>
        <div className="button-row centered-buttons"><Link className="button button-primary" href="/start">Start with the guarantee <ArrowRight size={18} /></Link><Link className="button button-ghost-light" href="/sign-in">Client sign in</Link></div>
      </section>

      <footer>
        <div className="footer-brand"><span>JS</span><div><strong>Jason Sirotin</strong><p>AI Automation Partner</p></div></div>
        <div className="footer-links"><Link href="/portfolio">Portfolio</Link><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/security">Data &amp; Security</Link><Link href="/sign-in">Client sign in</Link><a href="mailto:hello@automatemejay.com">Contact</a></div>
        <div className="footer-bottom"><p>Independent AI automation consulting</p><p>© 2026 Jason Sirotin. All rights reserved.</p></div>
      </footer>
    </main>
  );
}
