# Nilkurinji storefront

Next.js App Router, React, TypeScript and Tailwind storefront for Tea, Tea Bags, Rice, Snacks and Other Foods. Shopify owns the live catalog, variants, prices, inventory, cart, customer accounts, orders and editable content. Vercel is the planned hosting platform.

The approved reference package and implementation decisions are recorded in docs/plan/. The final homepage mockup takes precedence over older redesign proposals.

## Start locally

    npm ci
    Copy-Item .env.example .env.local
    npm run dev

The example environment starts the non-indexable, non-purchasable preview. Do not copy real secrets into tracked files. Server-only credentials belong in local .env.local or the deployment secret store.

## Checks

    npm test -- --run
    npm run typecheck
    npm run lint
    npm run build
    git diff --check

## Current documentation

- [Implementation plan](docs/plan/README.md)
- [Shopify setup](docs/SHOPIFY_SETUP.md)
- [Vercel deployment](docs/VERCEL_DEPLOYMENT.md)
- [Operations playbook](docs/OPERATIONS_PLAYBOOK.md)
- [Content review and launch gate](docs/CONTENT_REVIEW.md)
- [Asset inventory](docs/ASSETS.md)
- [Current design system](DESIGN.md)
- [Product scope and commerce architecture](PRODUCT.md)

The payment provider remains unselected. Razorpay Magic Checkout for headless Shopify is the technical baseline; Cashfree requires equivalent supported Shopify order completion and recovery verification. Checkout stays disabled until merchant onboarding and real test-order flows pass. No deployment or production payment has been performed by this repository update.
