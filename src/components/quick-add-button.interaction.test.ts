// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { QuickAddButton } from "./quick-add-button";
import { makeProduct } from "../../test/fixtures/storefront";
it("queues different purchase controls until the previous cart response finishes", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); const finish: ((value: unknown) => void)[] = [];
  const fetcher = vi.fn(() => new Promise((resolve) => finish.push(resolve))); vi.stubGlobal("fetch", fetcher);
  const host = document.createElement("div"); const root = createRoot(host);
  await act(async () => root.render(createElement("div", {}, createElement(QuickAddButton, { product: makeProduct(), purchasingEnabled: true }), createElement(QuickAddButton, { product: makeProduct({ id: "second", title: "Second tea" }), purchasingEnabled: true }))));
  try {
    await act(async () => { host.querySelectorAll("button")[0].click(); host.querySelectorAll("button")[1].click(); });
    expect(fetcher).toHaveBeenCalledTimes(1);
    await act(async () => finish[0]({ ok: true, json: async () => ({}) })); expect(fetcher).toHaveBeenCalledTimes(2);
    await act(async () => finish[1]({ ok: false, json: async () => ({ error: "Stock changed. Please try again." }) }));
    expect(host.textContent).toContain("Added"); expect(host.textContent).toContain("Stock changed");
  } finally { await act(async () => root.unmount()); vi.unstubAllGlobals(); }
});
