# Nilkurinji Design Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the five prioritized trust, commerce feedback, filter clarity, setup-copy, and accessibility issues found in the Nilkurinji storefront review.

**Architecture:** Preserve the existing Next.js App Router and Quiet Pantry Editorial design. Keep Shopify as the source of live catalog truth, and make preview mode visibly disclose draft content while disabling purchases.

**Tech Stack:** Next.js 16.4, React 19, TypeScript, Tailwind CSS 4, Vitest.

**Spec:** `.impeccable/critique/2026-10-19T16-15-15Z__src-app.md` and the user's selected scope, “Trust and approved copy” first and “Fix all five priority issues.”

## Global Constraints

- Read the relevant installed Next.js 16.4 guides under `node_modules/next/dist/docs/` before editing code.
- Do not assert unapproved product, ingredient, origin, quality, shipping, contact, social, or review facts.
- Preview copy and imagery must be labeled as draft; preview purchases remain disabled.
- Do not expose merchant setup language to shoppers.
- Preserve the supplied layout, the transparent category images, and current site direction.
- Keep user-provided private credentials out of source, test output, and commits.

## Review Focus

- Unsupported preview claims: neutral copy and a visible preview label should not imply verified product facts.
- Variant combinations: impossible combinations should have an explanation even when checkout is disabled, and valid but sold-out variants should remain distinguishable.
- Empty catalog and missing-content states: shopper-facing copy should explain what the visitor can do without exposing merchant setup steps.
- Filter behavior: the Tea collection should expose each product-type choice once and report the current result count accessibly.
- Keyboard navigation: search must retain a visible focus indicator and selected category filters must expose their state.

---

### Task 1: Trustworthy preview copy and disclosure

**Files:**
- Modify: `src/components/store-notice.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/lib/shopify/home-slides.ts`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/collections/[handle]/page.tsx`
- Modify: `src/lib/shopify/preview.ts`
- Test: `src/app/about/page.test.ts`, `src/components/site-header.test.ts`, and focused homepage/collection preview-copy tests
- Test: `src/lib/shopify/preview.test.ts`

**Interfaces:**
- Consumes: existing `getStorefrontMode`, homepage content, and About page content.
- Produces: visible preview disclosure and factual-neutral copy for illustrative catalog entries; no unapproved origin, quality, or product-description claims.

- [x] Write failing assertions for visible preview disclosure and removal of unsupported About/home/Tea and header-quality claims.
- [x] Run the focused tests and confirm they fail for the current markup.
- [x] Replace unsupported preview claims with neutral draft language and render the existing preview disclosure visibly.
- [x] Run focused tests and confirm they pass.

### Task 2: Explain invalid product variant combinations

**Files:**
- Modify: `src/components/product-purchase-panel.tsx`
- Create: `src/components/product-purchase-panel.test.ts`

**Interfaces:**
- Consumes: `StorefrontProduct` and Shopify's `StorefrontVariant.selectedOptions`.
- Produces: a clear status message when selected options do not match a real variant; existing unavailable and purchase-disabled rules remain authoritative.

- [x] Add failing tests for missing option combinations and valid unavailable variants.
- [x] Run the focused tests and confirm they fail for the missing-combination state.
- [x] Add explicit, accessible feedback for a non-existent combination while preserving sold-out feedback.
- [x] Keep invalid-combination and sold-out feedback visible when purchasing is disabled.
- [x] Run focused tests and confirm they pass.

### Task 3: Remove the duplicate Tea type filter

**Files:**
- Modify: `src/app/collections/[handle]/page.tsx`
- Modify: `src/components/product-grid.tsx`
- Test: `src/app/collections/[handle]/page.test.ts` and `src/components/product-grid.test.ts`

**Interfaces:**
- Consumes: the existing Tea top-filter row and collection facet configuration.
- Produces: one Tea type selector plus the existing non-duplicated facets, with the top selector still filtering by Shopify product tags.

- [x] Add failing regression assertions that the Tea Type checkbox group is absent and the top selector continues to filter matching product tags.
- [x] Run the focused tests and confirm they fail on the duplicate configuration and missing top-filter behavior.
- [x] Remove the redundant Tea Type facet and apply the top selector's tag filter in the product grid.
- [x] Run focused tests and confirm they pass.

### Task 4: Make unavailable setup states shopper-friendly

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/account/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/pages/[handle]/page.tsx`
- Modify: `src/app/shop/page.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/products/[handle]/page.tsx`
- Modify: `src/app/api/wishlist/route.ts`
- Modify: `src/components/product-grid.tsx`
- Test: `src/app/page.test.ts`, `src/app/about/page.test.ts`, `src/app/account/page.test.ts`, `src/app/contact/page.test.ts`, `src/app/pages/[handle]/page.test.ts`, and `src/components/product-grid.test.ts`
- Test: `src/app/shop/page.test.ts`, `src/app/search/page.test.ts`, `src/app/products/[handle]/page.test.ts`, `src/app/api/wishlist/route.test.ts`, and unavailable collection states

**Interfaces:**
- Consumes: current Shopify availability/content results.
- Produces: truthful, concise visitor-facing empty states with a route back to shopping, without Shopify Admin or Headless implementation language.

- [x] Add failing assertions for merchant-only setup language in rendered visitor states.
- [x] Run focused tests and confirm the assertions detect the current copy.
- [x] Rewrite only fallback copy; do not invent contacts, policy terms, or setup completion.
- [x] Run focused tests and confirm they pass.

### Task 5: Restore accessible filter and search states

**Files:**
- Modify: `src/components/product-grid.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/product-grid.test.ts`
- Create: `src/app/globals.test.ts`

**Interfaces:**
- Consumes: existing client-side category filters, computed product results, and global focus tokens.
- Produces: exposed selected state, a polite result-count announcement, and visible keyboard focus on search input.

- [x] Add failing server-rendered markup assertions for category `aria-pressed` and the live result count, plus a parsed CSS contract for visible search focus.
- [x] Run focused tests and confirm the assertions fail on current markup and CSS.
- [x] Add category selected state and result announcement; restore the palette focus outline for search input.
- [x] Run focused tests and confirm they pass.

### Final verification

- [x] Run `npm test` (22 files / 62 tests), `npm run lint`, `npm run typecheck`, and `npm run build` in preview mode.
- [x] Smoke-test the local home, Shop, Search, Tea collection, product, About, Contact, and policy routes with HTTP GET.
- [x] Inspect the final diff to confirm unrelated existing user changes are untouched.
- [x] Complete final source-only review; no remaining material issues found in the approved scope.
