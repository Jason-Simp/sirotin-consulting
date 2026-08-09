import { WorkflowPlatformPage } from "@/components/workflow-platform-page";
import { createPageMetadata } from "@/lib/seo";
import { getWorkflowService } from "@/lib/workflow-services";

const service = getWorkflowService("n8n");
export const metadata = createPageMetadata({ title: service.title, description: service.description, path: "/workflow-automation/n8n", image: { url: "/workflow-automation/n8n/opengraph-image", alt: "n8n automation consulting by Jason Sirotin" } });
export default function N8nPage() { return <WorkflowPlatformPage service={service} />; }
