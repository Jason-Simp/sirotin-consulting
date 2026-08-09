import { AlertTriangle, Bot, Check, Database, FileInput, Mail, ShieldCheck, UserCheck, Webhook, Zap } from "lucide-react";

function Node({ className = "", icon: Icon, eyebrow, label }: { className?: string; icon: typeof Zap; eyebrow: string; label: string }) {
  return <div className={`wf-node ${className}`}><span><Icon size={15} /></span><div><small>{eyebrow}</small><strong>{label}</strong></div></div>;
}

export function N8nCanvas() {
  return <div className="wf-canvas wf-n8n-canvas" aria-label="Illustration of a controlled n8n workflow">
    <div className="wf-window-bar"><span /><span /><span /><b>PRODUCTION / LEAD INTAKE</b><i>LIVE</i></div>
    <div className="wf-grid-lines" />
    <Node className="n1" icon={Webhook} eyebrow="TRIGGER" label="New request" />
    <Node className="n2" icon={FileInput} eyebrow="NORMALIZE" label="Validate data" />
    <Node className="n3" icon={Bot} eyebrow="BOUNDED AI" label="Classify need" />
    <Node className="n4" icon={UserCheck} eyebrow="HUMAN GATE" label="Approve action" />
    <Node className="n5" icon={Database} eyebrow="SYSTEM OF RECORD" label="Create record" />
    <Node className="n6" icon={Mail} eyebrow="PROVIDER" label="Send follow-up" />
    <Node className="error" icon={AlertTriangle} eyebrow="ERROR PATH" label="Return to owner" />
    <div className="wf-connector c1" /><div className="wf-connector c2" /><div className="wf-connector c3" /><div className="wf-connector c4" /><div className="wf-connector c5" /><div className="wf-error-line" />
    <div className="wf-execution"><span><Check size={13} /> Last execution passed</span><b>00:01.842</b></div>
  </div>;
}

export function MondayBoard() {
  const rows = [
    { task: "New website inquiry", owner: "JS", status: "Review", color: "yellow", evidence: "Form #1842" },
    { task: "CRM follow-up", owner: "AM", status: "Approved", color: "green", evidence: "msg_72A…" },
    { task: "Client onboarding", owner: "TK", status: "Building", color: "blue", evidence: "Board #461" },
    { task: "Database request", owner: "JS", status: "Blocked", color: "red", evidence: "Needs access" },
  ];
  return <div className="wf-canvas wf-monday-board" aria-label="Illustration of a governed monday.com operating board">
    <div className="wf-board-top"><div><b>Client delivery</b><small>OPERATIONS WORKSPACE</small></div><span><Zap size={13} /> 8 automations</span></div>
    <div className="wf-board-tabs"><b>Main table</b><span>My work</span><span>Exceptions</span><i>•••</i></div>
    <div className="wf-table-head"><span>WORK ITEM</span><span>OWNER</span><span>STATUS</span><span>EVIDENCE</span></div>
    <div className="wf-board-group"><strong><i /> Active work <small>4</small></strong>{rows.map((row) => <div className="wf-board-row" key={row.task}><span>{row.task}</span><span className="wf-avatar">{row.owner}</span><span><b className={`wf-status ${row.color}`}>{row.status}</b></span><span>{row.evidence}</span></div>)}</div>
    <div className="wf-board-rule"><Zap size={14} /><span>When status changes to Approved</span><i>→</i><span>run verified handoff</span><b>ON</b></div>
  </div>;
}

export function WorkflowSystemMap() {
  return <div className="wf-system-map" aria-label="Map showing business inputs routed through human control and automation">
    <div className="wf-map-orbit orbit-one" /><div className="wf-map-orbit orbit-two" />
    <Node className="map-email" icon={Mail} eyebrow="INPUT" label="Inbox" />
    <Node className="map-form" icon={FileInput} eyebrow="INPUT" label="Forms" />
    <Node className="map-data" icon={Database} eyebrow="SOURCE" label="Business data" />
    <div className="wf-map-core"><ShieldCheck size={24} /><small>CONTROL LAYER</small><strong>Human authority</strong><span>rules · approval · evidence</span></div>
    <Node className="map-n8n" icon={Webhook} eyebrow="ORCHESTRATE" label="n8n" />
    <Node className="map-monday" icon={Zap} eyebrow="OPERATE" label="monday.com" />
    <div className="wf-map-legend"><span><i className="cyan" /> system signal</span><span><i className="violet" /> human decision</span></div>
  </div>;
}
