# 05. Responsive behaviour

| Width | Shell | Shop grid | Filters |
|---|---|---:|---|
| `<360px` | 72px compact | 1 | Left drawer |
| `360–767px` | 72px | 2 | Left drawer |
| `768–1023px` | 72px | 3 | Left drawer |
| `1024–1279px` | 124px two-row | 3 | 208px sidebar |
| `≥1280px` | 124px two-row | 4 | 224px sidebar |

Page gutters: 16px below 360, 20px through 767, 32px through 1023, 40px through 1279, 64px above. Site maximum 88rem.

Desktop header uses two rows with left search, fixed centred logo, right account/cart and centred nav. Mobile is a single 72px row with left menu, centred compact logo, search and cart. Mobile menu opens left, max 360px, has accessible Shop disclosure and includes Account and Contact. Touch targets remain at least 44px.

Banners are about 264px desktop and stack copy above 4:3 art on mobile. Art has explicit mobile crops/focal points and no baked-in text. Categories form a native horizontal rail with about 2.5 items visible on mobile. Carousel uses native touch scroll, 5/3/1.5 card visibility by breakpoint, and hides arrows when no overflow.

Filters apply immediately on desktop. Mobile drawer edits a draft and commits only on Apply; Cancel/Escape discards. Back/Forward restores URL state. Below 1024px, filters open left. Cart opens right, maximum 440px and full width below 640px with internal scrolling. Search is bounded/centred desktop and full-width mobile, with input/results accessible above virtual keyboard.

Only one overlay at a time. All support Escape, focus return, scroll lock and close on navigation. Crossing shell breakpoints closes overlays; crossing 768 closes filters and discards unapplied changes. Provider checkout closes the site modal first and is tested with UPI app switch/return. Product sticky purchase bar respects safe-area insets and never obscures checkout content. Story collage stacks and reduces rotation on phones; footer follows a meaningful reading order.
