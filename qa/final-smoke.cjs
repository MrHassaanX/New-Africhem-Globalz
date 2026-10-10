const { chromium } = require("./tools/node_modules/@playwright/test");
(async () => {
  const browser=await chromium.launch({channel:"msedge",headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://localhost:3100",{waitUntil:"networkidle"});
  await page.waitForTimeout(2900);
  await page.getByRole("button",{name:"Switch to dark theme"}).click();
  await page.waitForTimeout(350);
  console.log("Dark CTA",await page.locator(".button").evaluate(e=>({bg:getComputedStyle(e).backgroundColor,text:getComputedStyle(e).color})));
  await page.screenshot({path:"qa/artifacts/dark.png",fullPage:true});
  await page.getByRole("navigation",{name:"Main navigation",exact:true}).getByRole("link",{name:"About",exact:true}).click();
  await page.waitForURL("**/about");
  console.log("Client navigation",await page.locator("h1").textContent());
  for(const route of ["icon.png","opengraph-image","unknown-page"]){
    const response=await page.request.get("http://localhost:3100/"+route);
    console.log(route,response.status(),(await response.body()).length);
  }
  console.log("Errors",errors);
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
