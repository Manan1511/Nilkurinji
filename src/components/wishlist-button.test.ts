// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { readWishlist, WishlistButton } from "./wishlist-button";
afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); document.body.replaceChildren(); vi.unstubAllGlobals(); });
it("handles corrupt storage and deduplicates saved handles", () => { localStorage.setItem("nilkurinji-wishlist-v1", "bad"); expect(readWishlist()).toEqual([]); localStorage.setItem("nilkurinji-wishlist-v1", '["tea","tea",2,"../bad"]'); expect(readWishlist()).toEqual(["tea"]); });
it("reports denied writes without falsely saving the product", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(createElement(WishlistButton, { handle: "tea", title: "Green tea" })));
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("denied"); });
  await act(async () => host.querySelector("button")!.click());
  expect(host.querySelector("button")!.getAttribute("aria-pressed")).toBe("false"); expect(host.textContent).toContain("could not be saved"); await act(async () => root.unmount());
});
it("does not evict an existing saved product at the cap", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); const handles = Array.from({ length: 20 }, (_, i) => `tea-${i}`); localStorage.setItem("nilkurinji-wishlist-v1", JSON.stringify(handles));
  const host = document.createElement("div"); const root = createRoot(host); await act(async () => root.render(createElement(WishlistButton, { handle: "another" })));
  await act(async () => host.querySelector("button")!.click()); expect(readWishlist()).toEqual(handles); expect(host.textContent).toContain("Remove an item"); await act(async () => root.unmount());
});
