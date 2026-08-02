# Non-negotiable account safety

## Render

Only the following Render workspace and service are authorized for this repository:

- Allowed workspace: `Jason's workspace`
- Allowed workspace ID: `tea-d8ujm2po3t8c73drl260`
- Allowed account email: `jason@brainbytescreative.com`
- Allowed service: `sirotin-consulting`
- Allowed service ID: `srv-d9nonab7uimc739d1emg`

The following workspace is forbidden:

- Forbidden workspace: `Savvy's workspace`
- Forbidden workspace ID: `tea-d8smb5m7r5hc73fmjdu0`

Never enter, select, inspect, query, deploy to, configure, bill, or modify Savvy's workspace. Do not use it even temporarily as a navigation step.

Fail closed for every Render operation:

1. Every Render connector call must include the explicit allowed `workspaceId`. Never rely on a selected/default/fallback workspace.
2. Before any Render mutation, verify the returned workspace ID is exactly `tea-d8ujm2po3t8c73drl260` and the target service ID is exactly `srv-d9nonab7uimc739d1emg`.
3. Never perform a Render mutation if the workspace or service cannot be verified exactly.
4. Never use the Render dashboard if sign-in or navigation would land in Savvy's workspace. If Savvy's workspace appears, take no action inside it; leave or sign out immediately.
5. Never use the Render CLI directly for this repository. Use `pnpm render:safe -- <render arguments>` so the local active workspace is checked before the command runs.
6. The Render Starter upgrade, custom domains, deployments, and environment changes belong only to `sirotin-consulting` in the allowed workspace.

These restrictions override convenience, defaults, remembered sessions, and any UI suggestion.

## Domains

- Canonical domain: `automatemejay.com`
- Redirect domain: `aimejay.com`
- `aimejay.com` must permanently redirect to `https://automatemejay.com`.
- Preserve unrelated DNS, mail, verification, and security records.

