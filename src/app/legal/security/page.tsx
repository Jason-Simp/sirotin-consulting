import type { Metadata } from "next";
import { SubpageHeader } from "@/components/subpage-header";

export const metadata: Metadata = { title: "Data and Security Notice", robots: { index: false, follow: false }, alternates: { canonical: "/legal/security" } };

export default function SecurityPage() {
  return <main className="subpage"><SubpageHeader /><div className="legal-page"><span className="legal-status">Draft pending professional review</span><h1>Data and Security Notice</h1><p className="legal-meta">Working version · August 2, 2026</p><article>
    <p>This notice describes the intended working model for client data. Final controls depend on the approved systems and engagement scope.</p>
    <h2>Client responsibility</h2><p>Clients decide what information may be shared, identify sensitive or regulated data before work begins, provide lawful access, maintain appropriate backups, review consequential outputs, approve production use, and monitor deployed automations.</p>
    <h2>Access and separation</h2><p>The client portal is designed to restrict client access to records belonging to their organization. Administrative privileges and service credentials are server-side. Row Level Security is applied to exposed database tables.</p>
    <h2>Third-party systems</h2><p>Automations may depend on third-party platforms selected or approved by the client. Their availability, privacy practices, and security controls are outside Jason’s direct control. Credentials should use least privilege and be revoked when no longer needed.</p>
    <h2>Human review</h2><p>AI-generated or automated outputs may be incomplete or incorrect. Appropriate human review is required for financial, legal, employment, safety, public, or otherwise consequential actions.</p>
    <h2>Incidents</h2><p>Suspected unauthorized access or data exposure related to the service should be reported promptly to <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a>. The parties will cooperate on reasonable containment and investigation steps.</p>
  </article></div></main>;
}
