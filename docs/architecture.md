# Phase 0–1 architecture

## Scope and provenance

The previous checkout points at MrHassaanX/Africhem-Globalz on archive/current-website. Its source commit is fb6024c3773a85a675a5429eb1e4a5e14c9b6be5. The new remote was empty at inspection. A separate clone was created under foundation with branch codex/foundation. No old CSS, layout or visual component was copied. The supplied official logo and the required AGENTS.md Next guidance are retained.

The two GetLayers prompts are references, not implementation commands. Their branding, shader constants, assets, obsolete dependency versions and single-HTML instructions are not adopted. The 6.53-second video was sampled at 0.5-second intervals: successive front cards slide through a shallow offset stack with visible upcoming layers and ample whitespace. Future catalogue work should translate that behavior using confirmed categories only.

## Routes and rendering

- app/layout.tsx: server-rendered document, local fonts, metadata, shared shell.
- app/page.tsx: identity/interaction specimen for foundation review only.
- app/[page]/page.tsx: statically generated temporary foundations for the six supporting routes not yet implemented. Awaited params follow installed Next 16 documentation. dynamicParams=false prevents arbitrary pages.
- app/template.tsx: 400ms route entrance without hiding server-rendered content.
- app/not-found.tsx: branded recovery.
- app/robots.ts and sitemap.ts: crawlers can read noindex; sitemap remains empty until explicit launch setting.
- app/opengraph-image.tsx and icon.png: original-brand social image and optimized official A mark.
- Providers and Header are narrow client boundaries. Pages, copy and footer stay server components.

When a phase implements a full page, replace its temporary dynamic-route entry with an explicit app/<route>/page.tsx and remove that key from generateStaticParams. Do not leave two handlers competing for the same URL.

## Visual system

styles/tokens.css defines cream/mineral, deep navy, industrial blue and teal semantic colors. Green is confined to the official logo gradient. Inter Tight display and Inter body fonts are local variable WOFF2 through next/font/local. Default theme is light; users can select dark. Saved preference is applied before paint; cross-tab changes are synchronized. Storage denial leaves a functional temporary choice.

The official full-color logo retains its gradient. Dark mode uses a cream support surface for its navy portions. The root specimen presents typography, material/light direction, palette and link states; it does not represent completed production hero photography.

Navigation is centered on desktop and switches to a native dialog below 1100px. The dialog handles focus confinement and Escape. Opening it stops Lenis and locks root scrolling; data-lenis-prevent allows internal menu scrolling. Close, resize and unmount restore scrolling. Active routes use a small underline. The skip link and visible focus styles support keyboard use.

## Motion

A single Lenis instance is owned by Providers. It runs from GSAP's ticker only, with ScrollTrigger updated from Lenis scroll events. No second RAF or ScrollSmoother is used. Route changes, preference changes and unmount destroy the previous instance before replacing it. Native scrolling remains the fallback if lazy imports fail. Legal routes and reduced-motion preferences skip Lenis/GSAP setup.

Reveal lazy-loads GSAP/ScrollTrigger near its section and uses scoped matchMedia cleanup. Content is never initially hidden. Motion's LazyMotion/domAnimation supplies UI interactions with reducedMotion=user.

The first-visit intro uses the official logo and tagline with a simple material-light CSS foundation. It runs once per tab session. Its visible animation completes at 2.3 seconds with a 2.8-second script fail-safe. CSS also dismisses it without hydration; keyboard input dismisses it immediately. It skips reduced motion and direct legal-page visits. There are no artificial percentages, diagnostics, spinners or WebGL startup dependency.

## Three.js preparation

SceneStage is a client-only opt-in dynamic import of SceneCanvas. Without activation, the page shows a CSS material specimen and downloads no renderer. Canvas failure leaves this fallback available.

The illustrative five-mesh sample is deliberately not the full Phase 2 scene. It uses current compatible React Three Fiber/Three packages, low-power preference, no antialiasing, no shadows, no expensive transmission or postprocessing. Desktop DPR is capped at 1.5; mobile/coarse-pointer DPR at 1. Offscreen or hidden-tab rendering changes to demand mode. Reduced motion uses a static frame. Pointer steering and slow rotation are restrained. Observers and visibility listeners clean up. Canvas resources unmount when the user closes the sample.

Future scenes use the same opt-in pattern. Add postprocessing only after testing actual cost, retain HTML/static fallback, and avoid initializing visual scenes on legal routes. The accurate globe now lives only on Global Reach.

## Content and security

lib/site.ts carries brand, confirmed email and navigation; lib/catalogue.ts supplies the typed product contract with an empty dataset. No grades, CAS numbers, stock, offices, statistics or certifications are invented.

The archive legal wording conflicts with its current form behavior and includes an unconfirmed entity suffix. Do not publish it unchanged. The foundation notices accurately describe the preview's current functionality; final policies require review.

There is no form/backend in this phase. Resend is intentionally deferred to Phase 6. When added, keep credentials server-only, validate and bound input, use durable anti-abuse controls and update privacy copy to the actual submission flow. The archive implementation is a reference, not a vetted migration.

.env files are ignored, with only .env.example tracked. SITE_INDEXABLE defaults false and controls both robots metadata and X-Robots-Tag headers. SITE_URL is a configurable canonical target, to verify before launch. No third-party trackers, remote fonts or reference assets are loaded. A strict CSP and deployment-specific headers should be tested once final hosting and service requirements are known.

## Phase 2 Home

app/page.tsx remains a Server Component. components/home/HomeIntro.tsx owns scoped GSAP ScrollTriggers for the editorial entrance, material photograph movement, and capabilities reveal. Its fixed desktop photograph moves and fades as the capabilities appear; on mobile the photograph sits below the text. Reduced motion retains the still image and readable content. GSAP triggers and browser listeners clean up on unmount. The existing Providers remain the sole Lenis owner.

components/home/ProductStack.tsx progressively reveals three provisional catalogue chapters with GSAP/ScrollTrigger on desktop. The cards are in normal flow without JavaScript, on mobile, and with reduced motion. Desktop keyboard focus on any card link scrolls that chapter into view. The captions describe the enquiry process, not unverified chemical categories or stock. The full Products catalogue remains a later phase.

The former Global Reach Home teaser was removed in Phase 2.5. The dedicated `/global-reach` route now hosts the globe. The Home CTA still links to the existing Contact foundation, with no claim that an enquiry form is connected.

## Global Reach globe migration

The archived `components/sections/GlobeScene.tsx` and `GlobalReachGlobe.tsx` supplied the working Earth texture generation, Natural Earth country outlines, atmosphere shader, sphere lighting, drag inertia, auto-rotation, keyboard rotation, arc geometry and responsive camera. They were copied into `components/global-reach/` and adapted to the current palette and page shell. The existing `assets/geo/natural-earth-110m.json` is byte-identical to the archive source; no production dependency or external asset URL was added.

`lib/globe/locations.ts` maps the seven names from `lib/content/company.ts` to geographic points within each partner country. The faint, non-directional arcs are conceptual network cues, not shipping routes. The page uses one shared Lenis owner from Providers and a scoped GSAP ScrollTrigger for globe entry and side-copy reveal. The renderer is dynamically imported near the viewport, caps DPR, switches to demand frames when offscreen or hidden, and keeps a CSS fallback. Reduced motion stops automatic rotation and uses demand rendering while preserving drag and keyboard controls.

The Home uses three optimized generated material WebPs in the product stack and one optimized generated fluid WebP as the hero fallback. These visuals are decorative material studies and do not depict inventory or specifications. Their generated source files remain outside the repository; only optimized final assets are referenced.
