import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { return indexable ? ["", "/about", "/products", "/industries", "/global-reach", "/contact", "/privacy", "/terms"].map(path => ({ url: siteUrl + path })) : []; }
