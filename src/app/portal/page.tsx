import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Files,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ReceiptText,
  Send,
  ShieldCheck,
  Upload,
  Wrench,
} from "lucide-react";
import { hasSupabaseConfig } from "@/lib/env";
import { provisionClientWorkspace } from "@/lib/provision-client-workspace";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  openBillingPortal,
  sendWorkspaceMessage,
  signOut,
  submitTestingReport,
  submitWorkspaceApproval,
  uploadWorkspaceFile,
} from "./actions";

export const metadata: Metadata = { title: "Client Workspace", robots: { index: false, follow: false }, alternates: { canonical: "/portal" } };

function formatDate(value: string | null | undefined) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default async function PortalPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!hasSupabaseConfig()) return <main className="portal-shell"><div className="portal-empty"><Wrench size={30} /><h1>The workspace foundation is ready.</h1><p>Supabase credentials are required to activate client accounts and private data.</p><Link className="button button-dark" href="/">Return home</Link></div></main>;

  const params = await searchParams;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;
  if (!userId) redirect("/sign-in");

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("full_name,email").eq("id", userId).maybeSingle(),
    supabase.from("organization_members").select("organization_id,can_view_billing,can_test,can_approve,member_role").eq("user_id", userId).eq("active", true).limit(1).maybeSingle(),
  ]);

  if (!membership) {
    const accountEmail = typeof authData.claims.email === "string" ? authData.claims.email.toLowerCase() : "";
    if (accountEmail === "jason@simplsolutions.app" || accountEmail === "sirotin@ecgprod.com") {
      await provisionClientWorkspace({
        supabase: createAdminClient(),
        email: accountEmail,
        fullName: "Jason Sirotin",
        companyName: "AutomateMeJay Workspace Preview",
        problem: "Preview how a client defines a recurring workflow and keeps the work in one place.",
        desiredOutcome: "Verify communication, files, testing, approvals, and billing access from a client perspective.",
        systemsInvolved: "AutomateMeJay, Supabase, Resend, Stripe",
      });
      redirect("/portal");
    }
    return <main className="portal-shell portal-shell-single"><section className="portal-empty portal-awaiting"><ShieldCheck size={34} /><p className="section-label">/ Private client workspace</p><h1>Your account is secure. No workspace has been activated yet.</h1><p>After you begin a protected first week or monthly engagement, Jason activates your organization here. This is where messages, files, testing, approvals, signed work, and billing live.</p><div className="button-row"><Link className="button button-primary" href="/start">Start protected</Link><Link className="button button-secondary" href="/book">Book a consultation</Link></div><form action={signOut}><button className="portal-text-button" type="submit"><LogOut size={15} /> Sign out</button></form></section></main>;
  }

  const [{ data: organization }, { data: subscription }, { data: workspaces }] = await Promise.all([
    supabase.from("organizations").select("name,status").eq("id", membership.organization_id).maybeSingle(),
    supabase.from("subscriptions").select("plan,status,current_period_end,stripe_customer_id").eq("organization_id", membership.organization_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("workspaces").select("id,name,problem,desired_outcome,success_definition,systems_involved,status,position,next_action,latest_summary,updated_at").eq("organization_id", membership.organization_id).order("created_at", { ascending: true }),
  ]);

  const workspace = workspaces?.find((item) => item.position === "active") ?? workspaces?.[0];
  const canManageBilling = Boolean(subscription?.stripe_customer_id && (membership.can_view_billing || membership.member_role === "primary_contact"));

  let messages: Array<{ id: string; sender_id: string; body: string; message_type: string; created_at: string }> = [];
  let notes: Array<{ id: string; title: string; body: string; note_type: string; pinned: boolean; created_at: string }> = [];
  let files: Array<{ id: string; original_name: string; description: string | null; size_bytes: number | null; storage_path: string; created_at: string; downloadUrl?: string }> = [];
  let reports: Array<{ id: string; iteration_name: string; expected_result: string | null; actual_result: string | null; comments: string | null; created_at: string }> = [];
  let approvals: Array<{ id: string; iteration_name: string; approval_type: string; comments: string | null; created_at: string }> = [];

  if (workspace) {
    const [messageResult, noteResult, fileResult, reportResult, approvalResult] = await Promise.all([
      supabase.from("messages").select("id,sender_id,body,message_type,created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: true }).limit(100),
      supabase.from("notes").select("id,title,body,note_type,pinned,created_at").eq("workspace_id", workspace.id).eq("client_visible", true).order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(20),
      supabase.from("files").select("id,original_name,description,size_bytes,storage_path,created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false }).limit(30),
      supabase.from("testing_reports").select("id,iteration_name,expected_result,actual_result,comments,created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("approvals").select("id,iteration_name,approval_type,comments,created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false }).limit(20),
    ]);
    messages = messageResult.data ?? [];
    notes = noteResult.data ?? [];
    reports = reportResult.data ?? [];
    approvals = approvalResult.data ?? [];
    files = await Promise.all((fileResult.data ?? []).map(async (file) => {
      const { data } = await supabase.storage.from("client-files").createSignedUrl(file.storage_path, 600);
      return { ...file, downloadUrl: data?.signedUrl };
    }));
  }

  const senderIds = [...new Set(messages.map((message) => message.sender_id))];
  const { data: senders } = senderIds.length ? await supabase.from("profiles").select("id,full_name,email,role").in("id", senderIds) : { data: [] };
  const senderMap = new Map((senders ?? []).map((sender) => [sender.id, sender]));
  const error = typeof params.error === "string" ? params.error : null;

  return <main className="portal-shell">
    <aside className="portal-nav">
      <Link href="/" className="wordmark"><span>JS</span><strong>Client workspace</strong></Link>
      <nav aria-label="Workspace navigation">
        <a className="active" href="#dashboard"><LayoutDashboard size={17} /> Overview</a>
        <a href="#messages"><MessageSquareText size={17} /> Communication</a>
        <a href="#files"><Files size={17} /> Files</a>
        <a href="#testing"><ClipboardCheck size={17} /> Testing</a>
        <a href="#approvals"><FileCheck2 size={17} /> Approvals</a>
        <a href="#billing"><ReceiptText size={17} /> Billing</a>
      </nav>
      <form action={signOut}><button type="submit"><LogOut size={16} /> Sign out</button></form>
    </aside>

    <section className="portal-content">
      <header className="portal-mobile-header"><Link href="/" className="wordmark"><span>JS</span><strong>Workspace</strong></Link><form action={signOut}><button type="submit" aria-label="Sign out"><LogOut size={18} /></button></form></header>
      <section id="dashboard" className="portal-intro">
        <p className="section-label">/ {organization?.name ?? "Client workspace"}</p>
        <h1>Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</h1>
        <p>This is the source of truth for your active work—not a generic dashboard. Messages, decisions, files, testing, approvals, and billing stay together.</p>
      </section>

      {error ? <div className="portal-alert">That action could not be completed. Nothing was lost; please review the fields and try again.</div> : null}

      {!workspace ? <section className="portal-card portal-no-work"><Activity size={24} /><h2>Your organization is active. The first workstream is being prepared.</h2><p>Jason will add the problem, desired outcome, next action, and working files here.</p></section> : <>
        <section className="portal-status-grid" aria-label="Workspace status">
          <div><span>Active workstream</span><strong>{workspace.name}</strong></div>
          <div><span>Status</span><strong>{workspace.status.replaceAll("_", " ")}</strong></div>
          <div><span>Next action</span><strong>{workspace.next_action ?? "Review together"}</strong></div>
          <div><span>Last updated</span><strong>{formatDate(workspace.updated_at)}</strong></div>
        </section>

        <section className="portal-card portal-brief">
          <div><p className="eyebrow">The problem</p><p>{workspace.problem ?? "Being defined with Jason."}</p></div>
          <div><p className="eyebrow">Useful outcome</p><p>{workspace.desired_outcome ?? workspace.success_definition ?? "Being defined with Jason."}</p></div>
          <div><p className="eyebrow">Current summary</p><p>{workspace.latest_summary ?? "Updates will appear as the work progresses."}</p></div>
        </section>

        <section id="messages" className="portal-section">
          <div className="portal-section-heading"><MessageSquareText /><div><p className="section-label">/ Communication center</p><h2>Keep the work moving without another meeting.</h2><p>Ask questions, report what happened, or make a decision. Every message stays attached to this workstream.</p></div></div>
          {notes.length ? <div className="portal-notes" aria-label="Project notes">{notes.slice(0, 3).map((note) => <article key={note.id}><span>{note.pinned ? "Pinned update" : note.note_type.replaceAll("_", " ")}</span><strong>{note.title}</strong><p>{note.body}</p></article>)}</div> : null}
          <div className="portal-thread">
            {messages.length ? messages.map((message) => {
              const sender = senderMap.get(message.sender_id);
              const mine = message.sender_id === userId;
              return <article key={message.id} className={mine ? "portal-message mine" : "portal-message"}><header><strong>{mine ? "You" : sender?.full_name ?? "Jason"}</strong><span>{message.message_type.replaceAll("_", " ")} · {formatDateTime(message.created_at)}</span></header><p>{message.body}</p></article>;
            }) : <div className="portal-empty-list"><MessageSquareText size={22} /><p>No messages yet. Start the conversation below.</p></div>}
            <form className="portal-compose" action={sendWorkspaceMessage}><input type="hidden" name="workspaceId" value={workspace.id} /><label htmlFor="workspace-message">Message Jason and your project team</label><textarea id="workspace-message" name="body" required minLength={1} maxLength={20000} placeholder="Share a question, result, decision, or change…" /><button className="button button-primary" type="submit">Send message <Send size={16} /></button></form>
          </div>
        </section>

        <section id="files" className="portal-section portal-two-column">
          <div><div className="portal-section-heading compact"><Files /><div><p className="section-label">/ Files</p><h2>Working materials</h2></div></div><div className="portal-list">{files.length ? files.map((file) => <a key={file.id} href={file.downloadUrl} className="portal-list-item" target="_blank" rel="noreferrer"><Files size={17} /><span><strong>{file.original_name}</strong><small>{file.description ?? `${Math.max(1, Math.round((file.size_bytes ?? 0) / 1024))} KB`} · {formatDate(file.created_at)}</small></span><ArrowUpRight size={16} /></a>) : <p className="portal-empty-copy">No files have been shared yet.</p>}</div></div>
          <form className="portal-mini-form" action={uploadWorkspaceFile}><input type="hidden" name="workspaceId" value={workspace.id} /><Upload /><h3>Share a file</h3><p>PDF, PNG, JPG, TXT, CSV, Word, or Excel. Maximum 10 MB.</p><label>File<input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.docx,.xlsx" /></label><label>Description <span>Optional</span><input name="description" type="text" maxLength={500} /></label><button className="button button-secondary" type="submit">Upload securely</button></form>
        </section>

        <section id="testing" className="portal-section portal-two-column">
          <div><div className="portal-section-heading compact"><ClipboardCheck /><div><p className="section-label">/ Testing</p><h2>Report what actually happened.</h2></div></div><div className="portal-list">{reports.length ? reports.map((report) => <article className="portal-list-item static" key={report.id}><ClipboardCheck size={17} /><span><strong>{report.iteration_name}</strong><small>{formatDate(report.created_at)}</small><p>Expected: {report.expected_result}<br />Actual: {report.actual_result}{report.comments ? <><br />Notes: {report.comments}</> : null}</p></span></article>) : <p className="portal-empty-copy">No test reports yet.</p>}</div></div>
          {membership.can_test ? <form className="portal-mini-form" action={submitTestingReport}><ClipboardCheck /><h3>Submit a test result</h3><input type="hidden" name="workspaceId" value={workspace.id} /><label>Iteration<input name="iterationName" required minLength={2} maxLength={160} placeholder="Example: Email follow-up v2" /></label><label>Expected result<textarea name="expectedResult" required minLength={2} maxLength={5000} /></label><label>Actual result<textarea name="actualResult" required minLength={2} maxLength={5000} /></label><label>Notes <span>Optional</span><textarea name="comments" maxLength={5000} /></label><button className="button button-primary" type="submit">Submit test</button></form> : null}
        </section>

        <section id="approvals" className="portal-section portal-two-column">
          <div><div className="portal-section-heading compact"><FileCheck2 /><div><p className="section-label">/ Decisions + approvals</p><h2>Keep consequential choices explicit.</h2></div></div><div className="portal-list">{approvals.length ? approvals.map((approval) => <article className="portal-list-item static" key={approval.id}><CheckCircle2 size={17} /><span><strong>{approval.iteration_name}</strong><small>{approval.approval_type.replaceAll("_", " ")} · {formatDate(approval.created_at)}</small>{approval.comments ? <p>{approval.comments}</p> : null}</span></article>) : <p className="portal-empty-copy">No approvals have been recorded yet.</p>}</div></div>
          {membership.can_approve ? <form className="portal-mini-form" action={submitWorkspaceApproval}><FileCheck2 /><h3>Record a decision</h3><input type="hidden" name="workspaceId" value={workspace.id} /><label>Iteration or deliverable<input name="iterationName" required minLength={2} maxLength={160} /></label><label>Decision<select name="approvalType" defaultValue="approved_for_next_step"><option value="approved_for_next_step">Approve next step</option><option value="approved_for_production">Approve for production</option><option value="changes_requested">Request changes</option></select></label><label>Comments <span>Optional</span><textarea name="comments" maxLength={5000} /></label><button className="button button-primary" type="submit">Record decision</button></form> : <div className="portal-mini-form portal-permission-note"><ShieldCheck /><h3>Approval access</h3><p>Your directing contact records formal approvals. You can still report testing results and send messages.</p></div>}
        </section>
      </>}

      <section id="billing" className="portal-card billing-card"><ReceiptText size={22} /><div><p className="eyebrow">Membership billing</p><h2>{subscription ? `${subscription.plan} partner` : "No recurring membership"}</h2><p>{subscription ? `Status: ${subscription.status.replaceAll("_", " ")}. Current paid period ends ${formatDate(subscription.current_period_end)}. Payment details, invoices, and cancellation are handled securely by Stripe.` : "Recurring billing appears after a monthly engagement begins."}</p></div>{canManageBilling ? <form action={openBillingPortal}><button className="button button-primary" type="submit">Manage membership <ArrowUpRight size={16} /></button></form> : <Link className="button button-secondary" href="mailto:hello@automatemejay.com">Billing help</Link>}</section>
    </section>
  </main>;
}
