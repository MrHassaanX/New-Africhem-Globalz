const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const widths = [320, 375, 390, 430, 768, 1024, 1366, 1440, 1920];
const output = path.join(__dirname, "artifacts", "products-stack");
fs.mkdirSync(output, { recursive: true });
const base = "http://127.0.0.1:3100";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const issues = [];
  let cases = 0;

  for (const theme of ["dark", "light"]) {
    for (const width of widths) {
      for (const motion of ["reduce", "no-preference"]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: motion });
        await context.addInitScript(value => {
          localStorage.setItem("africhem-theme", value);
          sessionStorage.setItem("africhem-intro-v1", "1");
        }, theme);
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("console", message => {
          if (message.type() === "error" || /GSAP|ScrollTrigger/i.test(message.text()) && message.type() === "warning") errors.push(message.text());
        });

        await page.goto(base + "/products", { waitUntil: "domcontentloaded" });
        if (motion === "no-preference" && width >= 768) {
          await page.waitForFunction(() => document.querySelector(".products-deck")?.classList.contains("is-stacked"), { timeout: 10000 });
        }
        const state = await page.evaluate(() => {
          const cards = [...document.querySelectorAll(".products-card")];
          const stage = document.querySelector(".products-deck-stage");
          const deck = document.querySelector(".products-deck");
          return {
            count: cards.length,
            numbering: cards.map(card => card.querySelector(".products-card-number")?.textContent?.trim()),
            names: cards.filter(card => card.dataset.status === "name-verified").map(card => card.querySelector("h2")?.textContent),
            pending: cards.filter(card => card.dataset.status === "awaiting-confirmation").length,
            images: cards.map(card => card.querySelector("img")?.getAttribute("src") ?? null),
            links: cards.filter(card => card.querySelector(".products-card-link")?.getAttribute("href") === "/contact").length,
            stacked: deck.classList.contains("is-stacked"),
            sticky: getComputedStyle(stage).position === "sticky",
            deckHeight: deck.offsetHeight,
            cardWidth: cards[0].getBoundingClientRect().width,
            cardHeight: cards[0].getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth - innerWidth,
            outOfBounds: cards.filter(card => { const r = card.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).length,
            sequential: cards.every((card, i) => i === 0 || card.getBoundingClientRect().top >= cards[i - 1].getBoundingClientRect().bottom),
          };
        });
        const name = `${theme} ${width} ${motion}`;
        if (state.count !== 10 || state.pending !== 8 || state.names.join("|") !== "White Spirit|Thinner") issues.push(`${name}: count or product identity ${JSON.stringify(state)}`);
        if (state.numbering.join("|") !== Array.from({ length: 10 }, (_, i) => `${String(i + 1).padStart(2, "0")} / 10`).join("|")) issues.push(`${name}: numbering`);
        if (state.links !== 10 || state.images.filter(Boolean).length !== 5) issues.push(`${name}: links or imagery`);
        if (state.overflow > 1 || state.outOfBounds) issues.push(`${name}: overflow ${state.overflow}px, out of bounds ${state.outOfBounds}`);
        const shouldStack = motion === "no-preference" && width >= 768;
        if (state.stacked !== shouldStack || state.sticky !== shouldStack) issues.push(`${name}: stack mode ${JSON.stringify(state)}`);
        if (!shouldStack && !state.sequential) issues.push(`${name}: cards not in document flow`);
        if (shouldStack && state.deckHeight < 4 * 900) issues.push(`${name}: pinned scroll length too short`);
        if (width >= 1100 && state.cardWidth < Math.min(width * .87, 1600)) issues.push(`${name}: card width too narrow`);
        if (shouldStack && (state.cardHeight < 430 || state.cardHeight > 700)) issues.push(`${name}: card height`);
        if (errors.length) issues.push(`${name}: ${[...new Set(errors)].join(" | ")}`);

        if ([390, 768, 1440].includes(width) && motion === "reduce") {
          await page.locator(".products-card").first().scrollIntoViewIfNeeded();
          await page.screenshot({ path: path.join(output, `first-${theme}-${width}-reduced.png`) });
          await page.locator(".products-card").nth(5).scrollIntoViewIfNeeded();
          await page.screenshot({ path: path.join(output, `sixth-${theme}-${width}-reduced.png`) });
        }

        if (shouldStack && ((theme === "dark" && [768, 1024, 1440, 1920].includes(width)) || (theme === "light" && [768, 1440].includes(width)))) {
          const positions = await page.evaluate(() => {
            const deck = document.querySelector(".products-deck");
            return { start: deck.getBoundingClientRect().top + scrollY, distance: deck.offsetHeight - innerHeight };
          });
          const samples = [];
          for (const [label, progress, index] of [["first", 0, 0], ["second", 1 / 9, 1], ["middle", 5 / 9, 5], ["last", 1, 9]]) {
            await page.evaluate(y => window.scrollTo(0, y), positions.start + positions.distance * progress);
            await page.waitForTimeout(950);
            const sample = await page.evaluate(index => {
              const stage = document.querySelector(".products-deck-stage").getBoundingClientRect();
              const cards = [...document.querySelectorAll(".products-card")];
              const active = cards[index].getBoundingClientRect();
              const previous = index ? cards[index - 1].getBoundingClientRect() : null;
              return { stageTop: stage.top, activeTop: active.top, previousTop: previous?.top, activeHeight: active.height };
            }, index);
            samples.push({ label, ...sample });
            if (Math.abs(sample.activeTop - sample.stageTop - 24) > 65) issues.push(`${name}: ${label} card did not reach stage ${JSON.stringify(sample)}`);
            if (index === 1 && !(sample.previousTop < sample.activeTop && sample.activeTop - sample.previousTop < 55)) issues.push(`${name}: previous-card depth missing`);
            if (width === 1440 && ["first", "second", "middle", "last"].includes(label)) {
              await page.screenshot({ path: path.join(output, `${label}-${theme}-${width}-motion.png`) });
            }
          }
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForTimeout(250);
          const reachedFooter = await page.evaluate(() => document.querySelector("footer").getBoundingClientRect().top < innerHeight);
          if (!reachedFooter) issues.push(`${name}: scroll did not reach footer`);
        }

        if (theme === "dark" && width === 1440 && motion === "no-preference") {
          await page.setViewportSize({ width: 390, height: 900 });
          await page.waitForTimeout(250);
          if (await page.locator(".products-deck.is-stacked").count()) issues.push("resize 1440→390: stack remained active");
          await page.setViewportSize({ width: 1440, height: 900 });
          await page.waitForFunction(() => document.querySelector(".products-deck")?.classList.contains("is-stacked"));
          if (await page.locator(".products-card").count() !== 10) issues.push("resize 390→1440: duplicate/missing cards");
          await page.locator(".products-card-link").nth(9).focus();
          await page.waitForTimeout(700);
          const focusState = await page.evaluate(() => {
            const deck = document.querySelector(".products-deck");
            const start = deck.getBoundingClientRect().top + scrollY;
            return { focused: document.activeElement === document.querySelectorAll(".products-card-link")[9], position: (scrollY - start) / (deck.offsetHeight - innerHeight) };
          });
          if (!focusState.focused || focusState.position < .8) issues.push(`keyboard focus after resize: ${JSON.stringify(focusState)}`);
        }

        await context.close();
        cases++;
      }
    }
  }
  await browser.close();
  console.log(JSON.stringify({ cases, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
