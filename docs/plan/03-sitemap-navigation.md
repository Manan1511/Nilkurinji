# 03. Sitemap and navigation

## Launch routes

`/`, `/shop` with `?category=tea|tea-bags|rice|snacks|other-foods`, `/products/[handle]`, `/cart`, `/search?q=…`, `/account` and account login/callback/orders/addresses, `/our-story`, `/tea-guide` and article, `/recipes` and article, `/journal` and article, `/contact`, `/shipping-and-returns`, Shopify privacy/refund/terms/shipping policy pages, `/checkout/status`, and branded 404. The old `/wishlist` URL permanently redirects to `/shop`; no wishlist page or API ships.

Account, cart, search and checkout-status surfaces are `noindex`.

## Navigation

Exact main navigation: Home, direct Shop link, Tea Guide, Recipes, Journal, Contact. Search sits left of the central logo on desktop; Account and Cart sit right. On mobile, menu opens from the left and contains the navigation and Account; Search and Cart remain in the header.

Active states follow the current route. Shop is active on `/shop` and product pages. Editorial section remains active on its article route. Use underline plus `aria-current`, not colour alone. Our Story is linked from footer and relevant editorial copy, not added to the approved primary nav.

## Footer

Follow A3: inverse logo, working contact block instead of an unconnected newsletter, verified socials and short approved brand line. Add category links, Our Story/editorial links, customer-care, account, delivery/returns, policies, legal name/address, GSTIN, FSSAI number and grievance contact only when supplied.

## Redirects

`/about` → `/our-story`; legacy tea/tea-bags/rice/snacks/other-food collections → matching Shop category state; `/our-tips` → `/tea-guide` if used. Preserve product handles. Add permanent redirects only for confirmed legacy paths.

## Later

Newsletter, reviews submission/moderation, loyalty, subscriptions, multilingual and international selling, currency selector, extra hero slides.
