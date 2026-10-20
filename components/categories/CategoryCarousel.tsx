"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { CategoryArtwork } from "./CategoryArtwork";
import "@/app/categories/categories.css";

const number = (value: number) => String(value).padStart(2, "0");

type Position = "center" | "left" | "right" | "far";

export function CategoryCarousel({ label = "Explore categories" }: { label?: string }) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const focusAfterSelection = useRef(false);
  const selectedLink = useRef<HTMLAnchorElement>(null);
  const count = categories.length;
  const move = (step: number) => setActive(current => (current + step + count) % count);

  useEffect(() => {
    if (!focusAfterSelection.current) return;
    selectedLink.current?.focus();
    focusAfterSelection.current = false;
  }, [active]);

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

  return <div className="category-carousel" role="region" aria-roledescription="carousel" aria-label={label}
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        focusAfterSelection.current = event.target instanceof HTMLElement && Boolean(event.target.closest(".category-card"));
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    }}>
    <div className="category-carousel-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { pointerStart.current = null; }}
      onClickCapture={event => { if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); } }}>
      {categories.map((category, index) => {
        const placement = position(index);
        const selected = placement === "center";
        const far = placement === "far";
        return <article className="category-card" data-position={placement} data-visual={category.visual} key={category.id}
          aria-label={selected ? category.name : undefined} aria-hidden={far || undefined}>
          <div className="category-card-surface">
            <CategoryArtwork visual={category.visual} />
            <div className="category-card-grain" aria-hidden="true" />
            <div className="category-card-top" aria-hidden={!selected}><span>AFRICHEM GLOBALZ</span><span>{number(index + 1)} / {number(count)}</span></div>
            <div className="category-card-copy" aria-hidden={!selected}>
              <p className="category-card-eyebrow">OUR CATEGORIES</p>
              <h3>{category.name}</h3>
              <p className="category-card-description">{category.description}</p>
            </div>
            <Link ref={selected ? selectedLink : undefined} className="category-card-link" href={`/categories/${category.slug}`} tabIndex={selected ? 0 : -1} aria-hidden={!selected}>
              Explore Category <span aria-hidden="true">↗</span>
            </Link>
            {!selected && !far && <button type="button" className="category-card-select" onClick={() => { focusAfterSelection.current = true; setActive(index); }}
              aria-label={`Show ${category.name} category`} />}
          </div>
        </article>;
      })}
    </div>
    <div className="category-carousel-controls">
      <div className="category-carousel-progress" aria-live="polite" aria-atomic="true">
        <span className="category-carousel-count">{number(active + 1)} <span>/ {number(count)}</span></span>
        <span className="category-carousel-active-name">{categories[active].name}</span>
      </div>
      <div className="category-carousel-buttons">
        <button type="button" onClick={() => move(-1)} aria-label="Previous category"><span aria-hidden="true">←</span></button>
        <button type="button" onClick={() => move(1)} aria-label="Next category"><span aria-hidden="true">→</span></button>
      </div>
    </div>
  </div>;
}
