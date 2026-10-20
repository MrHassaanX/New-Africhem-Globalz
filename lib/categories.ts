import { clientContent } from "@/lib/content/company";

export type CategoryVisual = "chemicals" | "footwear" | "agro" | "recycling";
export type CategoryStatus = "confirmed-products" | "category-only";
export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  visual: CategoryVisual;
  businessPillar: (typeof clientContent.pillars)[number]["title"];
  subcategories: readonly { id: string; name: string; productIds: readonly string[] }[];
  productIds: readonly string[];
  status: CategoryStatus;
};

export const categories = [
  {
    id: "chemicals", slug: "chemicals", name: clientContent.pillars[0].title,
    description: clientContent.pillars[0].description, visual: "chemicals",
    businessPillar: clientContent.pillars[0].title,
    subcategories: [{ id: "solvents", name: "Solvents", productIds: ["white-spirit", "thinner"] }],
    productIds: ["white-spirit", "thinner"], status: "confirmed-products",
  },
  {
    id: "footwear", slug: "footwear", name: clientContent.pillars[1].title,
    description: clientContent.pillars[1].description, visual: "footwear",
    businessPillar: clientContent.pillars[1].title,
    subcategories: [], productIds: [], status: "category-only",
  },
  {
    id: "uganda-agro-exports", slug: "uganda-agro-exports", name: clientContent.pillars[2].title,
    description: clientContent.pillars[2].description, visual: "agro",
    businessPillar: clientContent.pillars[2].title,
    subcategories: [], productIds: ["roses", "pineapples"], status: "confirmed-products",
  },
  {
    id: "recycling", slug: "recycling", name: clientContent.pillars[3].title,
    description: clientContent.pillars[3].description, visual: "recycling",
    businessPillar: clientContent.pillars[3].title,
    subcategories: [], productIds: [], status: "category-only",
  },
 ] as const satisfies readonly Category[];

export type CategorySlug = (typeof categories)[number]["slug"];
export function getCategory(slug: string) { return categories.find(category => category.slug === slug); }
