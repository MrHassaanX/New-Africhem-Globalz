import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { clientContent } from "@/lib/content/company";
import { ProcessRows } from "@/components/content/ProcessRows";
import { PillarRows } from "@/components/content/PillarRows";
import "./about.css";

export const metadata: Metadata = {
  title: "About Us",
  description: clientContent.brand.promise + " " + clientContent.brand.delivery,
  alternates: { canonical: "/about" },
};

const promise = clientContent.brand.promise.toUpperCase();
const headingBreak = promise.lastIndexOf(" IS ");

export default function AboutPage() {
  return <article className="about-page">
    <section className="about-hero wrap" aria-labelledby="about-title">
      <div className="about-topline"><span>AFRICHEM GLOBALZ / ABOUT US</span><span>{clientContent.brand.tagline.toUpperCase()}</span></div>
      <div className="about-hero-main">
        <p className="about-label">BUILT AROUND THE RESULT</p>
        <h1 id="about-title">{promise.slice(0, headingBreak)}<br /><span>{promise.slice(headingBreak + 1)}</span></h1>
        <div className="about-hero-foot"><strong>{clientContent.brand.tagline.toUpperCase()}</strong><p>{clientContent.brand.delivery}</p></div>
      </div>
    </section>

    <section className="about-story wrap" aria-labelledby="about-story-title">
      <p className="about-section-index">01 / OUR STORY</p>
      <div className="about-story-main"><h2 id="about-story-title">Why we<br />started.</h2><div>{clientContent.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
    </section>

    <figure className="about-context-image wrap"><div><Image src="/stock/port-logistics.webp" alt="Port cranes and vessels at dusk, illustrating international logistics" fill sizes="(max-width: 767px) 100vw, 90vw" /></div><figcaption>Illustrative industry photography · Global logistics</figcaption></figure>

    <section className="about-strengths" aria-labelledby="about-strengths-title"><div className="wrap">
      <div className="about-section-head"><p className="about-section-index">02 / WHY CHOOSE US</p><h2 id="about-strengths-title">The work<br /><span>behind the word.</span></h2></div>
      <ol className="about-strength-list">{clientContent.whyChooseUs.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol>
    </div></section>

    <section className="about-principle" aria-label="Client-first principle"><div className="wrap"><p className="about-section-index">OUR FIRST PRINCIPLE</p><blockquote>{clientContent.clientFirst}</blockquote></div></section>

    <section className="about-process wrap" aria-labelledby="about-process-title">
      <div className="about-section-head"><p className="about-section-index">03 / HOW WE WORK</p><h2 id="about-process-title">From plan<br /><span>to delivery.</span></h2></div>
      <ProcessRows listClassName="about-process-list" rowClassName="about-process-row" />
    </section>

    <section className="about-network" aria-labelledby="about-network-title"><div className="wrap">
      <div className="about-section-head"><p className="about-section-index">04 / OUR GLOBAL NETWORK</p><h2 id="about-network-title">People on<br /><span>the ground.</span></h2></div>
      <div className="about-network-copy"><p>{clientContent.network.overview}</p><p>{clientContent.network.support} {clientContent.network.detail}</p></div>
      <ul className="about-country-list"><li className="about-country-primary">India · Primary country</li>{clientContent.network.countries.map((country) => <li key={country}>{country}</li>)}</ul>
      <Link className="about-text-link" href="/global-reach">Explore Global Reach <span aria-hidden="true">↗</span></Link>
    </div></section>

    <section className="about-pillars wrap" aria-labelledby="about-pillars-title">
      <div className="about-section-head"><p className="about-section-index">05 / OUR PILLARS</p><h2 id="about-pillars-title">Four areas.<br /><span>One commitment.</span></h2></div>
      <PillarRows listClassName="about-pillar-list" rowClassName="about-pillar-row" />
    </section>

    <section className="about-values" aria-labelledby="about-values-title"><div className="wrap">
      <div className="about-section-head"><p className="about-section-index">06 / WHAT WE STAND FOR</p><h2 id="about-values-title">What guides<br /><span>the work.</span></h2></div>
      <ol className="about-value-list">{clientContent.values.map((value, index) => <li key={value.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{value.title}</h3><p>{value.description}</p></li>)}</ol>
    </div></section>

    <section className="about-close wrap"><p className="about-section-index">START A CONVERSATION</p><div><h2>Tell us what<br /><span>you need.</span></h2><Link href="/contact">Contact Africhem <span aria-hidden="true">↗</span></Link></div></section>
  </article>;
}
