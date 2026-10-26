# 09. Asset inventory

## Delivery rules

Use original masters outside `public`, optimise AVIF/WebP, preserve alpha for cutouts, record alt text/crop/focal point, and avoid text baked into imagery. Generated packaging is never sold as real packaging. Preview assets remain non-purchasable. Every final asset requires client approval.

## Required image families

| IDs | Use | Master guidance | Source |
|---|---|---|---|
| H01–H02 | Home desktop/mobile hero | 2400×420 wide; 1200×900 mobile | Generated lifestyle, tea scene right/pale left |
| H03–H08 | Shop all + five category banners | 2400×420 | Generated lifestyle matching each approved department |
| H09–H11 | Tea Guide, Recipes, Journal banners | 2400×420 | Generated editorial scene, no claims/text |
| H12–H13 | Story hero/closing | 2400×420 and 2400×360 | Generic landscape, not proof of estate ownership |
| C01–C05 | Five category medallions | 512×512 | Tea, tea bag, rice, snacks, other foods; transparent subject over measured ground |
| P01–P20 | Client product fronts | ≥1600×1600 | Client-supplied; actual product/pack |
| P01L–P20L | Product labels/back panels | ≥1600×2000 | Client-supplied readable legal details |
| S01–S02 | Story collage | 1000×1100 | Generic tea landscape/leaf study, no provenance inference |
| E01–E11 | Editorial cards | 1200×750, near 8:5 | Generated only for approved article topics/ingredients |
| D01–D08 | Section-specific tea leaf edge art | Eight transparent PNG masters; responsive WebP derivatives capped at 1024px | Individual asymmetrical left/right compositions for header, homepage hero, category row and editorial banners. Masters: `design/masters/botanical/`; WebP: `public/images/botanical/`. Do not reuse the homepage pair across all sections or mirror a single sprig. |
| O01 | Social image | 1200×630 | Compose approved artwork plus separately rendered logo |

Common generation prompt: photorealistic editorial food photography matching supplied Nilkurinji references, warm cream/forest palette, directional daylight, tactile stone/linen, natural shadows, no text, logo, invented package, glossy fantasy effects. H01 reserves the left 40% clear and places cup/landscape/real pack area to the right. Category art depicts the actual category without unsupported ingredients. E06–E08 require approved recipe data.

## Vector, icon and fonts

Create SVG sprout, full/inverse/compact logo proofs, one line-art branch, neutral collage stamp, paper grain/backing and checkout logo export. Use Lucide for interface icons and official verified social marks. Self-host Libre Baskerville 400, Lato 400/700 and Caveat 400 through `next/font`; retain licence files.

## Placeholder strategy

Development uses a labelled non-purchasable fixture catalog. Missing photos reserve the correct ratio with warm neutral ground and title. Missing category artwork retains its name. Never use broken-image glyphs or preview data as a live fallback. Production launch requires approved live imagery and actual catalog entry.
