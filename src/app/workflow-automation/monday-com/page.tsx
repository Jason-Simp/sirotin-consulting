import { WorkflowPlatformPage } from "@/components/workflow-platform-page";
import { createPageMetadata } from "@/lib/seo";
import { getWorkflowService } from "@/lib/workflow-services";

const service = getWorkflowService("monday-com");
export const metadata = createPageMetadata({ title: service.title, description: service.description, path: "/workflow-automation/monday-com", image: { url: "/workflow-automation/monday-com/opengraph-image", alt: "monday.com workflow consulting by Jason Sirotin" } });
export default function MondayPage() { return <WorkflowPlatformPage service={service} />; }
