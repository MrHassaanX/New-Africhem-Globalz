"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { m } from "motion/react";
import { navigation } from "@/lib/site";

const subscribe = (callback: () => void) => {
  window.addEventListener("africhem-theme", callback);
  const storage = (event: StorageEvent) => { if (event.key === "africhem-theme") { document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light"; callback(); } };
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener("africhem-theme", callback); window.removeEventListener("storage", storage); };
};
const getTheme = () => document.documentElement.dataset.theme === "dark";
const serverTheme = () => false;

export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const dark = useSyncExternalStore(subscribe, getTheme, serverTheme);
  const isActive = (href: string) => pathname === href || (href === "/categories" && pathname.startsWith("/categories/"));
  function unlock() { document.documentElement.removeAttribute("data-menu-open"); window.dispatchEvent(new CustomEvent("africhem-menu", { detail: false })); }
  function open() { dialog.current?.showModal(); document.documentElement.dataset.menuOpen = "true"; window.dispatchEvent(new CustomEvent("africhem-menu", { detail: true })); }
  function close() { dialog.current?.close(); unlock(); trigger.current?.focus(); }
  function toggleTheme() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("africhem-theme", theme); } catch { /* Temporary choice still works. */ }
    window.dispatchEvent(new Event("africhem-theme"));
  }
  useEffect(() => {
    const update = () => header.current?.classList.toggle("is-scrolled", window.scrollY > 12);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    dialog.current?.close();
    const media = matchMedia("(min-width: 1100px)");
    const resize = () => { if (media.matches) { dialog.current?.close(); unlock(); } };
    media.addEventListener("change", resize);
    return () => { media.removeEventListener("change", resize); unlock(); };
  }, [pathname]);
  return <header className="header" ref={header}>
    <Link href="/" className="brand" aria-label="Africhem Globalz — Home">
      <Image src="/africhem-logo.png" alt="AFRICHEM GLOBALZ" width={1041} height={271} sizes="(max-width: 600px) 145px, 190px" priority />
    </Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item =>
      <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>
    )}</nav>
    <div className="header-actions">
      <button className="theme-button" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={dark}><span aria-hidden="true">{dark ? "☼" : "◐"}</span></button>
      <Link className="enquire" href="/contact">Enquire <span aria-hidden="true">↗</span></Link>
      <button className="menu-button" ref={trigger} onClick={open} aria-label="Open navigation" aria-haspopup="dialog">Menu <span aria-hidden="true">☰</span></button>
    </div>
    <dialog data-lenis-prevent onClose={unlock} ref={dialog} className="mobile-menu" aria-label="Navigation" onClick={e => { if (e.target === dialog.current) close(); }}>
      <div className="mobile-menu-inner">
        <div className="menu-top"><span>AFRICHEM GLOBALZ</span><button onClick={close} aria-label="Close navigation" autoFocus>Close ×</button></div>
        <nav aria-label="Mobile navigation">{navigation.map((item, i) =>
          <m.div key={item.href} whileHover={{ x: 5 }} transition={{ duration: .2 }}>
            <Link href={item.href} onClick={close} aria-current={isActive(item.href) ? "page" : undefined}><span>0{i + 1}</span>{item.label}<span aria-hidden="true">↗</span></Link>
          </m.div>
        )}</nav>
        <p>Chemical sourcing, trading<br />and distribution.</p>
      </div>
    </dialog>
  </header>;
}
