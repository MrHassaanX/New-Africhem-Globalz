"use client";
import { Component, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false, loading: () => null });
const mediaSubscribe = (fn: () => void) => {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", fn);
  return () => media.removeEventListener("change", fn);
};
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <span className="scene-unavailable">Static material preview</span> : this.props.children; }
}
export function SceneStage() {
  const stage = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(mediaSubscribe, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let inView = false;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element); document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div className="material-study" ref={stage}>
    <div className="material-fallback" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <div className="study-caption"><span>01 / MATERIAL STUDY</span><span>GLASS · LIGHT · DEPTH</span></div>
    {enabled && <SceneBoundary><SceneCanvas active={visible} reduced={reduced} /></SceneBoundary>}
    <button className="scene-control" onClick={() => setEnabled(!enabled)} aria-pressed={enabled}>{enabled ? "Close motion preview" : "Preview material motion"} <span aria-hidden="true">{enabled ? "−" : "↗"}</span></button>
  </div>;
}
