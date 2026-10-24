import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const alt = "Africhem Globalz — Industrial chemical sourcing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public/africhem-logo.png"));
  return new ImageResponse(<div style={{ background: "#f7f9fb", color: "#0b2a5b", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "75px", justifyContent: "space-between" }}>
    {/* ImageResponse uses HTML images rather than Next Image. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={"data:image/png;base64," + logo.toString("base64")} alt="" width={330} height={86} />
    <div style={{ display: "flex", flexDirection: "column", fontSize: 70, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Industrial chemicals,<span style={{ color: "#0b7c89" }}>sourced for your requirement.</span></div>
    <div style={{ display: "flex", fontSize: 21 }}>Product · Specification · Destination</div>
  </div>, size);
}

