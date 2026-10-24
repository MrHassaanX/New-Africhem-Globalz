const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const base = "http://127.0.0.1:3100";
const widths = [320, 375, 390, 430, 600, 768, 1024, 1366, 1440, 1920];
const routes = ["/", "/products", "/products/thinners-and-white-spirit", "/products/thinners-and-white-spirit/white-spirit", "/other-businesses", "/how-it-works", "/global-reach", "/about", "/contact"];
const shots = new Set(["/", "/products", "/other-businesses", "/global-reach", "/about", "/contact"]);
const dir = path.join(__dirname, "artifacts", "revision");
fs.mkdirSync(dir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const issues = []; const results = [];
  for (const theme of ["light", "dark"]) for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await context.addInitScript(value => { localStorage.setItem("africhem-theme", value); sessionStorage.setItem("africhem-intro-v1", "1"); }, theme);
    const page = await context.newPage();
    page.on("pageerror", error => issues.push(`${theme} ${width}: ${error.message}`));
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.locator("h1").first().waitFor({ timeout: 10000 });
      const state = await page.evaluate(() => ({
        heading: document.querySelector("h1")?.textContent?.trim(),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        theme: document.documentElement.dataset.theme,
        quote: [...document.querySelectorAll("a.quote-button")].every(link => link.getAttribute("href")?.includes("/contact") && link.getAttribute("href")?.includes("#quote")),
        flags: document.querySelectorAll(".reach-country-list img[src*='/flags/']").length,
        formEnabled: !document.querySelector(".quote-form-shell button[type='submit']")?.hasAttribute("disabled"),
      }));
      const label = `${theme} ${width} ${route}`;
      if (response?.status() !== 200) issues.push(`${label}: HTTP ${response?.status()}`);
      if (state.overflow > 1) issues.push(`${label}: overflow ${state.overflow}px`);
      if (state.theme !== theme) issues.push(`${label}: theme ${state.theme}`);
      if (!state.quote) issues.push(`${label}: quote link destination`);
      if (route === "/global-reach" && state.flags !== 8) issues.push(`${label}: ${state.flags} flags`);
      if (route === "/contact" && state.formEnabled) issues.push(`${label}: form unexpectedly enabled without credentials`);
      if (shots.has(route) && [390, 1440].includes(width)) {
        await page.screenshot({ path: path.join(dir, `${route === "/" ? "home" : route.slice(1)}-${theme}-${width}.png`), fullPage: false });
        if (route === "/global-reach") { await page.locator("#network-globe").scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: path.join(dir, `globe-${theme}-${width}.png`), fullPage: false }); }
      }
      results.push({ label, ...state });
    }
    await context.close();
  }
  const page = await browser.newPage();
  for (const [oldPath, expected] of [["/categories", "/products"], ["/categories/chemicals", "/products/thinners-and-white-spirit"], ["/categories/footwear", "/other-businesses/footwear"], ["/categories/uganda-agro-exports", "/other-businesses/agro"], ["/categories/recycling", "/other-businesses/scrap-recycling"], ["/industries", "/other-businesses"]]) {
    const response = await page.request.get(base + oldPath, { maxRedirects: 0 });
    if (response.status() !== 308 || !response.headers().location?.endsWith(expected)) issues.push(`${oldPath}: redirect ${response.status()} ${response.headers().location}`);
  }
  const invalid = await page.request.post(base + "/api/quote", { data: {} });
  if (invalid.status() !== 400) issues.push(`invalid quote: HTTP ${invalid.status()}`);
  const valid = await page.request.post(base + "/api/quote", { data: { name: "Test", company: "Test Co", country: "India", email: "test@example.com", phone: "+916362830638", category: "thinners-and-white-spirit", product: "white-spirit", quantity: "1", unit: "tonnes", destination: "Kuwait", message: "Test enquiry" } });
  if (valid.status() !== 503) issues.push(`unconfigured quote: HTTP ${valid.status()}`);
  await browser.close();
  fs.writeFileSync(path.join(dir, "report.json"), JSON.stringify({ cases: results.length, issues, results }, null, 2));
  console.log(JSON.stringify({ cases: results.length, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
