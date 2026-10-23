---
name: Nilkurinji Tea
description: A tea-first storefront for loose tea and tea bags, guided by the supplied premium tea reference.
colors:
  paper: "#FBF9F4"
  parchment: "#F0EEE9"
  forest: "#04190F"
  forest-hover: "#192E23"
  ink: "#1B1C19"
  ash: "#53574F"
  violet: "#6E5D7B"
  brass: "#AF8C47"
  rule: "rgb(27 28 25 / 12%)"
  rule-dark: "rgb(251 249 244 / 24%)"
  error: "#8C302A"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(3.1rem, 6vw, 6.6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  mobileDisplay:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(3.1rem, 12vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.4rem, 4vw, 4.2rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.5vw, 1.55rem)"
    fontWeight: 400
    lineHeight: 1.18
  emptyStateHeading:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.18
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  heroIntro:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "clamp(1rem, 1.15vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  index:
    fontFamily: "Space Mono, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "2px"
spacing:
  page-gutter: "20px"
  section: "clamp(60px, 8vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
---

# Design System: Nilkurinji Tea

## Overview

**Creative direction: Tea, in two formats.**

The supplied reference contributes its dark forest surfaces, warm paper, high-contrast serif display type, and product-led rhythm. Nilkurinji keeps its wordmark and sprout while the storefront focuses only on tea and tea bags. A full tea photograph anchors the right side of the homepage hero; transparent cutouts introduce loose tea and tea bags in a separate format section below. One existing transparent leaf spray sits beside the homepage brand note as an editorial signature, not as repeated edge framing. The composition uses open space, exact alignment, and restrained metallic accents rather than decorative circles.

The brand voice is warm, unhurried, and lightly playful. It welcomes loose tea and tea bags without making either feel like a test of expertise. Use short, sensory everyday copy, as in “No perfect cup required.” Never invent origin, ingredients, health benefits, product facts, or quality claims.

The shared shell stays short and identical on every route. Search opens as an overlay and does not move the page. The home sequence is a tea editorial hero, a small selection of tea products, compact loose-tea and tea-bag format links, and approved tea-specific brewing information. One Shop page contains both product formats as filters; product, cart, search, About, Contact, account, and policy pages follow the same system. Wishlist functionality has been removed.

All visible preview products, prices, and product images are illustrative. Each sample price and the global preview notice make that clear. Preview purchases and indexing stay disabled. Shopify remains authoritative for live products, variants, prices, stock, cart totals, and checkout.

## Palette and typography

- Warm paper (`#FBF9F4`) is the main surface. Parchment (`#F0EEE9`) supports secondary content.
- Deep forest (`#04190F`) anchors the image stage, main actions, and preview strip. Hover uses `#192E23`.
- Ink (`#1B1C19`) and ash (`#53574F`) keep copy clear. Brass (`#AF8C47`) appears on dark surfaces and as decoration, never as essential text on paper. Violet remains a rare brand accent.
- Playfair Display leads headings and the existing wordmark. DM Sans handles navigation, product information, forms, buttons, and prices. Space Mono is limited to small indexes and approved numeric brewing data.
- The desktop hero uses `clamp(3.5rem, 6vw, 6.6rem)`; below 600px it uses `clamp(3.1rem, 12vw, 4.5rem)`. Introductory copy may use `clamp(1rem, 1.15vw, 1.125rem)`.
- Essential supporting text remains at least 14px. Index labels remain at least 12px. Do not reduce type to force a title onto one line.

## Layout and shell

- Keep the wordmark and sprout dimensions consistent across routes. Do not restore the removed descriptor.
- Desktop uses the centred wordmark, left-side Shop and Our Story links, and right utility actions. Mobile uses one compact row with menu, logo, search, and cart. The preview strip and header together stay close to 90px on desktop and under 90px on mobile.
- Search, menu, cart, and mobile filters are overlays. Opening one never adds a navigation row or pushes page content.
- Content is capped at 1440px, with responsive page gutters and a section rhythm between 60px and 112px.
- Controls have 2px corners and at least 44px hit areas. Main actions are at least 48px tall. Editorial images use square frames or natural transparent cutouts. Do not clip cutouts into circles.
- Product grids use three columns on wide screens, two on tablet and standard mobile, and one below 360px.

## Homepage and photography

- The hero headline is **“Make a little room for tea.”** Its supporting line names loose tea and tea-bag formats. The two actions open the single Shop page with the matching format filter selected.
- A tea still-life photograph fills the right side of the hero. A selection of up to three teas appears before the transparent loose-tea and tea-bag cutouts. Keep those format links compact, with desktop frames capped at 320px and mobile frames sized to the available width. Set them on parchment, never in circles or masks.
- The forest image stage uses the actual alpha-transparent loose-tea and tea-bag PNGs. Keep both subjects fully visible with `object-fit: contain`; never add an oval mask or circle behind them.
- After the tea selection and compact format links, show a concise brewing note. Brewing measurements appear only from an explicitly approved product profile. No speculative origin, taste, health, quality, shipping, or product claims.
- Keep concept photography disclosed in preview. Do not use landscape, packaging, or generated ingredients to imply a source, estate, harvest, or product recipe.
- Tea is the complete merchandise range. Do not show pantry foods, teaware, brewing equipment, storage containers, bundles containing accessories, or other merchandise.

## Catalog, transactions, and currency

- Shopify collection handles `tea` and `tea-bags` classify product formats inside the single Shop page. Old `/collections/tea` and `/collections/tea-bags` URLs redirect to the corresponding Shop filter. Catalog, search, direct product lookup, and recommendations expose only products assigned to either collection. No wishlist feature or lookup endpoint remains.
- Product pages keep Shopify variant choice, quantity, availability, add-to-cart, Buy Now, genuine approved reviews, FAQs, and tea-only recommendations. Preview products have no purchase action.
- Use the merchant's Shopify price and currency data. There is no currency chooser. Preview prices remain INR sample prices.
- Keep cart totals and hosted checkout Shopify-authoritative. Never substitute local preview items or prices when live Shopify fails.

## Motion and accessibility

- Use the shared `--motion-fast` (150ms), `--motion-control` (180ms), `--motion-panel` (240ms), and `--motion-image` (520ms) timings with the `--ease-out` curve.
- Keep feedback attached to its cause: buttons press by 1px, only directional arrow icons move, saved hearts fill, product images respond to hover/focus, and FAQ chevrons follow disclosure state.
- Preserve spatial direction: the left-side menu and filter triggers open panels from the left, the right-side cart opens from the right, and search opens beneath the header without moving page content.
- Search suggestions, newly added cart lines, and product-gallery changes use brief entrances to make content changes legible. Do not animate static sections merely to make the page feel busy.
- Do not use autoplay, parallax, perpetual steam, bouncy transitions, cursor effects, or animated grain.
- Respect reduced-motion preferences by removing spatial movement, image zoom and list entrances while keeping essential color and saved-state feedback. Content, image subjects, and actions remain understandable without animation setup.
- Keep visible focus, keyboard operation, Escape handling, focus return, accessible image descriptions, and screen-reader result announcements.

## Do and don't

- **Do** preserve the Nilkurinji wordmark, green identity, transparent tea cutouts, product clarity, and consistent shell dimensions.
- **Do** use straightforward language and only confirmed merchant facts.
- **Do** disclose concept imagery and sample prices on preview surfaces.
- **Don't** add a currency chooser, non-tea categories, teaware, storage products, unsupported product claims, or em dashes in shopper-facing copy.
- **Don't** repeat leaves around the page edges, create circles behind transparent images, or let search increase header height.
