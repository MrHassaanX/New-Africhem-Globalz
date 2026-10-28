import type { Metadata } from "next";
import { clientContent } from "@/lib/content/company";
import { GlobalReachGlobe } from "@/components/global-reach/GlobalReachGlobe";
import Image from "next/image";
import { QuoteLink } from "@/components/QuoteLink";
import "./reach.css";

export const metadata: Metadata = {
  title: "Global Reach",
  description: clientContent.network.overview,
  alternates: { canonical: "/global-reach" },
};

export default function GlobalReachPage() {
  return <article className="reach-page">
    <GlobalReachGlobe />

    <section className="reach-partners wrap" id="reach-partners" aria-labelledby="reach-partners-title">
      <p className="reach-globe-caption">Points mark India and seven partner countries. Red arcs illustrate a connected network, not verified shipping routes or Africhem offices.</p>
      <div className="reach-partners-heading"><p>02 / INDIA & THE PARTNER NETWORK</p><h2 id="reach-partners-title">Someone there.<br /><span>When it matters.</span></h2><div><p className="reach-partners-statement">{clientContent.network.support}</p><p>{clientContent.network.detail}</p><p>India is the primary country. The seven international locations mark partner countries, not Africhem offices.</p></div></div>
      <ol className="reach-country-list">{[clientContent.network.primaryCountry, ...clientContent.network.countries].map((country, index) => <li key={country} data-primary={index === 0 || undefined}><span>{String(index + 1).padStart(2, "0")}</span><Image src={`/flags/${({ India: "in", Kuwait: "kw", UAE: "ae", China: "cn", Algeria: "dz", Egypt: "eg", Uganda: "ug", Kenya: "ke" } as Record<string, string>)[country]}.svg`} alt="" width={40} height={30} unoptimized /><strong>{country}</strong><span>{index === 0 ? "OUR BASE" : "PARTNER COUNTRY"}</span></li>)}</ol>
      <div className="reach-destination"><p>Not on the list? Ask us about your destination. Partner responsibilities and available services are confirmed for each enquiry.</p><QuoteLink label="Check My Destination" /></div>
    </section>

    <section className="reach-cta wrap"><p>START A CONVERSATION</p><div><h2>Tell us your destination.</h2><QuoteLink /></div></section>
  </article>;
}
