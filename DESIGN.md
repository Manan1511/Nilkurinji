---
name: Nilkurinji Storefront
description: An editorial tea and pantry storefront with a restrained green identity.
colors:
  forest: "#254434"
  forest-hover: "#1c3327"
  paper: "#fafbf8"
  paper-soft: "#f4f6f1"
  ink: "#242d24"
  ink-secondary: "#526356"
  divider: "#d7ded7"
  error: "#9f3434"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(48px, 4.6vw, 68px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(32px, 3vw, 44px)"
    fontWeight: 400
    lineHeight: 1.15
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  input:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  action:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  control: "2px"
spacing:
  page-gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
  input-search:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    padding: "8px 4px"
  navigation-primary:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  product-card:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
---

# Design System: Nilkurinji Storefront

## Overview

**Creative North Star: "The Considered Cup"**

Nilkurinji keeps its existing logo and forest-green identity. The interface uses editorial type for the product story, clear sans-serif controls for shopping, quiet surfaces, and product imagery as the main visual material. The storefront should feel deliberate through proportion, hierarchy, and alignment rather than ornamental volume.

The header is compact and consistent across routes. Search opens over the page in a desktop popover and in a mobile sheet. Shop, collections, product detail, and recommendations share the same open card language. Repeated botanical framing, a large masthead, and the circular category shelf were rejected for this redesign. Product packaging and preview prices remain illustrative until approved by the owner.

**Key Characteristics:**
- Keep the existing Nilkurinji mark and forest-green identity.
- Pair editorial Newsreader headings with Manrope shopping controls and body copy.
- Use calm, near-white surfaces, light dividers, and consistent product frames.
- Keep the shell compact and let search open without pushing the page down.
- Use merchant-approved photography and content when the live catalog is ready.

## Colors

The palette centers on forest green, clean near-white surfaces, and quiet green-grey text and dividers. Error red is reserved for actionable failures.

### Primary
- **Forest Green:** Main actions, active links, focus indicators, and brand accents.
- **Deep Forest:** Pressed and hover states for primary actions.

### Neutral
- **Paper:** Main page and component surface.
- **Soft Paper:** Quiet secondary surfaces and image frames.
- **Pantry Ink:** Main body and heading color.
- **Sage Ink:** Supporting copy, secondary prices, and subdued labels.
- **Fine Divider:** Borders and separators.

### Named Rules
**The Product-First Rule.** Use product, place, and people imagery to carry the brand story. Add decoration only when the approved direction gives it a clear role.

## Typography

**Display Font:** Newsreader (with Georgia and serif fallbacks); **Body Font:** Manrope (with Arial and sans-serif fallbacks); **Logo Font:** Playfair Display, kept inside the existing Nilkurinji lockup.

**Character:** Newsreader gives the page an editorial voice. Manrope keeps controls, filters, product details, and status messages easy to scan. The logo remains visually separate from both roles.

### Hierarchy
- **Display:** Fluid Newsreader hero heading with a close line height and a restrained negative tracking.
- **Headline:** Newsreader section and editorial headings.
- **Title:** Newsreader product names, with a smaller setting at mobile widths.
- **Body:** Manrope for paragraphs, descriptions, prices, and transactional details.
- **Label:** Manrope for controls and functional labels. Keep the interface readable at its rendered size; do not shrink labels to imitate luxury packaging.

### Named Rules
**The One Logo Rule.** Preserve the supplied wordmark as its own lockup. Do not restyle its lettering independently on individual routes.

## Layout

The page shell uses a shared centered container and a single responsive gutter. Gutter space increases from compact phones to tablet and wide desktop layouts. The header row is shorter below the desktop breakpoint; the preview notice is also reduced there. The product grid uses four columns at wide desktop, three at standard desktop, and two at compact widths.

The desktop homepage pairs copy with a tea image. On compact layouts, copy and its action come before the image. Product listing pages keep the same card proportions across Shop, collection, search, and related-product views. Mobile filters use a draft-and-apply sheet. Search is outside normal document flow so opening it does not add header height.

## Elevation & Depth

The system is flat at rest. Borders and subtle surface changes group content. The desktop search popover is the limited raised surface and uses a soft shadow; other sections do not gain elevation for decoration.

### Named Rules
**The Quiet Surface Rule.** Use contrast, spacing, and a fine divider before adding a shadow or enclosing every item in a card.

## Shapes

Controls and panels use a small, consistent corner radius. Product cards remain open rather than pill-shaped or heavily boxed. Images keep the product frame they need, while interactive icon controls use a consistent square target. Do not put circles behind transparent imagery by default; use a circle only when the component itself needs circular geometry.

## Components

### Buttons
- **Character:** Compact, direct actions with a clear primary/secondary distinction.
- **Shape:** Lightly softened control corners.
- **Primary:** Forest fill with paper text. Use the same sizing and label role across routes.
- **Secondary:** Clear background with forest text and a fine forest outline.
- **Text:** Use for lower-priority navigation with an underline or arrow only where it improves recognition.
- **Hover / Focus:** Darken the primary action on hover. Keep a visible focus outline on keyboard focus.

### Cards / Containers
- **Character:** Open image-and-copy product tiles with shared spacing and alignment.
- **Image:** Keep a stable portrait frame and contain product packaging so labels are not cropped.
- **Details:** Product name and price remain readable, even at narrow widths. Do not use sample prices without an explicit preview label.
- **Actions:** Keep wishlist and purchase controls aligned to the card content. Hide purchase controls in preview mode.

### Inputs / Fields
- **Character:** Quiet fields with one visible edge, legible text, and a clear focus state.
- **Search:** Preserve the query on close. Show predictive results and collection routes in an overlay rather than moving the page content.
- **Focus / Error:** Keep the global visible focus treatment. Explain recoverable search and form errors with text.

### Navigation
- **Desktop:** One compact row with a stable logo width, restrained active underline, and consistent utility controls.
- **Mobile:** Menu, centered identity, search, and cart remain within the compact row. Account and wishlist remain reachable through the menu.
- **Search:** Use a bounded desktop popover and a top-aligned mobile sheet sized to the visual viewport.

## Do's and Don'ts

### Do
- **Do** preserve the existing logo and forest-green identity.
- **Do** correct alignment at the shared component or token when the same defect appears on multiple routes.
- **Do** review the header at rest and with search open, on desktop and mobile.
- **Do** use clear product imagery, readable copy, and consistent product frames.
- **Do** keep reduced-motion support and visible keyboard focus.

### Don't
- **Don't** repeat leaf illustrations as a border or frame around page sections.
- **Don't** add a circle or oval behind transparent product/category imagery unless the approved composition calls for it.
- **Don't** let header, logo, or navigation sizing drift between routes.
- **Don't** use tiny copy, misaligned action icons, or inconsistent card geometry as decorative styling.
- **Don't** present concept images, sample prices, reviews, origin stories, or product claims as merchant-approved facts.
