# Homepage reviews continuous carousel

## Intent

Show the five homepage customer reviews as a continuously gliding row, matching the supplied video. This should make the section feel active while letting shoppers scan multiple reviews.

## Goals

- Flow review cards continuously from right to left and loop seamlessly.
- Show roughly three cards on desktop and one full card with a peek of the next on phones.
- Keep each review's current copy, attribution, and distinct photo together in its card.
- Pause movement on hover and while keyboard focus is within the carousel.
- Remove the current arrows and slide counter, which are designed for stepped slides.
- Under reduced-motion preferences, stop autoplay and provide a manually scrollable static row.

## Non-goals

- Do not change review text, photos, or the Journal review archive.
- Do not add a third-party carousel dependency or a separate pause/play button.

## Approaches

1. **Continuous CSS marquee using the existing review markup (chosen):** render the five cards as one horizontal group and duplicate the group for a seamless loop. CSS pauses the glide on hover/focus; the reduced-motion layout becomes a static scrollable row. This matches the supplied reference and keeps the implementation light.
2. **Timed slide carousel:** move one card at a time every few seconds. This preserves the existing step controls but does not match the requested continuous movement.
3. **Carousel library:** adds dependency and behavior the existing five-card section does not need.

## Implementation calls

- Keep the existing homepage-only scope and five-review limit.
- Use a gentle leftward speed close to the supplied video, approximately 30 pixels per second.
- Hide duplicated cards from assistive technology so screen readers encounter each review once.
- Pause on hover and keyboard focus. On phones, the continuous loop remains visible; reduced-motion users get a touch-scrollable static row.

## Verification

Run typecheck and lint. Do not run the test suite unless requested. Inspect desktop and phone layouts, verify three-card/one-plus-peek density, check the seamless loop, hover/focus pause, and the reduced-motion fallback.
