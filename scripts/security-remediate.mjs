#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const AUDIT_LEVELS = new Set(["moderate", "high", "critical"]);
const WORKSPACE_PATH = new URL("../pnpm-workspace.yaml", import.meta.url);

function fail(message) {
  console.error(`SECURITY REPAIR BLOCK: ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    ...options,
  });

  if (result.error) {
    fail(`${command} could not run (${result.error.message})`);
  }

  return result;
}

function readAudit() {
  const result = run("corepack", ["pnpm", "audit", "--json"]);

  if (!result.stdout.trim()) {
    fail("pnpm audit returned no JSON output");
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    fail("pnpm audit returned unreadable JSON");
  }
}

function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value);
  return match ? match.slice(1).map(Number) : null;
}

function minimumPatchedVersion(range) {
  const match = /(?:^|\s)>=?\s*(\d+\.\d+\.\d+)(?:\s|$)/.exec(range);
  return match?.[1] ?? null;
}

function isDirectPath(path, moduleName) {
  return path === `.>${moduleName}`;
}

function setWorkspaceOverride(moduleName, target) {
  const workspace = readFileSync(WORKSPACE_PATH, "utf8");
  const overrideBlock = /^overrides:\n((?: {2}[^\n]+\n)*)/m;
  const blockMatch = overrideBlock.exec(workspace);

  if (!blockMatch) {
    fail("pnpm-workspace.yaml has no overrides block; explicit review is required");
  }

  const keyPattern = moduleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const existingLine = new RegExp(`^  ${keyPattern}: [^\\n]+$`, "m");
  const nextLine = `  ${moduleName}: ${target}`;
  const nextWorkspace = existingLine.test(workspace)
    ? workspace.replace(existingLine, nextLine)
    : workspace.replace(overrideBlock, `overrides:\n${blockMatch[1]}${nextLine}\n`);

  writeFileSync(WORKSPACE_PATH, nextWorkspace);
}

const initialAudit = readAudit();
const advisories = Object.values(initialAudit.advisories ?? {}).filter((advisory) =>
  AUDIT_LEVELS.has(advisory.severity),
);

if (advisories.length === 0) {
  console.log("Security repair: no moderate-or-higher advisories found.");
  process.exit(0);
}

const repairs = new Map();

for (const advisory of advisories) {
  const moduleName = advisory.module_name;
  const target = minimumPatchedVersion(advisory.patched_versions);

  if (!moduleName || !target) {
    fail(`advisory ${advisory.id ?? "unknown"} has no exact minimum patched version`);
  }

  const targetParts = parseVersion(target);
  if (!targetParts) {
    fail(`patched version ${target} for ${moduleName} is not a stable semantic version`);
  }

  const findings = advisory.findings ?? [];
  if (findings.length === 0) {
    fail(`advisory ${advisory.id ?? "unknown"} has no dependency findings`);
  }

  for (const finding of findings) {
    if ((finding.paths ?? []).some((path) => isDirectPath(path, moduleName))) {
      fail(`${moduleName} is a direct dependency and requires explicit review`);
    }

    const currentParts = parseVersion(finding.version);
    if (!currentParts) {
      fail(`installed version ${finding.version} for ${moduleName} is not a stable semantic version`);
    }

    if (currentParts[0] !== targetParts[0] || currentParts[1] !== targetParts[1]) {
      fail(
        `${moduleName} requires a minor or major change (${finding.version} -> ${target}); explicit review is required`,
      );
    }

    if (targetParts[2] <= currentParts[2]) {
      fail(`${moduleName} advisory does not provide a newer patch (${finding.version} -> ${target})`);
    }
  }

  const existingTarget = repairs.get(moduleName);
  if (existingTarget && existingTarget !== target) {
    fail(`${moduleName} has conflicting patched versions (${existingTarget} and ${target})`);
  }

  repairs.set(moduleName, target);
}

for (const [moduleName, target] of repairs) {
  setWorkspaceOverride(moduleName, target);
  console.log(`Security repair: pinning transitive ${moduleName} to ${target}.`);
}

const installResult = run("corepack", ["pnpm", "install", "--lockfile-only"], { stdio: "inherit" });
if (installResult.status !== 0) {
  fail("pnpm could not refresh the lockfile after the patch-level override");
}

const finalAudit = readAudit();
const remaining = Object.values(finalAudit.advisories ?? {}).filter((advisory) =>
  AUDIT_LEVELS.has(advisory.severity),
);

if (remaining.length > 0) {
  fail(`${remaining.length} moderate-or-higher advisories remain after repair`);
}

console.log("Security repair: audit is clean after bounded patch-level remediation.");
