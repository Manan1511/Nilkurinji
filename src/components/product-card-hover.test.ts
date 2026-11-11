// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ProductCard } from "./product-card";
import { normalizeProduct } from "@/lib/shopify/normalize";
import { makeProduct, makeVariant } from "../../test/fixtures/storefront";

it("shows the default pack artwork and directs multi-pack shoppers to choose a pack", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const variants = { nodes: ["500 g", "1 kg"].map((value) => ({ id: value, title: value, availableForSale: true, price: { amount: "240", currencyCode: "INR" }, selectedOptions: [{ name: "Pack size", value }] })) };
  const product = normalizeProduct({ id: "1", handle: "elaichi-tea", title: "Elaichi Tea", description: "", variants });
  const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductCard, { product })));
  const imageSources = () => [...host.querySelectorAll("img")].map((image) => decodeURIComponent(image.getAttribute("src") ?? ""));
  expect(imageSources()[0]).toContain("img-0503.webp");
  expect(imageSources()[1]).toContain("elaichi-500g-card-alt.webp");
  expect(host.querySelector('button[aria-label^="1 kg,"]')).toBeNull();
  const choosePack = [...host.querySelectorAll("a")].find((link) => link.textContent === "Choose pack");
  expect(choosePack?.getAttribute("href")).toBe("/products/elaichi-tea");
  expect(host.textContent).not.toContain("Buy now");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});

it("shows direct add to cart for a single pack without a redundant buy button", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const host = document.createElement("div"); const root = createRoot(host);
  const product = makeProduct({ variants: [makeVariant()] });
  await act(async () => root.render(createElement(ProductCard, { product, cartEnabled: true })));
  expect([...host.querySelectorAll("button")].some((button) => button.textContent?.includes("Add to cart") && !button.disabled)).toBe(true);
  expect(host.textContent).not.toContain("Buy now");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});

it("shows coming soon as a separate status below the product link", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const host = document.createElement("div"); const root = createRoot(host);
  const product = makeProduct({ comingSoon: true, variants: [], featuredImage: null });
  await act(async () => root.render(createElement(ProductCard, { product })));
  const status = [...host.querySelectorAll("p")].find((element) => element.textContent === "Coming Soon!");
  expect(status).toBeDefined();
  expect(status?.closest("a, button")).toBeNull();
  expect(host.textContent).not.toContain("Add to cart");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});
