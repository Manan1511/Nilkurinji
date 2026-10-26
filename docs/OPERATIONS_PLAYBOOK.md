# Nilkurinji operations and handover

Shopify Admin is the store operations interface. Vercel hosts the storefront. The payment-provider dashboard may still be needed for settlement, gateway disputes and reconciliation.

## Catalog and content

1. Add products, pack-size variants, SKU, price, stock, shipping weight, images, SEO and the correct published collection in Shopify Admin.
2. Tea facets use tags with type:, flavour: and caffeine: prefixes. Keep values stable and approved.
3. Publish products to the Headless storefront and verify them in the intended environment.
4. Edit homepage/category/story/values/shipping metaobjects and Shopify blogs. Confirm the current query supports each field before entering content.
5. Publish only approved product facts and genuine reviews.

## Orders and fulfillment

1. Review Shopify Admin → Orders. Confirm payment or COD status before packing.
2. Verify address, carrier serviceability, inventory and merchant COD rules.
3. Fulfill in Shopify and add tracking there.
4. Handle cancellation and refund according to approved policies and provider procedures.
5. Never treat COD as prepaid or a browser callback as proof of payment.

## Delivery data

Maintain the public nilkurinji_shipping metaobject entry india and its serviceability CSV. Use six-digit PINs and true/false prepaid/COD flags. Refresh the verified timestamp whenever the data changes. Stale or unavailable data returns unknown; checkout remains the final authority.

## Vercel release and incident triage

- Follow docs/VERCEL_DEPLOYMENT.md for project setup, environment scope, domain and rollback.
- Record exact URL, time zone, device/browser, expected result, actual result and reproduction steps.
- Inspect Vercel deployment/function logs and the corresponding Shopify product/cart/order before changing business data.
- For stale content, verify Headless publication, collection/metaobject handle and the 60-second cache window.
- For article/page content without a Shopify webhook topic, use POST /api/revalidate with an approved scope and the operator secret through a secure server-side tool. Never expose REVALIDATE_SECRET in a browser or logs.
- For payment uncertainty, close new checkout with SHOPIFY_CHECKOUT_ENABLED=false and reconcile the provider and Shopify state. Never start a second payment after capture or while status is uncertain.
- Roll back through Vercel deployment history. Do not patch build output or alter a production cart/order to hide an application defect.
- Never include tokens, cookie secrets, payment credentials, full addresses or other customer data in bug reports.

## Launch training

- [ ] Product, pack, price, stock, collection and image maintenance.
- [ ] Homepage/category/story/blog/policy publishing.
- [ ] Test order, COD state, fulfillment, cancellation and refund.
- [ ] Vercel previews, logs, environment scopes, rollback and least-privilege access.
- [ ] Owner-approved provider, domain, policies and support coverage recorded.
- [ ] Payment-pending recovery and serviceability data maintenance documented.

No live merchant order, refund, settlement or production deployment is verified by this playbook alone.
