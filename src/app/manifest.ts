import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jason Sirotin — AI Automation Partner",
    short_name: "AutomateMeJay",
    description: "Practical AI automation consulting with Jason Sirotin.",
    start_url: "/",
    display: "standalone",
    background_color: "#02060c",
    theme_color: "#02060c",
    orientation: "any",
    categories: ["business", "productivity"],
    icons: [
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
