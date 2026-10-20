# Nilkurinji storefront product brief

## Product

Nilkurinji is a consumer food and drink storefront designed from the supplied homepage and website-plan PDFs. The approved implementation is a responsive Next.js storefront deployed on Netlify, with Shopify as the source of catalog, inventory, cart pricing, hosted checkout, and order administration.

The intended audience appears to be shoppers in India; this is an inference from the INR, India-only checkout, and food-category requirements, not a confirmed audience statement. English and INR are the initial defaults.

## Experience

The site includes Home, Shop, Tea, Tea Bags, Rice, Snacks, and Other Foods collections, product detail, Cart, predictive Search, Wishlist, About, Contact, and Shopify policy pages. Product pages support galleries, variants, quantity, add-to-cart, buy-now, approved details, FAQs and reviews, and related-product recommendations. Search, filtering, sorting, recommendations, inventory, price, and checkout use Shopify data when the storefront is live.

The redesign keeps the supplied logo and forest-green identity, with warm near-white surfaces, Newsreader editorial headings, Manrope controls and body text, and open product frames. A compact header opens search in a desktop popover or a mobile sheet without moving the page. The homepage leads with a tea-focused hero and selected tea, then links to Tea, Tea Bags, the brand story, and pantry collections. Shop, collection, search, and recommendation cards share one system. Layouts adapt to mobile, tablet, and desktop widths. The site excludes Tea Guide, Recipes, Journal, newsletter, and a custom customer-account system.

The current local storefront is a design preview. Preview catalog names, sample prices, packaging, and selected imagery are illustrative. Those values do not establish merchant facts or production catalog content. Purchases and indexing stay disabled in preview mode. See [DESIGN.md](DESIGN.md) for the implemented visual system and [the redesign handover](docs/design/redesign-v2/handover.md) for evidence and remaining launch gates.

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
