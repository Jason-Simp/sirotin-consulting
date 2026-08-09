import { workflowOg } from "@/lib/workflow-og";

export const runtime = "edge";
export const alt = "monday.com workflow consulting by Jason Sirotin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return workflowOg({ eyebrow: "monday.com workflow consulting", title: "monday.com workflows your team can trust", accent: "and actually use.", platform: "monday.com" });
}
