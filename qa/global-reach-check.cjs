const { chromium } = require("playwright");
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

const base = "http://127.0.0.1:3100";
const widths = [375, 430, 768, 1024, 1440, 1920];
const countries = ["Kuwait", "UAE", "China", "Algeria", "Egypt", "Uganda", "Kenya"];
const artifactDir = path.join(__dirname, "artifacts");
fs.mkdirSync(artifactDir, { recursive: true });

async function meanPixelDifference(first, second) {
  const a = await sharp(first).resize(160, 160).removeAlpha().raw().toBuffer();
  const b = await sharp(second).resize(160, 160).removeAlpha().raw().toBuffer();
  let total = 0;
  for (let index = 0; index < a.length; index++) total += Math.abs(a[index] - b[index]);
  return total / a.length;
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];
  const issues = [];

  for (const theme of ["dark", "light"]) for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
    await context.addInitScript(value => {
      localStorage.setItem("africhem-theme", value);
      sessionStorage.setItem("africhem-intro-v1", "1");
    }, theme);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("requestfailed", request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const response = await page.goto(`${base}/global-reach`, { waitUntil: "networkidle" });
    if ([375, 1440].includes(width)) await page.screenshot({ path: path.join(artifactDir, `reach-hero-${theme}-${width}.png`) });
    await page.evaluate(() => {
      const element = document.getElementById("network-globe");
      if (element) scrollTo(0, element.getBoundingClientRect().top + scrollY + 180);
    });
    await page.waitForTimeout(1700);
    const state = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      heading: document.querySelector("h1")?.textContent,
      countries: [...document.querySelectorAll(".reach-country-list strong")].map(element => element.textContent),
      canvas: document.querySelectorAll(".reach-globe-stage canvas").length,
      fallback: document.querySelectorAll(".reach-globe-stage .globe-fallback").length,
      overflow: document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth,
      header: !!document.querySelector(".header"),
      background: getComputedStyle(document.querySelector(".reach-globe-journey")).backgroundImage,
    }));
    if (response?.status() !== 200) issues.push(`${theme} ${width}: HTTP ${response?.status()}`);
    if (state.theme !== theme || state.heading !== "GLOBALREACH.") issues.push(`${theme} ${width}: theme or heading mismatch`);
    if (state.countries.join("/") !== countries.join("/")) issues.push(`${theme} ${width}: partner countries mismatch`);
    if (state.canvas !== 1 || state.fallback || !state.header) issues.push(`${theme} ${width}: globe canvas or shell missing`);
    if (state.overflow) issues.push(`${theme} ${width}: horizontal overflow`);
    if (errors.length) issues.push(`${theme} ${width}: ${errors.join(" | ")}`);
    await page.screenshot({ path: path.join(artifactDir, `reach-${theme}-${width}.png`) });
    if ([375, 1440].includes(width)) {
      await page.locator(".reach-partners").scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(artifactDir, `reach-partners-${theme}-${width}.png`) });
    }
    results.push({ theme, width, ...state, errors });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/global-reach`, { waitUntil: "networkidle" });
  await page.evaluate(() => { const element = document.getElementById("network-globe"); scrollTo(0, element.getBoundingClientRect().top + scrollY + 180); });
  await page.waitForTimeout(900);
  const input = page.locator(".globe-input");
  const box = await input.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 8, { steps: 10 });
  const dragging = await input.getAttribute("data-dragging");
  await page.mouse.up();
  const released = await input.getAttribute("data-dragging");
  if (dragging !== "true" || released !== "false") issues.push("desktop drag state failed");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1900);
  const rotationBefore = await page.locator(".reach-globe-stage canvas").screenshot();
  await page.waitForTimeout(2500);
  const rotationAfter = await page.locator(".reach-globe-stage canvas").screenshot();
  const idleRotationDifference = await meanPixelDifference(rotationBefore, rotationAfter);
  if (idleRotationDifference < 2) issues.push(`auto-rotation did not visibly resume: ${idleRotationDifference.toFixed(2)}`);
  const themeBefore = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.locator(".theme-button").click();
  await page.waitForTimeout(200);
  const themeAfter = await page.evaluate(() => document.documentElement.dataset.theme);
  if (themeBefore === themeAfter || await page.locator(".reach-globe-stage canvas").count() !== 1) issues.push("theme toggle disrupted globe");
  await context.close();

  const touch = await browser.newContext({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true });
  await touch.addInitScript(() => { localStorage.setItem("africhem-theme", "dark"); sessionStorage.setItem("africhem-intro-v1", "1"); });
  const touchPage = await touch.newPage();
  await touchPage.goto(`${base}/global-reach`, { waitUntil: "networkidle" });
  await touchPage.evaluate(() => { const element = document.getElementById("network-globe"); scrollTo(0, element.getBoundingClientRect().top + scrollY + 180); });
  await touchPage.waitForTimeout(800);
  const touchBox = await touchPage.locator(".globe-input").boundingBox();
  const cdp = await touch.newCDPSession(touchPage);
  const tx = Math.round(touchBox.x + touchBox.width / 2);
  const ty = Math.round(touchBox.y + touchBox.height / 2);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: tx, y: ty, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: tx + 24, y: ty + 2, id: 1 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: tx + 80, y: ty + 3, id: 1 }] });
  const touchDragging = await touchPage.locator(".globe-input").getAttribute("data-dragging");
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  if (touchDragging !== "true") issues.push("touch drag failed");
  const scrollBefore = await touchPage.evaluate(() => scrollY);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: tx, y: ty + 90, id: 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: tx + 2, y: ty - 30, id: 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await touchPage.waitForTimeout(450);
  const scrollAfter = await touchPage.evaluate(() => scrollY);
  if (scrollAfter <= scrollBefore) issues.push("vertical touch scroll blocked by globe");
  await touch.close();

  const reduced = await browser.newContext({ viewport: { width: 375, height: 900 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
  await reduced.addInitScript(() => { localStorage.setItem("africhem-theme", "dark"); sessionStorage.setItem("africhem-intro-v1", "1"); });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${base}/global-reach`, { waitUntil: "networkidle" });
  await reducedPage.evaluate(() => { const element = document.getElementById("network-globe"); scrollTo(0, element.getBoundingClientRect().top + scrollY + 180); });
  await reducedPage.waitForTimeout(1000);
  const reducedState = await reducedPage.evaluate(() => ({ canvas: document.querySelectorAll(".reach-globe-stage canvas").length, text: document.body.innerText, overflow: document.documentElement.scrollWidth > innerWidth }));
  if (reducedState.canvas !== 1 || reducedState.overflow || !reducedState.text.includes("Kuwait")) issues.push("reduced-motion mobile fallback failed");
  const stillBefore = await reducedPage.locator(".reach-globe-stage canvas").screenshot();
  await reducedPage.waitForTimeout(1800);
  const stillAfter = await reducedPage.locator(".reach-globe-stage canvas").screenshot();
  const reducedDifference = await meanPixelDifference(stillBefore, stillAfter);
  if (reducedDifference > 1) issues.push(`reduced-motion globe moved: ${reducedDifference.toFixed(2)}`);
  await reducedPage.locator(".globe-input").focus();
  await reducedPage.keyboard.press("ArrowRight");
  await reducedPage.waitForTimeout(150);
  const keyboardAfter = await reducedPage.locator(".reach-globe-stage canvas").screenshot();
  const reducedKeyboardDifference = await meanPixelDifference(stillAfter, keyboardAfter);
  if (reducedKeyboardDifference < 2) issues.push(`reduced-motion keyboard interaction failed: ${reducedKeyboardDifference.toFixed(2)}`);
  await reducedPage.screenshot({ path: path.join(artifactDir, "reach-reduced-mobile.png") });
  await reduced.close();

  await browser.close();
  fs.writeFileSync(path.join(artifactDir, "global-reach-report.json"), JSON.stringify({ results, dragging, released, touchDragging, scrollBefore, scrollAfter, idleRotationDifference, reducedDifference, reducedKeyboardDifference, themeBefore, themeAfter, reducedState: { canvas: reducedState.canvas, overflow: reducedState.overflow }, issues }, null, 2));
  console.log(JSON.stringify({ checked: results.length, dragging, released, touchDragging, verticalTouchScroll: scrollAfter > scrollBefore, idleRotationDifference, reducedDifference, reducedKeyboardDifference, themeBefore, themeAfter, reducedCanvas: reducedState.canvas, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
