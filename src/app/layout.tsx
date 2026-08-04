import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { JasonAgent } from "@/components/jason-agent";
import { AUTOMATEMEJAY_AGENT_ID } from "@/lib/agent-config";
import { GoogleTagManager } from "@/components/google-tag-manager";
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL),
  title: {
    default: "AI Automation Consultant — Jason Sirotin | AutomateMeJay",
    template: "%s — Jason Sirotin",
  },
  description:
    "Work directly with AI automation consultant Jason Sirotin to design, build, secure, troubleshoot, and improve practical business workflows.",
  category: "technology",
  applicationName: SITE_NAME,
  authors: [{ name: "Jason Sirotin", url: SITE_URL }],
  creator: "Jason Sirotin",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AutomateMeJay",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "Build better business automations with an ongoing AI partner.",
    description:
      "Bring one recurring problem. We will turn it into a working process.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Sirotin — AI Automation Partner",
    description: "Practical AI automation consulting for operating teams.",
    images: [SOCIAL_IMAGE.url],
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#02060c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div id="main-content" tabIndex={-1}>{children}</div>
        <JasonAgent agentId={AUTOMATEMEJAY_AGENT_ID} />
        <GoogleTagManager containerId={process.env.NEXT_PUBLIC_GTM_ID} />
      </body>
    </html>
  );
}
