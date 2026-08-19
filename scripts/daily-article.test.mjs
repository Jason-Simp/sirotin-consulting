import assert from "node:assert/strict";
import test from "node:test";
import { extractExistingPosts, findNearDuplicate, insertArticle, validateArticle, verifySourceUrls } from "./daily-article-lib.mjs";

const date = "2026-08-19";
const source = `export type BlogPost = {};\nexport const blogPosts: BlogPost[] = [\n  {\n    slug: "automate-purchase-orders-with-ai",\n    title: "How to automate purchase orders with AI without losing approval control",\n    category: "Operations automation",\n    published: "2026-08-18",\n    keywords: ["automate purchase orders with AI", "AI purchasing workflow", "purchase order automation"],\n  },\n];\n`;
const existingPosts = extractExistingPosts(source);

const article = {
  slug: "automate-customer-onboarding-with-ai",
  title: "How to automate customer onboarding with AI without losing handoff control",
  description: "A practical customer-onboarding workflow for verifying intake, assigning owners, controlling approvals, and recovering safely from incomplete integrations.",
  category: "Operations automation",
  published: date,
  updated: date,
  readTime: "12 min read",
  image: "/portfolio/simplsolutions.jpg",
  imageAlt: "Connected workflow systems representing a controlled customer onboarding process",
  imageCaption: "Reliable onboarding automation verifies each handoff, preserves the source record, and returns unresolved exceptions to a named owner.",
  keywords: ["automate customer onboarding with AI", "AI onboarding workflow", "customer onboarding automation"],
  intro: ["A ".repeat(170), "B ".repeat(170)],
  sections: Array.from({ length: 8 }, (_, index) => ({
    heading: `Control stage ${index + 1} with explicit evidence`,
    paragraphs: [`C${index} `.repeat(110)],
    ...(index === 0 ? { bullets: ["First control", "Second control", "Third control"] } : {}),
  })),
  takeaway: "D ".repeat(100),
  sources: [
    { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    { label: "NIST Secure Software Development Framework", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
    { label: "OWASP AI Agent Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html" },
    { label: "Microsoft identity platform documentation", url: "https://learn.microsoft.com/en-us/entra/identity-platform/" },
  ],
};

test("extractExistingPosts reads top-level blog metadata", () => {
  assert.equal(existingPosts.length, 1);
  assert.equal(existingPosts[0].slug, "automate-purchase-orders-with-ai");
  assert.equal(existingPosts[0].published, "2026-08-18");
});

test("validateArticle accepts a distinct, schema-complete article", () => {
  const result = validateArticle(article, { date, existingPosts, images: [article.image] });
  assert.ok(result.words >= 1_200);
});

test("findNearDuplicate detects repeated intent", () => {
  const duplicate = { ...article, slug: existingPosts[0].slug, title: existingPosts[0].title, keywords: existingPosts[0].keywords };
  assert.equal(findNearDuplicate(duplicate, existingPosts)?.slug, existingPosts[0].slug);
});

test("insertArticle prepends the article without deleting existing content", () => {
  const next = insertArticle(source, article);
  assert.ok(next.indexOf(article.slug) < next.indexOf(existingPosts[0].slug));
  assert.ok(next.includes("export const blogPosts"));
});

test("verifySourceUrls removes an unreachable optional citation when the source floor remains", async () => {
  const sources = [
    ...article.sources,
    { label: "Optional blocked reference", url: "https://blocked.example/reference" },
  ];
  await verifySourceUrls(sources, async (url) => ({
    status: String(url).includes("blocked.example") ? 403 : 200,
    body: { cancel: async () => {} },
  }));
  assert.equal(sources.length, 4);
  assert.ok(sources.every((sourceItem) => !sourceItem.url.includes("blocked.example")));
});
