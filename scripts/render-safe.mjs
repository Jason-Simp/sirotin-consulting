#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const ALLOWED_WORKSPACE_ID = "tea-d8ujm2po3t8c73drl260";
const FORBIDDEN_WORKSPACE_ID = "tea-d8smb5m7r5hc73fmjdu0";
const ALLOWED_SERVICE_ID = "srv-d9nonab7uimc739d1emg";

function fail(message) {
  console.error(`RENDER SAFETY BLOCK: ${message}`);
  process.exit(1);
}

const workspaceResult = spawnSync(
  "render",
  ["workspace", "current", "--output", "json"],
  { encoding: "utf8" },
);

if (workspaceResult.error) {
  fail(`unable to verify the active workspace (${workspaceResult.error.message})`);
}

if (workspaceResult.status !== 0) {
  fail("unable to verify the active workspace; no Render command was run");
}

let workspace;
try {
  workspace = JSON.parse(workspaceResult.stdout);
} catch {
  fail("Render returned an unreadable workspace response; no Render command was run");
}

if (workspace.id === FORBIDDEN_WORKSPACE_ID) {
  fail("Savvy's workspace is forbidden for this repository");
}

if (workspace.id !== ALLOWED_WORKSPACE_ID) {
  fail(
    `active workspace is ${workspace.name ?? "unknown"} (${workspace.id ?? "unknown"}), not the allowed Jason workspace ${ALLOWED_WORKSPACE_ID}`,
  );
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(
    `Render scope verified: ${workspace.name} (${workspace.id}); allowed service ${ALLOWED_SERVICE_ID}`,
  );
  process.exit(0);
}

const result = spawnSync("render", args, { stdio: "inherit" });
if (result.error) {
  fail(result.error.message);
}

process.exit(result.status ?? 1);
