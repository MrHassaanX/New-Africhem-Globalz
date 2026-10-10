const { chromium } = require("./tools/node_modules/@playwright/test");
const fs = require("node:fs");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const issues = [];
  const warnings = new Set();
  const results = [];
  for (const theme of ["light", "dark"]) for (const width of [375, 430, 768, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(value => {
      localStorage.setItem("africhem-theme", value);
      sessionStorage.setItem("africhem-intro-v1", "1");
    }, theme);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("requestfailed", request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
      if (message.type() === "warning") warnings.add(message.text());
    });
    await page.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const home = await page.evaluate(() => {
      const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
      const image = document.querySelector(".home-material-image");
      const logo = document.querySelector(".brand img");
      return {
        heading: document.querySelector("h1")?.textContent,
        text: document.body.textContent || "",
        theme: document.documentElement.dataset.theme,
        imageLoaded: image?.complete && image.naturalWidth > 0,
        imageSource: image?.getAttribute("src"),
        logoLoaded: logo?.complete && logo.naturalWidth > 0,
        styledHeading: Number.parseFloat(getComputedStyle(document.querySelector(".home-hero h1")).fontSize) > 40,
        canvas: document.querySelectorAll(".home-webgl canvas").length,
        trace: document.querySelectorAll(".home-chemical-trace circle").length,
        overflow: document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth,
        processRows: [...document.querySelectorAll(".capability-row h3")].map(element => element.textContent),
        cards: [...document.querySelectorAll(".stack-card h3")].map(element => element.textContent),
        homeGlobal: !!document.querySelector(".home-global"),
        navGlobal: !!document.querySelector('nav a[href="/global-reach"]'),
        halo: getComputedStyle(document.querySelector(".brand"), "::before").backgroundImage,
        heroHeading: rect(".home-hero h1"),
        stage: rect(".home-material-stage"),
      };
    });
    if (home.heading !== "SOURCINGSIMPLIFIED.") issues.push(`${theme} ${width}: default heading changed`);
    for (const phrase of ["Your supply chain is ours.", "We plan it, source it and see it through to delivery.", "CHEMICAL EXPORT / SOLVENTS & THINNERS", "PETROCHEMICALS", "DRUM FILLING"]) {
      if (!home.text.includes(phrase)) issues.push(`${theme} ${width}: missing ${phrase}`);
    }
    if (home.processRows.join("/") !== "Plan/Source/Deliver") issues.push(`${theme} ${width}: process changed`);
    if (home.cards.join("/") !== "Chemicals/Solvents/White Spirit & Thinner") issues.push(`${theme} ${width}: product teaser changed`);
    if (home.homeGlobal || !home.navGlobal) issues.push(`${theme} ${width}: Global Reach placement changed`);
    if (!home.imageLoaded || !home.imageSource?.includes("chemical-transfer")) issues.push(`${theme} ${width}: industrial hero image missing`);
    if (!home.logoLoaded || !home.styledHeading || home.theme !== theme) issues.push(`${theme} ${width}: logo, styles or theme missing`);
    if (home.canvas !== 1 || home.trace !== 8) issues.push(`${theme} ${width}: visual layers missing`);
    if (home.overflow) issues.push(`${theme} ${width}: horizontal overflow`);
    if (theme === "dark" && !home.halo.includes("radial-gradient")) issues.push(`${theme} ${width}: dark logo halo missing`);
    if (width <= 430 && home.stage.y < home.heroHeading.bottom) issues.push(`${theme} ${width}: visual overlaps headline`);
    if ([375, 1440].includes(width)) {
      await page.waitForTimeout(2200);
      const actionsOpacity = await page.locator(".home-hero-actions").evaluate(element => Number(getComputedStyle(element).opacity));
      if (actionsOpacity < .98) issues.push(`${theme} ${width}: hero actions did not finish revealing`);
      await page.screenshot({ path: `qa/artifacts/refined-home-${theme}-${width}.png` });
    }
    if (errors.length) issues.push(`${theme} ${width}: ${errors.join(" | ")}`);
    results.push({ theme, width, imageLoaded: home.imageLoaded, canvas: home.canvas, overflow: home.overflow });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const route of ["about", "products", "industries", "global-reach", "contact"]) {
    const response = await page.goto(`http://127.0.0.1:3100/${route}`, { waitUntil: "networkidle" });
    if (response?.status() !== 200 || !(await page.locator("h1").textContent())) issues.push(`${route}: placeholder failed`);
    if (route === "global-reach") {
      const text = await page.locator("body").textContent();
      for (const country of ["Kuwait", "UAE", "China", "Algeria", "Egypt", "Uganda", "Kenya"]) if (!text.includes(country)) issues.push(`global-reach: missing ${country}`);
    }
  }
  const removed = await page.goto("http://127.0.0.1:3100/concepts/home");
  if (removed?.status() !== 404) issues.push("alternate hero route still exists");
  await context.close();

  const reduced = await browser.newContext({ viewport: { width: 375, height: 900 }, reducedMotion: "reduce" });
  await reduced.addInitScript(() => sessionStorage.setItem("africhem-intro-v1", "1"));
  const reducedPage = await reduced.newPage();
  await reducedPage.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
  const reducedState = await reducedPage.evaluate(() => ({ canvas: document.querySelectorAll(".home-webgl canvas").length, image: document.querySelector(".home-material-image")?.naturalWidth, trace: document.querySelectorAll(".home-chemical-trace circle").length }));
  if (reducedState.canvas || !reducedState.image || reducedState.trace !== 8) issues.push("reduced-motion static visual failed");
  await reduced.close();
  await browser.close();
  fs.writeFileSync("qa/artifacts/home-refinement-report.json", JSON.stringify({ results, issues, warnings: [...warnings] }, null, 2));
  console.log(JSON.stringify({ checked: results.length, routes: 6, issues, warnings: [...warnings] }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
