import type { Metadata } from "next";
import Link from "next/link";
import { clientContent } from "@/lib/content/company";
import { PillarRows } from "@/components/content/PillarRows";
import "./pillars.css";

export const metadata: Metadata = {
  title: "Business Pillars",
  description: clientContent.pillars.map((pillar) => pillar.title).join(", ") + ".",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return <article className="pillars-page">
    <section className="pillars-hero wrap" aria-labelledby="pillars-title">
      <div className="pillars-topline"><span>AFRICHEM GLOBALZ / OUR PILLARS</span><span>01 — 04</span></div>
      <div className="pillars-hero-main"><p>FOUR BUSINESS AREAS</p><h1 id="pillars-title">BUSINESS<br /><span>PILLARS.</span></h1><div><p>Explore the four areas that make up Africhem Globalz.</p><a href="#pillar-list">Explore the pillars <span aria-hidden="true">↓</span></a></div></div>
    </section>

    <section className="pillars-list-section" id="pillar-list" aria-label="Business pillars"><div className="wrap">
      <div className="pillars-section-head"><p>01 / OUR PILLARS</p><h2>What we<br /><span>work across.</span></h2></div>
      <PillarRows listClassName="pillars-list" rowClassName="pillars-row" />
      <p className="pillars-note">For product specifications, availability or a particular requirement, speak with our team directly.</p>
    </div></section>

    <section className="pillars-close wrap"><p>START WITH YOUR REQUIREMENT</p><div><h2>Let&apos;s talk<br /><span>specifics.</span></h2><Link href="/contact">Contact Africhem <span aria-hidden="true">↗</span></Link></div></section>
  </article>;
}
