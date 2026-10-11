# Content and launch review

This is the release checklist for owner-provided facts. Local preview phrases and preview catalog tiles are clearly draft/layout material, not approved commercial claims. Replace or approve all content and images below before production indexing or checkout.

## Owner review required

- [ ] Brand story and homepage copy; product naming and category assignment.
- [ ] Up to 20 actual product records, variants, inventory, INR pricing, product images, alt text, packaging, ingredients, allergens, nutrition, origin, storage, and regulated claims as applicable.
- [ ] Product FAQs and metafield values; only genuine customer reviews with permission and explicit approval.
- [ ] Hero/category imagery; generated images remain concept/illustration assets and must not be presented as real Nilkurinji packaging or exact product photography.
- [ ] Contact page: confirmed customer-support email, phone, physical/business details, service hours, and social URLs.
- [ ] Shipping, taxes, delivery estimates, COD regions/fees/restrictions, cancellations, returns, refund timelines, and all statutory/company details in Shopify policies.
- [ ] Shopify customer accounts destination and account experience.
- [ ] Shopify merchant-store eligibility, Headless channel publication, payment provider approval, COD settings, shipping zones, and Razorpay onboarding if selected.
- [ ] Actual custom domain, Netlify site, HTTPS, and primary canonical URL.
- [ ] Product and policy SEO metadata; preview noindex and production indexing state.

## Release verification

- [ ] `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- [ ] Review desktop and narrow-mobile home, category, product, cart, search, wishlist, About, Contact, and policy routes.
- [ ] Keyboard-test navigation, carousel, product options, filters, cart quantities, and checkout handoff. Confirm reduced-motion mode.
- [ ] Shopify browse → cart → hosted checkout → test payment; also fail/cancel/COD paths where enabled.
- [ ] Confirm order, payment state, inventory, fulfillment, cancellation, and test refund in Shopify Admin.
- [ ] Checkout flag only enabled after owner sign-off; final production page and sitemap are indexable only after live launch approval.

Do not check a box without a current observable result. No merchant checkout has been validated as part of this code milestone.
