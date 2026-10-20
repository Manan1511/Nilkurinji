# Nilkurinji complete storefront redesign

Status: proposed design and delivery roadmap, ready for owner review. Planning only; this document does not authorize implementation or deployment.

Planning review: the original brief received a fresh, read-only builder check. The expanded requirements below have been self-reviewed against the existing source. Visual concept selection and owner approval remain the next design checkpoints.

Companion document: [detailed implementation plan](../plans/2026-10-20-nilkurinji-complete-redesign-implementation.md). This document owns the product, visual and interaction requirements; the companion owns file responsibilities, interfaces, work order and verification.

## Intent

Make Nilkurinji feel like a contemporary premium tea brand. The owner has rejected the present visual direction, including the oversized masthead, search that expands the document, and dated overall composition. The new work replaces the presentation across the entire storefront.

Confirmed by the owner: keep the existing logo and green identity; redesign the layouts and typography. The earlier PDFs remain useful for business scope and assets, but their composition no longer governs the redesign. Product photography will be replaced later and should not absorb this phase's effort.

The recommendation is a precise, product-focused tea shop: compact navigation, confident type, clear merchandising, deliberate image crops and useful interactions. Space should separate meaningful content rather than enlarge the header. The following visual and interaction choices are recommendations by the designer, not additional decisions already approved by the owner.

## What the current screenshots establish

- The masthead, branding and navigation occupy roughly a quarter to a third of the visible page before the hero begins.
- Search adds another large section and pushes the hero down. Its large heading, field border, input focus outline and submit button compete for attention.
- Repeated cream surfaces, conventional serif navigation and the decorative landscape composition flatten the hierarchy.
- Previous passes optimized individual details without establishing a convincing whole-page composition.

The redesign must be judged through complete rendered pages and interaction states. Passing compilation or a mechanical detector is not evidence that the visual direction succeeds.

## Design language

### Identity and typography

- Keep the approved logo artwork, its proportions and its green identity. Scale the logo as one unit; do not stretch or redraw it. A proposed compact header lockup must be shown in the concept review if it alters the existing arrangement.
- Keep the current forest green, #254434, as the anchor. Use near-white and soft neutral surfaces, dark ink, and a small tonal green range. Remove ornamental gold treatments and repeated decorative leaves.
- Proposed type pairing: Newsreader for editorial headings and Manrope for body, navigation and controls. The logo's own lettering remains unchanged. Confirm the pairing in the visual concept before production use.
- Body text: 16px minimum, line-height around 1.6. Functional labels: 14px minimum. Search fields and mobile native selects: 16px minimum. Smaller logo lettering or factual metadata must remain subordinate and demonstrably legible.
- Headline targets: 48–68px on desktop and 36–44px on mobile, adjusted for the approved copy. At normal zoom, aim for two desktop lines and three mobile lines. At 200% zoom, allow additional wrapping and natural reflow without clipping.
- Use normal-case labels, consistent type roles, one small-radius control system and clear keyboard focus. Avoid widely tracked micro-labels, ornamental badges and decorative pseudo-content.

### Layout and imagery

- Use a consistent maximum content width of 1440px, with 48px desktop gutters and 20px mobile gutters; allow smaller 16px gutters at 320px if needed.
- Build the hero around one strong image or product study with a clear headline and one primary shopping action. Retire the current faded landscape-and-copy composition.
- Use existing preview imagery during composition work. Keep image frames reusable so approved product photography can replace it without rebuilding layouts.
- No new packaging designs, elaborate asset production, unverified provenance, health claims, shipping promises, fake ratings or invented reviews.
- Motion provides feedback: short hover, disclosure and image transitions. No scroll hijacking, pinned storytelling, looping decorative movement or dependency added solely for simple effects. Reduced motion remains fully supported.

## Header and search

### Compact shared header

- One desktop row, 76px high, containing the compact existing logo at left, navigation in the middle and utilities at right. No second navigation row.
- Mobile/tablet header: 64px high. Collapse the navigation when the complete desktop row cannot fit; never squeeze labels or stack a second header row.
- Primary navigation recommendation: Shop, Tea, Our story, Contact. The logo supplies the Home link. Removing the redundant Home label is part of this proposal; all existing routes remain intact.
- Search, cart, account and wishlist retain their functions. Mobile may move account and wishlist into the menu, while search and cart stay immediately accessible.
- Keep utility hit areas at least 44 by 44px. The logo size, header height and icon alignment are identical across routes.
- The preview notice becomes a restrained single line: "Preview storefront · Purchases disabled". Maximum 24px high on desktop and 36px on mobile. The header plus notice must occupy no more than 100px of the page in their normal state.

### Search overlay

- Search opens over the page; it must not increase header height, change the hero's position or create a new content section.
- Desktop: a compact, non-modal popover anchored below the header's search control, up to 560px wide, constrained to the viewport. Its input is the primary element. Avoid a separate oversized heading and nested input borders.
- Mobile: a viewport-constrained search sheet with a visible close action and an input that remains usable when the keyboard is open. If it blocks the page, use modal dialog semantics, focus containment, inert background and restored scroll position. Desktop non-modal behavior must not trap focus.
- Both variants focus the input on open, close with Escape or the close control, restore focus appropriately, and close when navigating. Desktop outside interaction dismisses the popover without stealing the clicked element's focus.
- Empty input shows a few collection routes, labeled as collection browsing rather than fabricated popular searches.
- Predictive search: wait 300ms after typing, require at least two trimmed characters, cap the query at 120 characters, cancel obsolete requests and display at most six product results. No polling or requests for empty input.
- Each result shows actual product image, title and Shopify-authoritative price where available. Include an explicit link to all results. Enter still submits /search?q=... and direct result URLs remain usable.
- Use a server-only /api/search route backed by the existing typed catalog integration; return only public product fields. Reuse the existing 60-second public cache policy where applicable. No private credential reaches the browser.
- Loading, no matches and API failure are distinct. Preserve the query. A live failure must never insert preview products or prices.

## Page-by-page redesign

| Surface | Result |
| --- | --- |
| Home | Compact shared header; one purposeful hero; a real tea product selection; Tea and Tea Bags discovery; a short brand/story section using approved facts; secondary pantry navigation; concise footer. No repeated decorative strips or invented benefits. |
| Shop and every collection | One consistent catalog system, visible category choices, restrained filtering and sorting, and standardized image frames. Four product columns at wide desktop, three at intermediate widths when cards remain readable, and two on mobile. Filters open in a drawer on small screens. |
| Product cards | Open layouts without heavy enclosing boxes. Stable image ratios, readable names and prices, aligned information, unobtrusive wishlist action. Single-variant live products can expose Add; multi-variant products expose Choose options. Preview products have no inactive purchase controls. |
| Product detail | Large gallery, clearly grouped title and price, readable variants and quantity, obvious Add to cart and secondary Buy Now, then approved details/FAQs/reviews and related products. Desktop purchase details may be sticky within their section; mobile has one uninterrupted purchase flow. |
| Cart | Clean line items and quantity controls, clear stock/error feedback, and a distinct order summary. Desktop summary may be sticky. Mobile checkout must stay discoverable without covering line items. Retain the full /cart route. |
| Full search results | Same typography and product cards as Shop, visible query, useful count and empty-state recovery, and consistent gutters. |
| Wishlist | Same product-card system, browser-saved state, understandable remove action, and a useful empty state. |
| About | A deliberate editorial composition using approved brand facts and existing imagery. Remove the scrapbook/handwritten styling. |
| Contact and account | Clear contact links and the existing Shopify-hosted customer-account handoff. No new contact form or custom account system. |
| Privacy, Refund, Terms | Quiet reading layouts with a 65–75-character measure, readable headings, and unchanged policy meaning. |
| Footer | Compact, useful link groups, existing logo, approved social links and legible legal text. Avoid a disproportionately tall decorative ending. |

Tea Guide, Recipes, Journal and newsletter remain excluded. Rice, Snacks and Other Foods remain available as secondary categories. Review/FAQ content is shown only when backed by the approved source. The homepage is the first visual checkpoint, not the only redesigned route.

## Technical boundaries

- Keep Next.js, React, TypeScript, Tailwind, Netlify and Shopify hosted checkout. Read the installed Next.js 16.4 documentation before implementation.
- Preserve Shopify catalog/cart authority, secure cart cookies, Buy Now cart isolation, authoritative pricing/availability and existing recovery behavior.
- Keep the existing page slugs, server integration and SEO contracts. Recheck metadata, canonical URLs, structured data, robots, sitemap and social previews after layout changes.
- Preserve English, INR and India-only launch defaults. Payment/COD approval and end-to-end merchant-store validation are separate launch work.
- Keep preview products visibly separate from live data; preview checkout and indexing remain disabled. Shared credentials stay in ignored/runtime environment values.
- Replace the presentation through component CSS Modules and a small shared token/base layer. Reuse useful state and commerce logic; retire legacy page styling as each route migrates. Do not append another chain of global specificity overrides.
- Existing useful modules include src/lib/shopify, src/components/product-purchase-panel.tsx, cart-panel.tsx, wishlist state and search query handling. Reuse behavior, not the rejected presentation.
- Update DESIGN.md and .impeccable/design.json from the approved and finished new system, rather than altering documentation to silence detector warnings.
- Local milestone commits may be made after focused verification. Do not push, deploy, change DNS, alter Shopify catalog configuration or enable payments as part of visual implementation without the applicable authorization.

## Delivery roadmap

1. **Visual direction and proof.** Produce materially different first-viewport concepts within the fixed logo/green identity, recommend one, and settle the composition with the owner. Show real layout and copy, not just moodboards. Complete desktop and mobile homepage comps plus search-open states for the chosen direction before production UI work.
2. **Shared foundation and shell.** Establish the approved type/color/spacing/control tokens. Implement the compact header, responsive menu, preview notice, search overlay, public predictive-search endpoint and compact footer. This milestone is rejected if opening search shifts the page.
3. **Homepage.** Build the complete approved composition using existing temporary assets. Review desktop and mobile together. Resolve hierarchy, image framing, copy measure and CTA placement before spreading the system further.
4. **Shopping flow.** Apply the system to Shop, all collections, product cards, product detail, cart, search results and wishlist. Keep existing commerce tests and add interaction tests for new search and responsive controls.
5. **Supporting pages.** Apply the same shell/type/spacing system to About, Contact, account handoff and policy pages. Preserve approved factual and legal content.
6. **Whole-site review and handover.** Inspect rendered pages and states, batch material corrections, rerun relevant tests and production build, document the shipped system, and provide the local preview for final review. Deployment remains a separate step.

Native implementation is the previously chosen execution method. The companion file/task plan is available now for review; production UI work follows the design review and selection of a visual direction. This roadmap is not permission to skip the visual checkpoints.

## Acceptance checks

- At 1366x768 and 1440x900, the desktop header plus preview notice is at most 100px high; navigation stays on one row.
- At 320, 375, 390, 768, 1024, 1366, 1440 and 1920 CSS-pixel widths, there is no unintended horizontal overflow, logo clipping, elliptical round controls or overlapping utilities.
- Opening desktop search leaves the hero's top coordinate unchanged within 1 CSS pixel. Search content scrolls within its own maximum height where needed.
- At 375x812, 390x844 and the desktop viewports above, the hero heading, short supporting sentence and primary CTA are visible in the initial viewport. At 320x568, permit natural scrolling instead of shrinking type or clipping content.
- At 200% zoom, the layout may reflow to the compact header; content and controls remain available.
- Text contrast meets WCAG AA; visible keyboard focus and at least 44px interactive targets are retained. Price/name alignment survives two-line names, long prices and sold-out variants.
- Search tests cover Escape, focus return, outside dismissal, route changes, one-character/empty input, long queries, cancellation/out-of-order responses, no matches, network failures and live/preview separation.
- Commerce tests cover variants, quantity, unavailable stock, expired carts, API failures and Buy Now isolation. Visual redesign does not itself count as payment or launch validation.
- Run tests, lint, typecheck and the production build; confirm the local app serves the new assets. Performance targets are LCP <=2.5s, CLS <=0.1 and INP <=200ms, assessed honestly in representative lab runs and, after launch, field data where available.
- Review rendered desktop/mobile images before claiming visual completion. Respect the existing restriction on CUA/Playwright/CDP; obtain owner-provided rendered screenshots unless that restriction is explicitly changed. Never replace this visual checkpoint with source-only reassurance.
- The owner sees the complete homepage and search states before implementation moves to the full page rollout. Material review findings are resolved or explicitly reported as open.

## Research references

- [Kettl](https://kettl.co/): product-first merchandising with named teas, visible prices, collection routes and purchase actions. Interpret its clarity for Nilkurinji; do not copy its Japanese product story, classes or subscriptions.
- [Leaves and Flowers](https://leavesandflowers.com/): a focused Shop/Info hierarchy with separate utility actions and useful category routes. Learn from its navigation model without adding excluded editorial/newsletter scope.
- [Baymard search research](https://baymard.com/blog/search-bar-ui): search recognition, input design and useful recovery paths. The overlay design and height targets above are this proposal's choices, not measurements claimed from these references.
- [Newsreader](https://fonts.google.com/specimen/Newsreader) and [Manrope](https://fonts.google.com/specimen/Manrope): proposed fonts to test in the visual direction round.

## Owner review

Already settled: retain the logo and green identity, undertake a complete visual redesign, prioritize the homepage, keep Shopify/Netlify, and avoid spending this phase on final product photography.

Proposed for review: the contemporary editorial direction, compact one-row header, overlay/predictive search, type pairing, homepage sequence and removal of the redundant Home navigation label. Approving this brief sets the constraints for the visual concept round; approving a chosen visual concept sets the appearance for implementation.

## Detailed requirement contract

The sections below make the proposal buildable. The exact composition is still subject to the visual concept review. A working draft of a token or interaction is not an owner-approved visual comp.

### A. Decision register and boundaries

| ID | Decision | Authority/status |
| --- | --- | --- |
| BR-01 | Preserve the existing logo and green identity. | Owner confirmed. |
| BR-02 | Replace the layouts and typography across the whole storefront. | Owner confirmed. |
| BR-03 | Homepage is the first review surface. | Owner confirmed earlier in the project. |
| BR-04 | Existing photography is temporary; final product-photo work is not the priority. | Owner confirmed. |
| BR-05 | English, INR, India-only launch defaults; Shopify backend/checkout and Netlify hosting. | Existing approved scope. |
| BR-06 | Tea Guide, Recipes, Journal and newsletter remain excluded. | Owner confirmed earlier; unchanged by this redesign request. |
| DS-01 | Newsreader/Manrope, near-white surfaces, compact header and the composition described here. | Designer recommendations; test in visual concepts. |
| NAV-01 | Remove the redundant Home nav label while preserving the logo's Home link and all URLs. | Explicit proposal; include in concept review. |
| SEA-01 | Add predictive product suggestions to the overlay while preserving the full results page. | Proposed enhancement within the redesign. |
| OPS-01 | No publishing, DNS change, catalog provisioning, credential rotation or payment enablement in this work. | Scope boundary; launch operations remain separate. |

The build may improve presentation-related error recovery. It must not silently change inventory policy, shipping, tax, COD eligibility, payment processing or legal meaning.

### B. Proposed design tokens

These are starting values for the concept round. Once a comp is chosen, record its final values in DESIGN.md, .impeccable/design.json and the CSS token file together. Do not maintain three competing token definitions.

| Role | Proposed value | Usage |
| --- | --- | --- |
| Brand | #254434 | Main actions, brand identity, selected controls. |
| Brand hover | #1C3327 | Hover/pressed primary actions. |
| Page surface | #FAFBF8 | Main near-white background. |
| Subtle surface | #F4F6F1 | Product-image grounds and quiet grouped areas. |
| Primary ink | #242D24 | Headings and principal text. |
| Secondary ink | #526356 | Supporting copy and placeholders, subject to contrast verification. |
| Rule | #D7DED7 | Dividers and neutral control edges, not text. |
| Error | #9F3434 | Errors only; never decorative emphasis. |
| Focus | 2px solid brand, 3px offset | Keyboard-visible outline; adjust only when necessary for contrast on the underlying surface. |
| Radius | 2px | Buttons and fields. Image frames remain square. |
| Round utility | 44px square, aspect-ratio 1, flex-shrink 0 | Only controls intentionally designed as circles. |
| Spacing scale | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px | Use role-appropriate steps rather than isolated arbitrary values. |

Proposed type roles:

| Role | Desktop | Mobile | Notes |
| --- | --- | --- | --- |
| Hero heading | 48–68px | 36–44px | Newsreader, 400/500, line-height 1.08–1.15, tracking around -0.02em. |
| Page heading | 40–56px | 32–40px | Same editorial family; no extra eyebrow needed to repeat the page name. |
| Section heading | 32–44px | 28–34px | Clear scale below the hero. |
| Product title on a card | 20–22px | 18–20px | Full words remain readable; long names may wrap. |
| Product-detail title | 36–44px | 28–34px | No decorative tracking or forced clipping. |
| Body | 16px | 16px | Manrope, approximately 1.6 line-height. |
| Price | 18px | 16px | Stable number alignment; formatMoney remains authoritative. |
| Navigation and controls | 14–16px | 14–16px | Normal case, 500/600 weight, no exaggerated letter spacing. |
| Captions/metadata | 13px | 13px | Only secondary facts, never the main action or price. |
| Search/native select input | 16–18px | 16px minimum | Avoid mobile input zoom caused by undersized text. |

The existing logo currently includes live lettering. Replacing the page's display font must not change that logo accidentally. Preserve its existing logo font separately, or use an owner-approved equivalent vector lockup. Two UI font families are the target; a retained legacy logo font is a documented exception until a faithful approved asset exists.

Use the minimum font weights needed. Use next/font with swap behavior and the required character subset. The existing handwritten Caveat face is retired from page content after the About migration.

### C. Responsive layout map

| Width | Header | Catalog | Outer gutter |
| --- | --- | --- | --- |
| 320–359px | Compact, 64px | 2 columns, 12px gap | 16px |
| 360–767px | Compact, 64px | 2 columns, 16px gap | 20px |
| 768–1023px | Compact, 64px | 2 columns, 24px gap | 32px |
| 1024–1279px | Desktop, 76px | 3 columns, 24px gap | 32px |
| 1280px and wider | Desktop, 76px | 4 columns, 24–32px gap | 48px |

The 1440px content limit includes the gutters. Hero media may bleed beyond this grid only where the chosen comp explicitly does so. Headings, grids and footer columns otherwise share the same alignment rails.

At 200% zoom, compact navigation is an acceptable reflow. Do not force the desktop row to remain visible after it no longer fits. Do not hide overflow at the page root to conceal a layout defect.

### D. Header, navigation and footer details

**HDR-01: geometry.** A single shared shell controls the header. Preview mode contributes a 24px desktop notice or up to 36px compact notice. The row beneath remains 76px/64px. The total normal-state height is never more than 100px. Live mode omits the preview notice rather than leaving an empty slot.

**HDR-02: logo.** Give the approved lockup a reserved box, approximately 160px wide on desktop and 138px on compact layouts, with intrinsic ratio preserved. Final dimensions must be verified in the comp. Never set independent page-specific logo sizes or force a square logo frame.

**HDR-03: desktop navigation.** Shop, Tea, Our story and Contact sit on one line. Utility icons share one size and stroke family. The current route uses a restrained underline and an accessible current-page state. The logo links to Home with the accessible name "Nilkurinji home".

**HDR-04: compact navigation.** The menu, logo, search and cart fit the available width without overlap. Account and wishlist move into the menu. The menu is a controlled sheet, closes on navigation and Escape, and restores focus to an available trigger. Menu and search cannot both be open.

**HDR-05: sticky behavior.** The complete shell can be sticky at the top with a thin divider. It does not shrink, expand or change logo size while scrolling. No large shadow or animated floating capsule is added.

**FTR-01: footer.** Use brand, shopping and service groups. Shopping links cover Shop, Tea, Tea Bags and access to the other categories; service links include About, Contact, policies, account and Search. Only approved social URLs appear. Arrange long desktop link groups in short columns, and allow natural mobile height instead of shrinking text. The full original logo can appear here. No newsletter form or promotional claims are introduced.

### E. Search interaction and request contract

**SEA-02: presentation.** Desktop search is a non-modal, fixed-position popover below the visible shell, aligned to its utility area. Width is min(560px, viewport minus two gutters). It has a single search field and a visible close action. Maximum height is the lesser of 560px and available viewport space; results scroll internally. It never contributes height to document flow.

Compact search is a modal sheet below the shell, with a search row that remains reachable while results scroll. Limit it to the available dynamic/visual viewport when the keyboard opens. The background cannot receive pointer or keyboard interaction while the modal is open. Avoid an extra oversized title; provide an accessible name without consuming a second banner row.

**SEA-03: state machine.**

| State | Trigger | Visible result | Next behavior |
| --- | --- | --- | --- |
| Closed | Initial state or dismissal | Trigger only | Opening focuses the field. |
| Idle | Empty or one-character normalized query | Collection links; no product request | Typing two characters starts the debounce. |
| Waiting | Eligible query changes | Clear stale products; retain entered text | After 300ms, request suggestions. |
| Loading | Request starts | One quiet loading status, not several moving skeleton rows | Request can be cancelled. |
| Results | Successful response with items | Up to six linked products plus all-results action | Enter in the field submits the whole query; Enter on a result follows that link. |
| Empty | Successful response without items | "No products found" and collection routes | Editing keeps the field focused. |
| Error | Current request fails | Plain availability message, Retry and browse links | Query is preserved; no silent fallback catalog. |

Use native form and link keyboard behavior. The field is a search input, not a partially implemented ARIA combobox. Suggestion results are a semantic list of links with a separately announced result status. Do not claim arrow-key selection unless a complete, tested composite-widget pattern is later approved.

**SEA-04: lifecycle.** Escape and the close button return focus to the visible search trigger. An outside pointer dismisses the desktop popover without stealing the new target's focus. Tab may leave the non-modal popover; it closes once focus has actually left both panel and trigger. A modal contains focus until closed. Following any result, primary route, cart or account link closes the active panel. Crossing the 1024px breakpoint closes an open panel, releases any modal/body state, preserves the query and chooses an available focus target. Keyboard-driven height changes alone do not close the mobile sheet.

**SEA-05: normalization and concurrency.** Trim and collapse whitespace, preserve the user's letter case, and cap at 120 Unicode code points without splitting a surrogate pair. Count the two-character eligibility threshold using the same code-point rule, rather than JavaScript string length. Fewer than two normalized characters never trigger a suggestion request. Debounce for 300ms, abort the previous request when the query changes or the panel closes, and also guard response generations so an ignored abort cannot display an old query's results. Do not poll.

**SEA-06: endpoint.** GET /api/search?q=... uses the existing searchProducts service. Return only public fields: product ID, handle, title, featured image, minimum price or null, and preview status. At most six items are returned; hasMore indicates whether more results were available in the service response. Empty/short queries return an empty success without contacting Shopify. Failed searches return HTTP 503 with shopper-safe text, not a Shopify exception body. No cookies or cart data are read or written by this route.

**SEA-07: cache.** Keep the established 60-second Shopify public-fetch cache. Do not add shared HTTP caching to the API response: use no-store at that response boundary. The client may keep a bounded in-memory cache of 20 successful queries for 60 seconds; never cache failures or persist search history to localStorage. The new route must not cause a duplicate request for the same paused query or fire background requests while closed.

**SEA-08: full results.** Keep /search?q=... as an independent, directly accessible GET form and results page. Preview results retain sample-price labels. Live failures remain unavailable; missing catalog configuration never produces demo inventory. Search titles and result text are escaped by React, not inserted as HTML.

### F. Homepage section specification

| Order | Section | Content and layout requirement | Missing-data behavior |
| --- | --- | --- | --- |
| 1 | Hero | One composition, one headline, one short sentence, one primary Tea action, and one strong temporary image. No separate eyebrow/tagline pile. | Use explicitly labeled draft composition in preview. Live mode uses merchant content or a plain availability state. |
| 2 | Selected tea | Up to four tea/tea-bag products using the shared card system. Heading identifies the selection without claiming best-seller status. | Show only real available entries. Never duplicate products or insert pantry food to fill tea slots. |
| 3 | Tea discovery | Two deliberate entry points: Tea and Tea Bags. Useful labels, one action each, no circular clip-art category shelf. | Category routes remain valid even when empty; their pages show honest empty states. |
| 4 | Brand story | One image and a short, approved story excerpt with an About link. Approximately 40–60 words. | If no approved story is available, use a concise About route without invented origin claims. |
| 5 | Other pantry categories | Quiet access to Rice, Snacks and Other Foods. Keep tea visually primary. | Links only are sufficient; no new asset production is required. |
| 6 | Footer | Shared compact footer. | Hide social links that have no approved URL. |

On mobile, hero copy and its CTA precede the large media area so the action does not depend on scrolling past a tall image. At the specified 375/390px review sizes, the CTA is visible in the first viewport. At 320x568, scrolling is preferable to smaller text or a cropped composition.

The hero image is the only high-priority image unless a measured first-view need proves otherwise. Catalog imagery below the fold is lazy-loaded. Respect existing banner-slider capability: one campaign shows no carousel controls; multiple approved campaigns can use manual controls with accessible names. Autoplay is off. Do not add fake campaign slides merely to demonstrate a slider.

For one or two featured tea products, use an intentional single/paired composition with a sensible card width. Do not stretch two cards across a four-card canvas or add empty placeholder cards. Three or four products use the regular responsive grid.

### G. Shop, collections and product-card rules

**CAT-01: shared structure.** Shop and all five collections use the same page-heading, toolbar, card and empty-state patterns. Tea may differ through approved content and imagery, not an unrelated UI system. Remove category-specific decorative benefits bands and placeholder trust claims.

**CAT-02: controls.** Category links are visible. Sorting is labeled, not icon-only. Filters use real available product types/tags/prices. Wide layouts can show a restrained facet area; compact layouts use a Filters button and modal sheet with a current result count, Apply and Clear actions. Inside the sheet, edits are draft state until Apply; closing or Escape discards unapplied edits. Clear resets the draft; Apply commits it.

**CAT-03: state in URLs.** Keep filter/sort state in the current listing URL so returning from a product can restore the same selection. Use sort, category, productType, price and repeated facet.<groupId> parameters. Only configured values are accepted. Preserve q and unrelated attribution parameters. Default values are omitted. Changing controls replaces the current history entry without scrolling or fetching the catalog again; normal product navigation still pushes a route. Canonicals remain the base Shop/collection route; Search remains non-indexable.

**CAT-04: product cards.** Use one 4:5 image-frame ratio throughout catalog grids. Packshots use contain; editorial image crops use cover only when explicitly intended. Missing images use a neutral labeled fallback, not a fake product illustration. Product name, type when useful, price and action have a consistent order. A normal two-line title does not misalign prices across a row; longer titles wrap without hiding the full name.

**CAT-05: actions.** Preview cards show a truthful sample-price label and no purchase action. Live cards with exactly one variant can expose Add when that variant is available and purchasing is enabled. An eligible live product with multiple variants exposes Choose options and goes to the product page; never silently add the first available option. A sold-out product remains viewable and is labeled unavailable. Wishlist targets are independent of the product link and at least 44px square.

Apply card-action rules in this order so overlapping conditions do not produce contradictory controls:

| Condition | Card behavior |
| --- | --- |
| Preview product | Product/detail link, sample-price label when a price exists, no purchase control. |
| Live product with no available variant | Product/detail link and unavailable status; no Add. |
| Purchasing disabled | Product/detail link and the applicable store-level availability notice; no Add. |
| Enabled live product with multiple variants and at least one available | Choose options links to the product page. |
| Enabled live product with exactly one variant, available with a valid variant price | Add submits that exact variant once. |
| Missing variant/price data | Product/detail link and honest availability text; never invent a price or submission ID. |

**CAT-06: price and data edges.** Missing price is not ₹0. Preserve the Shopify currency when formatting; do not perform a client conversion. Default ordering retains products without a price; active price filters exclude unknown prices. An empty filtered set offers Clear filters; an empty published collection offers broader browsing; an API failure offers Retry/browse without claiming the shop is empty.

### H. Product detail and purchase behavior

- Desktop uses an approximately 7/5 gallery/details split. Below 1024px, stack gallery, product title/price and purchase controls in a single reading order.
- Give the primary gallery a stable frame, normally square, with contain behavior for packshots. Thumbnails are at least 44px targets and identify their selected state. Image selection must not reset the chosen variant or quantity.
- Purchase information can be sticky only when it fits the available desktop height. Disable sticky behavior on compact/short viewports rather than creating a cramped internal scrollbox.
- The selected variant is the sole source for the displayed purchase price and submission ID. Preserve findSelectedVariant and the existing unavailable-combination handling.
- Initially select the first available variant, or the first variant when none is available so its unavailable state is understandable. Expose each option with a proper label and indicate the actual selected value.
- Keep quantity within the existing 1–10 contract. Use availableForSale for eligibility and server responses as the authority. Do not invent new backorder policy from quantityAvailable alone.
- Add to cart is primary. Buy Now is secondary and clearly labeled. Both have pending, success and failure states and reject duplicate submission while busy.
- Add success announces confirmation and updates the header cart count through the existing event. It does not force navigation away from the product.
- Buy Now uses the existing separate-cart flow. Its failure preserves selections and its success does not overwrite the shopping-cart cookie.
- On a stock/API failure, retain the user's selected options and quantity, show a useful recovery action, and never fabricate a successful add.
- Details, ingredients/brewing guidance, FAQs and reviews are rendered only from approved content. Do not invent a review submission form or star aggregate. Recommendations exclude the current product and reuse the existing same-collection fallback.
- Missing product: use the route's not-found behavior with a shopping route. Unavailable API: show a temporary-availability message, not a false 404 and not preview data.

### I. Cart and wishlist details

**Cart layout.** On desktop, use flexible line items beside an approximately 320px order summary. On compact screens, the summary follows the line items with a single full-width checkout action. Do not add a second fixed checkout bar or new cart drawer in this redesign.

**Cart updates.** Reuse /api/cart and ShopifyCart. Serialize mutations: while an update/remove/checkout request is pending, prevent a second mutation from racing it. Keep the old row visible until a successful response returns. The returned server totals replace the UI totals; do not calculate a supposedly authoritative total from stale browser prices.

**Cart recovery.** Loading, empty, preview, expired, unavailable-line and API-failure states are distinct. A failed removal preserves the item. After a conflict, provide a cart refresh path using GET /api/cart instead of silently continuing with stale totals. Checkout is disabled for empty/unavailable carts, pending changes and preview mode. Preserve safe hosted-checkout URL validation and signed HttpOnly cookies.

**Wishlist storage.** Retain the existing nilkurinji-wishlist-v1 key and 20-item cap. Handle denied storage writes as well as corrupted reads. If saving fails, retain the previous saved state and announce that the item could not be saved on this device. At the cap, explain that an item must be removed; do not silently discard an earlier saved product. Cross-tab changes remain synchronized through the existing event/storage model.

**Wishlist availability.** Missing/deleted products do not create broken cards. Preserve the remaining saved products and explain unavailable entries. If all saved products are unavailable, distinguish that from never having saved anything. Live data failures do not fall back to preview items.

### J. Supporting pages and copy ownership

| Content | Source/ownership | Redesign rule |
| --- | --- | --- |
| Header/footer action labels | Storefront UI | Short, consistent and accessible; no em dashes. |
| Homepage hero/campaign text | Existing HomepageContent/merchant configuration | Preserve approved facts; preview drafts remain clearly drafts. |
| About story and Contact content | Published Shopify Pages | Recompose and improve readability without inventing address, history or sourcing. |
| Product names, options and prices | Shopify product/variant data | No local rewrite of authoritative values. |
| Product details, FAQs, reviews | Existing approved metafields/references | Hide absent content cleanly; no fake filler. |
| Policies | Shopify policies and existing page mapping | Preserve legal meaning and headings; sanitize HTML. |
| Socials | Approved configured social links | Hide missing/invalid destinations. |
| Preview imagery/prices | Explicit preview fixtures | Label illustrative imagery and sample prices; disable purchases/indexing. |

About uses editorial type and a coherent image/text rhythm, with no handwritten scrapbook treatment. Contact stays link-based. Account stays a Shopify-hosted handoff. Reading pages use approximately 68ch text width, natural paragraph spacing and a heading hierarchy beginning with one h1. Do not change policy language merely to fit a new card layout.

### K. Accessibility, motion and performance

- All controls have accessible names, visible focus and appropriate state. Repeated product controls include the product title in their accessible name.
- The 44px control target is a project design floor, not a claim that WCAG AA universally requires 44px. See the [W3C target-size explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Modal sheets follow [W3C's modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): initial focus, contained tab sequence, Escape, visible close control, inert background and logical focus return. Non-modal desktop search does not receive aria-modal.
- Do not communicate availability, selection or errors through color alone. Announce meaningful search/cart changes without reading every keystroke or every product card again.
- Use 120–240ms transitions for feedback. Image hover scale stays subtle, around 1.025. Reduced motion removes movement and unnecessary transitions while keeping state changes immediate.
- Keep one high-priority hero image, responsive image sizes and stable frame dimensions. Use the existing Next/Netlify image pipeline; do not add an unrelated image service or animation library.
- Keep the server-rendered shell/content. Client code owns interactions, not all page data fetching. Search makes no background requests while closed; filter changes on the already loaded <=20-product catalog do not request the catalog again.
- [Core Web Vitals targets](https://web.dev/articles/vitals): LCP <=2.5s, CLS <=0.1, INP <=200ms. Local/lab checks are useful signals; field INP and percentile-based claims require actual field data after launch.

### L. Visual proof, review and stop conditions

Before production UI work, show materially different homepage first-view compositions that all honor BR-01/02 and HDR-01. After selection, prepare complete desktop/mobile homepage comps plus search-open states. The chosen comp governs implementation; subsequent layout changes require an explicit comp revision rather than an untracked CSS improvisation.

Review captures must include normal home, search open, menu open, Shop, Tea/Tea Bags, one product with variants, cart, wishlist, About, Contact and a policy page. Include long names, no image, sold out, no search results and an API failure. Desktop and mobile are reviewed together, not as separate sign-offs for unrelated designs.

The existing restriction on browser automation remains. No CUA, Playwright or CDP is introduced by this plan. Use owner-provided rendered screenshots and an owner-assisted keyboard/mobile checklist unless the owner changes that restriction. DOM tests and source checks cannot close the rendered-layout gate.

Stop rollout after the shared shell/home milestone if the composition still feels dated or the compact geometry fails. Resolve that at the system level before applying it to other pages. Do not call the redesign finished while material findings remain open or while only source/build evidence exists for its visual quality.

### M. Acceptance matrix and handover

| ID | Check | Required evidence |
| --- | --- | --- |
| V-01 | Header + notice <=100px; one desktop row; 76px/64px row heights. | Rendered geometry at 1366/1440 and compact widths. |
| V-02 | Search causes <=1px change in hero position. | Before/after geometry or matched rendered captures; not a CSS-string assertion. |
| V-03 | No overlap/overflow at 320, 375, 390, 768, 1024, 1366, 1440, 1920px. | Viewport capture/checklist, including 1023/1024 transition. |
| V-04 | First-view hero CTA visible at specified 375/390px and desktop sizes. | Whole viewport captures, not a cropped hero image. |
| V-05 | Logo proportions, card frames, type roles and control shapes agree across routes. | Shared review contact sheet. |
| I-01 | Search/menu/filter keyboard, dismissal and resize cleanup work. | DOM tests plus owner-assisted native-browser checks. |
| I-02 | No stale search response replaces the current query; limits and errors work. | Fake-timer/deferred-response tests and route tests. |
| I-03 | Card variant actions and PDP quantity/availability are correct. | Unit/DOM tests with single, multiple and unavailable variants. |
| I-04 | Cart mutation order, totals, expiry and Buy Now isolation are preserved. | Mocked API/DOM tests; no live orders created by visual QA. |
| I-05 | Wishlist survives blocked/corrupt storage and missing products. | Storage/API fixture tests. |
| C-01 | No fabricated claims, review stars or prices; mode separation holds. | Content audit and preview/live failure tests. |
| S-01 | Private credentials stay server-only; cart stays no-store. | Source/build-boundary checks and endpoint headers. |
| SEO-01 | One h1 per page; canonical/policy routes, metadata and index gates preserved. | Metadata/markup/route checks. |
| Q-01 | Tests, lint, typecheck, production build and whitespace checks pass. | Captured command results for the final implementation. |
| Q-02 | Approved design system is documented from the finished build. | DESIGN.md, sidecar, screenshot index and runbook. |

Handover includes the local preview URL, route/state review matrix, known issues, asset-replacement notes, new component/token map, test/build commands and a clear separation between completed visual work and remaining launch operations. The detailed implementation document maps each requirement to an owning task.

### N. Visual direction round and page blueprints

These are concrete starting points for the design review. They specify composition rather than business claims. Select one direction before fine-tuning every page; do not combine all three into a visually inconsistent site.

| Concept | First viewport | Supporting system | What the review must establish |
| --- | --- | --- | --- |
| Editorial tea shop, recommended | Compact left-aligned logo/nav shell; a clear headline beside a carefully framed product or tea image; one Tea action. Approximately equal copy/media columns, without the current faded landscape overlay. | Near-white surfaces, dark green controls, open product grids, restrained serif headlines and plain navigation. | Whether the typography and product framing communicate quality without ornament, and whether the logo remains readable at its compact size. |
| Product study | One dominant product image against a controlled green or neutral field, with a shorter offset headline and a small, clearly positioned shopping action. | Larger media areas, strong tonal contrast and fewer visible elements per section. | Whether existing temporary imagery can support the composition without oversized packaging or text that disappears into the image. |
| Modern tea house | A wider tea/ritual photograph with a separate solid copy area; slightly warmer neutral surfaces and a quieter editorial rhythm. | More emphasis on the approved story and category imagery, with the same compact controls and open catalog. | Whether it still feels contemporary and product-focused rather than returning to decorative leaves, ornamental borders and tall mastheads. |

Every concept must use the same real logo, short preview notice, plausible copy length and available catalog. Changing only colors or fonts does not count as a materially different composition. Review normal and search-open states together so the utility experience belongs to the design.

**Home blueprint for the recommended direction**

- At 1366x768, target a hero around 440–520px high below the shell. It is a composition target, not a fixed height that can clip longer copy. Use two columns at desktop widths and stack below 1024px. The headline, supporting sentence and CTA must fit without forcing the first product section far out of reach.
- Give desktop media a deliberate frame, initially around 4:3, with no repeated edge foliage or decorative stickers. A packshot can sit on a neutral ground; an existing editorial image can be cropped after checking the product remains intact. Keep text outside complex imagery where possible.
- Use one 48px-minimum primary action with a short, specific label such as "Explore tea". Avoid a second equal-weight action, scroll hint or badge beside it. The image does not need its own competing caption block.
- Begin the selected-tea section with a heading and one "View all tea" link aligned to the grid. Use 64–80px section separation on desktop and 32–48px on compact layouts as starting values. Do not repeat a large introductory paragraph before every grid.
- Tea/Tea Bags discovery uses two useful image/link areas or two clear text-led entries, according to the chosen comp. It is visually quieter than the hero. The story excerpt and pantry routes remain secondary, so the page reads as a tea brand rather than a general grocery directory.
- On compact screens, show copy and action before media, then product cards in two columns. Do not turn the whole page into horizontal carousels. A link and its arrow share one inline alignment rule; arrows never sit on an unrelated baseline.

**Shop, collection and results blueprint**

- Put the page heading, concise optional description and product count near the top, rather than adding a second hero above the catalog. Keep the count subordinate and do not invent collection totals when only a loaded subset is known.
- At wide desktop sizes, category navigation and sort/filter controls occupy one calm toolbar above the grid, or a compact facet rail if the approved comp warrants it. Whichever is chosen must remain shared by Shop and collections. Avoid stacking several full-width control rows before products.
- Cards use square-cornered 4:5 frames and content below, without a heavy outline around every card. Keep title and price close enough to read as one item. Use a restrained text/button action rather than a large floating cart circle that competes with the product.
- A two-line name reserves enough space for normal price alignment. Longer names remain readable and may increase card height. Wishlist controls stay inside the frame's safe inset and cannot be clipped by a neighboring overflow container.
- Mobile keeps category access, a labeled Filters action and labeled sorting visible. Avoid making every category a separate large pill. Opening filters covers the current view without pushing products down; Apply returns to the same listing and retains scroll position where possible.
- The full results page gives the query field and result summary one clear hierarchy. Empty results offer collection links and a query edit; failed results offer retry. Neither state renders an empty product grid with a misleading zero-price card.

**Product-detail blueprint**

- Keep breadcrumbs brief and subordinate. On desktop, place gallery and purchase details within one content container, with a 32–48px gap. The title, price, options and primary action form one readable vertical group.
- Do not separate price from options with a promotional/trust panel. Option controls use actual option names and selected states. Quantity is a compact labeled control; Add to cart has more visual weight than Buy Now.
- Under the purchase group, show only useful, approved product details. FAQs can use native disclosures; reviews show their source-approved content. Do not leave large empty review or origin sections when that content is missing.
- Related products return to the shared card grid with a concise heading. They are a clear next browsing step, not another giant banner.
- On mobile, keep title/price/options close to the gallery. Do not add a second sticky purchase bar in this phase. A long variant name or failed request must expand naturally without covering the Add action.

**Utility and reading-page blueprint**

- Cart uses a clear item list plus summary on desktop. Thumbnail, title/options, quantity and remove action have distinct alignment. Prices are readable without turning every row into a bordered card. On mobile, the summary follows the last item and leads to one checkout action.
- Wishlist uses the shared grid and a short explanation of browser/device storage. An unavailable saved product has a recoverable state, including removal; it does not quietly disappear from the user's saved list.
- About uses a strong opening statement, an existing image and approved story copy in a controlled reading width. More sections are justified by actual content, not by a need to fill the page.
- Contact puts available contact methods first. Account explains the Shopify handoff and presents one clear action. Policies share a quiet title/content layout; long headings and inline links wrap without affecting the shared header.
- Footer begins with a divider or tonal change, not another decorative benefits band. Useful links, the preserved brand and concise legal/preview information are sufficient. Missing social channels leave no empty icons.

### O. Rendered review matrix

The widths below are CSS pixels, with browser zoom recorded. Use whole-viewport captures for above-the-fold checks and full-page captures for page rhythm. Do not crop away a broken header or an awkward section boundary.

| Route/state group | Required rendered coverage | Specific decision |
| --- | --- | --- |
| Home, closed shell | 320, 375, 390, 768, 1024, 1366, 1440, 1920px; include 375x812, 390x844, 1366x768 and 1440x900. | Header density, first-view CTA, page rhythm, image crop and footer proportion. |
| Search/menu | Desktop closed/open matched pair; compact search and menu at 390px; 1023/1024 transition; real compact keyboard-open check. | No document shift, reachable close/input, bounded results, correct cleanup. |
| Shop and Tea | Grid checks at the same width set; Tea Bags and one pantry collection at 390/1440px. | Consistent rails, 4/3/2 columns, card alignment, filter/sort usability. |
| Product detail | 320/390/768/1024/1440px; ordinary and long-name/multi-variant product. | Gallery/purchase proximity, option wrapping, action visibility and sticky eligibility. |
| Cart and wishlist | 320/390/1440px; empty and populated states, long item names. | Summary placement, line-item controls, recoverable storage/stock errors. |
| About, Contact, account and each policy | 390/1440px plus 200% zoom/reflow check on a representative reading page. | Shared branding, readable measure and natural long-content flow. |
| Data/interaction edges | Representative compact and desktop captures of no image, sold out, no search matches, API failure and blocked wishlist storage. | Honest messaging and absence of clipping/false purchase controls. |

For each capture, record route, dimensions, zoom, source mode, build/commit, state, finding, severity and resolution. Use stable names such as home-390-closed.png and search-1440-results.png. Keep fixture-only evidence clearly labeled; it does not prove that the merchant catalog or payments are live.

Keyboard checks include opening/closing search, reaching result links, completing mobile-menu/filter interactions, changing a variant/quantity, reading an error and returning to the trigger. Device checks include the mobile keyboard, rotation or breakpoint change, scroll restoration and touch targets. These remain owner-assisted under the existing automation restriction.

Block the next rollout milestone for unreadable text, unreachable actions, overlapping controls, displaced hero content, false purchase states or a rejected overall composition. Cosmetic findings can be batched, but must remain visible in the review matrix until resolved. A fixture test, clean detector result or successful build does not replace this judgment.
