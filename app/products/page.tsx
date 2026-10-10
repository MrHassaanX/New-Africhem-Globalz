import type { Metadata } from "next";
import Link from "next/link";
import { clientContent } from "@/lib/content/company";
import { products } from "@/lib/catalogue";
import { ProductDeck } from "@/components/products/ProductDeck";
import "./products.css";

export const metadata: Metadata = {
  title: "Products",
  description: `Explore Africhem Globalz materials, including ${clientContent.chemicalFocus.namedMaterials.join(" and ")}.`,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return <article className="products-page">
    <section className="products-hero wrap" aria-labelledby="products-page-title">
      <div className="products-topline"><span>AFRICHEM GLOBALZ / PRODUCTS</span><span>CHEMICAL CATALOGUE</span></div>
      <div className="products-hero-main">
        <p className="products-label">START WITH YOUR REQUIREMENT</p>
        <h1 id="products-page-title">Materials,<br /><span>sourced with<br />clarity.</span></h1>
        <div className="products-hero-copy">
          <p>A useful sourcing conversation begins with the material, its requirements and the information behind it.</p>
          <p>Specifications and availability are confirmed through an enquiry.</p>
        </div>
      </div>
    </section>

    <ProductDeck products={products} />

    <section className="products-close wrap" aria-labelledby="products-close-title">
      <p className="products-label">START A CONVERSATION</p>
      <h2 id="products-close-title">Can&apos;t find<br /><span>what you need?</span></h2>
      <div><p>Tell us the material and requirement.</p><Link href="/contact">Send an Enquiry <span aria-hidden="true">↗</span></Link></div>
    </section>
  </article>;
}
