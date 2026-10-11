# Nilkurinji storefront product brief

## Product

Nilkurinji is a consumer food and drink storefront designed from the supplied homepage and website-plan PDFs. The approved implementation is a responsive Next.js storefront deployed on Netlify, with Shopify as the source of catalog, inventory, cart pricing, hosted checkout, and order administration.

The intended audience appears to be shoppers in India; this is an inference from the INR, India-only checkout, and food-category requirements, not a confirmed audience statement. English and INR are the initial defaults.

## Experience

The site includes a home page, all-products shop, Tea, Tea Bags, Rice, Snacks, and Other Foods collections, product detail, cart, search, wishlist, About, Contact, Privacy, Refund, and Terms pages. Product pages support galleries, variants, quantity, add-to-cart, buy-now, details, FAQs, approved reviews, and related-product recommendations. Search, filtering, sorting, recommendations, inventory, price, and checkout are Shopify-backed.

The home design follows the supplied PDFs: warm cream surfaces, deep botanical green, editorial serif headings, restrained sans-serif UI, natural food photography, centered brand mark, an editorial hero, category links, best sellers, and a benefits band. Preserve the supplied layout's order and proportions at desktop; collapse it cleanly for mobile. There is no Tea Guide, Recipe, Journal, newsletter, or separate custom customer-account system.

## Commerce and operations

- Shopify Headless Storefront API is the only live catalog/cart authority; prices and inventory must never be inferred from local fixtures.
- Shopify's hosted checkout handles transactions. COD and online payments are configured in Shopify Admin; no custom card or Razorpay processing is built in the storefront.
- Only approved merchant products, up to 20, may become live. The development store currently has no storefront-visible products, and payment eligibility has not been verified.
- A clearly labeled local preview catalog may demonstrate layout only. It has no prices, checkout, or purchase controls.
- Wishlist state is saved in the visitor's browser and is not an account/order data source.
- Contact, policy, product-origin, ingredient, health, shipping, refund, social, and review facts need owner-supplied approval. Never fabricate them.
- Private Shopify credentials are server-only Netlify runtime secrets, not source, browser environment variables, build artifacts, or commits. Rotate the shared private token before production.

## Launch gates

Before launch, the owner must provide approved product data and imagery; policy and shipping/COD rules; business and contact information; social URLs; Shopify merchant-store eligibility and Headless channel configuration; Razorpay approval if used; domain access; and Netlify environment secrets. Test browse → cart → hosted checkout, test payments/refunds, Shopify order state, and inventory before opening checkout to shoppers.

## Authority

- `NILKURINJI HOME PAGE DESIGN.pdf` — visual composition and home copy/layout reference.
- `NILKURINJI Website plan 2.pdf` — visual and content scope reference.
- The user-approved Netlify implementation plan in this conversation — technical and commerce scope.
