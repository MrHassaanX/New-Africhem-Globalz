import type { Metadata } from "next";
import { BuyerSteps } from "@/components/BuyerSteps";
import { QuoteLink } from "@/components/QuoteLink";
export const metadata: Metadata = { title: "How It Works", description: "From product enquiry to sourcing discussion and delivery planning in three clear steps.", alternates: { canonical: "/how-it-works" } };
export default function HowItWorksPage() { return <article className="revision-page"><header className="revision-hero wrap"><p className="revision-kicker">HOW IT WORKS</p><h1>From enquiry to delivery in three steps</h1><p>Begin with the material, quantity and destination. Each quotation depends on confirmed specifications, documents and shipping requirements.</p></header><section className="revision-section wrap"><BuyerSteps /></section><section className="revision-closing wrap"><div><p className="revision-kicker">READY TO BEGIN?</p><h2>Start with your requirement.</h2></div><QuoteLink /></section></article>; }
