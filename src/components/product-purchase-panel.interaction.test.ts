// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { ProductPurchasePanel } from "./product-purchase-panel";
import { makeProduct, makeVariant } from "../../test/fixtures/storefront";
afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); });
it("submits the selected variant once and locks options during a pending add", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); let finish!: (value: unknown) => void;
  const fetcher = vi.fn(() => new Promise((resolve) => { finish = resolve; })); vi.stubGlobal("fetch", fetcher);
  const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
  const product = makeProduct({ variants: [makeVariant(), makeVariant({ id: "second", selectedOptions: [{ name: "Size", value: "200 g" }], price: { amount: "640", currencyCode: "INR" } })] });
  await act(async () => root.render(createElement(ProductPurchasePanel, { product, purchasingEnabled: true })));
  await act(async () => { const select = host.querySelector("select")!; select.value = "200 g"; select.dispatchEvent(new Event("change", { bubbles: true })); });
  expect(host.textContent).toContain("₹640");
  const add = [...host.querySelectorAll("button")].find((button) => button.textContent?.includes("Add to cart"))!;
  await act(async () => { add.click(); add.click(); }); expect(fetcher).toHaveBeenCalledTimes(1); expect(JSON.parse((fetcher.mock.calls as unknown as [string, RequestInit][])[0][1].body as string).variantId).toBe("second");
  expect(host.querySelector("select")!.disabled).toBe(true);
  await act(async () => finish({ ok: false, json: async () => ({ error: "Stock changed. Try another option." }) })); expect(host.textContent).toContain("Stock changed"); expect(host.querySelector("select")!.value).toBe("200 g"); await act(async () => root.unmount());
});
