// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ProductGallery } from "./product-gallery";
import { ProductVariantImageProvider, useProductVariantImage } from "./product-variant-image";
import { normalizeProduct } from "@/lib/shopify/normalize";
it("navigates the counter and handles missing images", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductGallery, { images: [{ url: "/images/category-tea.png", altText: "Tea", width: 100, height: 100 }, { url: "/images/category-tea-bags.png", altText: "Tea bags", width: 100, height: 100 }], title: "Tea" })));
  const counter = () => host.querySelector('[role="status"]')?.textContent;
  expect(counter()).toBe("1/2");
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]')!.click());
  expect(counter()).toBe("2/2");
  expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).toBe("Tea bags");
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]')!.click());
  expect(counter()).toBe("1/2");
  await act(async () => root.render(createElement(ProductGallery, { images: [], title: "Tea" })));
  expect(host.textContent).toContain("Product image coming soon");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});

it("shows only the selected pack's curated images", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const variants = { nodes: ["500 g", "1 kg"].map((value) => ({ id: value, title: value, availableForSale: true, price: { amount: "240", currencyCode: "INR" }, selectedOptions: [{ name: "Pack size", value }] })) };
  const product = normalizeProduct({ id: "1", handle: "elaichi-tea", title: "Elaichi Tea", description: "", variants });
  function Switcher() {
    const { setVariantId } = useProductVariantImage();
    return createElement("button", { onClick: () => setVariantId(product.variants[1].id) }, "Select 1 kg");
  }
  const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductVariantImageProvider, null, createElement(Switcher), createElement(ProductGallery, { images: product.images, variants: product.variants, handle: product.handle, title: product.title }))));
  const active = () => decodeURIComponent(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("src") ?? "");
  const next = () => host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]')!.click();
  expect(active()).toContain("img-0503.webp");
  await act(async () => next()); expect(active()).toContain("elaichi-500g-back.webp");
  await act(async () => next()); expect(active()).toContain("elaichi-500g-side.webp");
  await act(async () => host.querySelector("button")!.click());
  expect(active()).toContain("img-0494.webp");
  await act(async () => next()); expect(active()).toContain("elaichi-1kg-back.webp");
  await act(async () => next()); expect(active()).toContain("elaichi-1kg-side.webp");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});

it("advances for every rapid arrow press", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const host = document.createElement("div"); const root = createRoot(host);
  const images = ["One", "Two", "Three"].map((name) => ({ url: `/images/${name}.png`, altText: name, width: 100, height: 100 }));
  await act(async () => root.render(createElement(ProductGallery, { images, title: "Tea" })));
  const next = host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]');
  await act(async () => { next?.click(); next?.click(); });
  expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).toBe("Three");
  const previous = host.querySelector<HTMLButtonElement>('[aria-label="Previous product image"]');
  await act(async () => { previous?.click(); previous?.click(); });
  expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).toBe("One");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});

it("keeps the previous image in place until the next image loads", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const host = document.createElement("div"); document.body.appendChild(host); const root = createRoot(host);
  const images = ["One", "Two"].map((name) => ({ url: `/images/${name}.png`, altText: name, width: 100, height: 100 }));
  await act(async () => root.render(createElement(ProductGallery, { images, title: "Tea" })));
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]')?.click());
  const previous = host.querySelector('img[aria-hidden="true"]');
  const active = host.querySelector<HTMLImageElement>('img:not([aria-hidden="true"])');
  expect(previous).not.toBeNull();
  expect(active?.getAttribute("alt")).toBe("Two");
  expect(active?.parentElement?.className).toContain("imageWaiting");
  await act(async () => { active?.dispatchEvent(new Event("load")); await Promise.resolve(); });
  expect(active?.parentElement?.className).toContain("imageEntering");
  await act(async () => active?.parentElement?.dispatchEvent(new Event("animationend", { bubbles: true })));
  expect(host.querySelector('img[aria-hidden="true"]')).toBeNull();
  await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals();
});

it("displays the requested Classic Tea sequence after changing packs", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const variants = { nodes: ["500 g", "1 kg"].map((value) => ({ id: value, title: value, availableForSale: true, price: { amount: "240", currencyCode: "INR" }, selectedOptions: [{ name: "Pack size", value }] })) };
  const product = normalizeProduct({ id: "1", handle: "premium-tea", title: "Classic Tea", description: "", variants });
  function Switcher() {
    const { setVariantId, setImageUrl } = useProductVariantImage();
    return createElement("button", { onClick: () => { setVariantId(product.variants[1].id); setImageUrl(product.variants[1].image?.url ?? null); } }, "Select 1 kg");
  }
  const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductVariantImageProvider, null, createElement(Switcher), createElement(ProductGallery, { images: product.images, variants: product.variants, handle: product.handle, title: product.title }))));
  expect(decodeURIComponent(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("src") ?? "")).toContain("img-0309.webp");
  await act(async () => host.querySelector("button")?.click());
  const expected = ["img-0286.webp", "classic-1kg-back.webp", "classic-1kg-side.webp", "img-0289.webp", "img-0290.webp", "img-0291.webp", "img-0292.webp", "img-0293.webp", "img-0294.webp"];
  expect(host.querySelector('[role="status"]')?.textContent).toBe("1/9");
  for (let i = 0; i < expected.length; i++) {
    expect(decodeURIComponent(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("src") ?? "")).toContain(expected[i]);
    if (i < expected.length - 1) await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]')!.click());
  }
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});
