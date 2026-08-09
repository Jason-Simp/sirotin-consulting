import { ImageResponse } from "next/og";

export function workflowOg({ eyebrow, title, accent, platform }: { eyebrow: string; title: string; accent: string; platform?: string }) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "68px 76px", color: "#f7fbff", background: "linear-gradient(135deg,#02070d 0%,#061522 60%,#14143b 100%)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, fontWeight: 700 }}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, borderRadius: 27, border: "2px solid #20d8f5", color: "#20d8f5", fontSize: 20 }}>JS</span>Jason Sirotin</div>
        <div style={{ display: "flex", padding: "12px 20px", border: "1px solid #26465b", borderRadius: 30, color: "#a8bac8", fontSize: 18 }}>{platform ?? "Workflow automation"}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div style={{ display: "flex", color: "#20d8f5", fontSize: 19, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 25 }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 71, lineHeight: 1.02, fontWeight: 800, letterSpacing: -3 }}><span>{title}</span><span style={{ color: "#37c7ff" }}>{accent}</span></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#9eb0bf", fontSize: 19 }}>
        <span>MAP</span><span style={{ color: "#20d8f5" }}>→</span><span>BUILD</span><span style={{ color: "#20d8f5" }}>→</span><span>TEST</span><span style={{ color: "#20d8f5" }}>→</span><span>OPERATE</span><span style={{ marginLeft: "auto" }}>automatemejay.com</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
