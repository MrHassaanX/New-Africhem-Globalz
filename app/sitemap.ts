import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";
import { chemicalFamilies, chemicalProducts } from "@/lib/chemical-catalogue";
import { otherBusinesses } from "@/lib/businesses";
export default function sitemap(): MetadataRoute.Sitemap { return indexable ? ["", "/products", ...chemicalFamilies.map(family => `/products/${family.slug}`), ...chemicalProducts.map(product => `/products/${product.family}/${product.slug}`), "/other-businesses", ...otherBusinesses.filter(business => business.status === "documented").map(business => `/other-businesses/${business.slug}`), "/how-it-works", "/global-reach", "/about", "/contact", "/privacy", "/terms"].map(path => ({ url: siteUrl + path })) : []; }
