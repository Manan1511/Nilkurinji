# 02. Design system

## Measured palette

| Token | Value | Source/use |
|---|---|---|
| `paper` | `#F3EFE3` | B2 header and page ground |
| `paper-light` | `#F6F2E6` | Featured section ground |
| `card` | `#F1EEDF` | Product card body |
| `image-ground` | `#ECE0CA` | Product media ground |
| `forest` | `#163122` | Trust bar, footer, primary action |
| `ink` | `#142B1C` | Headings and strong text |
| `muted` | `#525346` | Body copy |
| `sage` | `#DEDFD1` | Supporting band |
| `rule` | `#D3CCBC` | Structural separators |
| `gold` | `#AAA07B` | Decorative strokes only |
| `control` | `#6F7768` | Functional border, added for contrast |
| `error` | `#9B342A` | Functional error colour |

Measured contrast: ink/paper ≈13.1:1; muted/paper ≈6.8:1; control/paper ≈4.0:1. Gold and pale rules must not carry essential meaning.

## Type

Closest screenshot matches: Libre Baskerville 400 for headings/navigation, Lato 400/700 for body/UI, Caveat 400 for short decorative script. Use the existing Playfair Display only for an approved wordmark if necessary. Self-host through `next/font`; retain licences. Confirm font and logo proof with the client.

| Role | Desktop / mobile |
|---|---|
| Home hero | 44px/1.0, 34px/1.08 |
| Banner heading | 48px/1.05, 34px/1.1 |
| Section heading | 30–32px/1.15, 26–28px/1.15 |
| Product title | 32px desktop detail, 28px mobile; cards 16px/15px |
| Body | 16px / 1.55; mobile line-height 1.6 |
| Supporting | 14px minimum |
| Eyebrow | 12px, `.18em` tracking |
| Script accent | 24–30px, decorative only |

## Tailwind v4

Declare measured colours, font variables, `--radius-card: .25rem`, `--radius-pill: 9999px`, 4px spacing base, standard 40/48/64/80/96rem breakpoints, and 88rem site container in CSS `@theme`. Use pill primary/secondary controls to match the reference; 44px minimum hit area and 48px primary purchase action. Inputs are at least 48px high with visible labels and strong borders. Cards use thin borders, warm media grounds, 4px corners and reserved landscape imagery.

Use Lucide for interface icons, 20–24px with consistent stroke. Product cards have no wishlist action. Use one reusable sprout, a clean footer botanical vector, distinct section-specific foliage images, subtle static paper texture and layered polaroid collage. Keep product photography colour-accurate. Motion: 160ms controls, 180ms nav underline, ≤3px arrows, ≤1.02 image zoom, 220–260ms drawers; obey reduced motion.
