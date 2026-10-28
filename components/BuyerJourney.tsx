"use client";
import { useEffect, useRef } from "react";
import { buyerSteps } from "@/lib/verified-content";
import { QuoteLink } from "@/components/QuoteLink";

export function BuyerJourney() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const line = element.querySelector(".buyer-journey-line span");
        const steps = gsap.utils.toArray<HTMLElement>(".buyer-journey-step", element);
        if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: element, start: "top 78%", end: "bottom 55%", scrub: .6 } });
        steps.forEach(step => gsap.fromTo(step, { y: 28, opacity: .55 }, { y: 0, opacity: 1, duration: .75, ease: "power2.out", scrollTrigger: { trigger: step, start: "top 82%", once: true } }));
      });
      revert = () => media.revert();
    }).catch(() => { /* Static steps remain readable. */ });
    return () => { disposed = true; revert?.(); };
  }, []);
  return <section className="buyer-journey" ref={root} aria-label="Buyer process"><div className="buyer-journey-line" aria-hidden="true"><span /></div><ol>{buyerSteps.map(step => <li className="buyer-journey-step" key={step.number}><span>{step.number}</span><div><h2>{step.title}</h2><p>{step.description}</p></div></li>)}</ol><div className="buyer-journey-end"><QuoteLink /></div></section>;
}
