import { timingSafeEqual } from "node:crypto";

export function isAuthorizedAgentToolRequest(request: Request) {
  const expected = process.env.AGENT_TOOL_SECRET;
  const provided = request.headers.get("x-agent-tool-secret")
    ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !provided) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
}
