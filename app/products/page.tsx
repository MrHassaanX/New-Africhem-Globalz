import type { Metadata } from "next";
import Link from "next/link";
import { chemicalFamilies, chemicalProducts } from "@/lib/chemical-catalogue";
import { ChemicalDeck } from "@/components/products/ChemicalDeck";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { QuoteLink } from "@/components/QuoteLink";
import "./products.css";
import "./personal-products.css";

export const metadata: Metadata = { title: "Industrial Chemical Products", description: "Explore five chemical families and request a sourcing quotation based on your specification, quantity and destination.", alternates: { canonical: "/products" } };
export default function ProductsPage() {
  const cards = chemicalFamilies.map(family => ({ id: family.slug, name: family.name, description: family.description, image: family.image, href: `/products/${family.slug}`, quoteCategory: family.slug, eyebrow: "CHEMICAL FAMILY" }));
  return <article className="products-page personal-products"><header className="products-hero wrap"><div className="products-topline"><span>AFRICHEM GLOBALZ / PRODUCTS</span><span>01—05 CHEMICAL FAMILIES</span></div><div className="products-hero-main"><p className="products-label">PRODUCTS</p><h1>Start with the chemical family.</h1><div className="products-hero-copy"><p>A useful sourcing conversation begins with the material, its requirements and the information behind it.</p><p>Explore five families. Only founder-confirmed product names appear on these pages.</p><QuoteLink /></div></div></header>
    <ChemicalDeck cards={cards} label="Five chemical families" />
    <section className="products-confirmed wrap" aria-labelledby="confirmed-title"><div className="products-confirmed-head"><p className="products-label">CURRENTLY NAMED PRODUCTS</p><h2 id="confirmed-title">Two names. A specific conversation.</h2><p>White Spirit and Thinner are the product names confirmed in the client source. Grade, documentation and availability are reviewed for each enquiry.</p></div><div className="products-confirmed-list">{chemicalProducts.map(product => <article key={product.slug}><span>THINNERS &amp; WHITE SPIRIT</span><h3>{product.name}</h3><p>{product.typicalUse}</p><div><Link href={"/products/" + product.family + "/" + product.slug}>Product details <span aria-hidden="true">→</span></Link><QuoteLink category={product.family} product={product.slug} /></div></article>)}</div><p className="products-document-note">Quality, technical and safety documents depend on the product and source. No public COA, TDS or SDS file has been approved for download.</p></section>
    <section className="products-faq wrap"><div><p className="products-label">BUYER QUESTIONS</p><h2>What to ask before a quote.</h2></div><ProductFAQ /></section>
    <section className="products-close wrap"><p className="products-label">REQUEST A QUOTATION</p><h2>Bring us the material and the detail.</h2><div><p>Share your grade, quantity and destination; our team can discuss the available product information and quotation options.</p><QuoteLink /></div></section>
  </article>;
}
