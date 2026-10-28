import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chemicalFamilies, chemicalProducts, getChemicalFamily } from "@/lib/chemical-catalogue";
import { QuoteLink } from "@/components/QuoteLink";
import { ChemicalDeck } from "@/components/products/ChemicalDeck";
export const dynamicParams = false;
export function generateStaticParams() { return chemicalFamilies.map(family => ({ family: family.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ family: string }> }): Promise<Metadata> { const { family } = await params; const data = getChemicalFamily(family); return data ? { title: data.name, description: data.description, alternates: { canonical: `/products/${family}` } } : {}; }
export default async function FamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params; const data = getChemicalFamily(family); if (!data) notFound();
  const named = chemicalProducts.filter(product => product.family === family);
  return <article className="revision-page"><header className="revision-hero wrap"><p className="revision-kicker"><Link href="/products">PRODUCTS</Link> / {data.name.toUpperCase()}</p><h1>{data.name}</h1><p>{data.description}</p><QuoteLink category={family} /></header>
    <section className="revision-section wrap surface-band surface-band--cool"><div className="revision-section-head"><p className="revision-kicker">CONFIRMED PRODUCTS</p><h2>{named.length ? "Named products in this family." : "Start with your requirement."}</h2></div>
      {named.length ? <ChemicalDeck cards={named.map(product => ({ id: product.slug, name: product.name, description: product.typicalUse ?? data.description, image: product.slug === "white-spirit" ? "/materials/liquid-glass.webp" : "/stock/industrial-tanks-sunset.webp", href: `/products/${family}/${product.slug}`, quoteCategory: family, quoteProduct: product.slug, eyebrow: "CONFIRMED PRODUCT NAME" }))} label={`${data.name} confirmed products`} /> : <div className="empty-family"><p>We do not have a founder-approved named product list for this family yet. Send the material, grade and quantity you need; the team can review the enquiry without implying current stock.</p><QuoteLink category={family} /></div>}
    </section><section className="revision-closing wrap"><div><p className="revision-kicker">NEED A DIFFERENT CHEMICAL?</p><h2>Share the detail before we quote.</h2></div><QuoteLink category={family} /></section></article>;
}
