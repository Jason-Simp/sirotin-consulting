import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { SubpageHeader } from "@/components/subpage-header";
import { blogPosts, getBlogPost } from "@/lib/blog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: ["Jason Sirotin"],
      images: [{ url: post.image, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated,
    author: { "@type": "Person", name: "Jason Sirotin", url: "https://automatemejay.com" },
    publisher: { "@type": "Person", name: "Jason Sirotin" },
    image: `https://automatemejay.com${post.image}`,
    mainEntityOfPage: `https://automatemejay.com/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };

  return (
    <main className="subpage blog-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <SubpageHeader />
      <article className="blog-article">
        <header className="blog-article-header">
          <Link className="blog-back" href="/blog"><ArrowLeft size={16} /> All news and guides</Link>
          <div className="blog-meta"><span>{post.category}</span><time dateTime={post.published}>Published {new Date(`${post.published}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time><span>{post.readTime}</span></div>
          <h1>{post.title}</h1>
          <p className="blog-article-deck">{post.description}</p>
          <div className="blog-author"><div className="blog-author-photo"><Image src="/jason-sirotin-headshot.png" alt="Jason Sirotin" fill sizes="52px" /></div><div><strong>Jason Sirotin</strong><span>AI Automation Partner</span></div></div>
        </header>
        <div className="blog-article-visual"><Image src={post.image} alt={post.title} fill priority sizes="(max-width: 900px) 100vw, 1120px" /></div>
        <div className="blog-article-layout">
          <aside><p>In this guide</p><nav>{post.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}>{String(index + 1).padStart(2, "0")} {section.heading}</a>)}</nav></aside>
          <div className="blog-article-body">
            {post.intro.map((paragraph) => <p className="blog-intro" key={paragraph}>{paragraph}</p>)}
            {post.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <p className="section-label">/ {String(index + 1).padStart(2, "0")}</p>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}><Check size={17} /> {bullet}</li>)}</ul>}
              </section>
            ))}
            <div className="blog-takeaway"><p className="section-label">/ Practical takeaway</p><p>{post.takeaway}</p></div>
            {post.sources && <div className="blog-sources"><h2>Primary references</h2>{post.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} <ExternalLink size={14} /></a>)}</div>}
          </div>
        </div>
      </article>
      <section className="blog-post-cta"><div><p className="section-label">/ Ready to apply it?</p><h2>Bring one process. Leave with a clearer next step.</h2></div><Link className="button button-primary" href="/book">Book a free consultation <ArrowRight size={17} /></Link></section>
    </main>
  );
}
