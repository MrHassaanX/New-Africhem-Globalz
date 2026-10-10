import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const alt = "Africhem Globalz — Sourcing Simplified";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public/africhem-logo.png"));
  return new ImageResponse(<div style={{ background: "#f2ece1", color: "#10283a", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "75px", justifyContent: "space-between" }}>
    {/* ImageResponse uses HTML images rather than Next Image. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={"data:image/png;base64," + logo.toString("base64")} alt="" width={330} height={86} />
    <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 600, letterSpacing: -5, lineHeight: 1 }}>SOURCING<span style={{ color: "#07567c" }}>SIMPLIFIED.</span></div>
    <div style={{ display: "flex", fontSize: 21 }}>Chemical sourcing, trading and distribution.</div>
  </div>, size);
}

