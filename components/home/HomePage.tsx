import Link from "next/link";
import { clientContent } from "@/lib/content/company";
import { HomeIntro } from "./HomeIntro";
import { CategoryCarousel } from "@/components/categories/CategoryCarousel";
import { ProcessRows } from "@/components/content/ProcessRows";
import "@/app/home.css";

export function HomePage() {
  return <div className="home-page">
    <HomeIntro>
      <section className="home-capabilities" aria-labelledby="capabilities-title">
        <div className="home-container">
          <div className="home-capabilities-head">
            <p className="home-kicker">HOW WE WORK</p>
            <h2 id="capabilities-title">From requirement <em>to delivery.</em></h2>
            <p>{clientContent.whyChooseUs[0].description}</p>
          </div>
          <div className="home-process-line" aria-hidden="true"><span /></div>
          <ProcessRows listClassName="home-capability-list" rowClassName="capability-row" />
        </div>
      </section>
    </HomeIntro>

    <section className="home-categories" aria-labelledby="categories-title">
      <div className="home-section-heading home-container"><p className="home-kicker">CATEGORIES</p><div><h2 id="categories-title">Explore our<br /><em>categories.</em></h2><p>Four business areas, from chemicals and footwear to Uganda agro-exports and recycling.</p></div></div>
      <CategoryCarousel label="Home category preview" />
      <div className="home-categories-tail home-container"><p>Start with the category that matches your requirement.</p><Link href="/categories">Explore Categories <span aria-hidden="true">↗</span></Link></div>
    </section>

    <section className="home-closing" aria-labelledby="closing-title"><div className="home-container home-closing-inner">
      <p className="home-kicker">START A CONVERSATION</p><h2 id="closing-title">Tell us what<br />you&apos;re <em>looking for.</em></h2><div><p>{clientContent.brand.delivery}</p><Link href="/contact">Send an Enquiry <span aria-hidden="true">↗</span></Link></div>
    </div></section>
  </div>;
}
