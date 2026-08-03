import type { Metadata } from "next";

export const SITE_URL = "https://automatemejay.com";
export const SITE_NAME = "AutomateMeJay";
export const SOCIAL_IMAGE = {
  url: "/jason-sirotin-ai-automation-og.png",
  width: 1200,
  height: 630,
  alt: "Jason Sirotin, AI automation partner — practical systems built with human approval",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
