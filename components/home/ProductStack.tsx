"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { clientContent } from "@/lib/content/company";

const chapters = [
  { title: clientContent.pillars[0].title, description: clientContent.pillars[0].description, image: "/materials/liquid-glass.webp", alt: "Macro study of folded translucent blue liquid glass" },
  { title: "Solvents", description: clientContent.chemicalFocus.application + ".", image: "/materials/mineral-crystal.webp", alt: "Macro study of warm translucent crystalline material" },
  { title: clientContent.chemicalFocus.namedMaterials.join(" & "), description: "Confirmed materials for paints and coatings enquiries.", image: "/materials/industrial-fluid.webp", alt: "Macro study of industrial metal and deep blue fluid" },
] as const;

export function ProductStack() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(element.querySelectorAll<HTMLElement>(".stack-card"));
        const links = cards.map(card => card.querySelector<HTMLAnchorElement>(".stack-card-link")!);
        const focusHandlers = links.map((link, index) => {
          const focus = () => {
            const travel = element.offsetHeight - innerHeight;
            const start = element.getBoundingClientRect().top + scrollY;
            window.scrollTo({ top: start + Math.max(0, travel) * [0, .45, .86][index], behavior: "smooth" });
          };
          link.addEventListener("focus", focus);
          return focus;
        });
        const setActive = (active: number) => cards.forEach((card, index) => { card.style.zIndex = String(index === active ? 4 : 2 - index); });
        cards.forEach((card, index) => gsap.set(card, { y: index * 24, scale: 1 - index * .035, zIndex: cards.length - index }));
        setActive(0);
        element.classList.add("is-stacked");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: element, start: "top top", end: "bottom bottom", scrub: .8,
            onUpdate(self) { setActive(self.progress < .19 ? 0 : self.progress < .59 ? 1 : 2); },
          },
        });
        timeline.to(cards[0], { yPercent: -104, scale: .96, opacity: 0, ease: "none", duration: 1 }, 0)
          .to(cards[1], { y: 0, scale: 1, ease: "none", duration: 1 }, 0)
          .to(cards[1], { yPercent: -104, scale: .96, opacity: 0, ease: "none", duration: 1 }, 1)
          .to(cards[2], { y: 0, scale: 1, ease: "none", duration: 1 }, 1);
        return () => {
          element.classList.remove("is-stacked");
          links.forEach((link, index) => link.removeEventListener("focus", focusHandlers[index]));
          cards.forEach(card => { card.style.zIndex = ""; });
        };
      });
      revert = () => mm.revert();
    }).catch(() => { /* Normal document flow remains readable. */ });
    return () => { disposed = true; revert?.(); };
  }, []);
  return <div className="stack-scroll" ref={root}>
    <div className="stack-viewport">{chapters.map((chapter, index) => <article className="stack-card" key={chapter.title}>
      <div className="stack-art"><Image src={chapter.image} alt={chapter.alt} fill sizes="(max-width: 899px) 100vw, 48vw" loading="lazy" /></div>
      <div className="stack-content">
        <div className="stack-card-top"><span>{String(index + 1).padStart(2, "0")} / 03</span></div>
        <div><h3>{chapter.title}</h3><p className="stack-description">{chapter.description}</p></div>
        <Link className="stack-card-link" href="/products">Explore <span aria-hidden="true">↗</span></Link>
      </div>
    </article>)}</div>
  </div>;
}
