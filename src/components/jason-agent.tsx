"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Bot, LoaderCircle, Mic, PhoneOff, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = { role: "user" | "agent"; text: string };

function AgentConversation() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [localError, setLocalError] = useState("");
  const pendingMessage = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversation = useConversation({
    onMessage: ({ role, message }) => setMessages((current) => [...current, { role, text: message }]),
    onError: (message) => setLocalError(message || "The assistant could not connect."),
  });
  const { sendUserMessage, status } = conversation;

  useEffect(() => {
    if (status !== "connected" || !pendingMessage.current) return;
    const message = pendingMessage.current;
    pendingMessage.current = null;
    sendUserMessage(message);
  }, [sendUserMessage, status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, conversation.isSpeaking]);

  async function startVoice() {
    setLocalError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      conversation.startSession({ connectionType: "webrtc" });
    } catch {
      setLocalError("Microphone access is needed for voice. You can still type below.");
    }
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setLocalError("");
    if (conversation.status === "connected") {
      conversation.sendUserMessage(text);
    } else {
      pendingMessage.current = text;
      conversation.startSession({ textOnly: true, connectionType: "websocket" });
    }
  }

  return <div className="agent-shell">
    {open && <section className="agent-panel" aria-label="AutomateMeJay AI assistant">
      <header>
        <div className="agent-avatar"><Bot size={19} /></div>
        <div><strong>Jason’s AI assistant</strong><span>{conversation.status === "connected" ? conversation.isSpeaking ? "Speaking" : "Ready" : conversation.status === "connecting" ? "Connecting" : "Voice + text"}</span></div>
        <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}><X size={18} /></button>
      </header>
      <div className="agent-disclosure">I’m an AI assistant inspired by Jason’s communication style—not Jason himself. I can explain the service and point you to Jason’s live consultation calendar.</div>
      <div className="agent-messages" ref={scrollRef} aria-live="polite">
        {messages.length === 0 && <div className="agent-welcome"><strong>What would you like to know?</strong><p>Ask about Jason, the agent-built portfolio, engagement options, or the free consultation.</p><a className="agent-book-link" href="/book">See live consultation times</a></div>}
        {messages.map((message, index) => <p className={`agent-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === "agent" ? "AI" : "You"}</span>{message.text}</p>)}
        {conversation.isSpeaking && <div className="agent-speaking"><i /><i /><i /><span>Jason’s AI is answering</span></div>}
      </div>
      {(localError || conversation.message) && <p className="agent-error" role="alert">{localError || conversation.message}</p>}
      <div className="agent-actions">
        {conversation.status === "connected" ? <button className="agent-voice-button end" type="button" onClick={() => conversation.endSession()}><PhoneOff size={16} /> End session</button> : <button className="agent-voice-button" type="button" onClick={() => void startVoice()} disabled={conversation.status === "connecting"}>{conversation.status === "connecting" ? <LoaderCircle className="spin" size={16} /> : <Mic size={16} />} Talk with Jason’s AI</button>}
      </div>
      <form className="agent-input" onSubmit={send}>
        <label className="sr-only" htmlFor="agent-message">Message Jason’s AI assistant</label>
        <input id="agent-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a question…" maxLength={1000} />
        <button type="submit" aria-label="Send message" disabled={!draft.trim() || conversation.status === "connecting"}><Send size={17} /></button>
      </form>
      <footer>Powered by ElevenLabs · Live booking is handled by Google Calendar</footer>
    </section>}
    <button className="agent-launcher" type="button" aria-expanded={open} aria-label={open ? "Close Jason's AI assistant" : "Open Jason's AI assistant"} onClick={() => setOpen((current) => !current)}>{open ? <X size={22} /> : <><span><Mic size={19} /></span><b>Ask Jason’s AI</b></>}</button>
  </div>;
}

function AgentUnavailable() {
  const [open, setOpen] = useState(false);
  return <div className="agent-shell">
    {open && <section className="agent-panel agent-unavailable"><header><div className="agent-avatar"><Bot size={19} /></div><div><strong>Jason’s AI assistant</strong><span>Setup in progress</span></div><button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}><X size={18} /></button></header><div className="agent-welcome"><strong>The assistant is being connected.</strong><p>In the meantime, email <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a> or book a free consultation.</p><a className="button button-primary" href="/book">Book a consultation</a></div></section>}
    <button className="agent-launcher" type="button" aria-expanded={open} aria-label={open ? "Close Jason's AI assistant" : "Open Jason's AI assistant"} onClick={() => setOpen((current) => !current)}><span><Mic size={19} /></span><b>Ask Jason’s AI</b></button>
  </div>;
}

export function JasonAgent({ agentId }: { agentId?: string }) {
  if (!agentId) return <AgentUnavailable />;
  return <ConversationProvider agentId={agentId}><AgentConversation /></ConversationProvider>;
}
