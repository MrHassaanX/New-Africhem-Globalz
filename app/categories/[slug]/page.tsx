import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryArtwork } from "@/components/categories/CategoryArtwork";
import { ProductDeck } from "@/components/products/ProductDeck";
import { categories, getCategory } from "@/lib/categories";
import { categoryProductPositions } from "@/lib/category-products";
import "../categories.css";
import "@/app/products/products.css";

const rangeHeadings = {
  chemicals: "Explore our chemicals.",
  footwear: "Explore our footwear range.",
  "uganda-agro-exports": "From Uganda to global markets.",
  recycling: "Keeping materials in use.",
} as const;

export const dynamicParams = false;
export function generateStaticParams() { return categories.map(category => ({ slug: category.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return category ? {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  } : {};
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const positions = categoryProductPositions[category.slug];
  return <article className="category-detail-page">
    <section className="category-detail-hero wrap" aria-labelledby="category-title">
      <div className="categories-topline"><span><Link href="/">HOME</Link> / <Link href="/categories">CATEGORIES</Link> / {category.name.toUpperCase()}</span><span>AFRICHEM GLOBALZ</span></div>
      <div className="category-detail-hero-main">
        <div><p className="category-detail-eyebrow">BUSINESS CATEGORY</p><h1 id="category-title">{category.name}</h1><p>{category.description}</p>
          <div className="category-detail-actions"><Link href="/categories">← All Categories</Link></div>
        </div>
        <div className="category-detail-visual"><CategoryArtwork visual={category.visual} /></div>
      </div>
    </section>
    <section className="category-detail-body" aria-labelledby="category-detail-heading">
      <div className="category-detail-heading wrap"><p>EXPLORE THE RANGE</p><h2 id="category-detail-heading">{rangeHeadings[category.slug]}</h2></div>
      <p className="category-detail-note wrap">Tell us what you need. Our team can share current product information and availability.</p>
      <ProductDeck products={positions} label={`${category.name} range`} categoryLabel={category.name} categoryVisual={category.visual} />
      <div className="category-detail-enquiry wrap"><p>For a specific requirement or current availability, speak with our team.</p><Link href="/contact">Send an Enquiry <span aria-hidden="true">↗</span></Link></div>
    </section>
  </article>;
}
