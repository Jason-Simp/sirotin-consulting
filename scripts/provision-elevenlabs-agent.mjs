import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.ELEVENLABS_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
const explicitVoiceId = process.env.ELEVENLABS_JASON_VOICE_ID;
const voiceName = process.env.ELEVENLABS_JASON_VOICE_NAME ?? "Jason Sirotin";
const existingAgentId = process.env.ELEVENLABS_AGENT_ID;
const toolIds = [process.env.ELEVENLABS_AVAILABILITY_TOOL_ID, process.env.ELEVENLABS_BOOKING_TOOL_ID].filter(Boolean);

if (!apiKey) throw new Error("Set ELEVENLABS_API_KEY before provisioning.");

async function eleven(pathname, init = {}) {
  const response = await fetch(`https://api.elevenlabs.io${pathname}`, {
    ...init,
    headers: { "xi-api-key": apiKey, ...(init.body instanceof FormData ? {} : { "content-type": "application/json" }), ...init.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`ElevenLabs ${pathname} failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

async function resolveVoiceId() {
  if (explicitVoiceId) return explicitVoiceId;
  const result = await eleven("/v2/voices?page_size=100");
  const voices = result.voices ?? [];
  const exact = voices.find((voice) => voice.name?.trim().toLowerCase() === voiceName.trim().toLowerCase());
  if (!exact?.voice_id) throw new Error(`No ElevenLabs voice named \"${voiceName}\" was found. Set ELEVENLABS_JASON_VOICE_ID explicitly.`);
  return exact.voice_id;
}

const root = process.cwd();
const knowledgePath = path.join(root, "knowledge", "automate-me-jay-public-agent-kb.md");
const promptPath = path.join(root, "knowledge", "agent-system-prompt.md");
const [knowledge, prompt, voiceId] = await Promise.all([
  fs.readFile(knowledgePath),
  fs.readFile(promptPath, "utf8"),
  resolveVoiceId(),
]);

const form = new FormData();
form.append("file", new Blob([knowledge], { type: "text/markdown" }), "automate-me-jay-public-agent-kb.md");
const uploaded = await eleven("/v1/convai/knowledge-base/file", { method: "POST", body: form });
const knowledgeId = uploaded.id;
if (!knowledgeId) throw new Error("ElevenLabs did not return a knowledge base document ID.");

const agentConfig = {
  name: "AutomateMeJay — Jason's AI Assistant",
  conversation_config: {
    agent: {
      first_message: "Hi—I'm Jason's AI assistant, not Jason himself. I can answer questions about AutomateMeJay, the work, pricing, or help you book a free 30-minute consultation. What would be useful?",
      language: "en",
      prompt: {
        prompt,
        llm: "gemini-2.5-flash",
        knowledge_base: [{ type: "file", name: "AutomateMeJay public knowledge", id: knowledgeId, usage_mode: "auto" }],
        tool_ids: toolIds,
      },
    },
    tts: { voice_id: voiceId },
  },
  platform_settings: {
    widget: { variant: "full" },
  },
  tags: ["automatemejay", "website", "jason-sirotin"],
};

const result = existingAgentId
  ? await eleven(`/v1/convai/agents/${existingAgentId}`, { method: "PATCH", body: JSON.stringify(agentConfig) })
  : await eleven("/v1/convai/agents/create", { method: "POST", body: JSON.stringify(agentConfig) });

const agentId = result.agent_id ?? existingAgentId;
console.log(JSON.stringify({ agentId, knowledgeId, voiceName, siteUrl, toolIdsAttached: toolIds.length }, null, 2));
console.log(`Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID=${agentId} on Render after verifying the agent in ElevenLabs.`);
