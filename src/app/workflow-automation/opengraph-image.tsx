import { workflowOg } from "@/lib/workflow-og";

export const runtime = "edge";
export const alt = "Workflow automation consulting by Jason Sirotin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return workflowOg({ eyebrow: "Workflow automation consulting", title: "Make the work move.", accent: "Keep people in control." });
}
