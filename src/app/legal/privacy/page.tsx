import type { Metadata } from "next";
import { SubpageHeader } from "@/components/subpage-header";

export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return <main className="subpage"><SubpageHeader /><div className="legal-page"><span className="legal-status">Draft pending professional review</span><h1>Privacy Policy</h1><p className="legal-meta">Working version · August 2, 2026</p><article>
    <p>This notice explains how Jason Sirotin, an independent consultant, handles information submitted through this website and the client workspace. It is a working draft and should not be relied upon until the launch review is complete.</p>
    <h2>Information collected</h2><p>Information may include contact and company details, intake answers, account and workspace activity, messages, files, testing reports, approvals, agreement records, billing references, technical logs, and information you choose to provide while receiving services.</p>
    <h2>How information is used</h2><p>Information is used to review requests, provide and improve consulting services, manage accounts and subscriptions, communicate with clients, protect the service, keep business records, and comply with legal obligations.</p>
    <h2>Service providers</h2><p>Authorized providers may process limited information for hosting, authentication, databases, file storage, email, payments, monitoring, and other approved operational needs. Current planned providers include Render, Supabase, Resend, and Stripe. Payment card details are handled by Stripe and are not stored in this application.</p>
    <h2>AI tools and sensitive information</h2><p>Do not submit passwords, payment card numbers, health information, government identifiers, or other regulated or highly sensitive information unless a specific written process has been approved. Client information is not intentionally submitted to an AI provider without an agreed use case and appropriate safeguards.</p>
    <h2>Retention and security</h2><p>Information is retained only as reasonably needed for service delivery, business records, security, dispute resolution, and legal compliance. Reasonable administrative and technical safeguards are used, but no online system can be guaranteed completely secure.</p>
    <h2>Your choices</h2><p>You may request access, correction, or deletion of appropriate information, subject to contractual, operational, and legal retention needs.</p>
    <h2>Contact</h2><p>Privacy questions may be sent to <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a>.</p>
  </article></div></main>;
}
