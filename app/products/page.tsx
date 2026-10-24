import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { chemicalFamilies, chemicalProducts } from "@/lib/chemical-catalogue";
import { QuoteLink } from "@/components/QuoteLink";
import { ProductFAQ } from "@/components/products/ProductFAQ";

export const metadata: Metadata = { title: "Industrial Chemical Products", description: "Browse Africhem Globalz chemical families and confirmed products, then request a specification-led quotation.", alternates: { canonical: "/products" } };
export default function ProductsPage() {
  return <article className="revision-page products-revision">
    <header className="revision-hero wrap"><p className="revision-kicker">PRODUCTS / CHEMICAL SOURCING</p><h1>Chemicals for a precise sourcing conversation.</h1><p>Explore five chemical families. Share the grade, quantity and destination you need; named products appear only where confirmed in client source material.</p><QuoteLink /></header>
    <section className="revision-section wrap" aria-labelledby="family-title"><div className="revision-section-head"><p className="revision-kicker">01 / CHEMICAL FAMILIES</p><h2 id="family-title">Start with the material.</h2></div><div className="product-family-grid">{chemicalFamilies.map(family => <article className="product-family" key={family.slug}><div className="product-family-art"><Image src={family.image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" /></div><div><h3>{family.name}</h3><p>{family.description}</p><Link className="text-arrow" href={`/products/${family.slug}`}>View Products <span aria-hidden="true">→</span></Link></div></article>)}</div><p className="photo-note">Images are illustrative stock or abstract material imagery, not Africhem facilities or product packaging.</p></section>
    <section className="revision-section wrap" aria-labelledby="confirmed-title"><div className="revision-section-head"><p className="revision-kicker">02 / CONFIRMED NAMES</p><h2 id="confirmed-title">Products currently named.</h2></div><div className="confirmed-grid">{chemicalProducts.map(product => <article key={product.slug}><p>THINNERS &amp; WHITE SPIRIT</p><h3>{product.name}</h3><p>{product.typicalUse}</p><strong>Price on request</strong><div><Link className="text-arrow" href={`/products/${product.family}/${product.slug}`}>Product details <span aria-hidden="true">→</span></Link><QuoteLink category={product.family} product={product.slug} /></div></article>)}</div></section>
    <section className="revision-section wrap" aria-labelledby="document-title"><div className="revision-section-head"><p className="revision-kicker">03 / DOCUMENTATION</p><h2 id="document-title">Ask for the documents relevant to your order.</h2></div><p className="revision-lead">Quality, technical and safety documentation depends on the product and source. Tell us what you need during the quotation request. No public COA, TDS or SDS file has been approved for download yet.</p></section>
    <section className="revision-section wrap" aria-labelledby="faq-title"><div className="revision-section-head"><p className="revision-kicker">04 / BUYER QUESTIONS</p><h2 id="faq-title">Frequently asked questions.</h2></div><ProductFAQ /></section>
    <section className="revision-closing wrap"><div><p className="revision-kicker">A MATERIAL IN MIND?</p><h2>Tell us the specification and destination.</h2></div><QuoteLink /></section>
  </article>;
}
