import type { ShopifyImage } from "@/lib/shopify/types";

type Pack = "500g" | "1kg";

// Source numbers match the client's originals in Nilkurinji-photos.
const sequences: Record<string, Record<Pack, readonly string[]>> = {
  "premium-tea": {
    "1kg": ["0286", "0287", "0288", "0290", "0289", "0291", "0292", "0293", "0294"],
    "500g": ["0309", "0310", "0311", "0312", "0316", "0313", "0314", "0317", "0294"],
  },
  "rose-tea": {
    "1kg": ["0479", "0287", "0480", "0484", "0481", "0485", "0482", "0478"],
    "500g": ["0490", "0310", "0487", "0489", "0488", "0486", "0491", "0493"],
  },
  "elaichi-tea": {
    "1kg": ["0494", "0287", "0495", "0498", "0496", "0292", "0497", "0493"],
    "500g": ["0503", "0310", "0499", "0502", "0500", "0292", "0501", "0493"],
  },
};

const fronts = new Set(["0286", "0309", "0479", "0490", "0494", "0503"]);
const backs = new Set(["0287", "0310"]);
const sides = new Set(["0288", "0311"]);
const packCampaigns = new Set(["0289", "0316", "0484", "0489", "0498", "0502"]);
const packLifestyle = new Set(["0293", "0317", "0482", "0491", "0497", "0501"]);
const leafImages = new Set(["0290", "0312", "0480", "0487", "0495", "0499"]);
const pouringImages = new Set(["0291", "0313", "0481", "0488", "0496", "0500"]);
const portraits = new Set(["0292", "0314", "0485", "0486"]);
export function curatedProductGallery(handle: string | undefined, pack: string | null | undefined, title: string): ShopifyImage[] | null {
  const normalized = pack?.toLowerCase().replace(/\s+/g, "");
  const size: Pack | null = normalized === "500g" || normalized === "0.5kg" ? "500g" : normalized === "1kg" || normalized === "1000g" ? "1kg" : null;
  const ids = handle && size ? sequences[handle]?.[size] : undefined;
  if (!ids || !size) return null;
  const label = `${title}, ${size === "500g" ? "500 g" : "1 kg"}`;
  return ids.map((id) => {
    const description = fronts.has(id) ? `Front of ${label} pack`
      : backs.has(id) ? `Back of Nilkurinji Premium Classic Tea, ${size === "500g" ? "500 g" : "1 kg"} pack`
        : sides.has(id) ? `Side of ${label} pack`
        : packCampaigns.has(id) ? `${label} pack with a cup of tea`
          : packLifestyle.has(id) ? `${label} pack beside a cup of tea`
            : leafImages.has(id) ? "Tea leaves being added to a pan"
              : pouringImages.has(id) ? "Tea being poured into a cup"
                : portraits.has(id) ? "A woman enjoying a cup of tea"
                  : "Purple flowers on a mountain hillside";
    return { url: `/images/client-supplied/gallery/img-${id}.webp`, altText: description, width: 1448, height: 1086 };
  });
}
