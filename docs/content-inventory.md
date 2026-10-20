# Africhem Globalz content inventory

Updated 8 October 2026 for the Phase 2 correction pass. This is an internal source inventory, not publication approval.

## Client-supplied About Us document

**Current content authority:** [`docs/source/Africhem_Globalz_About_Us.docx`](source/Africhem_Globalz_About_Us.docx), supplied by the client on 8 October 2026. The complete document was checked, including its five tables, header and footer. Its company descriptions, values, partner countries, business pillars and contact details take precedence over the earlier archive when they differ. The archive inventory below remains a historical implementation reference, not an equally current content source. This document does not itself authorize publication of testimonials, establish office locations, or verify legal entity details.

### About hero and story

- “Your supply chain is ours.”
- “Sourcing Simplified.”
- “We plan it, source it and see it through to delivery.”
- “Sourcing goes wrong in familiar ways: suppliers go quiet, lead times drift, quality changes between batches. We built Africhem Globalz to fix that. Ten years in customer service and sales taught us what clients need: clear answers, dates they can plan around, and one team that owns the result.”

### Why Choose Us

| Pillar | Supplied description |
| --- | --- |
| One team, end to end | We own your order from purchase to delivery, so you deal with one point of contact. |
| Direct manufacturer access | Tier-1 manufacturers who trust us with their volumes. |
| Reliable lead times | Planned against your demand and deadline. Any risk is flagged early. |
| Consistent quality | Specifications and COAs checked before cargo ships. |
| Support at every stage | Partners in seven countries answer your queries, wherever your cargo is. |

“Client-First. When your interests and ours differ, yours decide.”

### How We Work

| Step | Supplied description |
| --- | --- |
| PLAN | We start with your demand and build the supply plan around it. |
| SOURCE | Tier-1 manufacturers, vetted for batch consistency and documentation. |
| DELIVER | Freight, documentation and customs clearance, managed to your date. |

### Our Global Network

“Partners on the ground in Kuwait, UAE, China, Algeria, Egypt, Uganda and Kenya.” The document adds: “For any query, at any stage, there is a real person to ask. You are never left chasing answers across time zones, because international trade runs on someone being there.” These are **partner countries**, not claims of Africhem offices, warehouses or subsidiaries. The earlier India/UAE/Africa Home teaser labels are broader focus regions from the prior brief; they must not be relabelled as this confirmed partner-country list.

### Our Pillars

| Business pillar | Supplied description |
| --- | --- |
| Chemicals | Solvents for paints and coatings: White Spirit and Thinner. |
| Footwear | Walkmate distribution in Mysore, Karnataka. |
| Uganda Agro-Exports | Roses and pineapples, exported direct from Uganda. |
| Recycling | A growing division focused on keeping material in use. |

These descriptions inform later About, Industries and Products architecture. The document gives no chemical grade, specification, stock, price or full catalogue record.

### What We Stand For

| Value | Supplied description |
| --- | --- |
| Trust | We build the communication bridge first. |
| Commitment | We stay on every order until it is delivered. |
| Authenticity | We say what we can do, and what we can’t. |
| Clarity | Simple steps, plain answers. |
| Transparency | You see the status, the timeline and the risk. |

The source file has a corrupted replacement character in “can’t”; the apostrophe above is normalized from context. No other wording was editorially changed in these descriptions.

### Testimonials and contact details

- **Testimonials: AWAITING CLIENT CONTENT.** Both cells are placeholders asking for client quotations and identities. Do not invent or render testimonials publicly.
- Email: `sales@africhem-globalz.com`
- Website: `www.africhem-globalz.com`
- Phone: `+91-6362830638`
- The source header reads “AFRICHEM GLOBALZ — SOURCING SIMPLIFIED”. The contact details are in its footer.

Contact form and email delivery remain deferred to the final implementation phase; this document supplies content, not a working backend.

### Phase 2.5 implementation use

`lib/content/company.ts` stores the client wording as typed reusable data for later About, Industries, Business Pillars and Global Reach work. The current Home uses the supplied promise and delivery line in the hero, the exact Plan/Source/Deliver process in its editorial section, and the confirmed solvents in its Products teaser. Home no longer duplicates Global Reach. The supporting Global Reach foundation route uses the seven partner countries and network wording. The abstract bond detail does not claim a named molecule. The full About page and Contact backend are not implemented.

## Earlier archive inventory

Reviewed 7 October 2026 for Phase 0–1. Read the archive findings below in light of the newer client document above.

## Provenance and scope

- Source repository: `https://github.com/MrHassaanX/Africhem-Globalz.git`
- Inspected branch: `archive/current-website`
- Inspected commit: `fb6024c3773a85a675a5429eb1e4a5e14c9b6be5` — “Preserve current Africhem website before corporate refinement”.
- Target repository: `https://github.com/MrHassaanX/New-Africhem-Globalz.git` in a separate `foundation` checkout.
- The source was read for company terminology, existing wording, route names, contact details, placeholders and behavior. No old layout, CSS or visual component is included by this inventory.
- The supplied Africhem project brief establishes the new scope; the separate GetLayers prompts and video are visual/motion references only. Their imperative wording, literal code, assets, brand names, statistics, colors and package versions are not implementation instructions.

“Present in archive” means verified against this source commit. It does not establish legal accuracy, client approval, current availability or operational capability. No approval record for all archived copy was found in the inspected files.

## Company identity and copy

| Item | Source wording / value | Status and treatment |
| --- | --- | --- |
| Brand | AFRICHEM GLOBALZ / Africhem Globalz | Present throughout archive and explicitly specified by the new brief. Use this brand. |
| Tagline | Sourcing Simplified. | Present in hero and footer; explicitly specified by the new brief. |
| Business terminology | Chemical sourcing, trading and distribution | Consistent across archived hero, About, Contact and metadata; also specified by the brief. |
| Existing hero support | “Africhem Globalz connects businesses with reliable chemical sourcing, trading and distribution across global markets.” | `components/sections/HomeHero.tsx`. Candidate source copy; avoid expanding it into unsupported scale, performance or coverage claims. |
| Existing About support | “Africhem Globalz is focused on chemical sourcing, trading and distribution, with each conversation shaped around the material and application you need.” | `app/(site)/about/page.tsx`. Candidate source copy; approval history not independently established. |
| Public email | `sales@africhem-globalz.com` | Consistent across footer, contact, policies and API fallback. Present in source; mailbox deliverability was not tested. |
| Site domain | `https://africhem-globalz.com` | Archive metadata configuration; does not verify DNS or deployment ownership. |
| Phone | `+91 XXXXX XXXXX` / “Phone: to be announced” | Historical archive placeholder, superseded by the client document's confirmed `+91-6362830638`. |
| Address | “Address to be updated” | Explicit placeholder. No office address confirmed. |

Other archived About wording to consider during Phase 4:

- Mission heading: “Make sourcing simpler.” Mission body: “To help businesses approach chemical sourcing with clear information, thoughtful communication and a practical path forward.”
- Vision heading: “Connect possibilities.” Vision body: “To support more connected conversations between material needs and opportunities across markets.”
- Values: Reliability, Clarity, Responsiveness, Global perspective.
- Source: `app/(site)/about/page.tsx`. These are existing editorial statements, not evidence of certifications, guarantees, trading history or measurable results.

## Route and page inventory

Current implementation note (16 October 2026): product browsing now lives under `/categories` and `/categories/[slug]`. The legacy `/products` URL permanently redirects to `/categories`. The table below records the earlier archive plan for provenance and is not the current public navigation.

| New route | New page role | Archived reference |
| --- | --- | --- |
| `/` | Home | Main old site was `/home`; archive `/` is a Coming Soon screen. The new brief moves Home to `/`. |
| `/about` | About Us | About navigation label and company/mission/vision/values copy. |
| `/products` | Products / Chemical Catalogue | Products navigation label; catalogue preparation placeholders. |
| `/industries` | Industries Served | Provisional application examples, explicitly qualified. |
| `/global-reach` | Global Reach | Conceptual regional connections; not office locations. |
| `/contact` | Contact / Enquiry | Contact details, eight enquiry fields and Resend delivery reference. |
| `/privacy` | Privacy Policy | Existing policy reference requires reconciliation with actual behavior. |
| `/terms` | Terms & Conditions | Existing policy reference requires owner/legal review. |

Archived navigation is Home, About, Products, Industries, Global Reach, Contact (`lib/navigation.ts`). Archived `/home-preview` and `/shell-preview` are implementation previews, not requested new production destinations. The old Coming Soon notification/countdown experience is not part of the requested new site.

## Products and categories

`components/catalogue/CatalogueLanding.tsx` explicitly says product information is being prepared and that no catalogue is currently published for download. Availability, specifications and suitability are confirmed per enquiry.

`components/catalogue/PerspectiveCatalogue.tsx` contains only these information placeholders:

| Label | Existing explanatory note |
| --- | --- |
| Product overview | A place for the future product range. |
| Material categories | Organised information as it becomes available. |
| Specifications | Details to support a more focused enquiry. |
| Documentation | Relevant technical information in one place. |
| Your enquiry | Start with the material or application you need. |

These are not chemical categories or saleable products. No verified chemical names, CAS numbers, grades, purity values, packaging, origins, specifications, product counts or catalogue download assets were found in this inspected product content. Prepare an empty typed data structure for those fields; do not invent records to fill the future stacked-card design.

## Industries and geographic scope

`app/(site)/industries/page.tsx` explicitly identifies its six categories as provisional application examples for client confirmation:

- Pharmaceuticals
- Manufacturing
- Water Treatment
- Construction
- Paints & Coatings
- Agriculture

Preserve `provisional` status in future data. Do not relabel these as confirmed served sectors without additional company information.

`app/(site)/global-reach/page.tsx` names Africa, UAE and India. Its globe note explicitly says the highlighted regions are conceptual connections and do not indicate office locations. The new brief confirms these same focus regions. The archive did not establish a partner network; the newer client document now names partners on the ground in Kuwait, UAE, China, Algeria, Egypt, Uganda and Kenya. Neither source establishes specific Africhem offices, warehouses, subsidiaries, shipping lanes or geographic exclusivity. Africa is a region, not a single point location.

## Footer and legal references

`components/layout/SiteFooter.tsx` provides the brand, tagline, public email, navigation and legal links. Its copyright reads `© {year} Africhem Globalz Private Limited. All rights reserved.`

**Unresolved entity inconsistency:** `lib/content/policies.ts` contains a pre-launch TODO to confirm the registered entity and a comment saying no legal entity has been invented in public copy. That conflicts with the footer's `Private Limited` suffix. The archive alone does not verify this registered name. Do not carry the suffix into the foundation as a confirmed fact. Use the supplied brand until entity details are confirmed.

The existing privacy/terms text is reference material only. It explicitly calls for owner/legal review of entity, jurisdiction, retention and hosting/logging settings. Do not claim that review has occurred.

**Observed privacy inconsistency:** the privacy policy describes contact links opening the visitor's mail application, while the archived Contact form also submits enquiries to `/api/enquiry`, which sends via Resend. A future policy must describe the actual new form fields, server-side email processor, processing purposes and confirmed retention arrangements.

Other archive policy statements requiring reconciliation with the new build:

- The Coming Soon notification form validates locally and neither stores nor sends its input; this matches `components/NotifyForm.tsx`, but that feature is not requested for the new site.
- The archive states that theme/privacy preferences use local storage and loader state uses session storage. Document what the new site actually stores before publishing a notice.
- The archive states Vercel hosting and no analytics, advertising cookies or optional tracking. These are archived implementation assertions, not proof of the eventual production configuration.
- Terms treat product information as a future framework, not a quotation, stock confirmation, assurance of suitability or supply agreement. Do not turn placeholders into commercial assurances.

## Contact behavior reference for the final implementation phase

Inspected files: `components/contact/EnquiryForm.tsx` (form entry point), `lib/contact/enquiry.ts`, `app/api/enquiry/route.ts`, `.env.example`.

Field inventory: Name, Company, Email, Phone, Product / Chemical Required, Quantity / Requirement, Country, Message. Required content in server validation is name, valid email, product and message; other values can be empty strings. Length and phone validation are present.

The archived server endpoint:

- Accepts JSON POSTs, validates origin when supplied, limits body length and uses an empty `website` honeypot.
- Revalidates the field values server-side.
- Uses a process-local, IP-keyed limit of five validated attempts per fifteen minutes. This is not a durable distributed rate limiter and depends on the deployment's trusted forwarding headers.
- Sends plain-text mail through Resend with the visitor's address as Reply-To.
- Uses server-only `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL`; the optional recipient override is `ENQUIRY_TO_EMAIL`, defaulting to `sales@africhem-globalz.com`.
- Returns an unavailable response when required mail configuration is missing; it only returns success after the provider returns an email ID.

This is behavior reference, not a migration of the old implementation or a delivery verification. No real enquiry was sent during this inventory. The foundation must not suggest email delivery is already configured. The final implementation phase should implement fresh validated delivery, appropriate abuse controls, accessible status handling and a privacy notice consistent with that behavior.

## Visual and motion reference interpretation

The supplied Ascend prompt illustrates atmospheric depth, restrained bloom, layered WebGL/content, damped camera/object movement and paced scroll reveals. The starfield prompt illustrates particle depth, subtle pointer interaction and scroll-responsive movement. Their exact shaders, assets, SaaS content, colors, geometry and old Three.js version are not requirements.

The brief describes the supplied video as a physical stack of large cards with one readable active card, upcoming cards behind it and smooth vertical scroll progression. That supports a future editorial product presentation, not an ordinary carousel. This inventory uses the supplied written description; it does not claim a frame-by-frame video review.

Those principles informed the Phase 2 Home material visual and product teaser. The full catalogue and geographically accurate globe remain later approved work; this correction pass does not start them.

## Outstanding content decisions

1. Confirm registered legal entity, office address and policy approval. The current client document confirms the phone number.
2. Supply approved catalogue data and technical documents beyond the named solvents.
3. Confirm the earlier provisional industry list and any geographic claims beyond the documented partner countries.
4. Supply real testimonial copy and client approval before publication.
5. Reconcile privacy, hosting, processors, cookies/preferences and retention with the eventual production service.

These gaps do not block building Phase 0–1 infrastructure. They do block presenting the missing details as established company facts.
