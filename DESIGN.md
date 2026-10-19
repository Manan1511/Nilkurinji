---
name: Nilkurinji
description: A quiet pantry editorial in warm paper, botanical greens, and Playfair serif.
colors:
  cream: "#f7f5ee"
  paper: "#fbfaf6"
  ink: "#242d24"
  forest: "#254434"
  forest-deep: "#1c3327"
  sage: "#e5e9dc"
  sage-ink: "#536852"
  line: "#d9ded2"
  muted: "#71786d"
  ochre: "#b78049"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, Iowan Old Style, Times New Roman, serif"
    fontSize: "clamp(38px, 3.7vw, 49px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.027em"
  headline:
    fontFamily: "Playfair Display, Georgia, Iowan Old Style, Times New Roman, serif"
    fontSize: "clamp(34px, 3.1vw, 42px)"
    fontWeight: 400
    lineHeight: 1.03
  title:
    fontFamily: "Playfair Display, Georgia, Iowan Old Style, Times New Roman, serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "0.16em"
rounded:
  sm: "2px"
  pill: "999px"
  circle: "50%"
spacing:
  page-gutter: "40px"
  section-wide: "clamp(58px, 8vw, 106px)"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.forest-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "48px"
---

# Design System: Nilkurinji

## Overview

**Creative North Star: “The Quiet Pantry Editorial”**

The storefront pairs warm paper and restrained botanical greens with food photography, clear product information, and a Playfair Display editorial voice. The home page moves from its landscape hero and five circular category images into a left-aligned Best Sellers introduction beside a horizontal product carousel, then a dark benefits band. The wide-desktop carousel presents four compact product cards in its first view.

The implementation is deliberately light on surface effects. Hairline olive-toned borders, open catalog imagery, and tonal backgrounds provide structure; the homepage featured cards use a small paper panel as a surface-specific exception. Utility and purchase information remains in Arial. Product cards pair type, title, INR-formatted price, and a compact cart control. The local storefront currently labels illustrative copy and imagery as preview content and disables purchases.

**Key Characteristics:**
- Warm cream surfaces with deep green text and controls.
- Playfair Display for brand and editorial headings; Arial for utility text.
- Image-led catalog with flat cards and fine separators; homepage featured cards use a restrained bordered paper surface.
- A centered brand header and responsive, manually controlled four-card home carousel.

## Colors

The palette centers on warm cream and layered forest greens, with muted sage and ochre reserved for secondary detail and interaction.

### Primary
- **Forest** (`#254434`): Primary buttons, benefits surface, links, and brand accents.
- **Deep Forest** (`#1c3327`): Strong heading and wordmark ink; primary-button hover.

### Secondary
- **Sage** (`#e5e9dc`): Soft hover and fallback image surfaces.
- **Sage Ink** (`#536852`): Eyebrows, muted green labels, and supporting detail.
- **Ochre** (`#b78049`): Small status and saved-wishlist accents, including the cart count.

### Neutral
- **Warm Cream** (`#f7f5ee`): Page background and light text on dark surfaces.
- **Paper** (`#fbfaf6`): Light surface and primary-button text.
- **Ink** (`#242d24`): Default body text.
- **Divider** (`#d9ded2`): Header, form, and content separators.
- **Muted** (`#71786d`): Supporting and secondary copy.

### Named Rules
**The Paper-and-Botanical Rule.** Use cream and green as the dominant field; keep ochre to small markers and status details.

## Typography

**Display Font:** Playfair Display (Georgia, Iowan Old Style, Times New Roman, serif fallback)
**Body Font:** Arial (Helvetica, sans-serif fallback)
**Label/Mono Font:** Arial; no mono face is used.

**Character:** Playfair Display supplies a calm, literary brand voice, while Arial keeps navigation, labels, prices, and controls compact and direct.

### Hierarchy
- **Display** (400, `clamp(38px, 3.7vw, 49px)`, `0.98` line-height): Home hero heading.
- **Headline** (400, `clamp(34px, 3.1vw, 42px)`, `1.03` line-height): Home featured-products heading and other editorial section headings.
- **Title** (400, `21px`, `1.15` line-height): Product-card titles.
- **Body** (400, `15px`, `1.55` line-height): Base copy; individual supporting copy scales down in compact layouts.
- **Label** (700, `10px`, `0.16em` tracking, uppercase): Eyebrows and utility labels.

### Named Rules
**The Serif-and-Utility Rule.** Keep Playfair Display for the wordmark and editorial titles; use Arial for navigation, body copy, prices, and controls.

## Layout

The main content frame caps at `1360px`, with `40px` desktop gutters in wide sections. The homepage hero spans the viewport, layers its copy over the left side of a Nilgiri landscape, and ranges from `240px` to `290px` tall on desktop and `400px` to `470px` on mobile. Tea and tea-bag collections use matching landscape banners. The category shelf is five equal columns; below it, the Best Sellers intro occupies a narrow left column while the product carousel shows four cards in its desktop first view. Collection listings use three cards beside a filter rail. At `760px` and below, the header becomes a compact menu/wordmark/tools row, categories remain five across, the carousel shows two cards, product browsing narrows to two cards, and benefits form a two-by-two grid. The footer uses a compact forest-green field with botanical line art; the excluded newsletter is not shown. At `360px`, spacing and wordmark sizing tighten again. The overall spacing is generous on long-form sections (`clamp(58px, 8vw, 106px)`) and intentionally compact on the homepage reference composition.

## Elevation & Depth

The interface is flat at rest and does not use a box-shadow vocabulary. Depth comes from cream/sage/forest tonal blocks, image crops, and fine borders. Image cards may enlarge their image slightly on hover; small icon controls lift by one pixel as feedback.

### Named Rules
**The Flat-by-Default Rule.** Use background contrast and separators for grouping; do not introduce resting shadows.

## Motion & Feedback

The home and collection banners make one authored entrance: the copy settles upward by `8px`, while the image unfolds over `680ms` and eases into its resting crop. Category and product lists use short staggered entrances, capped at `280ms`. Mobile navigation fades and shifts into place; routine color, arrow, and control feedback stays between `150ms` and `220ms`. Saving a product gives the heart a brief pulse, and cart updates scale into view. No banner autoplay runs. `prefers-reduced-motion` collapses nonessential movement and transitions to `0.01ms` while keeping saved, selected, and cart states visible.

## Shapes

Most controls and form fields are square or nearly square (`2px` button radius and zero-radius selects). The hero’s main action and category imagery are deliberate exceptions: the action is pill-shaped, category images are circular, and icon controls are circular. Homepage featured product cards have a small `5px` corner radius, unlike open catalog cards. Borders are thin and muted; image containers clip their contents.

## Components

### Buttons
- **Shape:** Square-cornered utility buttons (`2px`); the homepage hero action overrides to a pill (`999px`).
- **Primary:** Forest fill with paper text, `48px` minimum height, `0 22px` padding, uppercase bold labels, and expanded tracking.
- **Hover / Focus:** Primary shifts to deep forest; outline shifts to sage. Keyboard focus uses a visible `2px` ochre outline with `4px` offset.
- **Secondary / Ghost:** Outline buttons retain a forest border and transparent fill; icon controls remain transparent until a sage hover surface.

### Cards / Containers
- **Corner Style:** Catalog product cards and image frames are square-cornered except the circular home-category thumbnails; homepage featured cards use a small `5px` radius.
- **Background:** Cream page ground; sage fallbacks; subtle warm neutral behind image and cart surfaces.
- **Shadow Strategy:** Flat; no shadows.
- **Border:** Thin separators structure sections and lists; catalog cards stay open without a surrounding border. Homepage featured cards use a fine warm border.
- **Internal Padding:** Catalog product details begin with `13px` top padding; homepage featured-card details use compact `8px 9px 7px` padding.

### Inputs / Fields
- **Style:** Paper-filled selects and fields use a thin line border, square corners, and ink text.
- **Focus:** Global `:focus-visible` treatment is an ochre outline with `2px` stroke and `4px` offset.
- **Disabled:** Disabled purchase controls reduce opacity and use a disabled cursor; preview commerce remains unavailable.

### Navigation
- **Style:** A centered Playfair wordmark and a centered lower navigation row, with search at left and shop tools at right on desktop. Current links use forest color and a fine underline. On mobile the nav becomes a collapsible full-width vertical list beneath the compact utility row.

### Homepage Editorial Stack
The homepage signature is the centered logo header, full-bleed landscape hero, centered five-image category shelf, left-side Best Sellers introduction beside a horizontal product carousel, and a full-width benefits strip. At wide desktop widths, show four cards in the first view; the carousel shows three cards at intermediate widths and two on mobile. Each card places product type, title, and INR price beside a compact circular cart control. On mobile, center the introduction. Keep this sequence for the home surface; do not impose it on catalog or policy pages.

### Image and Product Cards
Catalog cards keep imagery open and text directly beneath it. Homepage featured cards use a restrained bordered paper panel with a wide image and compact product details. Product type, title, and localized INR price remain legible, with the cart action aligned beside the details. Preview items have a small paper badge, image zoom is restrained, and purchase actions remain disabled until live commerce is configured.

## Do's and Don'ts

### Do:
- **Do** use the CSS variables in `src/app/globals.css` as the canonical color source.
- **Do** preserve the centered wordmark and homepage section order.
- **Do** keep the home categories circular and all five visible across on narrow screens, matching the implementation.
- **Do** respect `prefers-reduced-motion` for scrolling and transitions.
- **Do** label preview imagery/copy and keep purchase controls disabled in preview mode.

### Don't:
- **Don't** add resting shadows; the system uses tonal fields and hairline rules for depth.
- **Don't** wrap catalog product cards in heavy panels or oversized rounded cards; reserve the small paper panel for the homepage featured-card variant.
- **Don't** use preview copy or imagery as verified product, ingredient, quality, or shipping claims.
- **Don't** enable checkout in local preview mode.
