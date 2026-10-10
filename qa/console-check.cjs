const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const findings = [];
  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
    await context.addInitScript(() => { sessionStorage.setItem("africhem-intro-v1", "1"); });
    const page = await context.newPage();
    let route = "";
    page.on("pageerror", error => findings.push({ width, route, kind: "pageerror", message: error.message }));
    page.on("console", message => {
      if (["error", "warning"].includes(message.type())) findings.push({ width, route, kind: message.type(), message: message.text() });
    });
    page.on("response", response => {
      if (response.status() >= 400) findings.push({ width, route, kind: "HTTP", message: `${response.status()} ${response.url()}` });
    });
    page.on("requestfailed", request => findings.push({ width, route, kind: "requestfailed", message: `${request.url()} ${request.failure()?.errorText}` }));
    for (route of ["/", "/about", "/products", "/industries", "/global-reach", "/contact"]) {
      await page.goto("http://127.0.0.1:3100" + route, { waitUntil: "networkidle" });
      if (route === "/") {
        await page.locator(".home-capabilities").scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
      }
      if (route === "/global-reach") {
        await page.locator("#network-globe").scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
      }
    }
    await context.close();
  }
  await browser.close();
  const unique = [...new Map(findings.map(finding => [`${finding.kind}:${finding.message}`, finding])).values()];
  console.log(JSON.stringify({ checked: 12, findings: unique }, null, 2));
  const unexpected = unique.filter(finding => !finding.message.includes("THREE.Clock"));
  if (unexpected.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
