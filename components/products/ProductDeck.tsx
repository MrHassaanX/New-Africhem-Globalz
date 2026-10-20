"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductPosition } from "@/lib/catalogue";
import type { CategoryVisual } from "@/lib/categories";
import { CategoryArtwork } from "@/components/categories/CategoryArtwork";

const enquiryTopics = [
  { title: "Start with your brief.", description: "Share the material or product you have in mind." },
  { title: "Tell us the details.", description: "Let us know which requirements matter most." },
  { title: "Explore the range.", description: "Ask our team what information is currently available." },
  { title: "Check availability.", description: "We can confirm current options in conversation." },
  { title: "Discuss your timing.", description: "Share your target date with our team." },
  { title: "Request information.", description: "Further product details are available on enquiry." },
  { title: "Let's talk specifics.", description: "Bring your questions and we'll work through them." },
] as const;

export function ProductDeck({ products, label = "Products catalogue", categoryLabel, categoryVisual }: {
  products: readonly ProductPosition[];
  label?: string;
  categoryLabel?: string;
  categoryVisual?: CategoryVisual;
}) {
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

  return <section className="products-deck" ref={root} aria-label={label} data-category={categoryVisual}
    style={{ "--deck-count": products.length } as CSSProperties}>
    <ol className="products-deck-stage">
      {products.map((product, index) => {
        const named = product.status === "name-verified";
        return <li className="products-card" data-status={product.status} key={product.id}>
          <div className="products-card-art" data-visual={index + 1}>
            {product.image ? <Image src={product.image} alt="" fill sizes="(max-width: 767px) 92vw, 50vw" loading={index === 0 ? "eager" : "lazy"} /> : categoryVisual && <CategoryArtwork visual={categoryVisual} />}
            <span className="products-art-caption">{product.image?.startsWith("/stock/") || (!product.image && categoryVisual) ? "ILLUSTRATIVE INDUSTRY PHOTOGRAPH" : "ILLUSTRATIVE MATERIAL STUDY"}</span>
          </div>
          <div className="products-card-content">
            <div className="products-card-top"><span className="products-card-number">{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span><span>{named ? product.category.toUpperCase() : categoryLabel?.toUpperCase() ?? "PRODUCTS & MATERIALS"}</span></div>
            <div className="products-card-main">
              <p className="products-card-status">{named ? "PRODUCT IN FOCUS" : "ENQUIRE ABOUT THE RANGE"}</p>
              <h2>{named ? product.name : enquiryTopics[index % enquiryTopics.length].title}</h2>
              <p className="products-card-description">{named ? product.shortDescription : enquiryTopics[index % enquiryTopics.length].description}</p>
            </div>
            <Link className="products-card-link" href="/contact">{named ? "Enquire about this product" : "Ask about this range"}<span aria-hidden="true">↗</span></Link>
          </div>
        </li>;
      })}
    </ol>
  </section>;
}
