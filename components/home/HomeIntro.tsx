"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuoteLink } from "@/components/QuoteLink";

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const introRoot = element;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let context: { revert: () => void } | undefined;
    let responsive: { add: (query: string, callback: () => void) => unknown; revert: () => void } | undefined;
    let disposed = false;
    let setupVersion = 0;
    let revealTimer: number | undefined;
    async function setup() {
      const version = ++setupVersion;
      responsive?.revert(); responsive = undefined;
      context?.revert(); context = undefined;
      if (preference.matches) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || preference.matches || version !== setupVersion) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const heroCopy = introRoot.querySelector(".home-hero-copy");
        const lines = introRoot.querySelectorAll(".home-line > span");
        const eyebrow = introRoot.querySelector(".home-hero-eyebrow");
        const supporting = introRoot.querySelector(".home-hero-support");
        const actions = introRoot.querySelector(".home-hero-actions");
        const capabilities = introRoot.querySelector(".home-capabilities");
        const rows = introRoot.querySelectorAll(".capability-row");
        const processLine = introRoot.querySelector(".home-process-line span");
        responsive = gsap.matchMedia();
        responsive.add("(min-width: 768px)", () => {
          if (stage.current) {
            gsap.to(stage.current, { xPercent: -14, scale: 1.17, ease: "none", scrollTrigger: { trigger: introRoot, start: "top top", end: "bottom bottom", scrub: .75 } });
            gsap.to(stage.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: capabilities, start: "55% center", end: "bottom center", scrub: true } });
          }
          if (heroCopy) gsap.to(heroCopy, { y: -55, opacity: .18, ease: "none", scrollTrigger: { trigger: introRoot, start: "top top", end: "55% top", scrub: .8 } });
          if (processLine && capabilities) gsap.to(processLine, { scaleX: 1, ease: "none", scrollTrigger: { trigger: capabilities, start: "top 80%", end: "bottom 45%", scrub: .6 } });
          rows.forEach((row) => {
            gsap.fromTo(row, { y: 20, opacity: .55 }, { y: 0, opacity: 1, duration: .7, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 85%", once: true } });
            const title = row.querySelector("h3 span");
            if (title) gsap.fromTo(title, { yPercent: 105 }, { yPercent: 0, duration: .75, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 85%", once: true } });
          });
        });
        responsive.add("(max-width: 767px)", () => {
          rows.forEach((row) => gsap.fromTo(row, { y: 12, opacity: .75 }, { y: 0, opacity: 1, duration: .5, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 92%", once: true } }));
        });
        const entrance = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        entrance.from(eyebrow, { opacity: 0, y: 16, duration: .65 })
          .from(lines, { yPercent: 105, stagger: window.innerWidth < 768 ? .1 : .16, duration: window.innerWidth < 768 ? .75 : 1.05 }, "-=.36")
          .from(supporting, { opacity: 0, y: 22, duration: .75 }, "-=.52")
          .from(actions, { opacity: 0, y: 18, duration: .7 }, "-=.52");
        const introVisible = document.documentElement.dataset.intro === "show";
        revealTimer = window.setTimeout(() => { if (!disposed) entrance.play(); }, introVisible ? 2200 : 100);
      }, introRoot);
    }
    const change = () => { if (revealTimer) clearTimeout(revealTimer); void setup().catch(() => {}); };
    change(); preference.addEventListener("change", change);
    return () => { disposed = true; setupVersion++; if (revealTimer) clearTimeout(revealTimer); responsive?.revert(); context?.revert(); preference.removeEventListener("change", change); };
  }, []);

  return <div className="home-intro" ref={root}>
    <div className="home-material-stage" ref={stage} aria-hidden="true">
      <Image src="/stock/industrial-tanks-sunset.webp" alt="" fill preload sizes="(max-width: 767px) 100vw, 56vw" className="home-material-image" />
      <div className="home-material-wash" />
      <p className="home-industrial-caption">ILLUSTRATIVE INDUSTRY PHOTOGRAPHY · NOT AN AFRICHEM FACILITY</p>
    </div>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-hero-eyebrow">AFRICHEM GLOBALZ <span> / INDUSTRIAL CHEMICALS</span></p>
        <h1 id="home-title">
          <span className="home-line"><span>Industrial chemicals, </span></span>
          <span className="home-line home-line-accent"><span>sourced, verified </span></span>
          <span className="home-line"><span>and shipped to your port.</span></span>
        </h1>
        <p className="home-tagline">SOURCING SIMPLIFIED.</p>
        <p className="home-hero-support">Tell us the material, specification, quantity and destination. We coordinate the sourcing conversation, available documents and delivery requirements before quoting.</p>
        <div className="home-hero-actions"><QuoteLink /><Link className="home-secondary-link" href="/how-it-works">See How It Works <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className="home-hero-visual-space" aria-hidden="true" />
    </section>
    {children}
  </div>;
}
