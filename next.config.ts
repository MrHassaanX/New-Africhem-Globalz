import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/categories", destination: "/products", permanent: true },
      { source: "/categories/chemicals", destination: "/products/thinners-and-white-spirit", permanent: true },
      { source: "/categories/footwear", destination: "/other-businesses/footwear", permanent: true },
      { source: "/categories/uganda-agro-exports", destination: "/other-businesses/agro", permanent: true },
      { source: "/categories/recycling", destination: "/other-businesses/scrap-recycling", permanent: true },
      { source: "/industries", destination: "/other-businesses", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ...(process.env.SITE_INDEXABLE !== "true" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
    ] }];
  },
};
export default config;
