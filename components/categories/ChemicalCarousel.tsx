"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { chemicalFamilies } from "@/lib/chemical-catalogue";
import { quoteHref } from "@/components/QuoteLink";
import "@/app/categories/categories.css";

const number = (value: number) => String(value).padStart(2, "0");
type Position = "center" | "left" | "right" | "far";

export function ChemicalCarousel({ label = "Chemical families" }: { label?: string }) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const focusAfterSelection = useRef(false);
  const selectedLink = useRef<HTMLAnchorElement>(null);
  const count = chemicalFamilies.length;
  const move = (step: number) => setActive(current => (current + step + count) % count);
  useEffect(() => { if (focusAfterSelection.current) { selectedLink.current?.focus(); focusAfterSelection.current = false; } }, [active]);
  function position(index: number): Position {
    const distance = (index - active + count) % count;
    return distance === 0 ? "center" : distance === 1 ? "right" : distance === count - 1 ? "left" : "far";
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClickUntil.current = performance.now() + 400;
      move(dx < 0 ? 1 : -1);
    }
  }
  return <div className="category-carousel chemical-carousel" role="region" aria-roledescription="carousel" aria-label={label}
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        focusAfterSelection.current = event.target instanceof HTMLElement && Boolean(event.target.closest(".category-card"));
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    }}>
    <div className="category-carousel-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { pointerStart.current = null; }}
      onClickCapture={event => { if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); } }}>
      {chemicalFamilies.map((family, index) => {
        const placement = position(index);
        const selected = placement === "center";
        const far = placement === "far";
        return <article className="category-card" data-position={placement} key={family.slug} aria-hidden={far || undefined}>
          <div className="category-card-surface">
            <div className="category-art" aria-hidden="true"><Image src={family.image} alt="" fill sizes="(max-width: 767px) 84vw, 460px" className="category-art-image" /></div>
            <div className="category-card-grain" aria-hidden="true" />
            <div className="category-card-top"><span>AFRICHEM GLOBALZ</span><span>{number(index + 1)} / {number(count)}</span></div>
            <div className="category-card-copy"><p className="category-card-eyebrow">CHEMICAL FAMILY</p><h3>{family.name}</h3><p className="category-card-description">{family.description}</p></div>
            {selected && <div className="chemical-card-actions"><Link ref={selectedLink} className="category-card-link" href={`/products/${family.slug}`}>Explore Family <span aria-hidden="true">→</span></Link><Link className="chemical-card-quote" href={quoteHref(family.slug)}>Get a Quote <span aria-hidden="true">→</span></Link></div>}
            {!selected && !far && <button type="button" className="category-card-select" onClick={() => { focusAfterSelection.current = true; setActive(index); }} aria-label={`Show ${family.name}`} />}
          </div>
        </article>;
      })}
    </div>
    <div className="category-carousel-controls"><div className="category-carousel-progress" aria-live="polite" aria-atomic="true"><span className="category-carousel-count">{number(active + 1)} <span>/ {number(count)}</span></span><span className="category-carousel-active-name">{chemicalFamilies[active].name}</span></div><div className="category-carousel-buttons"><button type="button" onClick={() => move(-1)} aria-label="Previous family">←</button><button type="button" onClick={() => move(1)} aria-label="Next family">→</button></div></div>
    <nav className="chemical-carousel-overview" aria-label="All five chemical families"><ol>{chemicalFamilies.map((family, index) => <li key={family.slug}><Link href={`/products/${family.slug}`}><span>{number(index + 1)}</span>{family.name}</Link></li>)}</ol></nav>
  </div>;
}
