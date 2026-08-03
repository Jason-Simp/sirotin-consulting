import type { Metadata } from "next";
import { SubpageHeader } from "@/components/subpage-header";
import { SessionCompleter } from "./session-completer";

export const metadata: Metadata = {
  title: "Completing Sign In",
  robots: { index: false, follow: false },
  alternates: { canonical: "/auth/complete" },
};

export default function CompleteAuthPage() {
  return (
    <main className="subpage">
      <SubpageHeader />
      <section className="simple-state">
        <p className="section-label">/ Secure client sign in</p>
        <h1>Opening your workspace.</h1>
        <SessionCompleter />
      </section>
    </main>
  );
}
