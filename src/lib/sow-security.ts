import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { SowDocument } from "@/lib/sow";

export function hashSow(document: SowDocument) {
  return createHash("sha256").update(JSON.stringify(document)).digest("hex");
}

export function createAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(token: string, storedHash: string) {
  const supplied = Buffer.from(hashAccessToken(token), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return supplied.length === stored.length && timingSafeEqual(supplied, stored);
}
