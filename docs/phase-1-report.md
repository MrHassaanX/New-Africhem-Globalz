# Phase 0 + Phase 1 report — 7 October 2026

## 1. Old repository content inventory

See content-inventory.md. Inspected archive/current-website at fb6024c3773a85a675a5429eb1e4a5e14c9b6be5. Confirmed usable brand, tagline, business terminology and sales@africhem-globalz.com. Catalogue data is placeholder-only; industry sectors are explicitly provisional. No unsupported product specifications, offices, statistics or certifications were migrated. The archive's unconfirmed “Private Limited” suffix and outdated enquiry/privacy wording are flagged.

## 2. New repository state

The original workspace folder was actually the old repository. Following the user's selection, cloned the empty New-Africhem-Globalz remote into the separate foundation directory, on codex/foundation. The remote remains https://github.com/MrHassaanX/New-Africhem-Globalz.git. No commits, push, deployment or old tracked-file edits. The parent repository reports only the untracked foundation/ directory.

## 3–4. Architecture and design system

Fresh Next.js 16.3.7 App Router, strict TypeScript and Tailwind 4 foundation. Server-rendered content and shared shell with scoped client boundaries. Root is an explicitly labeled identity/interaction specimen. Seven requested supporting routes are static foundations. No completed homepage was built.

Local Inter Tight display and Inter body fonts; warm cream/mineral light theme, deep navy dark theme, industrial blue and teal accents. Official logo keeps its original gradient. Semantic tokens, responsive spacing and visible keyboard focus are shared.

## 5. Navbar

Centered desktop links, restrained active underline, enquiry link and persisted theme control. Narrow screens use a native modal navigation dialog with focus confinement, Escape dismissal and focus return. Scrolled header uses a subtle border and blur.

## 6. Loader

Once-per-tab logo/tagline intro. Visible sequence ends after 2.3 seconds with a 2.8-second script fail-safe. Reduced motion, storage denial and direct legal visits skip it. CSS dismissal works independently of hydration; keyboard input dismisses it. No fake progress indicators.

## 7. Motion and scroll

One Lenis instance at a time, driven by GSAP ticker; ScrollTrigger sync and cleanup. Reduced-motion changes tear down continuous scroll enhancement. Native scrolling remains the fallback. Motion LazyMotion supports UI hover behavior. Route entrance is 400ms. Content remains visible if enhancement fails.

## 8. Three.js

Opt-in dynamic React Three Fiber boundary, static CSS fallback, error boundary, offscreen/hidden-tab demand rendering and reduced-motion static frame. DPR cap is 1.5 desktop / 1 mobile or coarse pointer. Five simple material-study meshes validate the boundary. Final hero material art, bloom, particles, fluid shaders and the geographic globe remain future work. Legal routes render no canvas.

## 9. Dependencies

Installed and lockfile recorded: Next, React, TypeScript, Tailwind/PostCSS, Inter/Inter Tight font packages, Lenis, GSAP, Motion, Three and React Three Fiber with corresponding type/lint packages. Drei and postprocessing are deferred until genuinely needed. Resend is deferred to Phase 6; no delivery functionality or secrets are included.

QA-only Playwright and FFmpeg live in ignored qa/tools and are not production dependencies.

## 10–11. Created and modified files

All application files are new in the separate checkout. No source application files in the old checkout were modified. New groups:

- app/: layout, global CSS, root specimen, route template, statically generated page foundations, 404, robots, sitemap, social image and favicon.
- components/: Header, Footer, Intro, Providers, Reveal and scene boundary/sample.
- styles/tokens.css; lib/site.ts and lib/catalogue.ts.
- public/africhem-logo.png: exact supplied transparent logo.
- Configuration: package/lockfile, TypeScript, Next, ESLint, PostCSS, environment example and ignore rules.
- AGENTS.md: required installed-Next documentation guidance.
- docs/: content inventory, architecture and this report.
- README.md; qa/check.cjs and qa/final-smoke.cjs.

## 12–14. Static validation

- npm run lint: PASS, no errors or warnings on the reviewed application. Initial anonymous-export warning corrected.
- npm run typecheck: PASS.
- npm run build: PASS; final run completed without warnings, generated static foundation routes and metadata assets.
- git diff --check: clean (new files remain untracked).

The Windows sandbox initially denied Next's native compiler path canonicalization. Running the authorized checks outside that sandbox resolved it; this was not an application compilation error.

## 15. Browser result

Headless Microsoft Edge against local production server:

- Root and all seven requested routes: HTTP 200.
- Unknown path: HTTP 404.
- Client-side navigation from Home to About: passed.
- No page errors or console errors in the main browser QA run.
- Theme changes persist on reload; intro does not replay.
- At 768 × 500, the mobile dialog scrolls internally (202px tested) while the page stays at scrollY=0.
- Escape closes the dialog, clears scroll lock and returns focus to Open navigation.
- Reduced motion: no intro, no Lenis instance, route animation disabled.
- No JavaScript: core heading and server-rendered content remain available.
- Opt-in WebGL: one canvas successfully mounted, no error fallback.
- Legal pages: zero canvases.
- Final favicon and OpenGraph image: HTTP 200, 3,920 and 65,664 bytes respectively.
- Final dark primary-button colors: background rgb(241,245,244), text rgb(6,17,26).

Raw measurements and screenshots are in ignored qa/artifacts locally.

## 16. Responsive result

Measured at viewport widths 320, 375, 430, 768, 1024, 1440 and 1920 (height 1000). At every width, document and body scrollWidth exactly matched viewport width: no horizontal overflow. Desktop and narrow-mobile screenshots visually inspected. Short-height modal separately verified.

This is responsive browser emulation, not physical iOS/Android device testing.

## 17–18. Design and code reviews

Independent content/design/accessibility and code reviews completed. Actionable findings fixed:

1. Mobile dialog initially conflicted with Lenis wheel handling. Added data-lenis-prevent, contained overflow, root scroll lock and coordinated Lenis stop/start.
2. Mobile scene initially shared desktop DPR; now capped at 1.
3. Tiny supporting labels enlarged to at least 11px in the relevant specimen areas.
4. Cross-tab theme updates now update the document theme.
5. Social-image dimensions changed to numeric values; clean final build verified.
6. Full-logo favicon reduced to the official mark to remove unnecessary transfer weight.

Review found no additional blocking server/client boundary, lifecycle cleanup, secret-handling or content-claim issues within the Phase 1 scope.

## 19. Performance and limitations

One local, unthrottled desktop production run measured LCP 372ms and CLS 0. These are lab observations, not field Core Web Vitals or mobile guarantees. The intro still intentionally covers the first visit for its short sequence; LCP alone does not measure perceived intro duration.

Initial JavaScript resources observed: approximately 240 KB transferred / 736 KB decoded, including framework, UI motion and deferred scroll libraries loaded during the run. Two local font files total about 93 KB. Optimized logo responses were approximately 4–7 KB. The original supplied logo remains 149 KB on disk. The favicon was subsequently reduced to 4 KB.

The initial page has zero canvases. The scene uses five meshes, no shadows, no postprocessing and no transmission passes; no hardware GPU trace, frame-rate benchmark, field telemetry or full Lighthouse audit was performed. Full cinematic scenes must be re-audited when implemented.

The root is a foundation study. Catalogue data, company narrative approval, stacked product cards, global globe, contact delivery, complete legal notices, custom cursor and final loader material art are not implemented. There are no analytics or optional cookies, so no unnecessary consent banner was added. Canonical production domain and final launch indexing settings need verification before deployment.

Preview builds are noindex through both metadata and response headers. Nothing has been published.

## 20. Recommended Phase 2

After foundation approval, implement the focused Home page: cinematic industrial/material hero, editorial sourcing/trading/distribution introduction, limited product teaser using approved categories, global-reach teaser and enquiry CTA. Reuse the prepared scene boundary with a static fallback and add measured scroll choreography. Keep the main accurate geographic globe for the dedicated Global Reach phase.

Phase 2 has not started. The attached project brief explicitly says “DO NOT START PHASE 2. Wait for approval.”
