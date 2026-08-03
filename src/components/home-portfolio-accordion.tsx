"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Bot, Globe2 } from "lucide-react";

const projects = [
  { name: "SimplSolutions", category: "Business automation", href: "https://www.simplsolutions.app/" },
  { name: "ECG Productions", category: "Film and video production", href: "https://www.ecgprod.com/" },
  { name: "DriveOn Protection", category: "Vehicle protection", href: "https://driveonprotection.com/" },
  { name: "SchoolAmplified", category: "K–12 intelligence", href: "https://schoolamplified.ai/" },
  { name: "SimplDemocracy", category: "Civic intelligence", href: "https://simpldemocracy.app/" },
  { name: "SimplCity — Manchester", category: "Municipal AI experience", href: "https://simplsite.app/cities/manchester-new-hampshire#ask" },
];

export function HomePortfolioAccordion() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    const summary = details.querySelector("summary");
    if (!summary) return;

    const closeWhenSummaryLeavesViewport = () => {
      if (!details.open) return;
      const bounds = summary.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) details.open = false;
    };

    window.addEventListener("scroll", closeWhenSummaryLeavesViewport, { passive: true });
    return () => window.removeEventListener("scroll", closeWhenSummaryLeavesViewport);
  }, []);

  return (
    <section className="home-portfolio-section" aria-label="Selected work">
      <details className="home-portfolio-accordion" ref={detailsRef}>
        <summary>
          <span className="home-portfolio-kicker"><Bot size={16} aria-hidden="true" /> Selected work</span>
          <strong>Explore the agent-built portfolio</strong>
          <span className="home-portfolio-summary-action">Six live projects <b aria-hidden="true">+</b></span>
        </summary>
        <div className="home-portfolio-panel">
          <div className="home-portfolio-panel-intro">
            <span className="home-portfolio-percent">95%</span>
            <div><strong>agent-produced execution</strong><p>Human-directed, reviewed, and approved.</p></div>
          </div>
          <nav className="home-portfolio-links" aria-label="Featured portfolio projects">
            {projects.map((project, index) => (
              <a href={project.href} target="_blank" rel="noreferrer" key={project.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Globe2 size={18} aria-hidden="true" />
                <div><strong>{project.name}</strong><small>{project.category}</small></div>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <a className="portfolio-center-link" href="/portfolio" target="_blank" rel="noreferrer">Open the complete portfolio center <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </details>
    </section>
  );
}
