import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://automatemejay.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/portfolio`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/start`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/one-off`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/legal/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legal/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legal/security`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
