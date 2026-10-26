# 10. Project structure and quality constraints

Extend existing modules rather than create a second app.

```text
src/app/            routes, layouts, API, SEO, errors
src/components/     brand, layout, home, catalog, product, cart, search,
                    account, editorial, forms, storefront primitives
src/lib/shopify/    server client, queries, normalization, catalog, content,
                    cart, Customer Account API
src/lib/checkout/   provider adapter, hosted Shopify, Magic integration,
                    attempt binding, verification
src/lib/catalog/    filter parsing, URL state, card/variant rules
src/lib/session/    encrypted account session
public/images/      approved optimised assets only
design/             source masters, references, licences
tests/e2e/          commerce and account scenarios
tests/visual/       screenshot comparisons and approved fixtures
docs/plan/          approved implementation specification
docs/operations/    launch and recovery runbook
```

Server components fetch catalog/content. Client components own interactions. One cart provider, one overlay controller and URL-owned catalog state. Wishlist provider, state, page and API are removed. No Redux/custom DB. Validate on server; field-level errors preserve input. Sanitize merchant rich text and validate links. Never log payment payloads, tokens or addresses.

Target WCAG 2.1 AA: semantic landmarks/headings, keyboard paths, visible focus, accessible dialogs/disclosures, 44px targets, 4.5:1 normal text contrast, labels/errors, announcements, reduced motion, 200% zoom and narrow reflow. Third-party checkout accessibility requires separate testing.

Budgets to measure against production build: homepage JS ≤220KB compressed, product ≤280KB, fonts ≤130KB, mobile hero ≤150KB, desktop ≤250KB, card image 35–65KB, main PDP image ≤180KB, initial mobile home ≤1MB. Field targets at p75: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms. Use recorded mid-range mobile/slow-4G lab setup and load checkout SDK only on intent.
