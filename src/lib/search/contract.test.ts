import { expect, it } from "vitest";
import { isPredictiveSearchPayload } from "./contract";
it("rejects malformed or inconsistent public payloads", () => {
  expect(isPredictiveSearchPayload({ status: "ok", items: null })).toBe(false);
  expect(isPredictiveSearchPayload({ status: "ok", source: "shopify", query: "tea", items: [{ id: "1", handle: "tea", title: "Tea", image: null, price: null, isPreview: true }], hasMore: false })).toBe(false);
  expect(isPredictiveSearchPayload({ status: "ok", source: null, query: "", items: [], hasMore: false })).toBe(true);
});
