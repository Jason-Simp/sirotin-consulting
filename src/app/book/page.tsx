import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarCheck, CalendarClock, Handshake, Mail, Phone, Video } from "lucide-react";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Book a Free AI Automation Consultation",
  description: "Book a free 30-minute consultation with Jason Sirotin to define one practical AI automation opportunity and the right next step.",
  path: "/book",
});

export default function BookPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_CONSULTATION_BOOKING_URL
    ?? "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0lVz4Ms-gCu6Lih6OaMA48D_Uv9-CsRAjf-XUZqHExVVZX4KOabqb7dJl74DgQ-LSGfcEiLhyp";
  const bookingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/book#consultation`,
    name: "Free 30-minute AI automation consultation",
    description: "A direct conversation with Jason Sirotin to define one recurring process, a useful first outcome, and the right next step.",
    provider: { "@id": `${SITE_URL}/#jason` },
    areaServed: "US",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE_URL}/book` },
    potentialAction: {
      "@type": "ReserveAction",
      name: "Book a consultation",
      target: { "@type": "EntryPoint", urlTemplate: bookingUrl, actionPlatform: "https://schema.org/DesktopWebPlatform" },
    },
  };
  return (
    <main className="booking-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookingJsonLd) }} />
      <header className="subpage-header"><Link href="/"><ArrowLeft size={16} /> Back to the site</Link><span>Jason Sirotin / AI Automation Partner</span></header>
      <section className="booking-layout">
        <div>
          <p className="section-label">/ Free 30-minute consultation</p>
          <h1>Start by getting the workflow <em>clear.</em></h1>
          <p className="booking-lede">Meet directly with Jason to identify one recurring process, define a useful first outcome, and decide whether a risk-free first week, monthly partnership, or no follow-up is the right next step.</p>
          <div className="booking-points"><span><Handshake size={18} /> No charge and no card required</span><span><CalendarClock size={18} /> Live availability from Jason’s connected calendars</span><span><Video size={18} /> Google Meet link created automatically</span><span><CalendarCheck size={18} /> No obligation to continue</span></div>
          <a className="button button-primary booking-button" href={bookingUrl} target="_blank" rel="noreferrer">See live times and book <ArrowRight size={18} /></a>
          <p className="fine-print">Availability and conflict checking are controlled by Google Calendar. Confirmation and reminders arrive by email.</p>
          <div className="booking-contact-links"><a href="mailto:hello@automatemejay.com"><Mail size={17} /> Email Jason</a><a href="tel:+16788555169"><Phone size={17} /> Call 678-855-5169</a></div>
        </div>
        <aside><CalendarCheck size={34} /><p className="section-label">/ What happens next</p><ol><li><strong>Book the consultation.</strong><span>Choose a verified open time from the live calendar.</span></li><li><strong>Define the opportunity.</strong><span>We map the process, systems, risk, and useful first result.</span></li><li><strong>Choose deliberately.</strong><span>Continue with a paid engagement only when the fit and next step are clear.</span></li></ol><p>Prefer email? <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a></p></aside>
      </section>
    </main>
  );
}
