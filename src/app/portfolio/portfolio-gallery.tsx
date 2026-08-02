"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Bot, BriefcaseBusiness, Globe2, Megaphone, PanelsTopLeft } from "lucide-react";

type Category = "Client websites" | "AI products" | "Internal systems" | "Campaigns";

type WorkItem = {
  title: string;
  category: Category;
  description: string;
  href: string;
  status: string;
};

const work: WorkItem[] = [
  { title: "Brain Bytes Creative", category: "Client websites", description: "A premium, conversion-led agency website with a clear positioning system.", href: "https://brainbytescreative.com", status: "Live website" },
  { title: "SimplSite", category: "AI products", description: "Managed website and AI guide experience powered by an approved Business Brain.", href: "https://www.simplsolutions.app/", status: "Product experience" },
  { title: "SimplScribe", category: "AI products", description: "Conversation intelligence that turns calls into governed, usable work.", href: "https://www.simplsolutions.app/product/simplscribe", status: "Product experience" },
  { title: "SimplWiki", category: "AI products", description: "A structured knowledge layer designed to make approved context usable.", href: "https://www.simplsolutions.app/platform", status: "Product experience" },
  { title: "SimplEngine", category: "Internal systems", description: "The command surface for building, reviewing, testing, and deploying intelligence layers.", href: "/start", status: "Private system" },
  { title: "SimplCity — Manchester, NH", category: "Client websites", description: "A conversational Manchester city guide for exploring local information, places, and services.", href: "https://simplsite.app/cities/manchester-new-hampshire#ask", status: "Live city experience" },
  { title: "SimplDemocracy", category: "AI products", description: "A civic-information platform built around understandable, source-grounded public knowledge.", href: "https://simpldemocracy.app/", status: "Live civic platform" },
  { title: "Baxter BBC Operating System", category: "Internal systems", description: "A focused operating interface built around the team’s own working model.", href: "/start", status: "Private system" },
  { title: "Tire God Go-to-Market", category: "Campaigns", description: "A visual go-to-market operating surface for positioning, content, and execution.", href: "/start", status: "Strategy system" },
  { title: "SimplSolutions Product Portfolio", category: "AI products", description: "The connected product system behind a shared Business Brain.", href: "https://www.simplsolutions.app/", status: "Portfolio system" },
  { title: "SimplSocial", category: "AI products", description: "Always-on social execution grounded in brand voice and approval rules.", href: "https://www.simplsolutions.app/products/simplsocial", status: "Product experience" },
  { title: "SimplSocial Dashboard", category: "Internal systems", description: "A practical planning, review, and publishing command center for social teams.", href: "https://www.simplsolutions.app/products/simplsocial", status: "Product interface" },
  { title: "SimplContent", category: "AI products", description: "A governed content and SEO engine built from the organization’s real knowledge.", href: "https://www.simplsolutions.app/products/simplcontent", status: "Product experience" },
  { title: "SimplMail", category: "AI products", description: "Personal-feeling email and follow-up without generic bulk automation.", href: "https://www.simplsolutions.app/products/simplmail", status: "Product experience" },
  { title: "SimplVoice", category: "AI products", description: "AI call handling designed around clear routes, capture, and human escalation.", href: "https://www.simplsolutions.app/products/simplvoice", status: "Product experience" },
  { title: "SimplTraining", category: "AI products", description: "Role-specific AI workforce training organized around responsible adoption.", href: "https://www.simplsolutions.app/ai-training", status: "Product experience" },
  { title: "SimplNewsletter", category: "AI products", description: "A repeatable newsletter workflow built for consistency, review, and reuse.", href: "https://www.simplsolutions.app/products/simplmail", status: "Product workflow" },
  { title: "SimplUpload", category: "Internal systems", description: "A structured intake layer for bringing source material into governed workflows.", href: "https://www.simplsolutions.app/platform", status: "Platform module" },
  { title: "SimplBridge", category: "Internal systems", description: "A connection layer that moves approved context between business systems.", href: "https://www.simplsolutions.app/platform", status: "Platform module" },
  { title: "SimplWiki Workspace", category: "Internal systems", description: "A working knowledge interface for organizing and verifying source context.", href: "https://www.simplsolutions.app/platform", status: "Platform module" },
  { title: "SimplWiki Intelligence", category: "Internal systems", description: "An intelligence view for navigating larger collections of approved knowledge.", href: "https://www.simplsolutions.app/platform", status: "Platform module" },
  { title: "SimplEngine Builder", category: "Internal systems", description: "Agent-assisted tooling for turning client source material into working systems.", href: "/start", status: "Private system" },
  { title: "SimplEngine Command Surface", category: "Internal systems", description: "A build-and-review surface that keeps agent execution visible and controlled.", href: "/start", status: "Private system" },
];

const categories: Array<{ name: Category; Icon: typeof Globe2 }> = [
  { name: "Client websites", Icon: Globe2 },
  { name: "AI products", Icon: Bot },
  { name: "Internal systems", Icon: PanelsTopLeft },
  { name: "Campaigns", Icon: Megaphone },
];

export function PortfolioGallery() {
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const grouped = useMemo(() => new Map(categories.map(({ name }) => [name, work.filter((item) => item.category === name)])), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setOpenCategory(null);
    }, { threshold: 0 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio-accordions" ref={containerRef}>
      {categories.map(({ name, Icon }, index) => {
        const items = grouped.get(name) ?? [];
        return (
          <details key={name} open={openCategory === name} onToggle={(event) => setOpenCategory(event.currentTarget.open ? name : openCategory === name ? null : openCategory)}>
            <summary>
              <span>0{index + 1}</span>
              <Icon size={21} aria-hidden="true" />
              <strong>{name}</strong>
              <small>{items.length} project{items.length === 1 ? "" : "s"}</small>
              <b aria-hidden="true">+</b>
            </summary>
            <div className="portfolio-accordion-projects">
              {items.map((item) => (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>
                  <BriefcaseBusiness size={18} aria-hidden="true" />
                  <div><strong>{item.title}</strong><p>{item.description}</p><small>{item.status}</small></div>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </a>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
