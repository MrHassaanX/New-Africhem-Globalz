import Link from "next/link";
import Image from "next/image";
import { HomeIntro } from "./HomeIntro";
import { BuyerSteps } from "@/components/BuyerSteps";
import { QuoteLink } from "@/components/QuoteLink";
import { chemicalFamilies } from "@/lib/chemical-catalogue";
import { clientContent } from "@/lib/content/company";
import "@/app/home.css";

export function HomePage() {
  return <div className="home-page">
    <HomeIntro />
    <section className="home-process home-container" aria-labelledby="home-process-title">
      <div className="section-intro"><p className="home-kicker">HOW IT WORKS</p><h2 id="home-process-title">From enquiry to delivery in three steps</h2><p>Start with the product and destination. We&apos;ll clarify the detail before making a quotation.</p></div>
      <BuyerSteps compact />
    </section>
    <section className="home-families" aria-labelledby="home-families-title"><div className="home-container">
      <div className="section-intro"><p className="home-kicker">PRODUCTS</p><h2 id="home-families-title">Start with the chemical family.</h2><p>Five areas for a focused sourcing conversation. Only confirmed product names appear in the catalogue.</p></div>
      <div className="family-grid">{chemicalFamilies.map((family, index) => <article className="family-card" key={family.slug}>
        <div className="family-card-image"><Image src={family.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw" /></div>
        <div className="family-card-content"><span>{String(index + 1).padStart(2, "0")} / 05</span><h3>{family.name}</h3><p>{family.description}</p><div><Link href={`/products/${family.slug}`}>View Products <span aria-hidden="true">→</span></Link><QuoteLink category={family.slug} /></div></div>
      </article>)}</div>
      <div className="home-business-preview"><div><p className="home-kicker">OTHER BUSINESSES</p><h3>More businesses we serve</h3><p>Footwear, Uganda agro-exports, recycling and other areas have a separate place in our business directory.</p></div><Link className="text-arrow" href="/other-businesses">Explore Other Businesses <span aria-hidden="true">→</span></Link></div>
    </div></section>
    <section className="home-client-first home-container"><p className="home-kicker">OUR FIRST PRINCIPLE</p><blockquote>{clientContent.clientFirst}</blockquote></section>
    <section className="home-closing"><div className="home-container"><div><p className="home-kicker">START A CONVERSATION</p><h2>Tell us what you need.</h2><p>Share the material, quantity and destination. We&apos;ll take the conversation from there.</p></div><QuoteLink /></div></section>
  </div>;
}
