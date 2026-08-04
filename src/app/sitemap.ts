import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://automatemejay.com";
  const siteUpdated = new Date("2026-08-04T00:00:00Z");
  return [
    { url: base, lastModified: siteUpdated, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/approach`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.9 },
    ...blogPosts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.updated, changeFrequency: "monthly" as const, priority: 0.75 })),
    { url: `${base}/book`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/start`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/one-off`, lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.6 },
  ];
}
