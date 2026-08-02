import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SubpageHeader() {
  return <header className="subpage-header"><Link href="/"><ArrowLeft size={16} /> Back to the site</Link><span>Jason Sirotin / AI Automation Partner</span></header>;
}
