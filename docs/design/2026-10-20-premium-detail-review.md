# Nilkurinji premium detail review

Scope: shared header and search, plus the home, catalog, product, cart and support patterns that use them. This is a refinement of the approved cream/green and Playfair identity. Product photography, catalog facts, routes, legal text and checkout configuration stay outside this visual pass.

## Design direction

Premium is expressed through clear hierarchy, consistent spacing, readable information and precise interaction. Preserve the existing editorial hero and tea-first home sequence. The header needs a distinct masthead row and navigation row, not overlapping absolute positioning. Search needs one clear entry point and one shared form treatment.

Design variance 5, motion intensity 3, visual density 3. Existing brand and layout take priority over random hero/font selection. No new hero, bento layout, decorative animation, factual claims or imagery is introduced.

## Research and interpretation

- [Bellocq](https://www.bellocqtea.com/) distinguishes category browsing from Search, Account and Cart. Its tea collections group products by useful characteristics. Nilkurinji borrows the separation of shopping navigation and utility controls, scaled to its smaller approved catalog.
- [Rare Tea Company](https://rareteacompany.com/) pairs tea categories with product-specific prices and details. Nilkurinji keeps product information legible and actions tied to real availability. It does not borrow unverified sourcing or quality claims.
- [Postcard Teas](https://www.postcardteas.com/site/shop/) foregrounds product names, prices and variant selection. This reinforces a product-first hierarchy rather than extra decoration.
- [Baymard's search-field research](https://baymard.com/blog/search-bar-ui) treats recognition, discoverability, input design and results recovery as part of product finding. Nilkurinji uses a labeled desktop Search trigger, an explicit mobile search icon, a full search field on expansion, and useful collection routes when there are no matches.

These are design interpretations of the public sites and research. Competitor browser screenshots were not captured.

## Findings and fixes

| Priority | Finding | Correction |
| --- | --- | --- |
| P1 | Search label and placeholder look like unstructured text; the submit icon is disconnected. | Use a composed Search trigger and an expandable, bordered field with a visible Search submit button. |
| P1 | Desktop and mobile search have separate markup and treatments. | Share one form component and one disclosure; retain query submission, focus on open, Escape, close control and outside dismissal. |
| P1 | The unavailable homepage can expose internal Shopify configuration text. | Use a shopper-facing availability message with a route back to the shop. |
| P2 | Logo and navigation are crowded together. | Give the masthead and navigation separate grid rows with a 22px desktop gap and consistent brand dimensions. |
| P2 | Layered header CSS produces regressions between revisions. | Remove 168 obsolete header/search selectors and place the authoritative rules in storefront-chrome.css. |
| P2 | Support and shopping utility labels are unnecessarily small. | Set support links to 14px, shopping links to 13px, and mobile search/select inputs to at least 16px. Maintain 44px actions. |
| P2 | Disabled preview cart circles look actionable. | Remove purchase controls on every preview-card variant; preserve sample-price labels and product-detail links. Reclaim the unused grid column. |
| P2 | A no-results search falls into generic product-grid advice about filters. | Provide a query-specific no-results message and Tea, Tea bags and Shop all routes. |
| P2 | Search results receive both outer and inner catalog gutters. | Remove the nested catalog gutter so results align with the search container. |
| P3 | Shop display tracking is tighter than the type floor. | Relax tracking from -0.045em to -0.035em. |

## Implementation

- Next.js Form keeps the existing GET query contract: /search?q=...
- The disclosure remains in document flow and does not trap focus.
- Mobile search and navigation are mutually exclusive. Account and wishlist remain available in the mobile menu.
- Desktop utilities use consistent 44px controls and 20px icons.
- At 320px the mobile grid has 288px of content width: 44px menu + 88px tools + 12px gaps leaves 144px for the 138px wordmark.
- Shared search uses readable placeholder contrast, browser-native validation, a 120-character query limit, visible focus and reduced-motion support.

## Verification boundary

Use the supplied current screenshots, source/CSS review, DOM interaction tests, build checks and direct-origin requests. The user's earlier restriction on browser automation remains in force, so this pass does not claim a new browser screenshot review at each viewport.

## Results

- All 74 tests in 23 files pass, including five DOM tests for search opening, focus return, mobile-menu coordination, query submission, outside dismissal and closing on navigation.
- ESLint, TypeScript, production compilation and Git whitespace checks pass.
- Eleven local routes return HTTP 200 with the shared header, including both search-result states and a preview product page.
- The production page serves the new header/search CSS; the obsolete desktop-search styles are absent from the delivered stylesheets.
- Search-placeholder contrast is 5.79:1; primary search-button contrast is 10.28:1.
- Impeccable's mechanical scan produced 338 advisory findings and no non-advisory findings. Nineteen advisories on the new stylesheet concern sizes outside the older DESIGN.md ramp. The intentional sizes serve wordmark, utility, field and heading roles; this pass does not rewrite unrelated design documentation to suppress the warnings.
- The production preview runs locally with purchases and indexing disabled. Browser-rendered desktop/mobile confirmation remains outside this pass's validation boundary.
