import type { Metadata } from "next";
import { Check } from "lucide-react";
import { StartForm } from "./start-form";
import { SubpageHeader } from "@/components/subpage-header";

export const metadata: Metadata = {
  title: "Start Your Free Week",
  description: "Bring one recurring business problem and request a free week of focused AI automation work.",
};

export default function StartPage() {
  return (
    <main className="subpage">
      <SubpageHeader />
      <div className="intake-layout">
        <aside>
          <p className="section-label">/ Start your free week</p>
          <h1>Tell me where the work gets stuck.</h1>
          <p>Your request gives me enough context to identify a useful first move. I review every request before activating the seven-day period.</p>
          <ul><li><Check size={15} /> About one hour of focused work</li><li><Check size={15} /> One automation opportunity</li><li><Check size={15} /> No credit card</li><li><Check size={15} /> No automatic paid conversion</li></ul>
        </aside>
        <section><StartForm /></section>
      </div>
    </main>
  );
}
