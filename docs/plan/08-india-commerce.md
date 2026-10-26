# 08. India commerce

## INR, GST and invoices

Display INR in Indian number format and show “Inclusive of all taxes” only after merchant tax setup is reviewed. Never add GST a second time in the frontend. Rates vary by product classification and location; client accountant approves GST registration, HSN, rate and place-of-supply configuration. A Shopify confirmation is not automatically a compliant GST invoice. Confirm an invoice app/template carrying required supplier, GSTIN, invoice, item/HSN, taxable value, tax, place-of-supply and applicable food licence details.

## Shipping and PIN serviceability

Client supplies fulfilment location, zones, rates, remote-area rules, timelines, free-shipping terms, COD coverage/fees and carrier. A PIN input is advisory; six-digit syntax alone cannot claim serviceability. Initial lookup can read an approved Shopify Files CSV: `pincode,prepaid,cod,eta_min_days,eta_max_days`. Stale/missing/failed data returns Unknown and does not block valid checkout. Final rates and eligibility are enforced in checkout.

## Payment

Shopify Payments is unavailable for India in the checked supported-country list. Merchant selects Cashfree or Razorpay. Planning baseline is Razorpay Magic Checkout for headless Shopify; its MID/store connection and provider approval are required. Cashfree’s generic inline SDK does not establish Shopify order sync. Confirm supported product, account eligibility, fees, KYC, settlements, refunds, COD, test/live environments and idempotent order completion before integration. No user payment credentials are received or logged by Nilkurinji.

Test UPI/card success, failure, pending, cancellation, app switching, browser closure after capture, delayed completion and refund. COD must create an unpaid/pending order and be enforced by provider/checkout settings, not merely UI. Confirm COD route separately.

## Checkout boundary

Embedded checkout can brand only the provider’s supported logo, business name, colour and labels; bank/UPI authentication may leave the page. Shopify hosted checkout is a recovery path and will not reproduce the storefront’s botanical layout. On a standard non-Plus plan, assume logo/colour/font controls only; do not promise Checkout Branding API or Plus-only customisation. Never switch to a second payment after captured/uncertain status.

## Food information and operations

Client/legal adviser verifies FSSAI disclosures, ingredients, allergens, net quantity, nutrition, manufacturer/packer, licence and category-specific exemptions. Shopify sends order, COD, shipping, cancellation and refund email. Authenticate sender domain. Provider dashboard may still be needed for settlements, disputes and reconciliation; do not claim every financial operation lives in Shopify Admin.
