import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, GraduationCap, Newspaper } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SubpageHeader } from "@/components/subpage-header";
import { blogPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI Automation News & Practical Guides",
  description: "Practical guides for choosing, building, securing, and improving AI automation for real business operations.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ unsubscribe?: string }> }) {
  const { unsubscribe } = await searchParams;
  const unsubscribeMessage = unsubscribe === "success"
    ? "You are unsubscribed. No more campaign emails will be sent."
    : unsubscribe === "invalid"
      ? "That unsubscribe link is invalid or has already been used."
      : unsubscribe === "error"
        ? "We could not update your email preference. Please try the link again or email hello@automatemejay.com."
        : null;
  return (
    <main className="subpage blog-page">
      <SubpageHeader />
      <section className="blog-hero">
        <Newspaper size={30} aria-hidden="true" />
        <p className="section-label">/ News + AI automation field guide</p>
        <h1>Research, news, and playbooks for building <em>real systems.</em></h1>
        <p>Every article is designed to help you make a decision, map a workflow, or test an automation—not simply repeat AI headlines.</p>
      </section>
      <section className="newsletter-card" aria-labelledby="newsletter-title">
        <div className="newsletter-copy"><GraduationCap size={31} /><p className="section-label">/ Free five-part email course</p><h2 id="newsletter-title">Learn AI automation basics one useful step at a time.</h2><p>Five short lessons. One per day. No sales pitch until lesson five—first we help you understand the work, the risks, and what a responsible first project looks like.</p><div className="newsletter-sequence"><span>01 Map the process</span><span>02 Pick the right target</span><span>03 Keep human control</span><span>04 Test exceptions</span><span>05 Build the first version</span></div></div>
        <div>{unsubscribeMessage && <p className="newsletter-notice" role="status">{unsubscribeMessage}</p>}{unsubscribe !== "success" && <NewsletterSignup />}</div>
      </section>
      <section className="blog-grid" aria-label="AI automation articles">
        {blogPosts.map((post, index) => (
          <article className={`blog-card${index === 0 ? " blog-card-featured" : ""}`} key={post.slug}>
            <Link className="blog-card-image" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
              <Image src={post.image} alt="" fill sizes={index === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 33vw"} />
            </Link>
            <div className="blog-card-body">
              <div className="blog-meta"><span>{post.category}</span><time dateTime={post.published}>{new Date(`${post.published}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time><span>{post.readTime}</span></div>
              <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.description}</p>
              <Link className="blog-read-link" href={`/blog/${post.slug}`}>Read the researched guide <ArrowRight size={16} /></Link>
            </div>
          </article>
        ))}
      </section>
      <section className="blog-cta">
        <BookOpenText size={28} />
        <div><p className="section-label">/ Bring the real process</p><h2>Turn the question into a working plan.</h2><p>Book a free 30-minute consultation to identify one automation opportunity and the right next step.</p></div>
        <Link className="button button-primary" href="/book">Book a consultation <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
