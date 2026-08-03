import type { SowDocument as SowDocumentData } from "@/lib/sow";

type Signature = { name: string; title?: string | null; signedAt?: string | null };

export function SowDocument({ document, client, consultant }: {
  document: SowDocumentData;
  client?: Signature & { company?: string | null };
  consultant?: Signature;
}) {
  return <article className="sow-document">
    <header>
      <p className="section-label">/ Statement of work</p>
      <h1>{document.title}</h1>
      <dl className="sow-facts">
        <div><dt>Version</dt><dd>{document.version}</dd></div>
        <div><dt>Fee</dt><dd>{document.fee}</dd></div>
        <div><dt>Service period</dt><dd>{document.cadence}</dd></div>
        <div><dt>Published</dt><dd>{document.effectiveDate}</dd></div>
        <div><dt>Terms incorporated</dt><dd>Version {document.termsVersion}</dd></div>
      </dl>
      <p className="sow-summary">{document.summary}</p>
    </header>
    {document.sections.map((section) => <section key={section.heading}>
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
    </section>)}
    {(client || consultant) && <section className="sow-signatures">
      <h2>Signature record</h2>
      <div>
        <div><span>Client</span><strong>{client?.name ?? "Awaiting signature"}</strong>{client?.title && <small>{client.title}{client.company ? ` · ${client.company}` : ""}</small>}{client?.signedAt && <small>Signed {new Date(client.signedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</small>}</div>
        <div><span>Consultant</span><strong>{consultant?.name ?? "Awaiting counter-signature"}</strong>{consultant?.title && <small>{consultant.title}</small>}{consultant?.signedAt && <small>Signed {new Date(consultant.signedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</small>}</div>
      </div>
    </section>}
  </article>;
}
