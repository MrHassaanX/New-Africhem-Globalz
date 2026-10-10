const { chromium } = require("playwright");

const base = "http://127.0.0.1:3100";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const issues = [];
  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await mobile.addInitScript(() => { sessionStorage.setItem("africhem-intro-v1", "1"); });
  const page = await mobile.newPage();
  page.on("pageerror", error => issues.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  const menuButton = page.locator(".menu-button");
  const themeButton = page.locator(".theme-button");
  const menuSize = await menuButton.boundingBox();
  const themeSize = await themeButton.boundingBox();
  if (menuSize.height < 44 || themeSize.height < 44 || themeSize.width < 44) issues.push("mobile touch target too small");
  await menuButton.click();
  if (!await page.locator(".mobile-menu").evaluate(node => node.open)) issues.push("menu did not open");
  const lockState = await page.evaluate(() => ({
    attribute: document.documentElement.dataset.menuOpen,
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
    scrollY: window.scrollY,
  }));
  if (lockState.attribute !== "true" || ![lockState.htmlOverflow, lockState.bodyOverflow].includes("hidden")) issues.push("body was not scroll locked");
  await page.keyboard.press("Escape");
  try {
    await page.waitForFunction(() => !document.documentElement.hasAttribute("data-menu-open"), null, { timeout: 2000 });
  } catch { issues.push("menu did not unlock scroll"); }
  if (await page.locator(".mobile-menu").evaluate(node => node.open)) issues.push("Escape did not close menu");
  if (!await menuButton.evaluate(node => document.activeElement === node)) issues.push("focus did not return to menu trigger");
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await themeButton.click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  if (before === after) issues.push("mobile theme toggle failed");
  await menuButton.click();
  await page.locator(".mobile-menu nav a[href='/about']").click();
  await page.waitForURL("**/about");
  if (await page.locator(".mobile-menu").evaluate(node => node.open)) issues.push("navigation did not close menu");
  await mobile.close();

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  await desktop.addInitScript(() => { sessionStorage.setItem("africhem-intro-v1", "1"); });
  const wide = await desktop.newPage();
  wide.on("pageerror", error => issues.push(error.message));
  await wide.goto(base, { waitUntil: "networkidle" });
  await wide.locator(".home-capabilities").scrollIntoViewIfNeeded();
  await wide.waitForTimeout(1100);
  const processState = await wide.evaluate(() => ({
    rows: document.querySelectorAll(".capability-row").length,
    sectionWidth: document.querySelector(".home-capabilities").getBoundingClientRect().width,
    lineScale: getComputedStyle(document.querySelector(".home-process-line span")).transform,
    lenisRoots: document.querySelectorAll("html.lenis").length,
  }));
  if (processState.rows !== 3 || processState.sectionWidth !== 1440) issues.push("desktop process section is incomplete");
  if (processState.lineScale === "matrix(0, 0, 0, 1, 0, 0)") issues.push("desktop process line did not advance");
  if (processState.lenisRoots > 1) issues.push("duplicate Lenis roots");
  await wide.evaluate(() => {
    const stack = document.querySelector(".stack-scroll");
    window.scrollTo(0, stack.getBoundingClientRect().top + scrollY + stack.clientHeight * .5);
  });
  await wide.waitForTimeout(1100);
  const stackState = await wide.evaluate(() => ({
    active: document.querySelector(".stack-scroll").classList.contains("is-stacked"),
    cards: document.querySelectorAll(".stack-card").length,
    firstCardOpacity: Number(getComputedStyle(document.querySelector(".stack-card")).opacity),
  }));
  if (!stackState.active || stackState.cards !== 3 || stackState.firstCardOpacity >= 1) issues.push("desktop product stack did not advance");
  await desktop.close();
  await browser.close();
  console.log(JSON.stringify({ menuTouchTarget: menuSize, themeTouchTarget: themeSize, lockState, themeBefore: before, themeAfter: after, process: processState, stack: stackState, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
