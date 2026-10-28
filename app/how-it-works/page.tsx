import type { Metadata } from "next";
import { BuyerJourney } from "@/components/BuyerJourney";
import "./personal-how.css";
export const metadata: Metadata = { title: "How It Works", description: "From product enquiry to sourcing discussion and delivery planning in three clear steps.", alternates: { canonical: "/how-it-works" } };
export default function HowItWorksPage() { return <article className="revision-page how-personal"><header className="revision-hero wrap"><p className="revision-kicker">HOW IT WORKS</p><h1>From enquiry to delivery in three steps.</h1><p>Begin with the material, quantity and destination. Each quotation depends on confirmed specifications, documents and shipping requirements.</p></header><BuyerJourney /></article>; }
