import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, MessageSquareText, Phone } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact Jason Sirotin",
  description: "Email, call, or book a free AI automation consultation with Jason Sirotin.",
  path: "/contact",
});

export default function ContactPage() {
  return <main className="subpage contact-page">
    <SubpageHeader />
    <section className="contact-hero">
      <div><p className="section-label">/ Contact Jason</p><h1>Talk to a person about the work that is <em>slowing you down.</em></h1><p>Questions are welcome. Share one recurring task, broken handoff, or automation idea and we can decide the most useful next step.</p></div>
      <div className="contact-options">
        <a href="mailto:hello@automatemejay.com"><span><Mail size={24} /></span><div><small>Email</small><strong>hello@automatemejay.com</strong><p>Best for context, links, and project questions.</p></div><ArrowRight size={19} /></a>
        <a href="tel:+16788555169"><span><Phone size={24} /></span><div><small>Call</small><strong>678-855-5169</strong><p>Tap to call from a phone or supported computer.</p></div><ArrowRight size={19} /></a>
        <Link href="/book"><span><CalendarDays size={24} /></span><div><small>Schedule</small><strong>Free 30-minute consultation</strong><p>Choose a confirmed open time from the live calendar.</p></div><ArrowRight size={19} /></Link>
        <Link href="/sign-in"><span><MessageSquareText size={24} /></span><div><small>Existing clients</small><strong>Open the communication center</strong><p>Messages, testing, approvals, files, and billing live in your private workspace.</p></div><ArrowRight size={19} /></Link>
      </div>
    </section>
  </main>;
}
