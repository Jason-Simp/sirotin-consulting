import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarCheck, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Free AI Automation Consultation",
  description: "Book a free 30-minute consultation with Jason Sirotin to define one practical AI automation opportunity and the right next step.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_CONSULTATION_BOOKING_URL;
  return (
    <main className="booking-page">
      <header className="subpage-header"><Link href="/"><ArrowLeft size={16} /> Back to the site</Link><span>Jason Sirotin / AI Automation Partner</span></header>
      <section className="booking-layout">
        <div>
          <p className="section-label">/ Free 30-minute consultation</p>
          <h1>Start by getting the workflow <em>clear.</em></h1>
          <p className="booking-lede">Meet directly with Jason to identify one recurring process, define a useful first outcome, and decide whether weekly, monthly, one-off, or no follow-up is the right next step.</p>
          <div className="booking-points"><span><Check size={17} /> No charge and no card required</span><span><Check size={17} /> Live availability from Jason’s connected calendars</span><span><Check size={17} /> Google Meet link created automatically</span><span><Check size={17} /> No obligation to continue</span></div>
          {bookingUrl ? <a className="button button-primary booking-button" href={bookingUrl} target="_blank" rel="noreferrer">See live times and book <ArrowRight size={18} /></a> : <a className="button button-primary booking-button" href={`mailto:hello@automatemejay.com?subject=${encodeURIComponent("AI Automation Consultation")}`}>Request a consultation <ArrowRight size={18} /></a>}
          <p className="fine-print">Availability and conflict checking are controlled by Google Calendar. Confirmation and reminders arrive by email.</p>
        </div>
        <aside><CalendarCheck size={34} /><p className="section-label">/ What happens next</p><ol><li><strong>Book the consultation.</strong><span>Choose a verified open time from the live calendar.</span></li><li><strong>Define the opportunity.</strong><span>We map the process, systems, risk, and useful first result.</span></li><li><strong>Choose deliberately.</strong><span>Continue with a paid engagement only when the fit and next step are clear.</span></li></ol><p>Prefer email? <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a></p></aside>
      </section>
    </main>
  );
}
