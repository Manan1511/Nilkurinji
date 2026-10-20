// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { usePredictiveSearch } from "./use-predictive-search";
let result: ReturnType<typeof usePredictiveSearch>;
let root: Root;
function Probe({ query, enabled = true }: { query: string; enabled?: boolean }) { result = usePredictiveSearch(query, enabled); return null; }
const payload = (query: string) => ({ status: "ok", source: "shopify", query, items: [], hasMore: false });
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); root = createRoot(document.createElement("div")); });
afterEach(async () => { await act(async () => root.unmount()); vi.useRealTimers(); vi.unstubAllGlobals(); });
it("debounces and makes no short/closed requests", async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => payload("tea") }); vi.stubGlobal("fetch", fetcher);
  await act(async () => root.render(createElement(Probe, { query: "t" })));
  await act(async () => vi.advanceTimersByTimeAsync(400)); expect(fetcher).not.toHaveBeenCalled();
  await act(async () => root.render(createElement(Probe, { query: "tea" })));
  await act(async () => vi.advanceTimersByTimeAsync(299)); expect(fetcher).not.toHaveBeenCalled();
  await act(async () => vi.advanceTimersByTimeAsync(1)); expect(fetcher).toHaveBeenCalledTimes(1); expect(result.status).toBe("empty");
  await act(async () => root.render(createElement(Probe, { query: "rice", enabled: false })));
  await act(async () => vi.advanceTimersByTimeAsync(400)); expect(fetcher).toHaveBeenCalledTimes(1);
});
it("ignores late responses even when transport ignores abort", async () => {
  let resolveOld!: (v: unknown) => void;
  const fetcher = vi.fn().mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; })).mockResolvedValue({ ok: true, json: async () => payload("green") }); vi.stubGlobal("fetch", fetcher);
  await act(async () => root.render(createElement(Probe, { query: "tea" }))); await act(async () => vi.advanceTimersByTimeAsync(300));
  await act(async () => root.render(createElement(Probe, { query: "green" }))); await act(async () => vi.advanceTimersByTimeAsync(300));
  await act(async () => resolveOld({ ok: true, json: async () => ({ ...payload("tea"), items: [{ id: "old", handle: "old", title: "Old", image: null, price: null, isPreview: false }] }) }));
  expect(result.status).toBe("empty"); expect(result.items).toEqual([]);
});
it("exposes malformed/failed response and retry without caching errors", async () => {
  const fetcher = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ items: null }) }).mockResolvedValue({ ok: true, json: async () => payload("tea") }); vi.stubGlobal("fetch", fetcher);
  await act(async () => root.render(createElement(Probe, { query: "tea" }))); await act(async () => vi.advanceTimersByTimeAsync(300)); expect(result.status).toBe("error");
  await act(async () => result.retry()); await act(async () => vi.advanceTimersByTimeAsync(300)); expect(result.status).toBe("empty"); expect(fetcher).toHaveBeenCalledTimes(2);
});
it("reuses successful queries for 60 seconds and expires them", async () => {
  const fetcher = vi.fn().mockImplementation(async (url: string) => ({ ok: true, json: async () => payload(new URL(url, "http://localhost").searchParams.get("q")!) })); vi.stubGlobal("fetch", fetcher);
  await act(async () => root.render(createElement(Probe, { query: "tea" }))); await act(async () => vi.advanceTimersByTimeAsync(300));
  await act(async () => root.render(createElement(Probe, { query: "tea", enabled: false })));
  await act(async () => root.render(createElement(Probe, { query: "tea" }))); expect(fetcher).toHaveBeenCalledTimes(1);
  await act(async () => root.render(createElement(Probe, { query: "tea", enabled: false }))); await act(async () => vi.advanceTimersByTimeAsync(60_001));
  await act(async () => root.render(createElement(Probe, { query: "tea" }))); await act(async () => vi.advanceTimersByTimeAsync(300)); expect(fetcher).toHaveBeenCalledTimes(2);
});
it("bounds the successful cache to 20 queries", async () => {
  const fetcher = vi.fn().mockImplementation(async (url: string) => ({ ok: true, json: async () => payload(new URL(url, "http://localhost").searchParams.get("q")!) })); vi.stubGlobal("fetch", fetcher);
  for (let index = 0; index < 21; index++) { await act(async () => root.render(createElement(Probe, { query: `tea-${index}` }))); await act(async () => vi.advanceTimersByTimeAsync(300)); }
  await act(async () => root.render(createElement(Probe, { query: "tea-0" }))); await act(async () => vi.advanceTimersByTimeAsync(300)); expect(fetcher).toHaveBeenCalledTimes(22);
});
