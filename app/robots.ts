import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, ...(indexable ? { sitemap: siteUrl + "/sitemap.xml" } : {}) }; }
// Crawlers must be allowed to read the noindex response headers and metadata.
