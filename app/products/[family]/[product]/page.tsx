import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { approvedDocuments, chemicalProducts, getChemicalFamily, getChemicalProduct } from "@/lib/chemical-catalogue";
import { QuoteLink } from "@/components/QuoteLink";
export const dynamicParams = false;
export function generateStaticParams() { return chemicalProducts.map(product => ({ family: product.family, product: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ family: string; product: string }> }): Promise<Metadata> { const { family, product } = await params; const data = getChemicalProduct(family, product); return data ? { title: data.name, description: `${data.name}: product information and quotation enquiry.`, alternates: { canonical: `/products/${family}/${product}` } } : {}; }
export default async function ProductPage({ params }: { params: Promise<{ family: string; product: string }> }) {
  const { family, product } = await params; const data = getChemicalProduct(family, product); const familyData = getChemicalFamily(family); if (!data || !familyData) notFound();
  const facts = [["Typical use", data.typicalUse], ["Grade", data.grade], ["Packaging", data.packaging], ["Minimum order", data.minimumOrder], ["Lead time", data.leadTime], ["Origin", data.origin], ["Handling", data.handling], ["Shipping requirements", data.shippingRequirements]].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const documents = approvedDocuments(data);
  return <article className="revision-page"><header className="revision-hero wrap"><p className="revision-kicker"><Link href="/products">PRODUCTS</Link> / <Link href={`/products/${family}`}>{familyData.name.toUpperCase()}</Link></p><h1>{data.name}</h1><p>Tell us your required grade, quantity and destination. Details beyond the confirmed product name are agreed for a specific quotation.</p><strong className="price-note">Price on request</strong><QuoteLink category={family} product={product} /></header>
    <section className="revision-section wrap"><div className="revision-section-head"><p className="revision-kicker">PRODUCT INFORMATION</p><h2>What is currently confirmed.</h2></div><dl className="product-facts">{facts.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl><p className="revision-lead">Specifications, grades, pack sizes, minimum order, lead time and available documents must be confirmed for your requirement. No fixed availability or shipping classification is stated here.</p></section>
    {documents.length > 0 && <section className="revision-section wrap"><h2>Approved documents</h2><ul>{documents.map(document => <li key={document.url}><a href={document.url} download>{document.title} ({document.type})</a>{!document.productSpecific && " · Sample document"}</li>)}</ul></section>}
    <section className="revision-closing wrap"><div><p className="revision-kicker">REQUEST A QUOTATION</p><h2>Ask about {data.name}.</h2></div><QuoteLink category={family} product={product} /></section></article>;
}
