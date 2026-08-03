"use client";

import dynamic from "next/dynamic";
import { Bot, Mic, X } from "lucide-react";
import { useState } from "react";

const AgentConversation = dynamic(
  () => import("@/components/jason-agent-conversation").then((module) => module.JasonAgentConversation),
  { ssr: false, loading: () => <section className="agent-panel agent-unavailable" aria-label="Loading Jason’s AI assistant"><div className="agent-welcome"><strong>Opening Jason’s AI…</strong></div></section> },
);

function AgentUnavailable() {
  const [open, setOpen] = useState(false);
  return <div className="agent-shell">
    {open && <section className="agent-panel agent-unavailable"><header><div className="agent-avatar"><Bot size={19} /></div><div><strong>Jason’s AI assistant</strong><span>Setup in progress</span></div><button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}><X size={18} /></button></header><div className="agent-welcome"><strong>The assistant is being connected.</strong><p>In the meantime, email <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a> or book a free consultation.</p><a className="button button-primary" href="/book">Book a consultation</a></div></section>}
    <button className="agent-launcher" type="button" aria-expanded={open} aria-label={open ? "Close Jason's AI assistant" : "Open Jason's AI assistant"} onClick={() => setOpen((current) => !current)}><span><Mic size={19} /></span><b>Ask Jason’s AI</b></button>
  </div>;
}

export function JasonAgent({ agentId }: { agentId?: string }) {
  if (!agentId) return <AgentUnavailable />;
  return <AgentAvailable agentId={agentId} />;
}

function AgentAvailable({ agentId }: { agentId: string }) {
  const [open, setOpen] = useState(false);
  return <div className="agent-shell">
    {open && <AgentConversation agentId={agentId} onClose={() => setOpen(false)} />}
    <button className="agent-launcher" type="button" aria-expanded={open} aria-label={open ? "Close Jason's AI assistant" : "Open Jason's AI assistant"} onClick={() => setOpen((current) => !current)}>{open ? <X size={22} /> : <><span><Mic size={19} /></span><b>Ask Jason’s AI</b></>}</button>
  </div>;
}
