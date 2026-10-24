# Revision audit — 24 October 2026

Source: `Africhem_Globalz_Outstanding_Changes_Audit_24_Oct_2026.pdf` (12 pages), checked against this local working tree before edits. The PDF's status labels describe an earlier inventory, not proof of the current site. Baseline: `main` at `4ad40f0`; `next-env.d.ts` was already modified by Next dev. No other pre-existing local changes. No commit, push, deployment or indexing is authorized.

Status key: **done** = locally implemented and verified; **partial** = local architecture exists but founder data, approval, provider configuration or real-device QA remains; **deferred** = conditional item not approved. Verification and after-state are recorded below and in the final QA note.

| ID | Priority | Before / current condition | Required change and relevant files | Verification | Status / founder dependency |
| --- | --- | --- | --- | --- | --- |
| 01 | P0 | Home H1 was tagline only | Chemical-first H1, support and hero actions; `components/home`, `app/home.css` | Home first viewport, mobile | **Done locally**; exact requested H1 used, operational wording still requires founder sign-off |
| 02 | P0 | Independent teal/navy enquiry links | Shared amber quote action; Header and all primary routes | All CTAs reach `/contact#quote` | **Done locally**; quote transport still disabled until configured |
| 03 | P0 | Mixed Categories/Industries menu; `/products` redirected backward | Canonical route/nav/legacy migration; `lib/site.ts`, `app`, `next.config.ts` | Navigation, 308s, sitemap | **Done locally**; six redirect targets tested |
| 04 | P0 | Home mixed four-business carousel | Five equal chemical family cards plus secondary business preview; Home | Responsive cards and links | **Done locally**; no fabricated products |
| 05 | P0 | No proof strip | Structured, approval-gated claims; Home/content | No unsupported claim appears | **Partial**; four factual alternatives shown, proposed COA/customs promises withheld pending verification |
| 06 | P0 | Seller-centric Plan/Source/Deliver | Shared buyer stepper; Home and `/how-it-works` | Both routes share source | **Done locally**; cautious operational wording |
| 07 | P0 | No legal company identifiers | Central optional identity fields; About/Footer/Contact | Only verified fields render | Partial by design; founder legal details missing |
| 08 | P0 | No named founder | Optional founder data and About profile slot | No invented profile | Partial by design; founder name, portrait, bio, role, profile missing |
| 09 | P1 | Phone/WA links already existed | Show contact consistently; hide generic social profiles; Header/Footer/Contact | tel/mailto/wa links | **Done locally**; user previously confirmed phone = WhatsApp |
| 10 | P1 | No public COA/TDS files | Typed approved-document architecture; product pages | No dead download links | Partial; founder must supply publishable documents |
| 11 | P1 | About overlarge and contains unverified Tier-1/10-year claims | Chemical-first hierarchy, client-first near top, five reason cards | Visual/content review | **Done locally**; those claims no longer rendered |
| 12 | P0 | `/products` sent to `/categories` | Five-family catalogue and routes | Five pages, verified entries only | **Done locally** |
| 13 | P0 | No product detail pages | Typed detail template for White Spirit and Thinner | Detail routes and quote preselection | Partial; specifications require founder data |
| 14 | P0 | Two chemical names confirmed, seven-slot filler | Hide filler; product-data checklist | Only two named products published | Partial; one approved product in each other family plus specs needed |
| 15 | P1 | No commercial FAQ | Six truthful buyer questions on Products | FAQ keyboard/semantic | **Done locally**; policy-dependent answers remain enquiry-oriented |
| 16 | P0 | Contact had direct links, no form | Validated quote form/API/provider config; `app/contact`, `app/api/quote` | Invalid/valid/error states; receipt only with credentials | Partial until mailbox, sender, API key and live receipt approved |
| 17 | P2 | Samples unconfirmed | No public sample action; record policy dependency | Search UI for sample CTA | Deferred; founder sample policy required |
| 18 | P1 | Four mixed categories only | Eight-area secondary directory | Grid/routes | **Partial**; eight cards exist, five marked coming soon pending facts |
| 19 | P1 | Legacy business pages used seven-slot filler | Focused truthful Agro/Footwear/Recycling content; others coming soon | No filler or invented service | Partial; founder descriptions/regions needed |
| 20 | P1 | Globe/countries already implemented | Preserve 3D, add flags/context/CTA, overlap QA | 8 locations, responsive globe | **Partial**; flags and CTA done, specific partner responsibilities pending founder |
| 21 | P1 | Cream/teal, 1600px span, oversized type | Reviewed tokens, amber actions, tighter layout, both themes | Visual/contrast at target widths | **Done locally**; theme default unchanged pending founder |
| 22 | P1 | Official PNG but dark halo; licensed stock already optimized | Consistent logo placement, remove halo; preserve photo provenance | Light/dark header/footer | Partial; clean SVG/real business photography not supplied |
| 23 | P1 | Preview legal routes only | Accurate review-state public pages; draft checklist in docs | No invented policies | Partial; legal approval and facts required |
| 24 | P1 | SEO metadata targets mixed categories; noindex already exists | Revised metadata, sitemap, redirects; retain noindex | Metadata/robots/route checks | **Partial**; local SEO done, indexing/domain deferred |
| 25 | P1 | Source responsive; live matrix not certified | Browser widths/themes, links, a11y, reduced motion, globe | Automated QA plus physical device separately | **Partial**; 180 automated cases clear, physical device unavailable |
| 26 | P2 | No conversion baseline | Measurement plan only; no instrumentation | No trackers added | Deferred; founder privacy/reporting approval required |

## Source and approval rules

- The company-supplied DOCX remains the provenance for existing wording, but an appearance in that file is not proof of operational or legal claims. Public pages will not display the unverified ten-year, Tier-1, guaranteed timing, COA checking, customs handling or factory ownership claims.
- White Spirit and Thinner are the only confirmed chemical names. The five chemical families are approved taxonomy, not evidence of specific inventory.
- India is the base; the seven marked partner countries are not Africhem offices or verified shipping routes.
- The user previously confirmed `+91-6362830638` as both business contact and WhatsApp number. Official LinkedIn/Instagram company profiles remain unknown.
- Licensed local stock photographs are illustrative. Real company photography and a clean SVG logo remain founder dependencies.

## Verified after-state

- Chemical-first H1, five equal family cards, secondary business preview, shared buyer stepper and amber quote CTA now replace the old Home hierarchy. The industrial Home photograph is retained.
- `/products` is canonical. White Spirit and Thinner have detail routes and product-context quote links; other family routes disclose that no named list is approved. Seven-slot filler decks are no longer publicly reachable through the canonical routes.
- `/other-businesses` has eight named cards; only Agro, Footwear and Scrap Recycling have short detail routes. The five areas without substantive source details say Coming soon.
- `/contact#quote` has client/server validation, field errors, preserved values, honeypot, same-origin check, size cap, basic cooldown, server-only Resend transport and truthful states. UI submission remains disabled until approved email configuration exists. End-to-end receipt is **blocked**, not passed.
- The existing R3F globe, geography, marker interaction, rotation, red arcs, lazy loading and reduced-motion handling remain. Eight MIT-licensed local SVG flags, destination action and country labels were added. Globe translation begins only after the text is fully faded.
- Generic LinkedIn and Instagram homepage links are hidden. The user-confirmed phone/WhatsApp and company email remain visible. No founder identity, legal registration, extra chemicals, COA/TDS/SDS downloads or commercial policy was invented.
- SEO titles, canonical paths, Open Graph wording and sitemap are aligned to the chemical catalogue. Noindex metadata and `X-Robots-Tag: noindex, nofollow` remain active; sitemap is empty in review mode.

### Legacy URL mapping (all tested as 308)

| Old | New |
| --- | --- |
| `/categories` | `/products` |
| `/categories/chemicals` | `/products/thinners-and-white-spirit` |
| `/categories/footwear` | `/other-businesses/footwear` |
| `/categories/uganda-agro-exports` | `/other-businesses/agro` |
| `/categories/recycling` | `/other-businesses/scrap-recycling` |
| `/industries` | `/other-businesses` |

### Local QA

- `npm run lint`: pass; `npm run typecheck`: pass; `npm run build`: pass after removing the exact OneDrive-placeholder `.next/server/app/api` build directory that blocked Next's unlink operation. No source file or Git history was removed.
- `qa/revision-check.cjs`: 180 route/viewport/theme cases, zero issues. Widths: 320, 375, 390, 430, 600, 768, 1024, 1366, 1440, 1920px, both themes. It verifies status, overflow, theme, quote destinations, flags, disabled unconfigured form, six legacy redirects, invalid API 400 and valid-but-unconfigured API 503. Screenshots: `qa/artifacts/revision/` (ignored by Git).
- `qa/revision-interaction-check.cjs`: product/category preselection, field-specific validation, preserved input, focus on first invalid field and mobile menu/quote action passed under a temporary dummy provider configuration; **no email was sent**.
- Normal-motion globe at 768, 1024 and 1440px: measured intro right edge and globe stage left edge at scroll offsets 0–600px. The stage never entered the intro area while its opacity was above zero. Reduced-motion globe and country list were visually checked in both themes.
- SVGs parse as XML; the official PNG logo has a real alpha channel. No recoloring or image filter was added.
- Physical phone, email inbox receipt, third-party document downloads and founder/legal sign-off were not testable here.
