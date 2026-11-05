// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ProductGallery } from "./product-gallery";
import { ProductVariantImageProvider, useProductVariantImage } from "./product-variant-image";
import { normalizeProduct } from "@/lib/shopify/normalize";
it("identifies selected gallery thumbnails and handles missing images", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductGallery, { images: [{ url: "/images/category-tea.png", altText: "Tea", width: 100, height: 100 }, { url: "/images/category-tea-bags.png", altText: "Tea bags", width: 100, height: 100 }], title: "Tea" })));
  const dots = host.querySelectorAll<HTMLButtonElement>('[aria-label^="Show product photo"]');
  await act(async () => dots[1].click()); expect(dots[1].getAttribute("aria-pressed")).toBe("true"); expect(dots[0].getAttribute("aria-pressed")).toBe("false");
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Next product image"]')?.click()); expect(dots[0].getAttribute("aria-pressed")).toBe("true");
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Previous product image"]')?.click()); expect(dots[1].getAttribute("aria-pressed")).toBe("true");
  await act(async () => root.render(createElement(ProductGallery, { images: [], title: "Tea" }))); expect(host.textContent).toContain("Product image coming soon"); await act(async () => root.unmount()); vi.unstubAllGlobals();
});

it("shows the selected pack and shared images without the other pack", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const variants = { nodes: ["500 g", "1 kg"].map((value) => ({ id: value, title: value, availableForSale: true, price: { amount: "240", currencyCode: "INR" }, selectedOptions: [{ name: "Pack size", value }] })) };
  const product = normalizeProduct({ id: "1", handle: "elaichi-tea", title: "Elaichi Tea", description: "", variants });
  function Switcher() {
    const { setVariantId, setImageUrl } = useProductVariantImage();
    return createElement("button", { onClick: () => { setVariantId(product.variants[1].id); setImageUrl(product.variants[1].image?.url ?? null); } }, "Select 1 kg");
  }
  const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductVariantImageProvider, null, createElement(Switcher), createElement(ProductGallery, { images: product.images, variants: product.variants, title: product.title }))));
  expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).toContain("500 g");
  expect(host.querySelectorAll('[aria-label^="Show product photo"]')).toHaveLength(5);
  const shown500: string[] = [];
  for (const dot of host.querySelectorAll<HTMLButtonElement>('[aria-label^="Show product photo"]')) {
    await act(async () => dot.click());
    expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).not.toContain("1 kg");
    shown500.push(decodeURIComponent(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("src") ?? ""));
  }
  expect(shown500.some((src) => src.includes("elaichi-500g-card-alt.webp"))).toBe(true);
  await act(async () => host.querySelector("button")?.click());
  expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).toContain("1 kg");
  expect(host.querySelectorAll('[aria-label^="Show product photo"]')).toHaveLength(5);
  const shown1kg: string[] = [];
  for (const dot of host.querySelectorAll<HTMLButtonElement>('[aria-label^="Show product photo"]')) {
    await act(async () => dot.click());
    expect(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("alt")).not.toContain("500 g");
    shown1kg.push(decodeURIComponent(host.querySelector('img:not([aria-hidden="true"])')?.getAttribute("src") ?? ""));
  }
  expect(shown1kg.some((src) => src.includes("elaichi-1kg-card-alt.webp"))).toBe(true);
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
  expect(active?.className).toContain("imageWaiting");
  await act(async () => { active?.dispatchEvent(new Event("load")); await Promise.resolve(); });
  expect(active?.className).toContain("imageEntering");
  await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals();
});
