# Nilkurinji storefront

## Product scope

Nilkurinji is an India-focused Shopify storefront for Tea, Tea Bags, Rice, Snacks and Other Foods. The unified catalog lives at /shop; category states use query parameters. Product options represent sellable pack sizes. Tea formats may be separate sibling products when their actual pack, image, inventory or price differs.

Shopper routes include Home, Shop, Product, Search, Cart, Account, Our Story, Tea Guide, Recipes, Journal, Contact, Shipping and Returns, Shopify policy pages, and checkout recovery/status. The main navigation is Home, Shop, Tea Guide, Recipes, Journal and Contact. Category links are available through Shop. The retired `/wishlist` URL permanently redirects to Shop. No currency chooser is planned.

## Commerce architecture

Next.js App Router, React, TypeScript and Tailwind CSS run on Vercel. Shopify is authoritative for products, variants, prices, inventory, carts, customers, orders, policies and editable storefront content. The Shopify Admin is the client’s product and content management interface; no custom admin or database is planned.

The storefront uses the Shopify Storefront API and Customer Account API. Product prices and tax treatment are Shopify-owned. Cart mutations are server validated. Shopify checkout remains a safe recovery path where appropriate.

The payment provider is not selected. Razorpay Magic Checkout’s documented headless Shopify integration is the technical baseline. Cashfree is an alternative only after its complete headless Shopify order-creation, recovery, COD and refund behaviour is verified. A provider interface or successful payment by itself does not prove that an order was created correctly in Shopify. Payments are disabled until merchant onboarding and end-to-end order verification pass.

## Brand and design authority

The approved screenshots control the composition. The final homepage mockup is the homepage authority; the approved Tea, Tea Bags, Tips and Story mockups guide their respective sections. The rejected prior homepage and rejected Leaf-to-Cup redesign are historical only.

Use warm paper, forest green, the centred stacked wordmark and sprout, two-row desktop header, shallow panoramic banners, five category medallions, landscape product cards, trust band, editorial cards, and the Our Story paper collage. Preserve the visual hierarchy and adapt only where needed for readability, responsive behaviour, accurate product information and accessible controls. See DESIGN.md and docs/plan/README.md.

When the Nilkurinji flower is used as a brand motif, show it blue-violet to pale mauve, not white. Keep named ingredient flowers such as jasmine and hibiscus in their own colors; generated flower artwork is illustrative, not botanical proof.

## Content and claims

The client edits products and content in Shopify. Publish only approved product facts, ingredients, origin, nutrition, health, sustainability, delivery, heritage, quality and production-process claims. The product page shows its “How it’s made” section only when the product’s `nilkurinji.how_its_made_approved` metafield is true. Prices, inventory, pack sizes and order status come from Shopify. Reviews must be genuine and approved. Preview prices and concept artwork are labelled and never become live fallback data.

## Preview and launch safety

Preview is non-indexable and non-purchasable. A live Shopify failure never falls back to preview products, prices, hero artwork or draft content. Payment, indexing, provider callbacks and customer accounts remain separately gated by environment configuration. Do not enable real orders until merchant configuration, catalog, policies, tax, delivery, payment recovery and production checks are approved.

See docs/SHOPIFY_SETUP.md, docs/VERCEL_DEPLOYMENT.md, docs/OPERATIONS_PLAYBOOK.md, docs/CONTENT_REVIEW.md, docs/ASSETS.md, DESIGN.md and docs/plan/README.md.
