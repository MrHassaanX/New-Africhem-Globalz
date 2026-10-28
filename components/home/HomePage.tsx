import Link from "next/link";
import { HomeIntro } from "./HomeIntro";
import { ChemicalCarousel } from "@/components/categories/ChemicalCarousel";
import { QuoteLink } from "@/components/QuoteLink";
import { buyerSteps, proofPoints } from "@/lib/verified-content";
import { clientContent } from "@/lib/content/company";
import "@/app/home.css";
import "@/app/personal-home.css";

export function HomePage() {
  return <div className="home-page">
    <HomeIntro>
    <section className="home-proof" aria-label="At a glance"><div className="home-container">{proofPoints.filter(point => point.approved && point.public).map(point => <div key={point.text}><span aria-hidden="true">◦</span><p>{point.text}</p></div>)}</div></section>
      <section className="home-capabilities" aria-labelledby="capabilities-title"><div className="home-container">
        <div className="home-capabilities-head"><p className="home-kicker">HOW IT WORKS</p><h2 id="capabilities-title">From requirement <em>to delivery.</em></h2><p>Three buyer-focused steps, beginning with the material and your destination.</p></div>
        <div className="home-process-line" aria-hidden="true"><span /></div>
        <ol className="home-capability-list">{buyerSteps.map(step => <li className="capability-row" key={step.number}><span>{step.number}</span><h3><span>{step.title}</span></h3><p>{step.description}</p></li>)}</ol>
        <div className="home-process-action"><QuoteLink label="Start with Step 1: Get a Quote" /><Link href="/how-it-works">See How It Works <span aria-hidden="true">→</span></Link></div>
      </div></section>
    </HomeIntro>
    <section className="home-categories" aria-labelledby="categories-title">
      <div className="home-section-heading home-container"><p className="home-kicker">PRODUCTS / 01—05</p><div><h2 id="categories-title">Start with the <em>chemical family.</em></h2><p>Five focused areas for a sourcing conversation. Only confirmed product names appear in the catalogue.</p></div></div>
      <ChemicalCarousel label="Five chemical families" />
      <div className="home-categories-tail home-container"><p>Have a specific grade or application in mind?</p><Link href="/products">Explore Products <span aria-hidden="true">→</span></Link></div>
    </section>
    <section className="home-business-preview home-container"><div><p className="home-kicker">OTHER BUSINESSES</p><h2>More businesses we serve.</h2><p>Footwear, Uganda agro-exports, recycling and other areas have their own directory, separate from the chemical catalogue.</p></div><Link href="/other-businesses">Explore Other Businesses <span aria-hidden="true">→</span></Link></section>
    <section className="home-client-first home-container"><p className="home-kicker">OUR FIRST PRINCIPLE</p><blockquote>{clientContent.clientFirst}</blockquote></section>
    <section className="home-closing" aria-labelledby="closing-title"><div className="home-container home-closing-inner"><p className="home-kicker">START A CONVERSATION</p><h2 id="closing-title">Tell us what you need.</h2><div><p>Share the material, quantity and destination. We’ll take the conversation from there.</p><QuoteLink /></div></div></section>
  </div>;
}
