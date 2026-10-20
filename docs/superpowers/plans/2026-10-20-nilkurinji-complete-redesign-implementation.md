# Nilkurinji Complete Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for the previously chosen native implementation method. Use superpowers:subagent-driven-development only if the owner changes that method. Steps use checkbox syntax for tracking.

**Status:** detailed proposed plan, not an instruction to start building. The owner requested more planning detail. Visual direction and the chosen comps still need review before production UI implementation.

**Goal:** replace the complete storefront presentation with a compact, contemporary premium tea experience while preserving the logo, green identity and working Shopify commerce boundaries.

**Architecture:** server routes keep catalog/content ownership. Existing commerce components retain their public responsibilities and gain component-scoped presentation. A small shared UI layer owns controls, containers and modal sheets. A public search endpoint and client hook provide bounded predictive search without exposing Shopify credentials or moving cart state into public caches.

**Tech stack:** installed Next.js 16.4, React 19, TypeScript, Tailwind 4, CSS Modules, lucide-react, Vitest and the existing jsdom environment. Netlify remains the deployment target. No platform migration or dependency upgrade is part of this plan.

**Spec:** [complete design contract](../specs/2026-10-20-nilkurinji-complete-redesign-design.md). Read it with this plan; it owns the appearance, page sequence and state behavior.

Read the spec's visual concepts, page blueprints and rendered review matrix before the task list. The engineering contracts below support that design; they are not a substitute for choosing its composition.

## 1. Global constraints

- Preserve the existing logo and green identity. The new display font must not silently replace the logo's current lettering.
- Desktop header row: 76px. Compact header row: 64px. Preview notice: at most 24px desktop / 36px compact. Normal shell total: at most 100px.
- Desktop header begins at 1024px; compact layout applies below it. Catalog columns: 4 at >=1280px, 3 at 1024–1279px, 2 below 1024px.
- Search opens outside document flow. Hero position change on open: at most 1 CSS pixel.
- Search: 2-character minimum, 120-character maximum, 300ms debounce, 6 suggestions, no polling, no requests while closed.
- Body text: at least 16px. Functional labels: at least 14px. Mobile text inputs/selects: at least 16px. Interactive target floor: 44px.
- Keep English, INR and India-only launch defaults; use Shopify-returned amounts/currencies instead of local conversion or hard-coded prices.
- Preserve existing routes, hosted checkout, signed HttpOnly cart cookies, no-store cart responses and Buy Now isolation.
- Preview purchases and indexing remain disabled. Live failures never substitute preview data.
- Keep Tea Guide, Recipes, Journal and newsletter excluded. Contact stays link-based; accounts stay Shopify-hosted.
- Read applicable installed guides in node_modules/next/dist/docs before changing Next APIs. This project does not opt into a new caching model as part of the redesign.
- Respect the existing CUA/Playwright/CDP restriction. Plan native-browser evidence with the owner; do not quietly introduce browser automation.
- No production source, dependency install, deployment, DNS change or Shopify configuration change during this planning task.
- Commit verified milestones locally and only stage their exact files. Push/deploy only with the applicable authorization. Preserve unrelated dirty changes.

## 2. Review focus

These five high-impact cases need explicit ownership and evidence; they are easy to miss in a happy-path visual build.

| Case | Expected behavior | Owner |
| --- | --- | --- |
| Open sheet during breakpoint change, keyboard appearance or unmount | No stranded focus, hidden active trigger, inert page or permanent body lock. | Tasks 1 and 3. |
| A slow search response arrives after a newer query or after closing | Old data cannot replace the current state; aborted requests do not surface as errors. | Tasks 2 and 3. |
| Preview/live mode or availability changes while an API request fails | No fabricated catalog, sample live price, secret or setup exception reaches a shopper. | Tasks 2, 4, 5, 7 and 8. |
| Variant/stock changes or rapid cart interaction | Correct variant/quantity is submitted once; server totals win; Buy Now does not replace the ordinary cart. | Tasks 4, 7 and 8. |
| Storage is blocked/corrupt/full, or saved products disappear | No crash, silent eviction or misleading empty state; existing saved items remain understandable. | Tasks 4 and 8. |

Additional listing cases are owned by Task 6: long/unrecognized URL values, returning from a product, draft-filter cancellation, and preserving q/attribution parameters.

## 3. Source inventory and migration map

| Existing file/module | Role to retain | Planned treatment |
| --- | --- | --- |
| src/app/layout.tsx | Metadata, page shell, fonts, shared header/footer | Add approved font variables and new token/base imports; keep server ownership. |
| src/app/globals.css | Existing global base and accumulated presentation | Inventory first; progressively remove migrated selectors. Final file contains only necessary base/Tailwind rules. |
| src/app/storefront-chrome.css | Current header/search override layer | Retire after header, search and shared utility styles move into modules. |
| src/components/site-header.tsx | Nav, cart count, menu/search entry points | Rebuild presentation and disclosure behavior; retain route/cart contracts. |
| src/components/site-footer.tsx, store-notice.tsx | Approved links and preview status | Recompose using the approved system. |
| src/components/search-form.tsx | GET /search with q | Keep contract and share field styling with the overlay. |
| src/components/product-card.tsx, quick-add-button.tsx | Product links, prices, purchase entry | Standardize cards and make variant action policy explicit. |
| src/components/product-grid.tsx | Filters/sort and product list | Keep product/filter semantics; add validated URL state and drawer draft state. |
| src/components/product-gallery.tsx | Product image selection | Recompose with stable image frame and accessible thumbnails. |
| src/components/product-purchase-panel.tsx | Variant/quantity/Add/Buy Now | Retain and extend tested behavior; replace visual layout. |
| src/components/cart-panel.tsx | Cart load/update/remove/checkout | Recompose, serialize mutations and improve recovery. |
| src/components/wishlist-button.tsx, wishlist-products.tsx | Browser wishlist and catalog lookup | Keep key/event/cap, handle write failures and missing products. |
| src/lib/shopify/catalog.ts | getProducts/getCollection/getProduct/searchProducts/getRecommendations | Preserve data authority; adopt the shared query normalizer only where required. |
| src/lib/shopify/server.ts | Server-only GraphQL, private token and 60-second public fetch cache | Reuse; do not expose it to client components or rewrite the cache model. |
| src/app/api/cart/route.ts | Secure cart transport and checkout | Preserve; add mocked regression tests, not live-order tests. |
| src/app/api/wishlist/route.ts | Validated saved-product lookup | Preserve endpoint contract and live/preview separation. |
| src/lib/shopify/cart-ui.ts | Quick-add variant selection | Tighten to the new single-variant action policy. |
| src/lib/shopify/content.ts and product-content.ts | Approved merchant content, pages, policies, FAQ/review parsing | Reuse fields; no new schema or fabricated content merely to fill a layout. |
| banner-carousel.tsx / featured-products-carousel.tsx | Current campaign/product presentation | Keep manual campaign support if used by approved comp; retire unused product carousel after migration. |
| botanical-frame.tsx / scroll-reveal-observer.tsx | Existing decoration/motion | Retire only after reference audit proves they are unused in the finished design. |

New code remains focused: colocate each component's .module.css; do not create a second all-site override sheet. Avoid creating wrapper components for every heading or paragraph.

Path notation below: a basename grouped with a fully qualified file inherits that file's directory. For example, the Task 3 hook test lives at src/hooks/use-predictive-search.test.ts. Unqualified existing component names refer to src/components; route families always refer to their src/app path. No generated test or fixture is shipped as a production module.

## 4. Shared interfaces to implement

These names are proposed implementation contracts. They do not exist yet and are not evidence that code has been built.

### 4.1 Shared UI, Task 1

- src/components/storefront/container.tsx: Container({ children, className? }: { children: ReactNode; className?: string }). One content-width/gutter owner.
- src/components/storefront/action.tsx: ActionButton with native ButtonHTMLAttributes plus variant "primary" | "secondary" | "text"; ActionLink with Next Link props and the same visual variants. Neither nests a button inside an anchor. IconButton requires an accessible label and a 44px target.
- src/components/storefront/modal-sheet.tsx: ModalSheet({ open, label, placement, triggerRef, initialFocusRef?, onClose, children }). placement is "right" | "top"; onClose receives "escape" | "outside" | "close" | "navigation" | "viewport". Refs point to HTMLElements; children is ReactNode.
- test/fixtures/storefront.ts: makeVariant(overrides?: Partial<StorefrontVariant>), makeProduct(overrides?: Partial<StorefrontProduct>), makeCart(overrides?: Partial<ShopifyCart>). Test fixtures are never imported from production code.

### 4.2 Search, Tasks 2–3

Create src/lib/search/query.ts:

```ts
export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 120;
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MAX_SUGGESTIONS = 6;
export function normalizeSearchQuery(value: string): string;
```

Create src/lib/search/contract.ts, using type-only imports of ShopifyImage and ShopifyMoney:

```ts
export type SearchSuggestion = {
  id: string;
  handle: string;
  title: string;
  image: ShopifyImage | null;
  price: ShopifyMoney | null;
  isPreview: boolean;
};
export type PredictiveSearchPayload =
  | { status: "ok"; source: "shopify" | "preview" | null;
      query: string; items: SearchSuggestion[]; hasMore: boolean }
  | { status: "error"; query: string; items: [];
      hasMore: false; message: string };
export function isPredictiveSearchPayload(value: unknown): value is PredictiveSearchPayload;
```

- src/app/api/search/route.ts exports GET(request: NextRequest): Promise<NextResponse<PredictiveSearchPayload>>. Short queries return an empty ok response with source null. Unavailable catalog returns the error branch and HTTP 503. Every response is no-store; no Set-Cookie.
- src/hooks/use-predictive-search.ts exports usePredictiveSearch(query: string, enabled: boolean), returning status "idle" | "waiting" | "loading" | "results" | "empty" | "error", items, hasMore, message and retry(). It consumes only the public endpoint and contract.
- src/components/search/search-overlay.tsx receives open, compact, query, onQueryChange, onClose and triggerRef. It consumes the hook and shared form/sheet; it never imports the Shopify server module.
- Preserve SearchForm's existing initialValue, id, inputRef and onSubmit props. Add optional controlled value/onQueryChange support without passing both value and defaultValue to the same input.

### 4.3 Catalog state, Task 6

Create src/lib/catalog-state.ts:

```ts
export type CatalogSort = "featured" | "title-asc" | "price-asc" | "price-desc";
export type CatalogState = {
  sort: CatalogSort;
  category: string;
  productType: string;
  priceBand: string;
  selectedFacets: Record<string, string[]>;
};
export type CatalogConfig = {
  categories: readonly string[];
  productTypes: readonly string[];
  priceBands: readonly string[];
  facets: readonly { id: string; values: readonly string[] }[];
};
export function parseCatalogQuery(params: URLSearchParams, config: CatalogConfig): CatalogState;
export function writeCatalogQuery(params: URLSearchParams, state: CatalogState): URLSearchParams;
```

Defaults are featured/all/all/all/{}. facet.<id> parameters can repeat; duplicate selected values are deduplicated. Parsing discards unconfigured values. Serialization changes only owned filter keys, preserves q and unrelated parameters, and omits defaults. When a configured price facet is used, the default standalone price band is disabled rather than applying two hidden price filters.

## 5. Task order and checkpoints

| Task | Depends on | Independently reviewable deliverable |
| --- | --- | --- |
| 0 | Owner review | Approved visual direction, complete home/search comps, baseline inventory. |
| 1 | 0 | Tokens, primitives and reusable modal-sheet behavior. |
| 2 | 0 | Typed, bounded public predictive-search API. |
| 3 | 1, 2 | Compact shared header, menu and search overlay. |
| 4 | 1 | Shared product card, deliberate quick-add policy, robust wishlist control. |
| 5 | 3, 4 | Complete homepage and shared footer; owner visual checkpoint. |
| 6 | 1, 4, 5 | Shop, all collections and full search-results experience. |
| 7 | 1, 4, 5 | Product gallery, variant/purchase flow and related content. |
| 8 | 4, 7 | Cart and wishlist pages with recovery states. |
| 9 | 5 | About, Contact, account and policy reading pages. |
| 10 | 6–9 | Completed migration, whole-site review, SEO/performance checks and documentation. |

Native execution is sequential. Independent dependencies do not authorize simultaneous edits to shared files. Do not begin Task 6 until the owner has reviewed the complete home/search milestone.

## Task 0: Establish the visual reference and baseline

**Files:** read the design spec, PRODUCT.md, DESIGN.md, existing components and supplied screenshots/PDFs. Create docs/design/redesign-v2/decision-register.md, asset-inventory.md and review-matrix.md. Store planning comps under .impeccable/mocks/redesign-v2/. No production code changes.

**Consumes:** BR-01 through OPS-01 and the rejected screenshot evidence. **Produces:** chosen concept, immutable approved comp paths, the token decisions Task 1 implements and the page/state evidence list Task 10 must close.

- [ ] Record the current branch, dirty/staged paths, local startup command, baseline test result and current route list. Do not commit pre-existing edits as part of the inventory.
- [ ] Inventory image references, dimensions, aspect ratios, actual transparency and where each image is used. Identify existing temporary assets that can be reused; do not generate replacement packaging.
- [ ] Produce materially different first-view concepts consistent with the fixed logo/green identity. Each shows actual copy, product placement, compact header and one primary action. Recommend one and record the owner's choice.
- [ ] Complete the chosen Home desktop/mobile and search-open comps, including an actual compact logo lockup. Verify the hero CTA and the 100px shell constraint in the comps.
- [ ] Record exact approved font roles, colors, frames, section sequence and any intentional exceptions. Mark rejected alternatives as rejected rather than leaving several competing references.
- [ ] Review the selected comps with the owner before Task 1. Planning images are not screenshots of a finished application.
- [ ] Commit only the new planning artifacts with a scoped local docs commit.

**Exit evidence:** one chosen direction, normal/open-search desktop and mobile states, no unresolved visual-system decision being passed to the implementer as a guess.

## Task 1: Build the shared foundation and modal sheet

**Create:** src/app/storefront-tokens.css, src/components/storefront/container.tsx and container.module.css, action.tsx and action.module.css, modal-sheet.tsx and modal-sheet.module.css, modal-sheet.test.ts, test/fixtures/storefront.ts. **Modify:** src/app/layout.tsx only for approved font variables/token imports at this stage.

**Consumes:** approved comps and token decisions. **Produces:** the interfaces in 4.1; isolated component classes, not another global override layer.

- [ ] Create typed test-product/cart factories with valid fake Shopify IDs and no real credentials, orders or personal information.
- [ ] Add modal-sheet DOM tests using the existing React createRoot/act + jsdom pattern. Assert controlled opening/closing, the onClose reason, explicit-close focus return, cleanup after unmount and no leftover body styles. Stub native dialog methods only at the jsdom boundary; do not claim those stubs prove browser focus containment.
- [ ] Run npm test -- --run src/components/storefront/modal-sheet.test.ts and confirm the unimplemented component fails.
- [ ] Implement the approved token roles, responsive Container, native ActionButton/ActionLink and 44px IconButton. Keep the current logo font separate from the new display font. Do not globally recolor unmigrated components yet.
- [ ] Implement ModalSheet with native dialog behavior, an accessible name, initial focus, close/cancel handling, reversible body-scroll locking and original-style restoration. Avoid a new UI dependency for this small primitive.
- [ ] Run its tests, lint and typecheck. Record owner-assisted checks still needed for native top-layer/inert/Tab behavior and mobile visual viewport handling.
- [ ] Commit this foundation's exact files locally.

**Exit evidence:** primitives render at the approved sizes; modal behavior has DOM coverage and a pending native-browser checklist, not a false visual pass.

## Task 2: Add the predictive-search contract and endpoint

**Create:** src/lib/search/query.ts, query.test.ts, contract.ts, contract.test.ts, src/app/api/search/route.ts and route.test.ts. **Modify:** src/lib/shopify/catalog.ts only to reuse the Unicode-safe query normalizer for searchProducts.

**Consumes:** existing searchProducts(term): Promise<StorefrontData<StorefrontProduct[]>>, the Shopify image/money types, and the interfaces in 4.2. **Produces:** the public DTO consumed by Task 3.

- [ ] Add normalization and runtime-payload tests. Include these exact assertions, plus malformed-response rejection:

```ts
expect(normalizeSearchQuery("  green\n  tea  ")).toBe("green tea");
expect([...normalizeSearchQuery("🍵".repeat(121))]).toHaveLength(120);
expect(isPredictiveSearchPayload({ status: "ok", items: null })).toBe(false);
```

- [ ] Mock searchProducts in route tests. A one-character query returns 200, source null and []; the mock is not called. An eight-product result returns six items and hasMore true. Null price/image remains null. Preview source/flags remain preview. An unavailable result returns 503 and a safe message without raw reason text.
- [ ] Include a single supplementary Unicode character as a short query. Both the hook and endpoint count Unicode code points for minimum eligibility, matching normalization's maximum-length rule. Use the same normalizer for full-page search; it must not truncate a surrogate pair a second time.
- [ ] Assert Cache-Control contains no-store and responses never set a cookie or return private/product-metafield data outside the DTO. Query handling does not interpolate GraphQL strings.
- [ ] Run the new tests and confirm they fail before implementation.
- [ ] Implement the normalizer, runtime guard and GET route with the declared DTO. Use existing 60-second upstream caching; no separate shared API-response cache and no new Shopify client.
- [ ] Run npm test -- --run src/lib/search src/app/api/search, then typecheck and the existing Shopify safety tests. Verify no real Shopify network call is made by these tests.
- [ ] Commit only this endpoint/contract milestone.

**Exit evidence:** strict public response shape, bounded results, explicit error behavior and retained mode separation.

## Task 3: Replace the header and implement overlay search

**Create:** src/hooks/use-predictive-search.ts and use-predictive-search.test.ts; src/components/search/search-overlay.tsx, search-overlay.module.css and search-overlay.test.ts; src/components/site-header.module.css, search-form.module.css and store-notice.module.css. **Modify:** site-header.tsx, site-header.test.ts, site-header.interaction.test.ts, search-form.tsx, store-notice.tsx and layout.tsx where integration requires it.

**Consumes:** Tasks 1–2, PRIMARY_NAV and existing /api/cart count/event. **Produces:** the 76px/64px shared shell, one active header panel and the public SearchOverlay from 4.2.

- [ ] Add hook tests with fake timers and controlled deferred fetches: 299ms makes no request; 300ms makes one; short/empty/closed makes none; a newer query cancels and supersedes the old response; rejected aborts do not show errors. Successful cache entries expire after 60 seconds and the cache stays bounded to 20 entries.
- [ ] Add header/overlay DOM cases: focus on open, Escape return, outside dismissal without focus theft, Tab leaving desktop search, mobile modal close, menu/search mutual exclusion, closing on primary/product/cart navigation and cleanup on 1023/1024 transition. Preserve query text when closing and reopening.
- [ ] Add malformed JSON, HTTP 503, no matches, missing image/price and retry cases. Status announcements identify the state without rereading the entire list. Suggestion anchors preserve normal keyboard/link behavior.
- [ ] Run these tests and observe the expected failures before replacing the old in-flow search panel.
- [ ] Implement the bounded client hook, shared form and desktop/mobile presentations. Keep q and /search unchanged. Use one visual field edge; do not suppress keyboard focus just to remove the old double-border appearance.
- [ ] Replace the two-row masthead with the approved one-row header and compact menu. Retain cart count updates and account/wishlist access. Use the short preview notice only in preview mode.
- [ ] Run targeted tests, lint and typecheck. Obtain rendered normal/open-search evidence at 1366x768, 1440x900 and 390x844. Check V-01/V-02 before accepting the milestone.
- [ ] Commit the header/search work only after those applicable checks, recording any still-pending owner-provided visual evidence explicitly.

**Exit evidence:** search works without moving the hero; header sizing is proven from rendered evidence, not an assertion against a CSS file.

## Task 4: Standardize product cards and safe card actions

**Create:** product-card.module.css, quick-add-button.module.css, wishlist-button.module.css and wishlist-button.test.ts; extend test fixtures as necessary. **Modify:** product-card.tsx/test.ts, quick-add-button.tsx, wishlist-button.tsx, src/lib/shopify/cart-ui.ts and cart-ui.test.ts.

**Consumes:** StorefrontProduct, formatMoney, existing purchase gate and wishlist key/event. **Produces:** one reusable card system for Home, catalogs, results, recommendations and wishlist; no new commerce endpoint.

- [ ] Add the action-policy tests using CAT-05's ordered decision table: preview => no purchase control; one available live variant + enabled purchasing => Add; eligible multiple variants => Choose options; sold-out/disabled purchasing => no Add; no price => no invented zero. getQuickAddVariant(multiVariantProduct, true) must return null even when only one of its several variants is available.
- [ ] Add quick-add interaction tests for one POST while pending, a genuine success event, safe error feedback and retained browsing links. Test disabled purchasing separately from sold-out variants.
- [ ] Add wishlist tests for denied setItem, corrupt JSON, cap=20, duplicate handles and cross-tab synchronization. At 20 items, adding a new handle must not silently evict an earlier saved item. Failed writes preserve the previous saved state and show visible feedback.
- [ ] Run the new tests and observe the failures for the changed action/storage policies.
- [ ] Implement the single-variant policy in cart-ui, the approved card/field spacing, 4:5 image frame, sample-price labeling, accessible wishlist names including the product title, and useful unavailable/choose-options states.
- [ ] Keep legacy ProductCard props accepted during migration so unmigrated callers do not break; stop using them to create unrelated visual card variants. Do not introduce new fixture products to fill a layout.
- [ ] Run card/cart-ui/wishlist tests, lint and typecheck. Review one/two-line/long titles, missing image, null price and unavailable products at 320/390 and wide desktop sizes.
- [ ] Commit this shared-card milestone.

**Exit evidence:** all call sites can use one card; no active-looking preview cart circle or implicit variant choice remains.

## Task 5: Build the complete homepage and shared footer

**Create:** src/components/home/home-hero.tsx, src/components/home/home-sections.tsx, src/components/home/home.module.css and src/components/site-footer.module.css. **Modify:** src/app/page.tsx, src/app/page.test.ts, src/components/site-footer.tsx, src/components/banner-carousel.tsx if the approved comp uses multiple campaigns, and associated home-slide tests only where behavior changes.

**Consumes:** getHomepageContent, getProducts, CATEGORIES, approved comps and Tasks 3–4. **Produces:** the full Home sequence and a shared footer used by the remaining pages.

- [ ] Add/update meaningful homepage tests: only tea/tea-bag entries enter the tea selection; pantry categories remain accessible; no fabricated claims/reviews are rendered; unavailable merchant content uses shopper-safe recovery and never a raw exception.
- [ ] Cover 0, 1, 2 and 4 featured products. Assert product identity/counts and route access; do not write brittle tests that merely restate spacing declarations.
- [ ] Run those tests before changing the route composition and verify the new expectations fail where appropriate.
- [ ] Implement the approved hero, selected tea, Tea/Tea Bags discovery, approved story, secondary pantry routes and footer. Map existing HomepageContent fields; optional content stays optional instead of inventing new CMS fields or business facts.
- [ ] Use the correct image sizes and one high-priority hero asset. Keep campaign controls manual and absent for a single campaign. Remove redundant hero/section labels and the old decorative category shelf from this route.
- [ ] Run Home/content/carousel regression tests, lint, typecheck and a production build. Review the complete page, including footer, at desktop and mobile sizes alongside search-open states.
- [ ] Obtain the owner's Home/system visual review. Resolve material composition issues here, before Task 6. Save the reviewed screenshots and disposition in the review matrix.
- [ ] Commit the complete homepage/footer milestone locally.

**Exit evidence:** one coherent full page, not a polished hero above mismatched sections. Owner review is recorded before the broader rollout.

## Task 6: Rebuild Shop, every collection and full results

**Create:** src/lib/catalog-state.ts/test.ts, product-grid.module.css, product-grid.interaction.test.ts, src/app/shop/shop.module.css, src/app/collections/[handle]/collection.module.css and src/app/search/search.module.css. **Modify:** product-grid.tsx/test.ts, Shop/collection/Search route files and their existing tests.

**Consumes:** Task 4 cards, Task 1 ModalSheet, current ProductFilterGroup/ProductTopFilter contracts, existing getProducts/getCollection/searchProducts. **Produces:** the catalog URL helpers in 4.3 and one listing/filter layout for all approved categories.

- [ ] Add parse/serialize tests: valid sort retained, invalid sort => featured, unknown facets discarded, repeated values deduplicated, default keys omitted, q and utm_source preserved. Do not combine an active configured price facet with a hidden standalone price band.
- [ ] Add interaction tests for sort/filter output, result counts, Clear, draft Apply/cancel, zero matches, unknown prices and return-to-list state. Closing the drawer without Apply must not change committed results.
- [ ] Run these tests before implementing the new behavior.
- [ ] Implement native history replaceState integration supported by the installed Next documentation, preserving framework history state and scroll position. Avoid a new server request for each local filter click on the already-loaded <=20-product catalog. Use the Next search-parameter integration with a narrow Suspense boundary only if required by the installed version.
- [ ] Recompose the three route families using the shared heading/container/cards and exact 4/3/2 grid rules. Keep the primary collection routes and SEO metadata; no category-specific decorative bands. Keep the API-failure, empty collection and empty filter/result states distinct.
- [ ] Run catalog-state/ProductGrid/Shop/collection/Search tests plus typecheck. Review Tea, Tea Bags and one pantry category, including a long sort label on 320px and the 1023/1024 transition.
- [ ] Commit this listing milestone.

**Exit evidence:** stable shared catalog UI, useful URL state, no double gutters, and consistent empty/error recovery.

## Task 7: Recompose product detail and preserve purchase correctness

**Create:** product-gallery.module.css, product-purchase-panel.module.css, product-purchase-panel.interaction.test.ts, product-gallery.test.ts and src/app/products/[handle]/product.module.css. **Modify:** existing gallery/purchase components, product route and tests; preserve exported findSelectedVariant/getPurchaseNotice contracts unless an explicit tested improvement is required.

**Consumes:** existing product types/services, parseFaqs/approved reviews, recommendation fallback, Task 4 cards and /api/cart. **Produces:** the redesigned PDP without a new payment or cart transport.

- [ ] Add tests using available, unavailable and nonexistent option combinations. Changing the variant updates the price and submitted variant ID; quantity clamps to 1–10; pending state blocks duplicate Add/Buy Now requests.
- [ ] Add gallery tests proving image selection does not reset purchase choices, selected thumbnails have an accessible state, and missing images do not break the layout.
- [ ] Cover Add success, failed add, failed Buy Now, preview and checkout-disabled states. Failure preserves options/quantity and does not announce success. Approved reviews/FAQs are not replaced by fabricated content when absent.
- [ ] Run those tests and observe failures for the new interactions/layout structure where applicable.
- [ ] Build the gallery/details split, compact stacked purchase flow, price/options/quantity grouping and approved content sections. Apply sticky details only when the panel fits the desktop viewport. Reuse all existing server-side price/availability decisions.
- [ ] Render related products through the same card system, excluding the current product. Keep the recommendation service and fallback policy intact.
- [ ] Run product/gallery/purchase/checkout-safety tests, lint and typecheck. Review an ordinary product, multi-option product, unavailable combination, no-image fixture, long title and API failure on desktop/mobile.
- [ ] Commit the product-detail milestone.

**Exit evidence:** the selected variant is visually clear and is exactly what Add/Buy Now submits; page styling does not alter the shopping-cart isolation contract.

## Task 8: Redesign cart and wishlist pages with recovery

**Create:** cart-panel.module.css, cart-panel.interaction.test.ts, wishlist-products.module.css, wishlist-products.test.ts and src/app/api/cart/route.test.ts. **Modify:** cart-panel.tsx, wishlist-products.tsx, Cart/Wishlist route layout and tests as needed. Do not replace the existing cart API contract.

**Consumes:** ShopifyCart, /api/cart, /api/wishlist, Task 4 card/wishlist behavior and current cart/wishlist events. **Produces:** trustworthy stateful utility pages with the approved shared shell.

- [ ] Add deferred-response cart tests: while any mutation is pending, another update/remove/checkout is blocked. Server-returned totals replace old totals. Failed removal retains the row; conflict recovery can refetch the cart; unavailable lines disable checkout.
- [ ] Add cart route regression tests with mocked Shopify functions: Buy Now creates a separate cart and returns a validated URL without Set-Cookie; expired/unsafe checkout cases reject; preview does not mutate or enable checkout. Never create a real order or cart during automated verification.
- [ ] Add wishlist fixtures for partial/all missing products, blocked storage, stale handles and API failure. Preserve available entries and distinguish an empty saved list from unavailable saved products.
- [ ] Run the new tests before changing these state paths.
- [ ] Implement the desktop line-items/order-summary composition and single compact checkout flow, loading/error/expired/preview states, serialized updates and safe recovery text. Keep POST payload names, quantity limits and cart-count events unchanged.
- [ ] Implement the shared-card wishlist layout, useful empty/browse actions and visible storage/availability feedback. Preserve nilkurinji-wishlist-v1 and event/storage synchronization.
- [ ] Run cart/wishlist/API/cookie/checkout tests, lint and typecheck. Review one item, several long-name items, sold-out line, expired cart and all utility-page empty states.
- [ ] Commit this cart/wishlist milestone.

**Exit evidence:** no misleading success, lost item on failed removal, racing totals or silent wishlist eviction.

## Task 9: Apply the system to supporting pages

**Create:** src/app/about/about.module.css, src/app/contact/contact.module.css and src/app/pages/[handle]/policy.module.css, plus src/app/account/account.module.css only if needed. **Modify:** the page.tsx and page.test.ts files in those four route directories.

**Consumes:** published Shopify Pages/policies, existing sanitization, approved socials/contact data and the shared shell. **Produces:** consistent editorial/reading layouts without new business features.

- [ ] Extend existing content-safety tests only where new handling is introduced: missing approved story/contact/policy content, invalid external links, API failure and sanitized HTML. Retain current route and account-host validation.
- [ ] Implement the About editorial composition and remove its handwritten/scrapbook presentation. If approved story content is missing, do not generate a fictitious origin narrative.
- [ ] Implement contact links, Shopify account handoff, and 65–75ch policy reading layouts with one h1. Preserve policy meaning and published titles. Do not add a contact form, newsletter or custom account UI.
- [ ] Run the affected route/content/sanitization tests, lint and typecheck. Review readable body copy, long headings and external-link focus at desktop/mobile sizes.
- [ ] Commit the supporting-page milestone.

**Exit evidence:** secondary pages belong to the same site and contain no new unapproved facts or broken content fallbacks.

## Task 10: Remove legacy presentation and close the whole-site review

**Modify/remove after reference audit:** globals.css, storefront-chrome.css, layout imports, unused botanical/carousel/reveal components, obsolete image assets, outdated CSS tests and unused fonts. **Update:** DESIGN.md, .impeccable/design.json, docs/design/redesign-v2/review-matrix.md and handover.md; metadata/robots/sitemap only where a documented regression requires it.

**Consumes:** every migrated route, approved comps and the spec acceptance matrix. **Produces:** the complete reviewed frontend, a lean authoritative design system and honest remaining-launch notes.

- [ ] Use rg to prove references before deleting any old component/asset/style. Distinguish unused generated images from intentionally retained page assets. Remove an unused import and its orphaned code in the same change; never delete an image merely because it was generated.
- [ ] Remove obsolete header/page global selectors and the storefront-chrome import once all their responsibilities have moved. Retire compatibility-only ProductCard props after all callers migrate. Preserve the installed Next-generated AGENTS block.
- [ ] Verify source boundaries: no private credentials/client Shopify import, no cached personalized cart, no new form field names, and no preview fixture imported into live fallback paths. Check for em dashes and unapproved claims in shopper-facing strings.
- [ ] Check metadata, canonical URLs, base filter canonicals, h1 structure, structured-data prices/reviews, policy mapping, robots/sitemap gates and social image references. No broken image path may be hidden by a successful HTML status.
- [ ] Run npm test, npm run lint, npm run typecheck, npm run build and git diff --check. Capture actual results; do not reuse an earlier milestone's result after relevant changes.
- [ ] Serve the new production build on the confirmed local project port. Check representative routes and served CSS/image URLs. Do not present a stale next start process as evidence of the new build.
- [ ] Assemble the required owner-provided rendered captures and keyboard/mobile checklist at the widths/states in the spec. Record every material finding, fix in a batch and re-review the affected rendered states. No source-only visual sign-off.
- [ ] Run the Impeccable detector once at the finished-UI stage unless an active hook already owns that scan. Separate actionable defects from documented intentional values; a clean scan alone does not close V-01 through V-05.
- [ ] Record representative lab performance results and the remaining field-data boundary. Preserve the Netlify automatic Next/OpenNext setup; do not add a static SPA fallback or deploy during this check.
- [ ] Derive DESIGN.md and its sidecar from the finished artifact. Deliver token/component/asset maps, screenshot index, startup/test commands, unresolved findings and launch prerequisites.
- [ ] Commit the final scoped cleanup/documentation milestone. Do not push or publish without authorization.

**Exit evidence:** the acceptance matrix is filled with evidence, not only checkmarks; no material visual issue is concealed behind passing code checks. If native rendered evidence is unavailable under the automation restriction, report that gate as pending.

## 6. Commands and evidence policy

| Purpose | Command / method | Passing evidence |
| --- | --- | --- |
| Targeted logic/DOM tests | npm test -- --run <owned test paths> | New tests pass; mocked tests make no live Shopify mutation. |
| Whole test suite | npm test | No regressions. Record actual file/test counts at execution time. |
| Static analysis | npm run lint; npm run typecheck | Both exit 0. |
| Production compilation | npm run build | Installed Next build succeeds, including type generation. |
| Whitespace | git diff --check | No whitespace errors in the intended change. |
| Source/deletion audit | rg / rg --files | No remaining imports/references to a retired artifact. |
| Local runtime | Confirm the project on port 3000, then start the fresh build in preview mode | Correct Nilkurinji title/routes and new served assets; no other project mistaken for this site. |
| Rendered review | Owner-provided screenshots + assisted interaction checklist under current restrictions | V-01 through V-05 and native behavior have real evidence. |

Most tests remain .test.ts because the existing Vitest include is src/**/*.test.ts. Use React createElement/act for DOM tests, as the current interaction suite does. Do not install another test framework just to write JSX test files. jsdom proves behavior and wiring, not CSS geometry, native dialog top-layer behavior or actual mobile keyboard layout.

Use fixed fixture data for unavailable/preview/live test branches; do not put shared tokens in test fixtures, screenshots, build logs or commits. Record API response status/shape rather than printing secrets or personal data.

## 7. Commit and rollback policy

- At execution start, inventory and preserve all current uncommitted/staged changes. The checkout already contains earlier work; a blanket add, reset or clean is not appropriate.
- If isolation is needed, preserve the current source state in the agreed branch/worktree before work begins; do not create a worktree from an unrelated default branch and lose the current storefront changes.
- Each milestone runs its relevant checks and commits locally. For a previously clean file, stage the exact path. For a file already dirty at baseline, stage only the milestone's owned hunks or use a separately reviewed baseline arrangement; staging its entire path can accidentally include earlier owner work. A docs-only commit does not imply the application has changed.
- Roll back a design milestone by reverting its scoped commit or restoring from its captured source baseline after checking for newer owner changes. Do not use destructive workspace resets.
- Keep the currently working local preview available between milestones where practical. Restart a production preview after rebuilding; do not assume HMR exists in next start.
- Corrected-code redeployment, domain changes, credential rotation and payment tests are future launch operations, not automatic effects of this plan.

## 8. Self-review and traceability

| Spec group | Owning task(s) |
| --- | --- |
| Brand decisions, visual concepts, approved composition | 0 |
| Tokens, typography, layout rails, primitive accessibility | 1 |
| Header, preview notice, nav and overlay lifecycle | 1, 3 |
| Query normalization, public API, limits/cache/failure separation | 2, 3 |
| Cards, card actions, preview prices and wishlist control | 4 |
| Full homepage, campaign behavior and footer | 5 |
| Shop/collections/full results, filters and URL state | 6 |
| Gallery, variants, purchase states, FAQs/reviews/recommendations | 7 |
| Cart and wishlist utility pages/recovery | 8 |
| About/Contact/account/policies and content authority | 9 |
| Responsive evidence, SEO, performance, cleanup, final system/runbook | 10 |

Self-review before handoff: shared type names agree across tasks; no task depends on an undefined interface; review-focus cases have named tests; all existing routes are covered; visual and live-payment verification are not conflated. No production code is supplied or changed by this plan.

## 9. What approval and completion mean

Reviewing this document settles proposed implementation scope, including predictive search and listing URL state. Choosing a visual comp settles its appearance. Those are distinct checkpoints. Native execution remains the existing method; there is no need to ask the owner to choose it again.

Implementation starts only after the applicable design review. Completion means the whole listed route/state matrix is reviewed and the final code checks pass. It does not mean the merchant catalog, payment/COD eligibility, Razorpay approval, shipping/refund facts, DNS or live purchase/refund testing have been completed.
