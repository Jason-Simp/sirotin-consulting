import { SITE_URL } from "@/lib/seo";
import type { WorkflowService } from "@/lib/workflow-services";

export function workflowServiceSchema(service: WorkflowService) {
  const url = `${SITE_URL}/workflow-automation/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: service.title,
        description: service.description,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: { "@id": `${url}#primaryimage` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#service` },
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        url: `${url}/opengraph-image`,
        width: 1200,
        height: 630,
        caption: `${service.platform} workflow automation consulting with Jason Sirotin`,
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: `${service.platform} workflow automation consulting`,
        description: service.description,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "United States" },
        audience: { "@type": "BusinessAudience", audienceType: "Business owners and operating teams" },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AutomateMeJay", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Workflow automation", item: `${SITE_URL}/workflow-automation` },
          { "@type": "ListItem", position: 3, name: service.platform, item: url },
        ],
      },
    ],
  };
}
