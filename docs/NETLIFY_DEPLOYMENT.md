# Netlify deployment and domain handoff

This project uses Next.js's Netlify OpenNext runtime. Netlify detects Next.js and configures the adapter automatically. `netlify.toml` runs `npm run build`, publishes `.next`, and selects Node 22. Keep Netlify's automatic Next.js adapter; do not add a second/pinned Next.js plugin, static-export setting, SPA catch-all redirect, VPS, Nginx, or systemd process.

## Deploy from Git

1. Push this repository to the Git provider and connect the repository in Netlify. The current workspace does not yet have a linked Netlify site or deploy target.
2. Confirm the build command is `npm run build`, publish directory `.next`, and Node version `22` (the checked-in `netlify.toml` supplies these values).
3. Check the Netlify account's current plan/credit limits before enabling continuous production builds. Start with the Free tier if the account permits; reduce unnecessary deploys and polling.
4. Configure Deploy Preview and Production environment values in Netlify. Keep checkout disabled in both until their respective tests pass. Add server variables from `.env.example` and the [Shopify setup guide](./SHOPIFY_SETUP.md); do not prefix server secrets with `NEXT_PUBLIC_`.
5. Trigger a deploy. Inspect the build log and preview URL. Deploy previews remain preview-mode, noindex, unpriced, and non-purchasable by default.
6. Add the custom domain to the Netlify site's **Production domains** first. For external GoDaddy DNS, use the exact record values Netlify shows under **Pending DNS verification** for this site. This project has no confirmed production domain/site name yet, so do not guess records or change DNS in advance.
7. If retaining GoDaddy DNS, Netlify documents an apex A-record fallback (`75.2.60.5`) and a `www` CNAME to the exact `site-name.netlify.app`; use the dashboard's site-specific values and its current external-DNS instructions. Alternatively, delegate DNS to Netlify only if the owner wants that and has reviewed existing email and other DNS records.
8. Wait for DNS verification, then verify Netlify provisions HTTPS/TLS. Check both apex and `www`, redirects/canonical host behavior, and the certificate before changing `SITE_URL` to the approved primary URL.
9. Enable production checkout only after the Shopify merchant, product, payment, policy, shipping, and purchase-test gates in [Shopify setup](./SHOPIFY_SETUP.md) pass. Keep `SHOPIFY_INDEXING_ENABLED=false` throughout testing; set it to `true` only after the owner confirms the public launch. Checkout and indexing use separate production-only flags.

Netlify's free plan and billing model may change. Verify the account-specific plan/credit balance at setup; this repository cannot inspect a Netlify account or start a deployment by itself. Redeploy after environment-variable changes. Recovery is a corrected code commit followed by a new deploy; inspect deploy logs before promoting.

## Local commands

```powershell
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
```

## Official references

- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Netlify pricing and credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [Connect a custom domain to Netlify](https://docs.netlify.com/domains-https/custom-domains/)
- [Configure external DNS for a Netlify domain](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)
