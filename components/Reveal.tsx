"use client";
import { useEffect, useRef } from "react";
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    let gone = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (gone) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(element, { y: 24 }, { y: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 95%", once: true } });
        });
        cleanup = () => mm.revert();
      } catch { /* Server HTML is always visible. */ }
    }, { rootMargin: "100px" });
    observer.observe(element);
    return () => { gone = true; observer.disconnect(); cleanup?.(); };
  }, []);
  return <div ref={scope} className={className}>{children}</div>;
}
