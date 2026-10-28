"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { quoteHref } from "@/components/QuoteLink";
import "@/app/products/products.css";
import "@/app/products/personal-products.css";

export type ChemicalDeckCard = { id: string; name: string; description: string; image: string; href: string; quoteCategory: string; quoteProduct?: string; eyebrow: string };

export function ChemicalDeck({ cards, label }: { cards: readonly ChemicalDeckCard[]; label: string }) {
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
      const createStack = (depth: number, scrub: number) => {
        const items = Array.from(element.querySelectorAll<HTMLElement>(".products-card"));
        const links = Array.from(element.querySelectorAll<HTMLAnchorElement>(".products-card a"));
        if (items.length < 2) return;
        element.classList.add("is-stacked");
        items.forEach((card, index) => gsap.set(card, { yPercent: index ? 115 : 0, y: 0, scale: index ? .992 : 1, opacity: 1, zIndex: index + 1 }));
        const timeline = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: element, start: "top top", end: "bottom bottom", scrub, invalidateOnRefresh: true } });
        for (let index = 1; index < items.length; index++) {
          const step = index - 1;
          timeline.to(items[index - 1], { y: -depth, scale: .982, duration: 1 }, step);
          timeline.to(items[index], { yPercent: 0, scale: 1, duration: 1 }, step);
        }
        let focusFrame = 0;
        const onFocus = (event: FocusEvent) => {
          const card = (event.currentTarget as HTMLElement).closest(".products-card");
          const index = items.indexOf(card as HTMLElement);
          if (index < 0) return;
          const start = element.getBoundingClientRect().top + window.scrollY;
          const distance = Math.max(0, element.offsetHeight - window.innerHeight);
          cancelAnimationFrame(focusFrame);
          focusFrame = requestAnimationFrame(() => window.scrollTo(0, start + distance * index / (items.length - 1)));
        };
        links.forEach(link => link.addEventListener("focus", onFocus));
        const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
          cancelAnimationFrame(refresh); cancelAnimationFrame(focusFrame);
          links.forEach(link => link.removeEventListener("focus", onFocus));
          timeline.scrollTrigger?.kill(); timeline.kill();
          gsap.set(items, { clearProps: "transform,opacity,zIndex" });
          element.classList.remove("is-stacked");
        };
      };
      media.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", () => createStack(24, .65));
      media.add("(min-width: 768px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)", () => createStack(16, .45));
      revert = () => media.revert();
    }).catch(() => { /* All cards remain in document flow if motion is unavailable. */ });
    return () => { disposed = true; revert?.(); };
  }, []);
  return <section className="products-deck chemical-deck" ref={root} aria-label={label} style={{ "--deck-count": cards.length } as CSSProperties}>
    <ol className="products-deck-stage">{cards.map((card, index) => <li className="products-card" key={card.id}>
      <div className="products-card-art"><Image src={card.image} alt="" fill sizes="(max-width:767px) 92vw, 50vw" loading={index === 0 ? "eager" : "lazy"} /><span className="products-art-caption">{card.image.startsWith("/materials/") ? "ILLUSTRATIVE MATERIAL STUDY" : "ILLUSTRATIVE INDUSTRY PHOTOGRAPHY"}</span></div>
      <div className="products-card-content"><div className="products-card-top"><span className="products-card-number">{String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span><span>AFRICHEM GLOBALZ</span></div>
        <div className="products-card-main"><p className="products-card-status">{card.eyebrow}</p><h2>{card.name}</h2><p className="products-card-description">{card.description}</p></div>
        <div className="chemical-deck-actions"><Link className="products-card-link" href={card.href}>Explore <span aria-hidden="true">→</span></Link><Link href={quoteHref(card.quoteCategory, card.quoteProduct)}>Get a Quote <span aria-hidden="true">→</span></Link></div>
      </div>
    </li>)}</ol>
  </section>;
}
