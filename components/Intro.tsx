import Image from "next/image";
// CSS owns the deadline, so a failed hydration cannot leave a blocking intro.
export const introScript = `try {
  var theme = localStorage.getItem("africhem-theme");
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
} catch {}
try {
  if (!sessionStorage.getItem("africhem-intro-v1") && !matchMedia("(prefers-reduced-motion: reduce)").matches && !["/privacy", "/terms"].includes(location.pathname)) {
    sessionStorage.setItem("africhem-intro-v1", "1");
    document.documentElement.dataset.intro = "show";
    setTimeout(function(){ delete document.documentElement.dataset.intro; }, 2800);
    document.addEventListener("keydown", function(){ delete document.documentElement.dataset.intro; }, {once:true});
  }
} catch {}`;
export function Intro() {
  return <div className="intro" aria-hidden="true"><div className="intro-light" /><div className="intro-content"><Image src="/africhem-logo.png" alt="" width={1041} height={271} sizes="280px" /><p>SOURCING SIMPLIFIED.</p><span className="intro-rule" /></div></div>;
}
