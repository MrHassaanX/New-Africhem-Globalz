// Only names documented in the company-supplied source are public product entries.
export type ChemicalDocument = {
  type: "COA" | "TDS" | "SDS";
  title: string;
  url: string;
  productSpecific: boolean;
  approved: boolean;
};

export type ChemicalProduct = {
  slug: string;
  name: string;
  family: string;
  source: string;
  typicalUse?: string;
  grade?: string;
  properties?: readonly { name: string; value: string; method?: string }[];
  packaging?: string;
  minimumOrder?: string;
  leadTime?: string;
  origin?: string;
  handling?: string;
  shippingRequirements?: string;
  documents: readonly ChemicalDocument[];
};

export const chemicalFamilies = [
  { slug: "paints-and-coatings", name: "Paints & Coatings", description: "Talk to us about materials for paints and coatings, with your required specification and destination.", image: "/stock/industrial-refinery.webp" },
  { slug: "petrochemicals", name: "Petrochemicals", description: "Share the petrochemical material, grade and volume you need so we can review the request.", image: "/stock/industrial-tanks-sunset.webp" },
  { slug: "polymers", name: "Polymers", description: "Bring your polymer grade and application requirements to a sourcing conversation.", image: "/materials/mineral-crystal.webp" },
  { slug: "industrial-chemicals", name: "Industrial Chemicals", description: "Discuss industrial chemical requirements, documentation and destination with our team.", image: "/materials/chemical-transfer.webp" },
  { slug: "thinners-and-white-spirit", name: "Thinners & White Spirit", description: "The currently named chemical products are White Spirit and Thinner for paints and coatings.", image: "/materials/liquid-glass.webp" },
] as const;

export type ChemicalFamilySlug = (typeof chemicalFamilies)[number]["slug"];
export const getChemicalFamily = (slug: string) => chemicalFamilies.find(family => family.slug === slug);

const source = "docs/source/Africhem_Globalz_About_Us.docx — Our Pillars / Chemicals";
export const chemicalProducts: readonly ChemicalProduct[] = [
  { slug: "white-spirit", name: "White Spirit", family: "thinners-and-white-spirit", source, typicalUse: "Solvent for paints and coatings.", documents: [] },
  { slug: "thinner", name: "Thinner", family: "thinners-and-white-spirit", source, typicalUse: "Solvent for paints and coatings.", documents: [] },
];
export const getChemicalProduct = (family: string, product: string) => chemicalProducts.find(item => item.family === family && item.slug === product);
export const approvedDocuments = (product: ChemicalProduct) => product.documents.filter(document => document.approved && document.url.startsWith("/documents/"));
