const { chromium } = require("playwright");
const sharp = require("sharp");
const path = require("node:path");

async function difference(first, second) {
  const a = await sharp(first).resize(160, 160).removeAlpha().raw().toBuffer();
  const b = await sharp(second).resize(160, 160).removeAlpha().raw().toBuffer();
  let total = 0;
  for (let i = 0; i < a.length; i++) total += Math.abs(a[i] - b[i]);
  return total / a.length;
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const issues = [];
  const base = "http://127.0.0.1:3100/global-reach";
  const stable = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const markerPage = await stable.newPage();
  await markerPage.goto(base, { waitUntil: "networkidle" });
  await markerPage.evaluate(() => { const element = document.getElementById("network-globe"); scrollTo(0, element.getBoundingClientRect().top + scrollY + 180); });
  await markerPage.waitForTimeout(1000);
  await markerPage.screenshot({ path: path.join(__dirname, "artifacts", "globe-marker-audit.png") });
  const attempts = [];
  for (const [x, y] of [[434,303],[542,280],[652,254],[697,285],[959,251],[521,465],[561,471]]) {
    await markerPage.mouse.move(x, y);
    await markerPage.mouse.click(x, y);
    await markerPage.waitForTimeout(80);
    attempts.push({ x, y, name: await markerPage.evaluate(() => document.querySelector(".globe-selection strong")?.textContent ?? null) });
  }
  const selected = attempts.find(attempt => attempt.name)?.name ?? null;
  if (!selected) issues.push(`visible markers did not reveal a country label: ${JSON.stringify(attempts)}`);
  await stable.close();

  const mobile = await browser.newContext({ viewport: { width: 320, height: 900 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
  const tapPage = await mobile.newPage();
  await tapPage.goto(base, { waitUntil: "networkidle" });
  await tapPage.locator("#network-globe").scrollIntoViewIfNeeded();
  await tapPage.waitForTimeout(800);
  const taps = [];
  for (const [x, y] of [[44,310],[78,294],[151,286],[176,305],[269,298],[85,408],[106,413]]) {
    await tapPage.touchscreen.tap(x, y);
    taps.push({ x, y, name: await tapPage.evaluate(() => document.querySelector(".globe-selection strong")?.textContent ?? null) });
  }
  if (!taps.some(tap => tap.name)) issues.push(`mobile tap did not reveal a country label: ${JSON.stringify(taps)}`);
  await mobile.close();

  const motion = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const dragPage = await motion.newPage();
  await dragPage.goto(base, { waitUntil: "networkidle" });
  await dragPage.evaluate(() => { const element = document.getElementById("network-globe"); scrollTo(0, element.getBoundingClientRect().top + scrollY + 180); });
  await dragPage.waitForTimeout(1000);
  await dragPage.mouse.move(630, 470);
  await dragPage.mouse.down();
  await dragPage.mouse.move(780, 470, { steps: 5 });
  await dragPage.mouse.up();
  const canvas = dragPage.locator(".reach-globe-stage canvas");
  const released = await canvas.screenshot();
  await dragPage.waitForTimeout(300);
  const coasted = await canvas.screenshot();
  const inertiaDifference = await difference(released, coasted);
  if (inertiaDifference < 2) issues.push(`globe did not visibly coast after drag: ${inertiaDifference.toFixed(2)}`);
  await motion.close();
  await browser.close();
  console.log(JSON.stringify({ selected, attempts, taps, inertiaDifference, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
