const { chromium } = require("playwright");

const expected = {
  about: [
    "YOUR SUPPLY CHAIN", "IS OURS.", "SOURCING SIMPLIFIED.",
    "We plan it, source it and see it through to delivery.",
    "Sourcing goes wrong in familiar ways: suppliers go quiet, lead times drift, quality changes between batches. We built Africhem Globalz to fix that.",
    "Ten years in customer service and sales taught us what clients need: clear answers, dates they can plan around, and one team that owns the result.",
    "One team, end to end", "Direct manufacturer access", "Reliable lead times", "Consistent quality", "Support at every stage",
    "Client-First. When your interests and ours differ, yours decide.",
    "Kuwait", "UAE", "China", "Algeria", "Egypt", "Uganda", "Kenya",
    "Chemicals", "Footwear", "Uganda Agro-Exports", "Recycling",
    "Trust", "Commitment", "Authenticity", "Clarity", "Transparency",
  ],
  industries: [
    "BUSINESS PILLARS", "Solvents for paints and coatings: White Spirit and Thinner.",
    "Walkmate distribution in Mysore, Karnataka.",
    "Roses and pineapples, exported direct from Uganda.",
    "A growing division focused on keeping material in use.",
  ],
  contact: ["sales@africhem-globalz.com", "+91-6362830638", "www.africhem-globalz.com"],
};
const processCopy = [
  "We start with your demand and build the supply plan around it.",
  "Tier-1 manufacturers, vetted for batch consistency and documentation.",
  "Freight, documentation and customs clearance, managed to your date.",
];

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  const issues = [];
  for (const route of ["/", "/about", "/industries", "/global-reach", "/contact"]) {
    await page.goto("http://127.0.0.1:3100" + route, { waitUntil: "domcontentloaded" });
    const { text, process, globe, form } = await page.evaluate(() => ({
      text: (document.querySelector("main")?.innerText ?? "").replace(/\s+/g, " "),
      process: [...document.querySelectorAll(".capability-row,.about-process-row")].map(row => row.textContent),
      globe: !!document.querySelector(".reach-globe-journey"),
      form: !!document.querySelector("form"),
    }));
    const routeExpected = route === "/about" ? expected.about : route === "/industries" ? expected.industries : route === "/contact" ? expected.contact : [];
    for (const line of routeExpected) if (!text.includes(line)) issues.push(`${route}: missing ${line}`);
    if (["/", "/about"].includes(route)) {
      if (process.length !== 3) issues.push(`${route}: expected three process rows`);
      for (const line of processCopy) if (!process.some(row => row.includes(line))) issues.push(`${route}: missing process copy ${line}`);
    }
    if (route === "/" && globe) issues.push("Home contains Global Reach globe");
    if (route === "/global-reach" && !globe) issues.push("Global Reach globe missing");
    if (route === "/contact" && form) issues.push("Contact form/backend unexpectedly present");
    if (text.includes("[TESTIMONIAL")) issues.push(`${route}: placeholder testimonial is public`);
  }
  await browser.close();
  console.log(JSON.stringify({ routes: 5, issues }, null, 2));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
