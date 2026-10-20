// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { WishlistProducts } from "./wishlist-products";
import { makeProduct } from "../../test/fixtures/storefront";
afterEach(() => { localStorage.clear(); document.body.replaceChildren(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("keeps available products and lets visitors remove a missing saved entry", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); localStorage.setItem("nilkurinji-wishlist-v1", '["test-tea","gone"]'); vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ products: [makeProduct()] }) }));
  const host = document.createElement("div"); document.body.append(host); const root = createRoot(host); await act(async () => root.render(createElement(WishlistProducts, { purchasingEnabled: false })));
  expect(host.textContent).toContain("Test tea"); expect(host.textContent).toContain("Saved product unavailable");
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Remove unavailable saved product from wishlist"]')!.click());
  expect(JSON.parse(localStorage.getItem("nilkurinji-wishlist-v1")!)).toEqual(["test-tea"]); expect(host.textContent).not.toContain("Saved product unavailable"); await act(async () => root.unmount());
});
it("distinguishes unavailable saved products from a never-saved list", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); localStorage.setItem("nilkurinji-wishlist-v1", '["gone"]'); vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ products: [] }) }));
  const host = document.createElement("div"); const root = createRoot(host); await act(async () => root.render(createElement(WishlistProducts, { purchasingEnabled: false }))); expect(host.textContent).toContain("Your saved products are unavailable"); await act(async () => root.unmount());
});
