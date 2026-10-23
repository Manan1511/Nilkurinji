# Superseded: Nilkurinji Leaf to Cup Redesign Blueprint

**Status:** Superseded on 2026-10-20 by the tea-only visual direction documented in [DESIGN.md](DESIGN.md), based on the user's supplied premium tea storefront HTML reference. The current storefront sells only tea and tea bags, uses the existing transparent tea cutouts, and excludes teaware, storage, pantry goods, and currency selection. See [`docs/design/tea-only-reference/handover.md`](docs/design/tea-only-reference/handover.md).

**Goal:** Make Nilkurinji recognisable as a tea brand through composition, photography, brewing rituals, and product presentation, even when packaging changes.

**Audience:** Premium daily tea drinkers. Clear choices, sensory detail, approachable language.

**Approved direction:** Warm paper, deep forest green, restrained violet, editorial typography, and a photographic journey from leaf to cup. Preserve the wordmark and sprout; remove the descriptor.

**Architecture:** Retain Next.js, React, TypeScript, Tailwind/CSS Modules, Netlify, and Shopify. Replace the visual system and page compositions while preserving commerce safeguards.

**Boundaries:** Pasted estate, altitude, harvest, product, and shipping claims are creative examples. Publish them only after approval. Newsletter, Tea Guide, Recipes, and Journal remain excluded. Product-specific brewing modules are included.

## 1. Brand and copywriting audit

### Design principle

Tea is the organising subject. Photography shows leaves, infusion, and the finished cup. Product information explains taste, format, and preparation. Editorial details resemble tea labels and brewing notes. Pantry remains available but follows tea. Botanical imagery appears once with purpose rather than repeating around page edges.

Use references selectively. [Ippodo](https://ippodotea.com/) demonstrates approachable taste descriptions; [Bellocq](https://www.bellocqtea.com/) demonstrates tea discovery by type, region, and scent. Borrow their attention to merchandise, not their identity.

### Before and after

| Current element | Replacement |
|---|---|
| Long uppercase preview announcement | Compact forest strip: “Design preview. Purchases disabled.” Keep concept-imagery disclosure in footer and relevant product views. |
| Wordmark with tiny “Food & Beverages” | Existing wordmark and sprout only, consistent on every route. |
| “A considered cup, every day.” | Eyebrow “NILKURINJI TEA”; headline “From leaf to cup.” |
| Generic introduction | “Explore tea and tea bags for your daily ritual.” |
| Oversized product-mockup hero | Tea-making photography with selectable Leaf / Water / Cup chapters. |
| “Explore Nilkurinji tea” over conventional grid | “Choose your next cup.” Open, specimen-style product presentation. |
| Flat Tea and Tea Bags panels | Editorial format comparison with distinct preparation photographs. |
| Proposed “Single Estates” and “Ritual Sachets” | Use familiar category names until product facts support specificity. |
| Empty “A little more about Nilkurinji” row | Substantive botanical editorial section followed by Our Story. |
| Proposed elevation, harvest and quality metrics | Show approved product data only; omit missing rows. |
| Invented tasting-score dots | Plain approved tasting notes; no invented scores. |
| “Add to Ritual” | Familiar Add to cart, Choose options, and Buy now. |
| Proposed free-shipping progress bar | Omit until shipping rules and eligibility are confirmed. |
| Repeated disclaimers | One compact preview notice, clear sample-price labels, contextual imagery disclosure. |
| Large generic footer | Compact navigation, contact/social links, policies, and brand signature. No newsletter. |

Copy must not invent origin, craft, ingredients, health effects, exclusivity, establishment dates, coordinates, altitude, scarcity, or shipping promises. Avoid “micro-lot,” “single-estate,” “whole leaf,” “orthodox,” and “pyramid infuser” unless approved. No em dashes in shopper-facing copy. Preview prices stay labelled “Sample price.” Keep navigation and transaction labels straightforward.

## 2. Design system and tokens

### Palette

| Token | Value | Usage |
|---|---|---|
| --paper | #F5F2EB | Main background |
| --parchment | #EAE5D9 | Image grounds and secondary surfaces |
| --forest | #112118 | Primary actions, preview strip, editorial section |
| --ink | #1A1917 | Primary text |
| --ash | #5C5852 | Supporting text |
| --violet | #6E5D7B | Selected markers, focus, occasional botanical detail |
| --brass | #B5945B | Decoration and accents on forest |
| --rule | rgba(26,25,23,.12) | Non-interactive separators |
| --rule-dark | rgba(245,242,235,.22) | Separators on forest |
| --error | #8C302A | Errors with explanatory text/icon |

Measured contrast: ink/paper 15.71:1; ash/paper 6.32:1; ash/parchment 5.62:1; paper/forest 14.97:1; violet/paper 5.34:1; brass/paper 2.55:1 (decorative only); brass/forest 5.86:1. Hairlines do not serve as the sole boundary of a control. Inputs use a stronger ash border.

### Typography

- Cormorant Garamond: display/editorial headings, weights 400/500, occasional 400 italic.
- DM Sans: body, navigation, prices, forms, buttons.
- Space Mono: approved brewing data and small numerical indexes.
- Existing Playfair Display: wordmark only.

Load through next/font. Remove superseded Newsreader and Manrope imports.

| Role | Specification |
|---|---|
| Hero | clamp(3rem, 5.3vw, 5.5rem), line-height .98, tracking -.035em |
| Section | clamp(2.1rem, 3.3vw, 3.5rem), line-height 1.06 |
| Product title | clamp(1.25rem, 1.5vw, 1.55rem), line-height 1.18 |
| Body | 1rem/1.65; introductory copy up to 1.125rem |
| Navigation/actions | 0.875rem–1rem, weight 500 |
| Supporting text | Minimum 0.875rem/1.5 |
| Technical labels | 0.75rem/1.5, tracking .08em |
| Indexes | 0.75rem, tracking .12em |

No essential 11px text. Mobile product titles wrap naturally.

### Geometry

Maximum content width 1440px. Desktop 12-column grid, 24px gutters. Page gutters: 16px below 360px, 20px from 360px, 32px from 768px, 48px from 1200px. Section spacing clamp(56px, 7vw, 104px). Reading width 65ch. Controls at least 44×44px; primary buttons 48px high. Controls use 2px corners; editorial image frames are square. Avoid pill buttons, floating card shadows, and decorative circles. Establish rhythm with rules and image scale.

## 3. Photography, surfaces, and assets

The hero shows tea being prepared, not fictional packaging. Produce coordinated images: (1) dry leaf study, (2) tea infusing in transparent teaware, (3) amber tea being poured with leaves visible nearby. Cup is the initial chapter. Packaging remains temporary; do not invent a new range.

Asset manifest: hero images in landscape 4:3 plus portrait crops; Tea and Tea bags format photographs in portrait 4:5; one verified violet-blue kurinji botanical reference/illustration; social preview from approved hero and wordmark. Match light and surface across the three hero chapters. Record desktop/mobile crops, focal points, alt text, and image provenance. No embedded text or logos.

Prompts:

**Leaf:** Editorial still life of dry tea leaves on a shallow handmade ceramic dish, warm unbleached paper and weathered stone, soft directional window light, visible irregular leaf texture, restrained forest green and warm neutrals, matte materials, no packaging, flowers, text, logo, or glossy advertising effects.

**Water:** Close editorial photograph of tea infusing in a simple transparent glass brewing vessel, loose leaves visibly opening in warm water, delicate natural steam, soft side light, warm stone worktop, quiet forest-green background, tactile realistic materials, no excessive condensation, flowers, packaging, text, or fantasy glow.

**Cup:** Editorial photograph of amber tea being poured from a transparent vessel into a handmade ceramic cup, a small amount of dry tea nearby, soft daylight, warm stone and unbleached linen, natural shadows, realistic liquid and glass, no packaging, blossoms, text, logo, or exaggerated gloss.

**Botanical:** Study of Strobilanthes kunthiana based on supplied verified references; preserve observed flower form, violet-blue colour, and leaf structure; restrained warm-paper composition, no jasmine, invented labels, text, or border.

Compare generated botanical art with verified references before calling it accurate. Tea scenes are illustrative, not proof of product appearance.

Use a reusable EditorialMedia wrapper. Apply restrained saturate(.9) contrast(1.02) to editorial images only; keep product imagery colour-accurate. Optional static SVG grain at 0.02 opacity on selected decorative surfaces, behind content, pointer-events:none, aria-hidden. No full-screen fixed noise, animated grain, or vignette over controls. Disable optional effects in forced-colour mode.

Preload the initial hero frame only. Reserve image ratios. Load remaining chapters after the first frame or user selection. Keep the current frame visible while another loads. Lazy-load below-fold images. Missing images never hide navigation or text.

## 4. Page architecture, interactions, and data

### Shared shell

At 1200px+: one 76px header; Tea, Tea bags, Pantry, Our story on the left; wordmark/sprout centred at max 190px; Search, Account, Wishlist, Cart on the right. Balanced grid tracks keep logo centred. The 24px preview strip makes the normal combined height 100px.

Below 1200px: one 64px header with Menu, compact logo, Search, Cart. Account, Wishlist, Contact, and all categories move into Menu. Preserve 44px targets below 360px. No extra navigation row or logo resizing. Dimensions match on every route.

### Search and overlays

Use one modal search: desktop maximum 720px, viewport-bounded; mobile full-width with internally scrolling results. Opening never pushes content. One input row, clear, close; no oversized intro heading. Initial links: Tea, Tea bags, Shop all. Keep the two-character minimum, 300ms debounce, cancellation, six suggestions, bounded successful-result cache, and all loading/empty/unavailable/retry states. Results show image, name, live Shopify price or explicit sample price. Enter opens full results. Keep ordinary result links; do not add incomplete combobox keyboard behaviour.

One overlay controller owns Menu, Search, Cart, and mobile Filters. Only one may be open. Support Escape, close button, focus restoration, scroll locking, and close-on-navigation. Crossing the 1200px breakpoint closes shell overlays; crossing 768px closes Filters and discards unapplied changes.

### Cart

One controller shares server-confirmed cart state among header, drawer, /cart, and purchase controls. Reuse /api/cart and the serialized mutation client; apply successful responses directly and avoid competing GETs. Open drawer only after successful Add. Buy Now keeps separate checkout cart and does not open the drawer. Drawer max width 440px desktop, full-width 100dvh on mobile. Keep /cart. No shipping progress until merchant rules are approved.

### Homepage

    Shared notice and header
    main
      Leaf / Water / Cup hero
      Selected teas
      Tea-format diptych
      Brewing ritual
      Botanical story
      Pantry links
    Shared footer

**Hero:** Desktop 5/7 copy/image columns, height clamp(500px, 42vw, 620px), no floating card. Copy: “NILKURINJI TEA”; “From leaf to cup.”; “Explore tea and tea bags for your daily ritual.” Primary “Explore tea”, secondary “Find your format”. Manual Leaf/Water/Cup controls change image/caption only, with stable layout. Below 900px stack copy before image, 4:3 mobile frame. No autoplay, scroll hijacking, glass card, invented metrics, or lot number.

**Selected teas:** Heading “Choose your next cup.” Show up to three tea products. Balance one/two products without blank slots. Failure and empty states are honest. Cards show approved metadata, 4:5 image, title, approved tasting notes, price, and valid variant/action. On mobile show image, wrapping title, price, one action; move secondary metadata and variant controls to PDP.

**Tea formats:** Two tall editorial panels, one hairline, “01 / Tea” and “02 / Tea bags”; preparation photos, concise copy, collection links; stack below 768px. Do not assume whole-leaf, pyramid, or single origin.

**Brewing:** If approved profile exists, show selected tea and its supplied dose, water, temperature, and time, with product link. Otherwise show qualitative Leaf → Water → Cup without numbers or product claims. No timer or universal recipe. Select featured product explicitly through homepage content.

**Botanical story:** Full-width forest section; large type beside one image desktop, text then image mobile. Heading “A twelve-year rhythm.” Label as botanical note. Explain the violet-blue flower/cycle without claiming estate ownership, ingredient use, or founder story. Kerala Tourism documents the botanical cycle: https://www.keralatourism.org/munnar/neelakurinji-munnar.php. Do not imply all populations flower together. No fabricated craftsmanship pillars. Link to Our Story with approved content.

**Pantry:** Compact “Alongside your tea.” section links Rice, Snacks, Other Foods. Text-led, optional restrained imagery. Header Pantry goes to /shop?category=pantry; add this presentation filter for the three existing collection handles.

**Footer:** Compact paper surface, wordmark, navigation, verified contact/social links, policies, preview and concept-imagery disclosure. No newsletter, shipping guarantees, foliage frame, or invented address.

### Other routes

| Surface | Treatment |
|---|---|
| Shop | Compact intro, categories, count, filters, sort, shared grid |
| Tea / Tea bags | Distinct intro photography and approved copy, shared catalog behaviour |
| Pantry collections | Shared system with food-specific details; no tea measurements |
| Product | Desktop 7/5 gallery/purchase; mobile gallery, title, price, options, purchase, taste/brewing, details |
| Search | Query, count, editable search, shared cards, empty/error states |
| Cart | Shared state, familiar line items, server totals, clear checkout |
| Wishlist | Shared cards, browser storage note, missing-product recovery |
| About | Editorial composition with supplied facts; no invented history |
| Contact | Readable verified links |
| Policies | 65ch column, clear hierarchy, sanitized Shopify content |
| Account | Keep Shopify-hosted handoff |

Catalog grid: 3 columns desktop; 2 tablet and mobile from 360px; 1 below 360px. Product cards show chips only for one Shopify option group with at most three short values. Otherwise “Choose options.” Out-of-stock variants stay disabled. Never silently replace a selected variant. Preview products expose no purchase action. Keep quantity, Buy Now, approved reviews/FAQs, and recommendations on PDP.

### Data contracts

Keep cart, search, and wishlist endpoint shapes. Add nullable teaProfile to StorefrontProduct, sourced from Shopify JSON metafield nilkurinji.tea_profile:

    approved: boolean
    format: "loose-tea" | "tea-bag" | null
    origin, estate, harvest, lot: string | null
    elevationM: number | null
    tastingNotes: string[]
    brewing:
      dose: { amount: number, unit: "g" | "bag" } | null
      waterMl, temperatureC, steepSeconds, infusions: number | null
      instructions: string | null

Publish only when approved is explicitly true. Malformed JSON yields no profile. Invalid fields are omitted individually. Values must be finite and meaningful; temperature 0–100°C; counts positive integers. Trim/bound strings; no raw HTML. Profiles are product-level. Variant-specific instructions stay in approved product details until supported. Price, weight, stock, and options stay Shopify variant data. Do not expand search/cart payloads without a display need.

Extend HomepageContent with ordered ritualChapters (Leaf, Water, Cup; desktop/mobile images and alt), formatImages for Tea/Tea bags, brewingProductHandle, and optional approved story heading/body/image. Retain legacy hero fields during migration. Missing live content never activates preview content; render approved available chapters only, otherwise use the approved legacy hero.

## 5. Motion choreography

Use CSS, no new animation dependency. Easing cubic-bezier(.22, 1, .36, 1).

| Interaction | Motion |
|---|---|
| Buttons | 160ms colour; arrow shifts at most 3px |
| Nav underline | 180ms reveal |
| Editorial image | 1 to 1.025 over 650ms on pointer hover |
| Hero chapter | 260ms opacity; stable frame |
| Search | 180ms opacity and at most 6px movement |
| Drawer | 240ms horizontal entrance |
| Sections | One-time 400ms opacity and at most 12px movement |
| Stagger | 60ms siblings, at most 180ms total |

No bouncy springs, endless steam, marquees, cursor effects, or parallax. Keep content visible without JavaScript. Reduced motion removes transforms, zoom, and stagger; state changes remain immediate.

## 6. File and component tree

Root: C:\Users\manan\Downloads\Projects\Nilkurinji.

Refactor shared shell/styles in src/app/layout.tsx, globals.css, storefront-tokens.css; site-header, store-notice, site-footer, storefront action/container/modal-sheet; all existing home, shop, collection, search, product, cart, wishlist, about, contact, account, policy routes and components/styles. Update site-config.ts, catalog-state.ts, cart-client.ts and Shopify types, queries, normalization, and content. Preserve endpoint contracts.

Add focused modules:

    src/components/cart-provider.tsx
    src/components/cart-drawer.tsx
    src/components/tea-details.tsx
    src/components/tea-details.module.css
    src/components/home/tea-formats.tsx
    src/components/home/tea-story.tsx
    src/components/home/brewing-ritual.tsx
    src/components/storefront/overlay-provider.tsx
    src/components/storefront/editorial-media.tsx
    src/components/storefront/editorial-media.module.css
    src/components/storefront/paper-grain.tsx
    src/lib/variant-selection.ts
    src/lib/shopify/tea-profile.ts
    public/images/leaf-to-cup/{hero-leaf,hero-water,hero-cup}.webp
    public/images/leaf-to-cup/{hero-leaf,hero-water,hero-cup}-mobile.webp
    public/images/leaf-to-cup/{format-tea,format-tea-bags,kurinji-study}.webp
    docs/design/leaf-to-cup/{asset-manifest,visual-review,handover}.md

Add tests beside parser, variant resolver, cart controller, drawer, and overlay controller. Extend existing tests. Keep the sprout mark; refactor the existing hero, not add a competing one. After review update PRODUCT.md, DESIGN.md, .impeccable/design.json, and Shopify setup documentation.

## 7. Execution and verification

**Phase 1, foundations:** Save this blueprint; record baseline branch, dirty files, checks; read installed Next.js CSS/fonts/images/component-boundary docs; make desktop and mobile homepage compositions; review header, hero, products, botanical story; approve visual direction before extending to routes; implement tokens, typography, actions, containers, and surfaces. Exit with coherent reference and primitives, no stacked overrides.

**Phase 2, shell and shopping controls:** Compact header, wordmark-only logo, overlay arbitration, existing search request behaviour, central cart state and drawer, full cart page. Verify keyboard, focus, navigation, breakpoint changes. Exit with consistent shell, no search layout shift, correct shared cart state.

**Phase 3, homepage:** Produce editorial assets; manual Leaf/Water/Cup; extend homepage normalization; build selected teas, format diptych, botanical story, pantry, footer. Check 0–3 products, missing images, incomplete live content. Exit with tea identity independent of packaging.

**Phase 4, catalog and utility routes:** Shared cards/grid; pantry aggregate filter; preserve sorting, URL history, parameters; shared variant resolver; recompose PDP; restyle wishlist, cart, About, Contact, policies, account. Exit with empty, unavailable, and normal shopping flows.

**Phase 5, brewing and handover:** Approved-profile parser/display; qualitative no-data fallback; responsive/accessibility review and batched fixes; update docs from finished design. Commit verified milestones locally. No push/deploy without authorization.

Run npm test -- --run, npm run typecheck, npm run lint, npm run build. Cover search loading/empty/failure/cancel/stale responses; overlay exclusivity, Escape, outside close, focus and scroll; shared drawer/cart state; failed Add, rapid mutations, Buy Now isolation; expired carts, unavailable/stock/checkout errors; variant ID and price; multi-option routing; pantry mapping; missing/malformed/unapproved/partial profiles; no live-to-preview fallback; preview purchase/index gates; credential absence in browser; no shopper-facing em dashes.

Local browser automation is authorised. Verify the server is the new build. Capture 320, 390, 768, 1024, 1440, and 1920px widths and a short 1366×768 desktop. Review homepage top/full page, Shop, Tea, PDP, utility pages; open search/menu/filter/cart; populated, empty, loading/error states; product with and without profile. Check consistent header/logo, no clipping/overflow, hero CTA visible, readable mobile titles/prices, 44px targets, virtual keyboard, visible focus, reduced motion, font layout shift, colour-accurate products, no repeated botanical framing. Review fresh screenshots after final visual edits.

Lab targets: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms, with setup recorded. Production field performance is separate. Completion requires visual approval, all scoped routes, passing behaviour checks, fresh responsive review, matching docs. Live catalog approval, payments, shipping rules, deployment, and DNS remain separate launch work.
