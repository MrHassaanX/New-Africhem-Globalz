const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const base = "http://127.0.0.1:3100";
const widths = [320, 360, 375, 390, 430, 600, 768, 1024, 1280, 1366, 1440, 1920];
const routes = ["/", "/about", "/industries", "/products", "/global-reach", "/contact", "/privacy", "/terms"];
const shotRoutes = new Set(routes);
const shotWidths = new Set([320, 375, 390, 768, 1366, 1440, 1920]);
const artifactDir = path.join(__dirname, "artifacts", "site-wide");
fs.mkdirSync(artifactDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];
  const issues = [];
  for (const theme of ["dark", "light"]) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await context.addInitScript(value => {
        localStorage.setItem("africhem-theme", value);
        sessionStorage.setItem("africhem-intro-v1", "1");
      }, theme);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      for (const route of routes) {
        const response = await page.goto(base + route, { waitUntil: "domcontentloaded" });
        await page.locator("h1").first().waitFor({ timeout: 10000 });
        const state = await page.evaluate(() => {
          const heading = document.querySelector("h1");
          const body = document.body;
          const main = document.querySelector("main");
          const footer = document.querySelector("footer");
          const elements = [...document.querySelectorAll("h1,h2,h3,p,a,button")];
          const clipped = elements.filter(element => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1) &&
              style.display !== "none" && style.visibility !== "hidden" &&
              style.position !== "absolute" && style.position !== "fixed";
          }).slice(0, 5).map(element => `${element.tagName}:${element.textContent?.trim().slice(0, 30)}`);
          return {
            theme: document.documentElement.dataset.theme,
            heading: heading?.textContent?.trim(),
            overflow: Math.max(document.documentElement.scrollWidth, body.scrollWidth) - innerWidth,
            clipped,
            main: !!main,
            footer: !!footer,
            brandVisible: !!document.querySelector(".brand img")?.getBoundingClientRect().width,
            menuVisible: getComputedStyle(document.querySelector(".menu-button")).display !== "none",
            bodyFont: parseFloat(getComputedStyle(body).fontSize),
          };
        });
        const caseName = `${theme} ${width} ${route}`;
        if (response?.status() !== 200) issues.push(`${caseName}: HTTP ${response?.status()}`);
        if (state.theme !== theme) issues.push(`${caseName}: theme mismatch ${state.theme}`);
        if (state.overflow > 1) issues.push(`${caseName}: horizontal overflow ${state.overflow}px`);
        if (state.clipped.length) issues.push(`${caseName}: clipped left ${state.clipped.join(", ")}`);
        if (!state.main || !state.footer || !state.brandVisible || !state.heading) issues.push(`${caseName}: missing shell/content`);
        if (state.menuVisible !== (width < 1100)) issues.push(`${caseName}: menu breakpoint mismatch`);
        if (shotRoutes.has(route) && shotWidths.has(width)) {
          const name = route === "/" ? "home" : route.slice(1);
          await page.screenshot({ path: path.join(artifactDir, `${name}-${theme}-${width}.png`) });
          if (route === "/" && [375, 1440].includes(width)) {
            await page.locator(".home-capabilities").scrollIntoViewIfNeeded();
            await page.screenshot({ path: path.join(artifactDir, `process-${theme}-${width}.png`) });
          }
          if (route === "/global-reach" && [320, 375, 430, 1440].includes(width)) {
            await page.locator("#network-globe").scrollIntoViewIfNeeded();
            await page.waitForTimeout(1500);
            await page.screenshot({ path: path.join(artifactDir, `globe-${theme}-${width}.png`) });
          }
        }
        results.push({ caseName, ...state });
      }
      if (errors.length) issues.push(`${theme} ${width}: ${[...new Set(errors)].join(" | ")}`);
      await context.close();
    }
  }
  await browser.close();
  const report = { cases: results.length, issues, results };
  fs.writeFileSync(path.join(artifactDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ cases: report.cases, issues: report.issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
