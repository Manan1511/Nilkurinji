// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ProductCard } from "./product-card";
import { normalizeProduct } from "@/lib/shopify/normalize";

it("changes both the front and alternate artwork when the selected pack changes", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const variants = { nodes: ["500 g", "1 kg"].map((value) => ({ id: value, title: value, availableForSale: true, price: { amount: "240", currencyCode: "INR" }, selectedOptions: [{ name: "Pack size", value }] })) };
  const product = normalizeProduct({ id: "1", handle: "elaichi-tea", title: "Elaichi Tea", description: "", variants });
  const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductCard, { product })));
  const imageSources = () => [...host.querySelectorAll("img")].map((image) => decodeURIComponent(image.getAttribute("src") ?? ""));
  expect(imageSources()[0]).toContain("elaichi-500g-front.webp");
  expect(imageSources()[1]).toContain("elaichi-500g-card-alt.webp");
  await act(async () => host.querySelector<HTMLButtonElement>('button[aria-label^="1 kg,"]')?.click());
  expect(imageSources()[0]).toContain("elaichi-1kg-front.webp");
  expect(imageSources()[1]).toContain("elaichi-1kg-card-alt.webp");
  await act(async () => root.unmount()); vi.unstubAllGlobals();
});
