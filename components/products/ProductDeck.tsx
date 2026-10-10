"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductPosition } from "@/lib/catalogue";

export function ProductDeck({ products }: { products: readonly ProductPosition[] }) {
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
        const cards = Array.from(element.querySelectorAll<HTMLElement>(".products-card"));
        const links = Array.from(element.querySelectorAll<HTMLAnchorElement>(".products-card-link"));
        if (cards.length < 2) return;

        element.classList.add("is-stacked");
        cards.forEach((card, index) => {
          gsap.set(card, { yPercent: index === 0 ? 0 : 115, y: 0, scale: index === 0 ? 1 : .992, opacity: 1, zIndex: index + 1 });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: element, start: "top top", end: "bottom bottom", scrub, invalidateOnRefresh: true },
        });
        for (let index = 1; index < cards.length; index++) {
          const step = index - 1;
          timeline.to(cards[index - 1], { y: -depth, scale: .982, opacity: .82, duration: 1 }, step);
          timeline.to(cards[index], { yPercent: 0, scale: 1, duration: 1 }, step);
        }

        let focusFrame = 0;
        const onFocus = (event: FocusEvent) => {
          const card = (event.currentTarget as HTMLElement).closest(".products-card");
          const index = cards.indexOf(card as HTMLElement);
          if (index < 0) return;
          const start = element.getBoundingClientRect().top + window.scrollY;
          const distance = Math.max(0, element.offsetHeight - window.innerHeight);
          cancelAnimationFrame(focusFrame);
          focusFrame = requestAnimationFrame(() => window.scrollTo(0, start + distance * index / (cards.length - 1)));
        };
        links.forEach(link => link.addEventListener("focus", onFocus));
        const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          cancelAnimationFrame(refresh);
          cancelAnimationFrame(focusFrame);
          links.forEach(link => link.removeEventListener("focus", onFocus));
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set(cards, { clearProps: "transform,opacity,zIndex" });
          element.classList.remove("is-stacked");
        };
      };

      media.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", () => createStack(24, .65));
      media.add("(min-width: 768px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)", () => createStack(16, .45));
      revert = () => media.revert();
    }).catch(() => { /* All cards remain in normal document flow if motion is unavailable. */ });

    return () => { disposed = true; revert?.(); };
  }, []);

  return <section className="products-deck" ref={root} aria-label="Products catalogue">
    <ol className="products-deck-stage">
      {products.map((product, index) => {
        const named = product.status === "name-verified";
        return <li className="products-card" data-status={product.status} key={product.id}>
          <div className="products-card-art" data-visual={index + 1}>
            {product.image && <Image src={product.image} alt="" fill sizes="(max-width: 767px) 92vw, 50vw" loading={index === 0 ? "eager" : "lazy"} />}
            <span className="products-art-caption">ILLUSTRATIVE MATERIAL STUDY</span>
          </div>
          <div className="products-card-content">
            <div className="products-card-top"><span className="products-card-number">{String(index + 1).padStart(2, "0")} / 10</span><span>{named ? "SOLVENTS" : "CATALOGUE POSITION"}</span></div>
            <div className="products-card-main">
              <p className="products-card-status">{named ? "CONFIRMED MATERIAL" : "DETAILS AWAITING CONFIRMATION"}</p>
              <h2>{named ? product.name : `Product ${String(index + 1).padStart(2, "0")}`}</h2>
              <p className="products-card-description">{named ? product.shortDescription : "Catalogue details being prepared."}</p>
            </div>
            <Link className="products-card-link" href="/contact">{named ? "Enquire about this product" : "Send an Enquiry"}<span aria-hidden="true">↗</span></Link>
          </div>
        </li>;
      })}
    </ol>
  </section>;
}
