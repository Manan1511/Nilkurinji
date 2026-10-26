# 13. Risks and client inputs

## Risks

| Risk | Mitigation |
|---|---|
| Rejected existing UI treated as authority | Follow PDFs and signed decision register |
| Screenshots are raster/AI-inconsistent | Measure major boundaries; use B2 precedence; approve fonts/logo |
| AI pack/claims published | Replace with real pack shots and approved copy before live sale |
| Provider SDK does not create Shopify order | Require a supported headless Shopify integration, not generic widget |
| Capture succeeds but Shopify completion fails | Pending state, signed events, provider reconciliation and no second payment |
| COD, GST or PIN claims are UI-only | Configure/enforce in Shopify/provider/carrier; unknown coverage stays unknown |
| FSSAI/GST/policies are assumed | Owner/adviser supplies and approves facts |
| Vercel Hobby used commercially | Budget appropriate commercial plan |
| Mobile is implemented before approval | Phase 2 approval gate |
| Old credentials remain active | Rotate exposed credential before production |
| Legacy blog/webhook assumptions | Use supported event topics; TTL/manual invalidation as documented |

## Assumptions and open questions

Assume English, INR, India-only, up to 20 products, five categories, pack-size variants, format-specific sibling products, Shopify accounts, no wishlist, database or custom admin, newsletter deferred and no currency selector. Provider is unselected; Razorpay Magic Shopify-headless is only the technical baseline. Confirm provider/account eligibility, Shopify plan and store upgrade/migration, catalog/facts/claims, format mapping, shipping/COD/PIN data, tax/HSN/invoice, return rules, newsletter scope, domain, social/support URLs, articles and quantity limits.

## Client checklist

Provide product titles, formats, pack sizes/weights, SKUs, prices, stock, ingredients/allergens/nutrition/storage/shelf life, manufacturer/licence/origin, approved brewing, images/alt and review permissions. Provide business/legal name/address, GSTIN, FSSAI, grievance/support contacts, policies, fulfilment/carrier/rates/timelines/remote areas/COD/PIN serviceability, provider KYC/test/live access through secure channels, refund operations, domain/Vercel access, approved story/values/claims, social links and launch articles.

## Launch gate

Do not enable real orders until catalog, content, legal and commercial rules are signed off; provider reliably creates the matching Shopify order; success/failure/pending/COD/refund/recovery pass; production credentials are rotated; HTTPS/domain/OAuth/webhooks work; responsive/fidelity review is approved; and Shopify training/runbook are delivered.
