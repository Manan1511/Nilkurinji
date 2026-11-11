import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { curatedProductGallery } from "./product-gallery";

describe("curated product gallery order", () => {
  it.each([
    ["premium-tea", "1 kg", "0286 0289 0290 0291 0292 0293 0294"],
    ["premium-tea", "500 g", "0309 0316 0312 0313 0314 0317 0294"],
    ["rose-tea", "1 kg", "0479 0287 0480 0484 0481 0485 0482 0478"],
    ["rose-tea", "500 g", "0490 0310 0487 0489 0488 0486 0491 0493"],
    ["elaichi-tea", "1 kg", "0494 0287 0495 0498 0496 0292 0497 0493"],
    ["elaichi-tea", "500 g", "0503 0310 0499 0502 0500 0292 0501 0493"],
  ])("keeps %s %s in the requested order", (handle, size, expected) => {
    const images = curatedProductGallery(handle, size, "Nilkurinji Tea");
    const originalIds = expected.split(" ");
    if (handle !== "premium-tea") originalIds.splice(1, 1);
    expect(images?.filter((image) => !/-side(?:-centered)?\.webp$/.test(image.url) && !image.url.endsWith("-back.webp")).map((image) => image.url.match(/img-(\d+)\.webp/)?.[1])).toEqual(originalIds);
    for (const image of images ?? []) expect(existsSync(join(process.cwd(), "public", image.url))).toBe(true);
  });

  it("leaves other products and unrecognised pack sizes to Shopify", () => {
    expect(curatedProductGallery("other", "500 g", "Tea")).toBeNull();
    expect(curatedProductGallery("premium-tea", "250 g", "Tea")).toBeNull();
  });

  it.each([
    ["premium-tea", "500 g", "0309"], ["premium-tea", "1 kg", "0286"],
    ["rose-tea", "500 g", "0490"], ["rose-tea", "1 kg", "0479"],
    ["elaichi-tea", "500 g", "0503"], ["elaichi-tea", "1 kg", "0494"],
  ])("uses the refined front for %s %s", (handle, size, id) => {
    expect(curatedProductGallery(handle, size, "Nilkurinji Tea")?.[0].url)
      .toBe(`/images/client-supplied/refined/img-${id}.webp`);
  });

  it.each([
    ["500 g", "classic-500g-back.webp", "classic-500g-side-centered.webp", 9],
    ["1 kg", "classic-1kg-back.webp", "classic-1kg-side.webp", 9],
  ])("uses the matching refined Classic back and side for %s", (size, back, side, count) => {
    const images = curatedProductGallery("premium-tea", size, "Nilkurinji Premium Classic Tea");
    expect(images?.[1].url).toBe(`/images/client-supplied/refined/${back}`);
    expect(images?.[2].url).toBe(`/images/client-supplied/refined/${side}`);
    expect(images).toHaveLength(count);
  });

  it.each([
    ["rose-tea", "500 g", "rose-500g-back.webp"],
    ["rose-tea", "1 kg", "rose-1kg-back.webp"],
    ["elaichi-tea", "500 g", "elaichi-500g-back.webp"],
    ["elaichi-tea", "1 kg", "elaichi-1kg-back.webp"],
  ])("uses the matching refined back for %s %s", (handle, size, filename) => {
    expect(curatedProductGallery(handle, size, "Nilkurinji Tea")?.[1].url).toContain(filename);
  });

  it.each([
    ["rose-tea", "500 g", "rose-500g-side.webp"],
    ["rose-tea", "1 kg", "rose-1kg-side.webp"],
    ["elaichi-tea", "500 g", "elaichi-500g-side.webp"],
    ["elaichi-tea", "1 kg", "elaichi-1kg-side.webp"],
  ])("shows the matching illustrative side after the back for %s %s", (handle, size, filename) => {
    const images = curatedProductGallery(handle, size, "Nilkurinji Tea");
    expect(images).toHaveLength(9);
    expect(images?.[2].url).toContain(filename);
  });
});
