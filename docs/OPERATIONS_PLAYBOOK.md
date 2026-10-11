# Nilkurinji operations and handover

Use Shopify Admin for store operations. This storefront does not create a second product, inventory, customer-account, order, or payment dashboard.

## Product and content update

1. Open **Shopify Admin → Products**. Add the real item, confirmed food details and images, options, INR prices, inventory, SEO fields, and the appropriate Shopify product type.
2. Assign the product to the relevant published collection: `tea`, `tea-bags`, `rice`, `snacks`, or `other-foods`. Publish it to the **Headless** sales channel. The storefront reads at most 20 products and 50 variants per product.
3. Update the `nilkurinji` metafields for product details and FAQs. Add customer reviews only after receiving a genuine review and approval to publish it.
4. Edit the published `nilkurinji_home` metaobject to update required homepage copy, approved hero media, optional second-carousel copy, featured-products heading, closing copy, and allowed social URLs. Keep incomplete or unapproved copy out of the live metaobject.
5. Edit the Shopify About/Contact pages and merchant policies from Shopify Admin. Do not use placeholder copy, personal contact details, or generated pack artwork as production facts.

## Order, payment, fulfillment, and refund routine

1. Open **Shopify Admin → Orders**. Review payment state before packing: COD orders can be unpaid/pending until the courier collects payment; online orders must show the merchant-approved paid state.
2. Verify address, shipping serviceability, inventory, and any COD restrictions. Fulfill only after the store's written payment and fulfillment rules are met.
3. Add tracking and mark fulfilled in Shopify so the store's order record remains authoritative.
4. Handle cancellation, partial/full refund, COD reconciliation, and customer notification using the merchant's approved policy and Shopify Admin. Record the reason and reconcile inventory/payment status.
5. Never issue a refund from this storefront. Confirm Razorpay eligibility and its current Shopify order/refund steps with the merchant account before training staff on those payment cases.

## Netlify release and support triage

- Follow [Netlify deployment](./NETLIFY_DEPLOYMENT.md) for deploy previews, Production environment variables, DNS, HTTPS, and recovery. Keep checkout and indexing separately gated.
- For a storefront bug, record the exact URL, timestamp/time zone, device/browser, expected result, actual result, and steps to reproduce. Check the Netlify deploy and function logs for that release and the matching Shopify product/cart/order record before changing business data.
- For stale catalog or homepage content, check that the item is published to the Headless channel, the collection/metaobject handle is exact, and the 60-second server cache window has passed.
- For checkout/payment or order-state issues, stop checkout by setting `SHOPIFY_CHECKOUT_ENABLED=false`, inspect Shopify Admin/provider status, then rerun the purchase test before reopening.
- For a release regression, use Netlify's prior successful deployment as the recovery point, then deploy a corrected commit. Do not edit build output or patch a production cart/order manually.
- Share URLs, timestamps, public error text, and request IDs with support. Never include the private Storefront token, cookie secret, customer payment details, or a full customer address in bug reports.

## Launch training checklist

- [ ] Walk the owner through adding a product, options, price, inventory, collection, SEO, and Headless publication.
- [ ] Walk through homepage metaobject, About/Contact pages, policy publishing, and review approval.
- [ ] Demonstrate a Shopify test order, COD pending state where enabled, fulfillment, cancellation, and test refund.
- [ ] Verify staff permissions in Shopify Admin and Netlify follow least privilege.
- [ ] Confirm the owner can deploy a preview, inspect logs, keep indexing closed during tests, and use the documented recovery procedure.
- [ ] Record the owner-approved live product catalog, primary domain, payment configuration, policies, and post-launch support contact/coverage.
