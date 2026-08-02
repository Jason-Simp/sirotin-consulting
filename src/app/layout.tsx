import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { JasonAgent } from "@/components/jason-agent";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com"),
  title: {
    default: "Jason Sirotin — AI Automation Partner",
    template: "%s — Jason Sirotin",
  },
  description:
    "Independent AI automation consulting for businesses that need practical workflows built, repaired, connected, and improved.",
  applicationName: "Jason Sirotin AI Automation Partner",
  authors: [{ name: "Jason Sirotin", url: "https://automatemejay.com" }],
  creator: "Jason Sirotin",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Jason Sirotin — AI Automation Partner",
    title: "Build better business automations with an ongoing AI partner.",
    description:
      "Bring one recurring problem. We will turn it into a working process.",
    images: [{ url: "/automation-workflow-social.png", width: 1731, height: 909, alt: "Multiple business processes resolving into one clear automation workflow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Sirotin — AI Automation Partner",
    description: "Practical AI automation consulting for operating teams.",
    images: ["/automation-workflow-social.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}<JasonAgent agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID} /></body>
    </html>
  );
}
