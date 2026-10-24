import Image from "next/image";
import Link from "next/link";
import { QuoteLink } from "@/components/QuoteLink";
import { proofPoints } from "@/lib/verified-content";

export function HomeIntro() {
  return <div className="home-intro">
    <section className="home-hero home-container" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-kicker">AFRICHEM GLOBALZ · INDUSTRIAL CHEMICALS</p>
        <h1 id="home-title">Industrial chemicals, sourced, verified and shipped to your port.</h1>
        <p className="home-hero-support">Sourcing conversations across paints and coatings, petrochemicals, polymers, industrial chemicals, and thinners and white spirit. Tell us your specification, quantity and destination; we&apos;ll discuss available product information, documents and delivery options before quoting.</p>
        <p className="home-tagline">SOURCING SIMPLIFIED.</p>
        <div className="home-hero-actions"><QuoteLink /><Link className="text-arrow" href="/how-it-works">See How It Works <span aria-hidden="true">→</span></Link></div>
      </div>
      <figure className="home-hero-media"><Image src="/stock/industrial-tanks-sunset.webp" alt="Industrial storage tanks and piping at sunset" fill priority sizes="(max-width: 767px) 100vw, 48vw" /><figcaption>Illustrative industry photography · Not an Africhem facility</figcaption></figure>
    </section>
    <div className="home-proof home-container" aria-label="At a glance">{proofPoints.filter(point => point.approved && point.public).map(point => <div key={point.text}><span aria-hidden="true">◦</span><p>{point.text}</p></div>)}</div>
  </div>;
}
