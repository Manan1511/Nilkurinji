# Content and launch review

This checklist separates content approval from code verification. Preview copy and generated concept imagery are draft layout material. Approval is required before real orders or indexing.

## Owner approval

- [ ] Final homepage, Shop banners, five category images, product card layout and all mobile compositions.
- [ ] Actual product catalog, product/pack relationships, SKU, price, tax settings, stock and weights.
- [ ] Real product photographs, alt text, packaging, ingredients, allergens, nutrition, storage, shelf life, manufacturer details and licence numbers as applicable.
- [ ] Brand story, sourcing, quality, sustainability, health and heritage claims, with evidence where required.
- [ ] Genuine customer reviews and permission to publish.
- [ ] Tea Guide, Recipes and Journal article copy, images, dates and related-product links.
- [ ] Customer-care and grievance contacts, business address, legal name, GSTIN, FSSAI number and verified social links.
- [ ] Privacy, terms, shipping, returns, cancellations and refund policies.
- [ ] India shipping rates, serviceability source, delivery estimates, COD regions/fees/limits, invoice setup and payment/refund process.
- [ ] Provider choice, merchant eligibility, Shopify integration, embedded UI settings and recovery process.
- [ ] Staging and production origins, domain, authentication callback and payment webhook URLs.

## Implementation checks

- [ ] All five categories work through the single Shop route.
- [ ] Client can maintain homepage, category, story, value, editorial and shipping content in Shopify.
- [ ] Live API errors never show preview products, prices, images or copy.
- [ ] Search, filters, cart, account and product variants use their documented states.
- [ ] Preview deployments remain non-purchasable and non-indexable.
- [ ] Checkout is gated until a provider-supported flow creates and confirms the correct Shopify order.
- [ ] No second payment path is offered after payment capture or uncertain status.

## Release verification

- [ ] npm ci, full tests, typecheck, lint and production build pass.
- [ ] Fresh screenshots reviewed at 320, 390, 768, 1024, 1366×768, 1440 and 1920 widths.
- [ ] Home, Shop, Tea Bags, food category, product, cart, search, account, Our Story, editorial, Contact and policies reviewed.
- [ ] Menu, filter, search and cart overlays tested; mobile menu/filter open from the left and cart from the right.
- [ ] Keyboard, focus, zoom, reduced motion and screen-reader status tested.
- [ ] Provider success, failure, cancel, pending, UPI return, COD, duplicate webhook, browser-closure recovery and refund tested where supported.
- [ ] Shopify order, payment state, inventory, fulfillment, customer email and invoice checked in Admin.
- [ ] Indexing enabled only after client launch approval.

Do not check an item without current observable evidence. Local build or test-payment success is not production merchant verification.
