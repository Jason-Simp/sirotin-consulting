import { workflowOg } from "@/lib/workflow-og";

export const runtime = "edge";
export const alt = "n8n workflow automation consulting by Jason Sirotin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return workflowOg({ eyebrow: "n8n automation consulting", title: "n8n workflows that keep working", accent: "after the demo.", platform: "n8n" });
}
