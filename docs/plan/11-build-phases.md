# 11. Build phases and approvals

Estimate: 24–33 productive developer days plus 4–6 days contingency, about 6–8 weeks depending on approvals/assets/provider onboarding. Do not parallelise away required client review gates.

| Phase | Effort | Deliverable and acceptance | Client gate |
|---|---:|---|---|
| 1. Thin commerce slice | 3–4d | Dev Shopify catalog, home/shop/product/cart, test hosted checkout, correct Shopify order/stock; provider spike documented | Approve commerce fields/flow |
| 2. Visual proof | 3–4d | Desktop Home/Shop/Story/Guide plus mobile 390px/tablet 768px comps, logo/font/asset proof, overlay states | Mandatory desktop and mobile approval before full mobile build |
| 3. Shell + Home | 3–4d | Shared measured header, nav/menu/search, Home, footer, content connection; screenshot gate | Approve shell/Home |
| 4. Shopping surfaces | 4–5d | Five categories, filters, sort, shared cards, variant purchase, search/cart and all states | Approve Home→Shop→Product→Cart |
| 5. Accounts + embed | 3–4d | Customer Account PKCE, orders/addresses, selected provider order sync, verified completion/webhooks/recovery | Approve account/payment; popup alone fails |
| 6. Editorial/business | 2–3d | Guide/Recipes/Journal/Story/Contact/policies, redirects and SEO | Approve content/design |
| 7. India catalog/commerce | 2–3d | Approved products, GST/shipping/PIN/COD/invoice/email | Approve catalog and rules |
| 8. QA | 3–4d | Full viewport/state/browser/keyboard/performance matrix, final screenshots | UAT/fidelity approval |
| 9. Launch/handover | 1–2d | Commercial Vercel, secrets, DNS/OAuth/webhooks, owner-assisted payment/refund, training | Launch approval |

Current setup: record baseline, preserve unrelated dirty/untracked work, save this plan and implement one verified milestone at a time on the user’s `main` branch. Read installed Next.js 16.4 guides before changing Next patterns. Existing hosted checkout is foundation/fallback, not evidence of embedded provider completion. Provider choice, Shopify merchant eligibility, live credentials, domain and business facts remain external dependencies. Push/deploy only under explicit authorisation.
