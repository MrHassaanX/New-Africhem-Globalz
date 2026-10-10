const { chromium } = require("./tools/node_modules/@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  fs.mkdirSync(path.join(__dirname, "artifacts"), { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.addInitScript(() => {
    window.__metrics = { cls: 0, lcp: 0 };
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__metrics.cls += e.value; }).observe({type:"layout-shift", buffered:true});
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.__metrics.lcp = e.startTime; }).observe({type:"largest-contentful-paint", buffered:true});
  });
  const response = await page.goto("http://localhost:3100", { waitUntil: "networkidle" });
  await page.waitForTimeout(2900);
  const firstLoad = await page.evaluate(() => ({
    ...window.__metrics, intro: document.documentElement.dataset.intro || null,
    canvasCount: document.querySelectorAll("canvas").length,
    resources: performance.getEntriesByType("resource").map(e => ({ name: e.name.split("/").pop(), size: e.transferSize, decoded: e.decodedBodySize, type: e.initiatorType })),
  }));
  const widths = [];
  for (const width of [320,375,430,768,1024,1440,1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(150);
    widths.push(await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth })));
    await page.screenshot({ path: path.join(__dirname, "artifacts", "home-" + width + ".png"), fullPage: true });
  }
  await page.setViewportSize({ width: 768, height: 500 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("dialog").hover();
  await page.mouse.wheel(0, 450);
  await page.waitForTimeout(250);
  const menu = await page.evaluate(() => ({ open: document.querySelector("dialog").open, scroll: document.querySelector("dialog").scrollTop, backgroundScroll: scrollY, lock: document.documentElement.dataset.menuOpen }));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const closed = await page.evaluate(() => ({ open: document.querySelector("dialog").open, lock: document.documentElement.dataset.menuOpen || null, focus: document.activeElement.getAttribute("aria-label") }));
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.screenshot({path:path.join(__dirname,"artifacts","dark.png"),fullPage:true});
  await page.reload({waitUntil:"networkidle"});
  const persistence = await page.evaluate(() => ({theme:document.documentElement.dataset.theme,intro:document.documentElement.dataset.intro || null}));
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  const routes = [];
  for (const route of ["about","products","industries","global-reach","contact","privacy","terms"]) {
    const res = await page.goto("http://localhost:3100/" + route, {waitUntil:"networkidle"});
    routes.push({ route, status: res.status(), noindex: res.headers()["x-robots-tag"], title: await page.title(), canvas: await page.locator("canvas").count() });
  }
  await page.goto("http://localhost:3100", {waitUntil:"networkidle"});
  await page.getByRole("button", { name: "Preview material motion" }).click();
  await page.waitForTimeout(2500);
  const scene = {canvas:await page.locator("canvas").count(),fallback:await page.locator(".scene-unavailable").count()};
  await page.screenshot({path:path.join(__dirname,"artifacts","scene.png"),fullPage:false});
  await page.getByRole("button", { name: "Close motion preview" }).click();
  const reducedContext = await browser.newContext({reducedMotion:"reduce",viewport:{width:375,height:800}});
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("http://localhost:3100", {waitUntil:"networkidle"});
  const reduced = await reducedPage.evaluate(() => ({intro:document.documentElement.dataset.intro || null,lenis:document.documentElement.classList.contains("lenis"),animation:getComputedStyle(document.querySelector(".route-enter")).animationName}));
  const noJs = await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:800}});
  const staticPage = await noJs.newPage();
  await staticPage.goto("http://localhost:3100");
  const staticContent = await staticPage.locator("h1").textContent();
  const report = {status:response.status(),noindex:response.headers()["x-robots-tag"],firstLoad,widths,menu,closed,persistence,routes,scene,reduced,staticContent,errors};
  fs.writeFileSync(path.join(__dirname,"artifacts","report.json"),JSON.stringify(report,null,2));
  console.log(JSON.stringify({...report,firstLoad:{...firstLoad,resources:firstLoad.resources.length}},null,2));
  await browser.close();
})().catch(e => {console.error(e);process.exitCode=1});
