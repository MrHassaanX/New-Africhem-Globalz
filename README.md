# AFRICHEM GLOBALZ — new website

The active website lives at this repository root on `codex/foundation`. `origin` points to the New-Africhem-Globalz repository. Run all commands from this directory.

## Local review

npm ci
npm run dev

For sharing, include the source files and `package-lock.json`; omit the ignored `node_modules/`, `.next/`, `.npm-cache/`, `qa/tools/`, and `qa/artifacts/` folders. A recipient can run `npm install` followed by `npm run dev`.

The production preview for this session runs at http://127.0.0.1:3100.
The root page is the single Home design with client-approved copy and a refined chemical-industry visual. `/global-reach` now has its dedicated interactive globe and client-confirmed partner-country content. The other six supporting routes remain foundations. Default builds are noindex.

## Checks

npm run lint
npm run typecheck
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100

Use Node 22 LTS or later compatible with Next 16.3.7.
On this Windows/OneDrive host, Next's native compiler required execution outside the filesystem sandbox to canonicalize the directory.

## Handoff

- docs/content-inventory.md: archived content provenance, confirmed facts and unresolved copy.
- docs/architecture.md: boundaries, design tokens, motion lifecycle and later-phase contracts.
- docs/phase-1-report.md: historical Phase 1 baseline, written before the project was flattened to this root.
- docs/phase-2-notes.md: Home interaction and asset provenance.
- docs/phase-2-5-notes.md: client copy integration and the current Home visual treatment.
- docs/roadmap.md: approved phase boundaries, including Footwear in Phase 4, the Global Reach globe in Phase 5 and Contact backend in Phase 7.
- lib/content/company.ts: reusable client-supplied company copy for Home and later pages.
- qa/home-refinement-check.cjs: current local headless Edge browser verification. QA dependencies are isolated from production.
  Install with npm install --prefix qa/tools --no-save --no-package-lock @playwright/test, then run node qa/home-refinement-check.cjs against port 3100.
- qa/global-reach-check.cjs: globe viewport, theme, drag, touch, idle-resume and reduced-motion checks. It uses Playwright and Sharp from the local QA/runtime environment, not production dependencies.
- qa/artifacts/: ignored local screenshots and measured results.

No deployment, commit, push, email delivery or Phase 3 implementation has been performed. The globe migration is awaiting visual approval.

