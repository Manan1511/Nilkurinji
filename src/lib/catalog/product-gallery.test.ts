import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { curatedProductGallery } from "./product-gallery";

describe("curated product gallery order", () => {
  it.each([
    ["premium-tea", "1 kg", "0286 0287 0299 0289 0290 0291 0292 0293 0294"],
    ["premium-tea", "500 g", "0309 0310 0321 0316 0312 0313 0314 0317 0294"],
    ["rose-tea", "1 kg", "0479 0480 0484 0487 0481 0485 0482 0478"],
    ["rose-tea", "500 g", "0490 0487 0489 0480 0488 0486 0491 0493"],
    ["elaichi-tea", "1 kg", "0494 0495 0498 0499 0496 0292 0497 0493"],
    ["elaichi-tea", "500 g", "0503 0499 0502 0495 0500 0292 0501 0493"],
  ])("keeps %s %s in the requested order", (handle, size, expected) => {
    const images = curatedProductGallery(handle, size, "Nilkurinji Tea");
    expect(images?.map((image) => image.url.match(/img-(\d+)\.webp/)?.[1])).toEqual(expected.split(" "));
    for (const image of images ?? []) expect(existsSync(join(process.cwd(), "public", image.url))).toBe(true);
  });

  it("leaves other products and unrecognised pack sizes to Shopify", () => {
    expect(curatedProductGallery("other", "500 g", "Tea")).toBeNull();
    expect(curatedProductGallery("premium-tea", "250 g", "Tea")).toBeNull();
  });
});
