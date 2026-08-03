import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://automatemejay.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/portfolio`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
    ...blogPosts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.updated, changeFrequency: "monthly" as const, priority: 0.75 })),
    { url: `${base}/book`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/start`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/one-off`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
