# Homepage Reviews Continuous Carousel Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the five homepage customer reviews into a continuously gliding, leftward card row that pauses on hover.

**Architecture:** Keep the existing `ReviewRail` client component and review-card markup, replacing the stepped scroll controls with a duplicated, seamless CSS marquee. Measure the original group width to set a duration near 30 pixels per second; CSS pauses on hover and focus, while reduced-motion users get one static, scrollable group.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules.

**Spec:** `docs/superpowers/specs/2026-11-04-home-review-autoplay-design.md`

## Global Constraints

- Keep the homepage limited to the first five customer reviews.
- Glide continuously from right to left at approximately 30 pixels per second.
- Show roughly three cards on desktop and one full card with a peek of the next on phones.
- Pause on hover and keyboard focus; do not show arrows, a counter, or a separate pause/play button.
- Hide the duplicated loop group from assistive technology.
- Under reduced motion, stop autoplay and provide a manually scrollable static row.
- Do not add a carousel dependency or change the Journal archive.
- Do not add or run tests unless requested; verify with typecheck, lint, and manual viewport inspection.

## Review Focus

- The duplicated group must meet the original group edge exactly so the loop has no blank gap or jump; compare the seam during a full cycle.
- A hidden duplicate must not be announced twice; inspect the accessibility tree or screen-reader semantics.
- Hover and keyboard focus must freeze movement and release cleanly when they leave.
- At phone widths, a review photo and attribution must remain readable inside one full card plus the next-card peek.
- Reduced-motion preference must leave a usable, touch-scrollable single group with no automatic movement.

---

### Task 1: Continuous homepage review rail

**Files:**
- Modify: `src/components/home/review-rail.tsx`
- Modify: `src/components/home/home-reviews.module.css`
- Modify: `src/components/home/home-reviews.tsx`

**Interfaces:**
- Consumes: five review card children from `HomeReviews` and their `count`.
- Produces: a continuous leftward marquee with two visually identical groups, only the original exposed to assistive technology.

- [x] Replace `ReviewRail`'s active-index tracking and arrow/counter controls with a track containing the original children and one duplicate group. Give the duplicate group `aria-hidden="true"` and `inert`; remove unused per-slide IDs and stepped-carousel labels from `HomeReviews`.
- [x] Measure the original group's rendered width with `ResizeObserver` and set the track's duration so one group passes at approximately 30 pixels per second. Keep a safe CSS duration fallback before measurement.
- [x] Style cards to show about three across desktop and 84% of the viewport on phones. Animate the track continuously left; pause it on `:hover` and `:focus-within`. Remove the stepped counter and arrows.
- [x] Add a `prefers-reduced-motion` layout that stops animation, hides the duplicate group, and restores horizontal scrolling with snap points.
- [x] Run `npm run typecheck`, scoped ESLint, and `git diff --check`; confirm the local homepage serves the glide, pause, and reduced-motion rules. The test suite was not run.
- [ ] Inspect desktop and phone layouts in a browser for card density, readability, pause behavior, and a seamless loop. Browser screenshot inspection was unavailable in this session.
