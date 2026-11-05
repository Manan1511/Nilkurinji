# Product Gallery Dots Implementation Plan

> **For agentic workers:** Use the approved design note and make only the focused gallery changes below.

**Goal:** Replace product detail photo thumbnails with accessible photo dots and touch swipe navigation.

**Architecture:** Extend the existing `ProductGallery` client component with dot buttons and touch gesture handling. Keep the current Next Image main photo, CSS module, and gallery image state.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-11-05-product-gallery-dots-design.md`

## Global Constraints

- Use the existing Next.js Image component and CSS module; add no dependency.
- Keep the main product photo and image ordering unchanged.
- Dot buttons select their corresponding photo and expose an accessible name and selected state.
- Horizontal swipes change one photo at a time; vertical page scrolling remains available.
- Do not change product-card hover imagery, product data, product page layout, or image aspect ratios.
- Respect reduced-motion preferences through existing image transitions.
- With one photo, render no dots; preserve the existing empty-gallery state.

## Review Focus

- A one-image product must not gain a meaningless dot or swipe state.
- Vertical touch movement must remain normal page scrolling.
- Dot controls must expose the active image to assistive technology.

---

### Task 1: Replace product thumbnails with dot and swipe navigation

**Files:**
- Modify: `src/components/product-gallery.tsx`
- Modify: `src/components/product-gallery.module.css`
- Leave unchanged: `src/components/product-gallery.test.ts`

**Interfaces:**
- Consumes: existing `ProductGallery({ images: ShopifyImage[], title: string })` props and `activeIndex` state.
- Produces: one accessible dot button per image and horizontal touch navigation on the main-image region.

- [x] Replace the image thumbnail buttons with small buttons labeled “Show product photo N of TOTAL”; expose the active item with `aria-pressed`.
- [x] Add touch-start/end handling to the main image region; change one image after a horizontal gesture of at least 40px, and ignore predominantly vertical gestures.
- [x] Set the main image region to allow vertical panning while handling horizontal swipes; preserve current aspect ratios and reduced-motion styling.
- [x] Keep dots hidden for zero/one-image states and preserve the existing empty-gallery message.
- [x] Review the final diff to confirm only the gallery component and its stylesheet changed for the gallery task.

**Acceptance:** Multiple photos can be selected by dots or horizontal touch swipes; a single photo shows no dots; the empty gallery message remains intact. No tests are added or run for this focused change.
