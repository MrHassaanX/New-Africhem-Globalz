const { chromium } = require("./tools/node_modules/@playwright/test");
const fs = require("node:fs");
(async () => {
 const browser = await chromium.launch({channel:"msedge",headless:true});
 const errors=[], warnings=[];
 const context = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"no-preference"});
 await context.addInitScript(() => {sessionStorage.setItem("africhem-intro-v1","1");});
 const page = await context.newPage();
 page.on("pageerror",e=>errors.push(e.message));
 page.on("console",m=>{if(m.type()==="error")errors.push(m.text());if(m.type()==="warning")warnings.push(m.text());});
 page.on("requestfailed",r=>errors.push("Request failed: "+r.url()+" "+r.failure()?.errorText));
 await page.goto("http://127.0.0.1:3100",{waitUntil:"networkidle"});
 await page.waitForTimeout(1800);
 const widths=[];
 for(const width of [320,375,430,768,1024,1440,1920]){
  await page.setViewportSize({width,height:900});
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(260);
  widths.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,canvas:document.querySelectorAll('canvas').length,hero:document.querySelector('h1')?.textContent})));
  await page.screenshot({path:"qa/artifacts/phase2-home-"+width+".png",fullPage:true});
 }
 await page.setViewportSize({width:1440,height:900});
 const stack=await page.locator(".stack-scroll").boundingBox();
 const stages=[];
 for(const f of [0,.3,.55,.8,1]){
  await page.evaluate(y=>window.scrollTo(0,y),stack.y+stack.height*f);
  await page.waitForTimeout(750);
  stages.push(await page.locator(".stack-card").evaluateAll(cards=>cards.map(c=>({title:c.querySelector('h3')?.textContent,y:Math.round(c.getBoundingClientRect().y),opacity:getComputedStyle(c).opacity,transform:getComputedStyle(c).transform,tab:c.querySelector('a')?.tabIndex}))));
  await page.screenshot({path:"qa/artifacts/phase2-stack-"+Math.round(f*100)+".png"});
 }
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.getByRole("button",{name:"Switch to dark theme"}).click();
 await page.waitForTimeout(400);
 await page.screenshot({path:"qa/artifacts/phase2-dark-1440.png",fullPage:true});
 await page.setViewportSize({width:375,height:900});
 await page.screenshot({path:"qa/artifacts/phase2-dark-375.png",fullPage:true});
 const dark=await page.evaluate(()=>({theme:document.documentElement.dataset.theme,stageVisible:getComputedStyle(document.querySelector(".home-material-stage")).display}));
 const reducedContext=await browser.newContext({viewport:{width:375,height:900},reducedMotion:"reduce"});
 await reducedContext.addInitScript(()=>sessionStorage.setItem("africhem-intro-v1","1"));
 const reducedPage=await reducedContext.newPage();
 await reducedPage.goto("http://127.0.0.1:3100",{waitUntil:"networkidle"});
 await reducedPage.waitForTimeout(500);
 const reduced=await reducedPage.evaluate(()=>({canvas:document.querySelectorAll("canvas").length,stacked:document.querySelector(".stack-scroll").classList.contains("is-stacked"),cards:[...document.querySelectorAll(".stack-card")].map(c=>Math.round(c.getBoundingClientRect().height)),intro:document.documentElement.dataset.intro||null}));
 await reducedPage.screenshot({path:"qa/artifacts/phase2-reduced-375.png",fullPage:true});
 const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});
 const staticPage=await noJs.newPage();await staticPage.goto("http://127.0.0.1:3100");
 const staticResult={hero:await staticPage.locator("h1").textContent(),cards:await staticPage.locator(".stack-card").count()};
 const result={widths,stages,dark,reduced,staticResult,errors,warnings};
 fs.writeFileSync("qa/artifacts/phase2-report.json",JSON.stringify(result,null,2));
 console.log(JSON.stringify({...result,stages:stages.map((s,i)=>({progress:[0,.3,.55,.8,1][i],cards:s.map(c=>({title:c.title,y:c.y,opacity:c.opacity,tab:c.tab}))}))},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
