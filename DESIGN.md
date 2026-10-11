# Nilkurinji design system

Derived from the implemented responsive storefront and the two supplied Nilkurinji homepage PDFs.

## Visual direction

Quiet pantry editorial: generous warm-paper space, forest-green typography and controls, botanical ingredient imagery, an expressive serif for headlines, and measured sans-serif utility labels. Preserve the reference's centered wordmark, split hero, category ribbon, best-seller area, and full-width benefits band. Narrow screens stack these elements and keep category and product browsing legible.

## Foundations

- Surfaces: warm cream paper with a darker cream inset; avoid gradients and heavy shadows.
- Primary ink: deep forest green; secondary ink: softened green-grey.
- Accent: muted leaf green, used sparingly for status and detail.
- Lines: subtle olive/cream borders.
- Typography: high-contrast editorial serif for brand/title hierarchy; clean sans-serif for navigation, metadata, prices, controls, and body copy.
- Layout: wide centered content frame, large desktop gutters, compact mobile edges, thin separators, open image cards, consistent 5-column desktop category ribbon and 2-column mobile product grid.
- Motion: restrained transition and manual hero carousel; respect `prefers-reduced-motion`.

## Components

The site uses a centered wordmark header, accessible responsive menu, manual hero carousel, category ribbon, open product cards, editorial category tiles, dark benefits strip, compact content pages, mobile filter disclosure, native Shopify cart summary, and a three-column footer. Preview imagery/copy is labelled; purchase controls require live Shopify and checkout configuration.

## Implementation reference

Color variables, typography, spacing, breakpoints, and component styles are in `src/app/globals.css`. Home composition lives in `src/app/page.tsx`; shared shell components are in `src/components/`.
