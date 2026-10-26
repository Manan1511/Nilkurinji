// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ProductGrid } from "./product-grid";
import { makeProduct } from "../../test/fixtures/storefront";
it("keeps mobile filter edits draft until Apply and preserves attribution", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); }; HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  history.replaceState(null, "", "/shop?utm_source=mail");
  const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductGrid, { products: [makeProduct({ collectionHandles: ["tea-bags"], tags: ["type:black-tea"] })], emptyMessage: "No products" })));
  const open = () => host.querySelector<HTMLButtonElement>('button[aria-label="Open filters"]')!.click();
  await act(async () => open());
  let sheet = host.querySelector("dialog")!;
  expect(host.querySelector('button[aria-label="Open filters"]')!.getAttribute("aria-expanded")).toBe("true");
  expect(host.querySelector('button[aria-label="Open filters"]')!.getAttribute("aria-controls")).toBe("catalog-filter-panel");
  expect(sheet.id).toBe("catalog-filter-panel");
  expect(sheet.getAttribute("data-placement")).toBe("left");
  const selectPrice = async (value: string) => act(async () => {
    const select = sheet.querySelector<HTMLSelectElement>("select")!;
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await selectPrice("300-499");
  expect(location.search).toBe("?utm_source=mail");
  await act(async () => sheet.querySelector<HTMLButtonElement>('[aria-label="Close filters"]')!.click());
  await act(async () => open()); sheet = host.querySelector("dialog")!;
  expect(sheet.querySelector("select")!.value).toBe("all");
  await selectPrice("300-499");
  await act(async () => [...sheet.querySelectorAll("button")].find((button) => button.textContent === "Apply filters")!.click());
  expect(location.search).toContain("price=300-499"); expect(location.search).toContain("utm_source=mail"); expect(host.textContent).toContain("Test tea");
  const priceChip = host.querySelector<HTMLButtonElement>('button[aria-label="Remove price filter"]');
  expect(priceChip).not.toBeNull();
  await act(async () => priceChip!.click());
  expect(location.search).not.toContain("price=");
  expect(location.search).toContain("utm_source=mail");
  await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); history.replaceState(null, "", "/");
});
