import type { Metadata } from "next";
import Link from "next/link";
import { clientContent } from "@/lib/content/company";
import { GlobalReachGlobe } from "@/components/global-reach/GlobalReachGlobe";
import "./reach.css";

export const metadata: Metadata = {
  title: "Global Reach",
  description: clientContent.network.summary,
  alternates: { canonical: "/global-reach" },
};

export default function GlobalReachPage() {
  return <article className="reach-page">
    <section className="reach-hero wrap" aria-labelledby="reach-title">
      <div className="reach-hero-top"><span>AFRICHEM GLOBALZ / GLOBAL REACH</span><span>PARTNERS ON THE GROUND</span></div>
      <div className="reach-hero-main">
        <h1 id="reach-title">GLOBAL<br /><span>REACH.</span></h1>
        <div className="reach-hero-copy"><p>{clientContent.network.summary}</p><span>{clientContent.network.support}</span><a href="#network-globe">Explore the network <b aria-hidden="true">↓</b></a></div>
      </div>
      <div className="reach-hero-bottom"><span>01 — 07</span><span>REAL PEOPLE. ACROSS TIME ZONES.</span></div>
    </section>

    <GlobalReachGlobe />

    <section className="reach-partners wrap" aria-labelledby="reach-partners-title">
      <div className="reach-partners-heading"><p>02 / THE PARTNER NETWORK</p><h2 id="reach-partners-title">Someone there.<br /><span>When it matters.</span></h2><div><p>{clientContent.network.detail}</p><p>These are partner locations, not Africhem offices.</p></div></div>
      <ol className="reach-country-list">{clientContent.network.countries.map((country, index) => <li key={country}><span>{String(index + 1).padStart(2, "0")}</span><strong>{country}</strong><span>PARTNER LOCATION ↗</span></li>)}</ol>
    </section>

    <section className="reach-cta wrap"><p>START A CONVERSATION</p><div><h2>One team.<br /><span>Every step.</span></h2><Link href="/contact">Discuss your requirement <span aria-hidden="true">↗</span></Link></div></section>
  </article>;
}
