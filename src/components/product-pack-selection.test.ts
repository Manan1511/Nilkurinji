// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { ProductPurchasePanel } from "./product-purchase-panel";
import { makeProduct, makeVariant } from "../../test/fixtures/storefront";

afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); window.history.replaceState({}, "", "/"); });

it("defaults to 500 g and updates the displayed price and URL when 1 kg is chosen", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const product = makeProduct({ variants: [
    makeVariant({ id: "gid://shopify/ProductVariant/1", selectedOptions: [{ name: "Pack size", value: "1 kg" }], price: { amount: "460", currencyCode: "INR" } }),
    makeVariant({ id: "gid://shopify/ProductVariant/2", selectedOptions: [{ name: "Pack size", value: "500 g" }], price: { amount: "240", currencyCode: "INR" } }),
  ] });
  const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(createElement(ProductPurchasePanel, { product, purchasingEnabled: false })));
  expect(host.querySelector<HTMLInputElement>('input[value="500 g"]')?.checked).toBe(true);
  expect(host.textContent).toContain("₹240");
  await act(async () => host.querySelector<HTMLInputElement>('input[value="1 kg"]')?.click());
  expect(host.querySelector<HTMLInputElement>('input[value="1 kg"]')?.checked).toBe(true);
  expect(host.textContent).toContain("₹460");
  expect(new URL(window.location.href).searchParams.get("variant")).toBe("1");
  await act(async () => root.unmount());
});
