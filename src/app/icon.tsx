import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#151713", color: "#d8ff52", fontSize: 21, fontWeight: 700, letterSpacing: "-1px" }}>JS</div>,
    size,
  );
}
