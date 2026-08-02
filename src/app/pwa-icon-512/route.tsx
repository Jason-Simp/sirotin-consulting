import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #07101b, #10152e)", color: "#e8fbff", fontSize: 168, fontWeight: 700, letterSpacing: "-10px" }}>JS</div>,
    { width: 512, height: 512 },
  );
}
