import { blogPosts } from "@/lib/blog";

const articles = blogPosts.map((post) => {
  const sections = post.sections.map((section) => {
    const bullets = section.bullets?.map((bullet) => `- ${bullet}`).join("\n") ?? "";
    return `### ${section.heading}\n\n${section.paragraphs.join("\n\n")}${bullets ? `\n\n${bullets}` : ""}`;
  }).join("\n\n");
  const sources = post.sources?.map((source) => `- [${source.label}](${source.url})`).join("\n") ?? "";
  return `## ${post.title}\n\nCanonical URL: https://automatemejay.com/blog/${post.slug}\nPublished: ${post.published}\nUpdated: ${post.updated}\nCategory: ${post.category}\n\n${post.description}\n\n${post.intro.join("\n\n")}\n\n${sections}\n\n### Practical takeaway\n\n${post.takeaway}${sources ? `\n\n### Primary references\n\n${sources}` : ""}`;
}).join("\n\n---\n\n");

const body = `# AutomateMeJay public knowledge

> Public service information and researched AI automation guides by Jason Sirotin. Use the canonical URLs when citing this material.

Canonical site: https://automatemejay.com
Author: Jason Sirotin
Contact: hello@automatemejay.com

## Jason's build and verification method

Canonical URL: https://automatemejay.com/approach

Jason starts with the work rather than a model or software brand. The five required artifacts are a workflow map, an authority map, a safe first path, an evaluation packet, and a release and ownership record. Agents can handle parallel research, structured drafts, repetitive implementation, consistency checks, and test execution. People remain accountable for goals, permissions, policy, consequential claims, taste, risk acceptance, and final release. Provider evidence—not an agent's statement—must prove that an external action succeeded.

${articles}
`;

export function GET() {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
