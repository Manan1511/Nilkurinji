"use client";
import { useEffect, useRef, useState } from "react";
import { isPredictiveSearchPayload, type SearchSuggestion } from "@/lib/search/contract";
import { isEligibleSearchQuery, normalizeSearchQuery, SEARCH_DEBOUNCE_MS } from "@/lib/search/query";
type State = { query: string; status: "idle" | "waiting" | "loading" | "results" | "empty" | "error"; items: SearchSuggestion[]; hasMore: boolean; message: string };
const initial: State = { query: "", status: "idle", items: [], hasMore: false, message: "" };
export function usePredictiveSearch(rawQuery: string, enabled: boolean) {
  const query = normalizeSearchQuery(rawQuery);
  const [state, setState] = useState<State>(initial);
  const [attempt, setAttempt] = useState(0);
  const cache = useRef(new Map<string, { expires: number; value: State }>());
  useEffect(() => {
    if (!enabled || !isEligibleSearchQuery(query)) { setState({ ...initial, query }); return; }
    let active = true;
    const controller = new AbortController();
    const cached = cache.current.get(query);
    if (cached && cached.expires > Date.now()) { setState(cached.value); return; }
    setState({ ...initial, query, status: "waiting" });
    const timer = window.setTimeout(async () => {
      setState({ ...initial, query, status: "loading" });
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store", signal: controller.signal });
        const body: unknown = await response.json();
        if (!active) return;
        if (!response.ok || !isPredictiveSearchPayload(body) || body.status !== "ok" || body.query !== query) throw new Error("Search is temporarily unavailable. Please try again.");
        const value: State = { query, status: body.items.length ? "results" : "empty", items: body.items, hasMore: body.hasMore, message: "" };
        cache.current.delete(query);
        cache.current.set(query, { expires: Date.now() + 60_000, value });
        if (cache.current.size > 20) cache.current.delete(cache.current.keys().next().value!);
        setState(value);
      } catch {
        if (active && !controller.signal.aborted) setState({ ...initial, query, status: "error", message: "Search is temporarily unavailable. Please try again." });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => { active = false; controller.abort(); window.clearTimeout(timer); };
  }, [query, enabled, attempt]);
  const visible = !enabled || !isEligibleSearchQuery(query) ? initial : state.query === query ? state : { ...initial, status: "waiting" as const };
  return { ...visible, retry: () => { cache.current.delete(query); setAttempt((value) => value + 1); } };
}
