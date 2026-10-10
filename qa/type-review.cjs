const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const phase = process.argv[2] || "before";
const dimensions = [[1366,768],[1440,900],[1920,1080],[390,844]];
const sections = [
  ["home-process", "/", ".home-capabilities", ".home-capabilities-head h2"],
  ["home-products", "/", ".home-products", ".home-section-heading h2"],
  ["about-story", "/about", ".about-story", ".about-story h2"],
  ["about-strengths", "/about", ".about-strengths", ".about-section-head h2"],
  ["about-process", "/about", ".about-process", ".about-process h2"],
];
const out = path.join(__dirname, "artifacts", "type-refinement", phase);
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const metrics = [];
  for (const [width,height] of dimensions) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    await context.addInitScript(() => { localStorage.setItem("africhem-theme", "dark"); sessionStorage.setItem("africhem-intro-v1", "1"); });
    const page = await context.newPage();
    let activeRoute = "";
    for (const [name,route,selector,headingSelector] of sections) {
      if (route !== activeRoute) { await page.goto("http://127.0.0.1:3100" + route, { waitUntil: "networkidle" }); activeRoute = route; }
      await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element) return;
        const header = document.querySelector(".header")?.getBoundingClientRect().height ?? 0;
        scrollTo(0, element.getBoundingClientRect().top + scrollY - header);
      }, selector);
      await page.waitForTimeout(100);
      await page.screenshot({ path: path.join(out, `${name}-${width}x${height}.png`) });
      const row = await page.evaluate(({selector,headingSelector}) => {
        const section = document.querySelector(selector);
        const heading = document.querySelector(headingSelector);
        const headingRect = heading.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const style = getComputedStyle(heading);
        return {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          headingLeft: Math.round(headingRect.left),
          headingTop: Math.round(headingRect.top),
          headingWidth: Math.round(headingRect.width),
          headingHeight: Math.round(headingRect.height),
          sectionHeight: Math.round(sectionRect.height),
          viewportWidth: innerWidth,
          viewportHeight: innerHeight,
        };
      }, { selector, headingSelector });
      metrics.push({ name, width, height, ...row });
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, "metrics.json"), JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify({ phase, screenshots: metrics.length, metrics }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
