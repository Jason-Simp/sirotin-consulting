import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { SubpageHeader } from "@/components/subpage-header";
import { blogPosts, getBlogPost, getRelatedBlogPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

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
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const relatedPosts = getRelatedBlogPosts(post);
  const wordCount = [post.title, post.description, ...post.intro, ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]), post.takeaway]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.published,
        dateModified: post.updated,
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#jason`,
          name: "Jason Sirotin",
          url: `${SITE_URL}/approach`,
          image: `${SITE_URL}/jason-sirotin-headshot.png`,
          sameAs: [
            "https://www.linkedin.com/in/jason-sirotin-455b265",
            "https://www.jasonsirotin.com/",
            "https://www.ecgprod.com/team/jason-sirotin/",
          ],
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
        image: {
          "@type": "ImageObject",
          contentUrl: `${SITE_URL}${post.image}`,
          caption: post.imageCaption,
        },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        articleSection: post.category,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        wordCount,
        keywords: post.keywords.join(", "),
        about: post.keywords.map((keyword) => ({ "@type": "DefinedTerm", name: keyword })),
        citation: post.sources?.map((source) => source.url),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog/${post.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "News and guides", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
      },
    ],
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
          <div className="blog-editorial-note" aria-label="Article standards">
            <span>First-hand operating perspective</span>
            <span>Primary references linked</span>
            <span>Updated <time dateTime={post.updated}>{new Date(`${post.updated}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></span>
          </div>
        </header>
        <figure className="blog-article-visual"><Image src={post.image} alt={post.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 1120px" /><figcaption>{post.imageCaption}</figcaption></figure>
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
            {post.sources && <div className="blog-sources"><h2>Primary references</h2><p>These sources support the factual and technical guidance in this article. Product decisions still require review against your own systems, policies, and risk.</p>{post.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} <ExternalLink size={14} /></a>)}</div>}
          </div>
        </div>
      </article>
      <section className="blog-related" aria-labelledby="related-guides-title">
        <div><p className="section-label">/ Continue learning</p><h2 id="related-guides-title">Related practical guides</h2></div>
        <div className="blog-related-grid">
          {relatedPosts.map((related) => (
            <article key={related.slug}>
              <span>{related.category}</span>
              <h3><Link href={`/blog/${related.slug}`}>{related.title}</Link></h3>
              <p>{related.description}</p>
              <Link href={`/blog/${related.slug}`}>Read the guide <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="blog-post-cta"><div><p className="section-label">/ Ready to apply it?</p><h2>Bring one process. Leave with a clearer next step.</h2></div><Link className="button button-primary" href="/book">Book a free consultation <ArrowRight size={17} /></Link></section>
    </main>
  );
}
