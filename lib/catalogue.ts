import { clientContent } from "@/lib/content/company";

type ProductFields = {
  id: string;
  image?: string | null;
  casNumber?: string | null;
  grade?: string | null;
  purity?: string | null;
  application?: string | null;
  packaging?: string | null;
  origin?: string | null;
  specifications?: Record<string, string> | null;
};

export type NamedProduct = ProductFields & {
  status: "name-verified";
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  source: string;
};

export type PendingProduct = ProductFields & {
  status: "awaiting-confirmation";
  slug: null;
  name: null;
  category: null;
  shortDescription: null;
  source: null;
};

export type ProductPosition = NamedProduct | PendingProduct;

const clientSource = "docs/source/Africhem_Globalz_About_Us.docx — Our Pillars / Chemicals";

const namedProducts: NamedProduct[] = [
  {
    id: "white-spirit",
    slug: "white-spirit",
    name: clientContent.chemicalFocus.namedMaterials[0],
    category: "Solvents",
    shortDescription: "Solvent for paints and coatings.",
    image: "/materials/liquid-glass.webp",
    source: clientSource,
    status: "name-verified",
  },
  {
    id: "thinner",
    slug: "thinner",
    name: clientContent.chemicalFocus.namedMaterials[1],
    category: "Solvents",
    shortDescription: "Solvent for paints and coatings.",
    image: "/materials/industrial-fluid.webp",
    source: clientSource,
    status: "name-verified",
  },
];

const pendingProducts: PendingProduct[] = Array.from({ length: 8 }, (_, index) => ({
  id: `pending-${String(index + 3).padStart(2, "0")}`,
  image: ["/materials/chemical-transfer.webp", "/materials/mineral-crystal.webp", "/materials/hero-fluid.webp"][index] ?? null,
  slug: null,
  name: null,
  category: null,
  shortDescription: null,
  source: null,
  status: "awaiting-confirmation",
}));

export const products: readonly ProductPosition[] = [...namedProducts, ...pendingProducts];
