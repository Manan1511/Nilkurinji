// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { CartPanel } from "./cart-panel";
import { makeCart } from "../../test/fixtures/storefront";
it("serializes cart mutations, blocks checkout and retains a row on failure", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); let complete!: (value: unknown) => void;
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ cart: makeCart(), purchasingEnabled: true }) }).mockImplementation(() => new Promise((resolve) => { complete = resolve; })); vi.stubGlobal("fetch", fetcher);
  const host = document.createElement("div"); document.body.append(host); const root = createRoot(host); await act(async () => root.render(createElement(CartPanel)));
  const remove = [...host.querySelectorAll("button")].find((button) => button.textContent?.includes("Remove"))!;
  const checkout = [...host.querySelectorAll("button")].find((button) => button.textContent?.includes("checkout"))!;
  await act(async () => { remove.click(); checkout.click(); }); expect(fetcher).toHaveBeenCalledTimes(2); expect(checkout.disabled).toBe(true);
  await act(async () => complete({ ok: false, json: async () => ({ error: "Stock changed. Refresh your cart." }) })); expect(host.textContent).toContain("Test tea"); expect(host.textContent).toContain("Stock changed"); expect(host.textContent).toContain("Refresh cart");
  await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals();
});
