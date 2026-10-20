import { products, type NamedProduct, type PendingProduct, type ProductPosition } from "@/lib/catalogue";
import { categories, type CategorySlug } from "@/lib/categories";

export type CategoryProductPosition = ProductPosition & { categoryId: CategorySlug };

const source = "docs/source/Africhem_Globalz_About_Us.docx — Our Pillars / Uganda Agro-Exports";
const agroProducts: readonly NamedProduct[] = [
  {
    id: "roses", slug: "roses", name: "Roses", category: "Uganda Agro-Exports",
    shortDescription: "Roses exported direct from Uganda.", image: "/stock/roses-pink.webp",
    source, status: "name-verified",
  },
  {
    id: "pineapples", slug: "pineapples", name: "Pineapples", category: "Uganda Agro-Exports",
    shortDescription: "Pineapples exported direct from Uganda.", image: "/stock/pineapple-field.webp",
    source, status: "name-verified",
  },
];

const confirmed = new Map<string, NamedProduct>([
  ...products.filter((product): product is NamedProduct => product.status === "name-verified"),
  ...agroProducts,
].map(product => [product.id, product]));

function pendingPosition(categoryId: CategorySlug, index: number): PendingProduct & { categoryId: CategorySlug } {
  return {
    id: `${categoryId}-pending-${String(index + 1).padStart(2, "0")}`,
    categoryId, image: null, slug: null, name: null, category: null,
    shortDescription: null, source: null, status: "awaiting-confirmation",
  };
}

export const categoryProductPositions = Object.fromEntries(categories.map(category => {
  const named = category.productIds.map(id => {
    const product = confirmed.get(id);
    if (!product) throw new Error(`Category product ${id} has no confirmed source record.`);
    return { ...product, categoryId: category.slug };
  });
  if (named.length > 7) throw new Error(`Category ${category.slug} exceeds seven positions.`);
  const positions: readonly CategoryProductPosition[] = [
    ...named,
    ...Array.from({ length: 7 - named.length }, (_, index) => pendingPosition(category.slug, named.length + index)),
  ];
  return [category.slug, positions];
})) as Record<CategorySlug, readonly CategoryProductPosition[]>;
