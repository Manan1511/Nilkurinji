// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ProductGallery } from "./product-gallery";
it("identifies selected gallery thumbnails and handles missing images", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductGallery, { images: [{ url: "/images/category-tea.png", altText: "Tea", width: 100, height: 100 }, { url: "/images/category-tea-bags.png", altText: "Tea bags", width: 100, height: 100 }], title: "Tea" })));
  await act(async () => host.querySelectorAll("button")[1].click()); expect(host.querySelectorAll("button")[1].getAttribute("aria-pressed")).toBe("true"); expect(host.querySelectorAll("button")[0].getAttribute("aria-pressed")).toBe("false");
  await act(async () => root.render(createElement(ProductGallery, { images: [], title: "Tea" }))); expect(host.textContent).toContain("Product image coming soon"); await act(async () => root.unmount()); vi.unstubAllGlobals();
});
