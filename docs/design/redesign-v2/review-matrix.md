# Redesign review matrix

This matrix separates source and automated evidence from browser-rendered visual evidence. No desktop or mobile browser capture of the current redesign was available during this implementation turn.

| ID | Review area | Source / automated evidence | Rendered review | Status |
| --- | --- | --- | --- | --- |
| V-01 | Compact, consistent header and logo; search does not displace content | Shared header and token rules; interaction tests cover open, close, navigation and breakpoint focus return | Pending fresh desktop and mobile capture, including search open | Source implemented; visual pending |
| V-02 | Editorial type, readable labels, consistent page spacing | Newsreader/Manrope roles, shared tokens and page modules; type and layout declarations reviewed | Pending review at 320, 390, 768, 1024, 1280 and 1440 widths | Source implemented; visual pending |
| V-03 | Remove repeated botanical framing and dated category shelf | New homepage composition does not render the old category shelf; unused frame component and legacy global stylesheet were removed after reference audit | Pending full-page review, including About and footer | Source implemented; visual pending |
| V-04 | Product grid and action alignment | Shared ProductCard, tested listing states, common 4:5 frame and explicit preview action policy | Pending long titles, null images, one/two-column mobile and desktop captures | Source implemented; visual pending |
| V-05 | Mobile menu, search, filters and touch targets | Native modal sheet lifecycle, visualViewport sizing, 44px control declarations, interaction tests | Pending keyboard, mobile browser chrome, virtual keyboard, focus, scroll and reduced-motion check | Source implemented; browser check pending |
| B-01 | Predictive search behavior and privacy | Public typed endpoint, no-store response, query normalizer, bounded request/cache behavior, tests | No network panel/live query capture available | Source and automated tests pass |
| B-02 | Cart write ordering | Shared cart mutation queue is used by product Add/Buy Now, quick-add, and cart update/remove/checkout. A regression exercises concurrent quick-add callers and queue release after a failed response. Queue scope is one browser document, not cross-tab/server-wide coordination. | No fresh multi-control browser exercise | Source and automated tests pass; browser exercise pending |
| B-03 | Wishlist lookup | Lookup uses direct per-handle product lookup rather than the first global bestseller page; regression test covers products outside that page and API failure | No live catalog data exercise | Source and automated tests pass; live catalog pending |
| B-04 | Optional homepage content | Missing optional fields normalize to empty values; homepage campaign can omit its eyebrow; regressions added | No Shopify content record loaded for visual review | Source and automated tests pass; merchant content pending |
| P-01 | Production compilation | Fresh `npm run build` completed and listed application routes | Not a visual check | Pass |
| P-02 | Lab and field performance | No representative browser or field data recorded | LCP/CLS/INP not measured | Open |
| C-01 | Shopify catalog, payments, COD, checkout, orders and refunds | No Shopify Admin or owner-assisted payment operation performed in this pass | Requires an eligible merchant store and approved gateway | Open launch gate |

## Superseded evidence

`.impeccable/review/desktop.png` and `.impeccable/review/mobile.png` are captures of the previous interface. The finish review correctly marked them as requiring recapture. Do not use them to sign off this redesign.

## Code review fixes

A fresh independent source review found four defects. The fixes and regression coverage are included in the current branch:

1. Serialize cart writes shared across independent product and cart controls so concurrent calls do not race over the cart cookie.
2. Return focus to the visible search trigger when the desktop search changes to compact layout.
3. Look up each saved product directly rather than scanning only the first 20 products returned by a bestselling query.
4. Treat optional Shopify homepage fields as optional instead of calling `.trim()` on missing values.

The reviewer declined a rendered-quality verdict because the available captures were stale and browser automation was unavailable. No second review was run after the one-pass fixes; focused regressions and the full suite were run instead.
