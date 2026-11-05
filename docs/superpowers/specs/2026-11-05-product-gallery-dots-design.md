# Product Gallery Dots Design

## Intent

On product detail pages, remove the row of photo thumbnails beneath the main image. Keep the photos available through compact, clickable dot controls and horizontal swiping, especially on phones.

## Scope

- Change only the product detail gallery component and its styling.
- Keep the main product photo and image ordering unchanged.
- Render one accessible dot per available photo; selecting a dot changes the main photo.
- Support horizontal touch swipes on the main photo area to move between photos.
- Do not change product-card hover imagery, product data, or the product page layout.
- When there is only one photo, show no navigation dots and do not add swipe behavior.

## Approaches considered

1. **Dots plus swipe navigation (selected):** removes thumbnail clutter while retaining access to each photo and a familiar mobile gesture.
2. **First photo only:** visually simplest, but hides additional product views and gives shoppers no way to inspect them.
3. **Keep thumbnails and add dots:** retains the photo strip the user asked to replace.

The user selected clickable dots and swipe support.

## Interaction and accessibility

- Dots are real buttons with labels such as “Show product photo 2 of 4” and expose the selected state.
- Touch swipes change one photo at a time; vertical page scrolling remains available.
- Reduced-motion preferences continue to be respected by the existing image transition.

## Constraints and non-goals

- Use the existing Next.js Image component and CSS module; add no dependency.
- No changes to cart, checkout, product cards, image sources, or gallery aspect ratios.
- No autoplay or added arrows.

## Acceptance

- Multiple photos appear as the main image with one dot per photo.
- Clicking a dot selects its photo.
- A horizontal touch swipe changes photos without blocking vertical scrolling.
- One-photo and no-photo states continue to render correctly.
