// Natural Earth land outlines via world-atlas v2.0.2; generate a static regional teaser.
const fs=require("node:fs");
(async()=>{
 const {feature}=require("./tools/node_modules/topojson-client");
 const {geoEquirectangular,geoPath}=await import("./tools/node_modules/d3-geo/src/index.js");
 const topology=JSON.parse(fs.readFileSync("qa/tools/node_modules/world-atlas/land-110m.json","utf8"));
 const land=feature(topology,topology.objects.land);
 const projection=geoEquirectangular().center([52,10]).scale(285).translate([450,225]).clipExtent([[0,0],[900,450]]);
 const path=geoPath(projection)(land);
 const render=(background,fill,stroke)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450" role="img" aria-label="Geographic outline of Africa, the Arabian Peninsula and Asia">
<rect width="900" height="450" fill="${background}"/>
<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-opacity=".72" stroke-width="1.3" vector-effect="non-scaling-stroke"/>
</svg>`;
 fs.mkdirSync("public/geo",{recursive:true});
 fs.writeFileSync("public/geo/reach-outline.svg",render("#0b2231","#103a4a","#83aeb8"));
 fs.writeFileSync("public/geo/reach-outline-light.svg",render("#eae2d5","#c6d8d4","#4a7d88"));
 console.log("Generated light and dark geographic teasers");
})().catch(e=>{console.error(e);process.exitCode=1});

