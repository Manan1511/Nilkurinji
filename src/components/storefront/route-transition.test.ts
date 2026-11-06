// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { RouteTransition } from "./route-transition";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); navigation.pathname = "/"; });

it("plays and clears the fallback arrival when the route changes", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.useFakeTimers();
  const host = document.createElement("div");
  const root = createRoot(host);
  await act(async () => root.render(createElement(RouteTransition, null, "Home")));
  expect(host.querySelector("main")?.className).not.toContain("entering");
  navigation.pathname = "/shop";
  await act(async () => root.render(createElement(RouteTransition, null, "Shop")));
  expect(host.querySelector("main")?.className).toContain("entering");
  await act(async () => vi.advanceTimersByTime(300));
  expect(host.querySelector("main")?.className).not.toContain("entering");
  await act(async () => root.unmount());
});
