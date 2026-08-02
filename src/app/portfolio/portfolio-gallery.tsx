"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "Client websites" | "AI products" | "Internal systems" | "Campaigns";

type WorkItem = {
  title: string;
  image: string;
  category: Category;
  description: string;
  href: string;
  external?: boolean;
  status: string;
};

const work: WorkItem[] = [
  { title: "Brain Bytes Creative", image: "/portfolio/brain-bytes-creative.jpg", category: "Client websites", description: "A premium, conversion-led agency website with a clear positioning system.", href: "https://brainbytescreative.com", external: true, status: "Live website" },
  { title: "SimplSite", image: "/portfolio/simplsite.jpg", category: "AI products", description: "Managed website and AI guide experience powered by an approved Business Brain.", href: "https://www.simplsolutions.app/", external: true, status: "Product experience" },
  { title: "SimplScribe", image: "/portfolio/simplscribe.jpg", category: "AI products", description: "Conversation intelligence that turns calls into governed, usable work.", href: "https://www.simplsolutions.app/product/simplscribe", external: true, status: "Product experience" },
  { title: "SimplWiki", image: "/portfolio/simplwiki-product.jpg", category: "AI products", description: "A structured knowledge layer designed to make approved context usable.", href: "https://www.simplsolutions.app/platform", external: true, status: "Product experience" },
  { title: "SimplEngine", image: "/portfolio/simplengine-product.jpg", category: "Internal systems", description: "The command surface for building, reviewing, testing, and deploying intelligence layers.", href: "/start", status: "Private system" },
  { title: "SimplCity — Manchester, NH", image: "/portfolio/simplcity.jpg", category: "Client websites", description: "A conversational Manchester city guide for exploring local information, places, and services.", href: "https://simplsite.app/cities/manchester-new-hampshire#ask", external: true, status: "Live city experience" },
  { title: "SimplDemocracy", image: "/portfolio/simpldemocracy.jpg", category: "AI products", description: "A civic-information platform built around understandable, source-grounded public knowledge.", href: "https://simpldemocracy.app/", external: true, status: "Live civic platform" },
  { title: "Baxter BBC Operating System", image: "/portfolio/baxter-bbc.jpg", category: "Internal systems", description: "A focused operating interface built around the team’s own working model.", href: "/start", status: "Private system" },
  { title: "Tire God Go-to-Market", image: "/portfolio/tire-god.jpg", category: "Campaigns", description: "A visual go-to-market operating surface for positioning, content, and execution.", href: "/start", status: "Strategy system" },
  { title: "SimplSolutions Product Portfolio", image: "/portfolio/simplsolutions.jpg", category: "AI products", description: "The connected product system behind a shared Business Brain.", href: "https://www.simplsolutions.app/", external: true, status: "Portfolio system" },
  { title: "SimplSocial", image: "/portfolio/simplsocial.jpg", category: "AI products", description: "Always-on social execution grounded in brand voice and approval rules.", href: "https://www.simplsolutions.app/products/simplsocial", external: true, status: "Product experience" },
  { title: "SimplSocial Dashboard", image: "/portfolio/simplsocial-dashboard.jpg", category: "Internal systems", description: "A practical planning, review, and publishing command center for social teams.", href: "https://www.simplsolutions.app/products/simplsocial", external: true, status: "Product interface" },
  { title: "SimplContent", image: "/portfolio/simplcontent.jpg", category: "AI products", description: "A governed content and SEO engine built from the organization’s real knowledge.", href: "https://www.simplsolutions.app/products/simplcontent", external: true, status: "Product experience" },
  { title: "SimplMail", image: "/portfolio/simplmail.jpg", category: "AI products", description: "Personal-feeling email and follow-up without generic bulk automation.", href: "https://www.simplsolutions.app/products/simplmail", external: true, status: "Product experience" },
  { title: "SimplVoice", image: "/portfolio/simplvoice.jpg", category: "AI products", description: "AI call handling designed around clear routes, capture, and human escalation.", href: "https://www.simplsolutions.app/products/simplvoice", external: true, status: "Product experience" },
  { title: "SimplTraining", image: "/portfolio/simpltraining.jpg", category: "AI products", description: "Role-specific AI workforce training organized around responsible adoption.", href: "https://www.simplsolutions.app/ai-training", external: true, status: "Product experience" },
  { title: "SimplNewsletter", image: "/portfolio/simplnewsletter.jpg", category: "AI products", description: "A repeatable newsletter workflow built for consistency, review, and reuse.", href: "https://www.simplsolutions.app/products/simplmail", external: true, status: "Product workflow" },
  { title: "SimplUpload", image: "/portfolio/simplupload.jpg", category: "Internal systems", description: "A structured intake layer for bringing source material into governed workflows.", href: "https://www.simplsolutions.app/platform", external: true, status: "Platform module" },
  { title: "SimplBridge", image: "/portfolio/simplbridge.jpg", category: "Internal systems", description: "A connection layer that moves approved context between business systems.", href: "https://www.simplsolutions.app/platform", external: true, status: "Platform module" },
  { title: "SimplWiki Workspace", image: "/portfolio/simplwiki.jpg", category: "Internal systems", description: "A working knowledge interface for organizing and verifying source context.", href: "https://www.simplsolutions.app/platform", external: true, status: "Platform module" },
  { title: "SimplWiki Intelligence", image: "/portfolio/simplwiki-2.jpg", category: "Internal systems", description: "An intelligence view for navigating larger collections of approved knowledge.", href: "https://www.simplsolutions.app/platform", external: true, status: "Platform module" },
  { title: "SimplEngine Builder", image: "/portfolio/simplengine.jpg", category: "Internal systems", description: "Agent-assisted tooling for turning client source material into working systems.", href: "/start", status: "Private system" },
  { title: "SimplEngine Command Surface", image: "/portfolio/simplengine-2.jpg", category: "Internal systems", description: "A build-and-review surface that keeps agent execution visible and controlled.", href: "/start", status: "Private system" },
];

const filters = ["All", "Client websites", "AI products", "Internal systems", "Campaigns"] as const;

export function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const visibleWork = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return work.filter((item) => {
      const categoryMatches = activeFilter === "All" || item.category === activeFilter;
      const queryMatches = !normalized || `${item.title} ${item.description} ${item.category} ${item.status}`.toLowerCase().includes(normalized);
      return categoryMatches && queryMatches;
    });
  }, [activeFilter, query]);

  return (
    <>
      <div className="portfolio-tools">
        <div className="portfolio-filters" aria-label="Filter portfolio projects">
          {filters.map((filter) => (
            <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
              {filter}
            </button>
          ))}
        </div>
        <label className="portfolio-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search portfolio</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the work" />
        </label>
      </div>

      <p className="portfolio-count" aria-live="polite">Showing {visibleWork.length} project{visibleWork.length === 1 ? "" : "s"}</p>

      <div className="portfolio-gallery-grid">
        {visibleWork.map((item) => {
          const CardLink = item.external ? "a" : Link;
          const linkProps = item.external ? { target: "_blank", rel: "noreferrer" } : {};
          return (
            <article className="portfolio-card" key={`${item.title}-${item.image}`}>
              <CardLink className="portfolio-card-image" href={item.href} {...linkProps} aria-label={`${item.title} — ${item.external ? "open project" : "discuss a similar build"}`}>
                <Image src={item.image} alt={`${item.title} project thumbnail`} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              </CardLink>
              <div className="portfolio-card-body">
                <div className="portfolio-card-meta"><span>{item.category}</span><span>{item.status}</span></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <CardLink className="portfolio-card-link" href={item.href} {...linkProps}>
                  {item.external ? "Open project" : "Build something similar"}
                  {item.external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
                </CardLink>
              </div>
            </article>
          );
        })}
      </div>

      {visibleWork.length === 0 && (
        <div className="portfolio-empty-state">
          <p>No projects match that search yet.</p>
          <button type="button" onClick={() => { setQuery(""); setActiveFilter("All"); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}
