import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "AI Automation Insights",
  description: "Practical guides for choosing, building, securing, and improving AI automation for real business operations.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "AI Automation Insights — Jason Sirotin",
    description: "Practical answers to the AI automation questions business owners are asking.",
    url: "/blog",
    images: ["/jason-sirotin-ai-automation-og.png"],
  },
};

export default function BlogPage() {
  return (
    <main className="subpage blog-page">
      <SubpageHeader />
      <section className="blog-hero">
        <p className="section-label">/ AI automation field guide</p>
        <h1>Useful answers for people building <em>real systems.</em></h1>
        <p>Clear, practical guidance on process design, cost, security, AI agents, knowledge systems, and implementation.</p>
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
              <Link className="blog-read-link" href={`/blog/${post.slug}`}>Read the guide <ArrowRight size={16} /></Link>
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
