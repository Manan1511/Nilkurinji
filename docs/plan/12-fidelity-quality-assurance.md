# 12. Fidelity and quality assurance

## Visual comparison

Keep original extracted references, approved responsive compositions/exceptions, and separately approved implementation baselines. Primary comparison viewport is 1536×1024. Capture Home, Shop, Tea Guide and Story at matching scroll positions. Compare section boundaries, hierarchy, banner crop/copy balance, logo/header, grid/card geometry, palette, typography and decorative placement. Use overlays for alignment but require human/client review; a diff score alone cannot pass.

Pass: desktop shared header 124px ±4px, approved logo allocation, shallow banners, correct card counts and landscape media, measured surfaces, approved type proof, legible 14px support text, complete legal footer, no critical commerce/accessibility defects. Differences allowed only for real product photography, corrected copy/claims, visible pack size, readable text/touch targets, required legal details and approved responsive layouts.

## Viewport/state matrix

Capture 320×800, 390×844, 768×1024, 1024×768, 1366×768, 1440×900, 1536×1024 and 1920×1080. Include homepage top/full, Shop all/Tea Bags/food, multi-pack and sold-out products, editorial listing/article, Story, policy/contact, cart, account/order/address, open menu/filter/search/cart, checkout and pending status. Check no overflow, clipped controls, sticky-header collisions, broken circles, lost keyboard focus or reduced-motion regression.

## Behavioural checks

- Catalog has five collections; filters/sort survive URL Back/Forward; no tea-only suppression; live errors never show preview data.
- Variant ID/price/stock correct; unavailable selection is retained; bad product/variant pairing cannot purchase.
- Cart drawer/page share confirmed state; rapid mutations serialize; failure retains prior state; Buy Now is isolated.
- Search min length/debounce/cancel/errors/empty states; no stale result or page displacement.
- Legacy `/wishlist` bookmark redirects to Shop; no wishlist UI or API remains.
- OAuth state/nonce/PKCE/refresh/logout and customer ownership of order/address.
- Provider SDK load, invalid cart, prepaid success/failure/pending/cancel, COD, UPI switch, browser close after capture, invalid signature, duplicate/out-of-order webhook, idempotent completion, refund and recovery. No second charge fallback after capture.
- HMAC rejection, sanitisation, preview noindex/no-purchase, no secret in browser/logs, legal detail correctness.

Run repository tests/typecheck/lint/build/diff checks and Playwright visual/e2e suite. Freeze dates and deterministic fixture data, wait for fonts/images, disable motion in baseline screenshots. Review changed baselines manually. Real provider-to-Shopify verification is separate from mocked tests.
