"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { clientContent } from "@/lib/content/company";
import { networkLocations } from "@/lib/globe/locations";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false, loading: () => null });

class GlobeBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="globe-fallback" role="img" aria-label="Illustrated Earth" /> : this.props.children; }
}

export function GlobalReachGlobe() {
  const journey = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [painted, setPainted] = useState(false);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const reducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const onPaint = () => setPainted(true);
    window.addEventListener("africhem-globe-ready", onPaint);
    return () => window.removeEventListener("africhem-globe-ready", onPaint);
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) setReady(true);
      update();
    }, { rootMargin: "260px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    if (reducedMotion || !journey.current || !intro.current) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    let responsive: { add: (query: string, callback: () => void) => unknown; revert: () => void } | undefined;
    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !journey.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        responsive = gsap.matchMedia();
        responsive.add("(min-width: 768px)", () => {
          const timeline = gsap.timeline({ scrollTrigger: {
            trigger: journey.current,
            start: "top top",
            end: () => `+=${Math.round(Math.min(window.innerHeight * .52, 520))}`,
            scrub: .65,
            invalidateOnRefresh: true,
          } });
          // Keep the sphere inside its right-side column while the copy is readable.
          timeline.to(intro.current, { opacity: 0, y: -45, ease: "none", duration: .35 }, 0);
          timeline.to(stage.current, { xPercent: () => window.innerWidth < 1100 ? -50 : -46.153846, ease: "none", duration: .6 }, .4);
        });
      }, journey.current);
      revert = () => { responsive?.revert(); context.revert(); };
    }
    void animate().catch(() => { /* The unanimated layout remains readable. */ });
    return () => { disposed = true; revert?.(); };
  }, [reducedMotion]);

  return <section className="reach-globe-journey" ref={journey} id="network-globe" aria-labelledby="reach-title">
    <div className="reach-globe-sticky">
      <div className="reach-globe-meta"><span>AFRICHEM GLOBALZ / GLOBAL REACH</span><span>DRAG TO EXPLORE ↔</span></div>
      <div className="reach-globe-intro" ref={intro}>
        <p>INDIA / SEVEN INTERNATIONAL PARTNER COUNTRIES</p>
        <h1 id="reach-title">GLOBAL<br /><span>REACH.</span></h1>
        <strong>{clientContent.network.overview}</strong>
        <span className="reach-globe-cue">Explore the network <span aria-hidden="true">↔</span></span>
      </div>
      <div ref={stage} className="reach-globe-stage globe-stage">
        <div className="globe-atmosphere" aria-hidden="true" />
        {!painted && <div className="globe-fallback" role="img" aria-label="Illustrated Earth" />}
        {ready && <GlobeBoundary><GlobeScene active={active} reducedMotion={reducedMotion} onSelectionChange={setSelected} /></GlobeBoundary>}
      </div>
      <div className="reach-globe-hud">
        <div className="globe-selection" aria-live="polite">{selected === null ? "SELECT A POINT TO EXPLORE" : <><span>{networkLocations[selected].primary ? "PRIMARY COUNTRY · LAST EXPLORED" : "PARTNER COUNTRY · LAST EXPLORED"}</span><strong>{networkLocations[selected].name}</strong></>}</div>
      </div>
    </div>
  </section>;
}
