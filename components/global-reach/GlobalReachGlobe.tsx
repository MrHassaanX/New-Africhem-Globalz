"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { clientContent } from "@/lib/content/company";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false, loading: () => <div className="globe-fallback" /> });

class GlobeBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="globe-fallback" role="img" aria-label="Illustrated Earth" /> : this.props.children; }
}

export function GlobalReachGlobe() {
  const journey = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sideCopy = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

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
    if (reducedMotion || !journey.current || !stage.current || !sideCopy.current) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    let responsive: { add: (query: string, callback: () => void) => unknown; revert: () => void } | undefined;
    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !journey.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        responsive = gsap.matchMedia();
        responsive.add("(min-width: 1024px)", () => {
          gsap.fromTo(stage.current, { scale: .86, yPercent: 9 }, {
            scale: 1, yPercent: 0, ease: "none",
            scrollTrigger: { trigger: journey.current, start: "top bottom", end: "top top", scrub: .7 },
          });
          gsap.to(stage.current, { xPercent: -10, ease: "none", scrollTrigger: { trigger: journey.current, start: "top top", end: "bottom bottom", scrub: .8 } });
          gsap.fromTo(sideCopy.current, { opacity: 0, y: 34 }, {
            opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: journey.current, start: "top 85%", end: "top 35%", scrub: .5 },
          });
        });
        responsive.add("(min-width: 768px) and (max-width: 1023px)", () => {
          gsap.fromTo(stage.current, { scale: .94, yPercent: 4 }, {
            scale: 1, yPercent: 0, ease: "none",
            scrollTrigger: { trigger: journey.current, start: "top bottom", end: "top top", scrub: .5 },
          });
        });
      }, journey.current);
      revert = () => { responsive?.revert(); context.revert(); };
    }
    void animate().catch(() => { /* The unanimated layout remains readable. */ });
    return () => { disposed = true; revert?.(); };
  }, [reducedMotion]);

  return <section className="reach-globe-journey" ref={journey} id="network-globe" aria-label="Interactive globe of partner locations">
    <div className="reach-globe-sticky">
      <div className="reach-globe-meta"><span>01 / PARTNERS ON THE GROUND</span><span>DRAG TO EXPLORE ↔</span></div>
      <div ref={stage} className="reach-globe-stage globe-stage">
        <div className="globe-atmosphere" aria-hidden="true" />
        {ready ? <GlobeBoundary><GlobeScene active={active} reducedMotion={reducedMotion} /></GlobeBoundary> : <div className="globe-fallback" role="img" aria-label="Illustrated Earth" />}
      </div>
      <div className="reach-globe-sidecopy" ref={sideCopy}>
        <p>SEVEN COUNTRIES. ONE POINT OF CONTACT.</p>
        <strong>{clientContent.network.support}</strong>
      </div>
      <p className="reach-globe-caption">Points mark partner countries. Red arcs illustrate a connected network, not verified shipping routes or Africhem offices.</p>
    </div>
  </section>;
}
