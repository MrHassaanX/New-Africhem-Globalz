"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    let generation = 0;
    async function configure() {
      const current = ++generation;
      dispose?.(); dispose = undefined;
      // Only the globe journey currently needs synchronized smooth scroll.
      if (preference.matches || pathname !== "/global-reach") return;
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"), import("gsap"), import("gsap/ScrollTrigger"),
      ]);
      if (current !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: true });
      const menu = (event: Event) => { if ((event as CustomEvent<boolean>).detail) lenis.stop(); else lenis.start(); };
      window.addEventListener("africhem-menu", menu);
      if (document.documentElement.dataset.menuOpen) lenis.stop();
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      // One clock: never run Lenis autoRaf alongside the GSAP ticker.
      ScrollTrigger.refresh();
      let refreshTimer: number | undefined;
      const scheduleRefresh = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      };
      const main = document.querySelector("main");
      const resizeObserver = main ? new ResizeObserver(scheduleRefresh) : undefined;
      if (main) resizeObserver?.observe(main);
      window.addEventListener("load", scheduleRefresh, { once: true });
      window.addEventListener("resize", scheduleRefresh, { passive: true });
      document.addEventListener("load", scheduleRefresh, true);
      window.addEventListener("africhem-canvas-ready", scheduleRefresh);
      void document.fonts.ready.then(scheduleRefresh);
      dispose = () => {
        window.clearTimeout(refreshTimer);
        resizeObserver?.disconnect();
        window.removeEventListener("load", scheduleRefresh);
        window.removeEventListener("resize", scheduleRefresh);
        document.removeEventListener("load", scheduleRefresh, true);
        window.removeEventListener("africhem-canvas-ready", scheduleRefresh);
        window.removeEventListener("africhem-menu", menu);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    }
    const update = () => { void configure().catch(() => { /* Native scrolling remains available. */ }); };
    update(); preference.addEventListener("change", update);
    return () => { generation++; dispose?.(); preference.removeEventListener("change", update); };
  }, [pathname]);
  return <LazyMotion features={domAnimation}><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>;
}

