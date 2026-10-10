"use client";
import { Component, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { clientContent } from "@/lib/content/company";
import { sceneMotion } from "./sceneMotion";

const MaterialCanvas = dynamic(() => import("./MaterialCanvas"), { ssr: false, loading: () => null });

function ChemicalTrace() {
  return <svg className="home-chemical-trace" viewBox="0 0 280 240" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".72">
      <path d="M27 83 82 42 146 65 190 30M82 42l5 81 63 35 60-32M146 65l4 93M150 158l39 43" />
    </g>
    <g fill="currentColor">
      {[[27,83,3],[82,42,4],[146,65,3],[190,30,2.5],[87,123,3.5],[150,158,4],[210,126,3],[189,201,2.5]].map(([x,y,r], index) => <circle key={index} cx={x} cy={y} r={r} />)}
    </g>
  </svg>;
}

function mediaSubscribe(fn: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", fn);
  return () => media.removeEventListener("change", fn);
}
function qualitySubscribe(fn: () => void) {
  const media = matchMedia("(max-width: 767px), (pointer: coarse)");
  media.addEventListener("change", fn);
  return () => media.removeEventListener("change", fn);
}

class CanvasBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useSyncExternalStore(mediaSubscribe, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const mobile = useSyncExternalStore(qualitySubscribe, () => matchMedia("(max-width: 767px), (pointer: coarse)").matches, () => true);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let nearIntro = false;
    let stageInView = false;
    const update = () => setVisible(nearIntro && stageInView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { nearIntro = entry.isIntersecting; if (nearIntro) setReady(true); update(); }, { rootMargin: "200px" });
    const stageObserver = new IntersectionObserver(([entry]) => { stageInView = entry.isIntersecting; update(); });
    observer.observe(element);
    if (stage.current) stageObserver.observe(stage.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); stageObserver.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const introRoot = element;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let context: { revert: () => void } | undefined;
    let responsive: { add: (query: string, callback: () => void) => unknown; revert: () => void } | undefined;
    let disposed = false;
    let revealTimer: number | undefined;
    async function setup() {
      responsive?.revert(); responsive = undefined;
      context?.revert(); context = undefined;
      sceneMotion.progress = 0;
      if (preference.matches) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || preference.matches) return;
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
        ScrollTrigger.create({
          trigger: introRoot, start: "top top", end: "bottom bottom",
          onUpdate(self) { sceneMotion.progress = self.progress; },
        });
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
    return () => { disposed = true; if (revealTimer) clearTimeout(revealTimer); responsive?.revert(); context?.revert(); preference.removeEventListener("change", change); sceneMotion.progress = 0; };
  }, []);

  return <div className="home-intro" ref={root}>
    <div className="home-material-stage" ref={stage} aria-hidden="true">
      <Image src="/materials/chemical-transfer.webp" alt="" fill preload sizes="(max-width: 767px) 100vw, 56vw" className="home-material-image" />
      <div className="home-material-wash" />
      <ChemicalTrace />
      {ready && !reduced && !mobile && <CanvasBoundary><MaterialCanvas active={visible} /></CanvasBoundary>}
      <p className="home-industrial-caption">PETROCHEMICALS <span> / </span> SOLVENTS &amp; THINNERS <span> / </span> DRUM FILLING</p>
    </div>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="home-hero-eyebrow">AFRICHEM GLOBALZ <span> / CHEMICAL EXPORT / SOLVENTS &amp; THINNERS</span></p>
        <h1 id="home-title">
          <span className="home-line"><span>SOURCING</span></span><span className="home-line home-line-accent"><span>SIMPLIFIED.</span></span>
        </h1>
        <p className="home-hero-support"><strong>{clientContent.brand.promise}</strong><br />{clientContent.brand.delivery}</p>
        <div className="home-hero-actions"><Link className="home-primary-link" href="/products">Explore Products <span aria-hidden="true">↗</span></Link><Link className="home-secondary-link" href="/contact">Send an Enquiry <span aria-hidden="true">↗</span></Link></div>
        <span className="home-scroll-cue" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></span>
      </div>
      <div className="home-hero-visual-space" aria-hidden="true" />
    </section>
    {children}
  </div>;
}

