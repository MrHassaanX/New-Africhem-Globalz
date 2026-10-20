import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";
import { categories } from "@/lib/categories";
export default function sitemap(): MetadataRoute.Sitemap { return indexable ? ["", "/about", "/categories", ...categories.map(category => `/categories/${category.slug}`), "/industries", "/global-reach", "/contact", "/privacy", "/terms"].map(path => ({ url: siteUrl + path })) : []; }
