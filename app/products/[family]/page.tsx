import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chemicalFamilies, chemicalProducts, getChemicalFamily } from "@/lib/chemical-catalogue";
import { QuoteLink } from "@/components/QuoteLink";
export const dynamicParams = false;
export function generateStaticParams() { return chemicalFamilies.map(family => ({ family: family.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ family: string }> }): Promise<Metadata> { const { family } = await params; const data = getChemicalFamily(family); return data ? { title: data.name, description: data.description, alternates: { canonical: `/products/${family}` } } : {}; }
export default async function FamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params; const data = getChemicalFamily(family); if (!data) notFound();
  const named = chemicalProducts.filter(product => product.family === family);
  return <article className="revision-page"><header className="revision-hero wrap"><p className="revision-kicker"><Link href="/products">PRODUCTS</Link> / {data.name.toUpperCase()}</p><h1>{data.name}</h1><p>{data.description}</p><QuoteLink category={family} /></header>
    <section className="revision-section wrap"><div className="revision-section-head"><p className="revision-kicker">CONFIRMED PRODUCTS</p><h2>{named.length ? "Named products in this family." : "Start with your requirement."}</h2></div>
      {named.length ? <div className="confirmed-grid">{named.map(product => <article key={product.slug}><h3>{product.name}</h3><p>{product.typicalUse}</p><strong>Price on request</strong><div><Link className="text-arrow" href={`/products/${family}/${product.slug}`}>Product details <span aria-hidden="true">→</span></Link><QuoteLink category={family} product={product.slug} /></div></article>)}</div> : <div className="empty-family"><p>We do not have a founder-approved named product list for this family yet. Send the material, grade and quantity you need; the team can review the enquiry without implying current stock.</p><QuoteLink category={family} /></div>}
    </section><section className="revision-closing wrap"><div><p className="revision-kicker">NEED A DIFFERENT CHEMICAL?</p><h2>Share the detail before we quote.</h2></div><QuoteLink category={family} /></section></article>;
}
