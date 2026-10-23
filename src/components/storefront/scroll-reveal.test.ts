// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { ScrollRevealObserver } from "./scroll-reveal";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

it("reveals a section once it enters view", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  let callback: IntersectionObserverCallback | null = null;
  let observed: Element | null = null;
  let unobserved: Element | null = null;
  class Observer {
    constructor(onChange: IntersectionObserverCallback) { callback = onChange; }
    observe(target: Element) { observed = target; }
    unobserve(target: Element) { unobserved = target; }
    disconnect() {}
    takeRecords() { return []; }
    root = null;
    rootMargin = "0px";
    thresholds = [0.08];
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  const host = document.createElement("div"); document.body.append(host);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 900, bottom: 1200, left: 0, right: 100, width: 100, height: 300, x: 0, y: 900, toJSON: () => ({}) } as DOMRect);
  const root = createRoot(host);
  await act(async () => root.render(createElement("div", null, createElement(ScrollRevealObserver), createElement("main", { id: "main-content" }, createElement("section", { "data-reveal": "section" })))));
  const section = host.querySelector("section")!;
  expect(section.dataset.revealState).toBe("waiting");
  expect(observed).toBe(section);
  const activeObserver = { unobserve: (target: Element) => { unobserved = target; } } as unknown as IntersectionObserver;
  await act(async () => callback?.([{ target: section, isIntersecting: true } as unknown as IntersectionObserverEntry], activeObserver));
  expect(section.dataset.revealState).toBe("visible");
  expect(unobserved).toBe(section);
  await act(async () => root.unmount());
});

it("leaves content visible when reduced motion is requested", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  const host = document.createElement("div"); document.body.append(host);
  const root = createRoot(host);
  await act(async () => root.render(createElement("div", null, createElement(ScrollRevealObserver), createElement("main", { id: "main-content" }, createElement("section", { "data-reveal": "section" })))));
  const section = host.querySelector("section")!;
  expect(section.dataset.revealState).toBeUndefined();
  await act(async () => root.unmount());
});

afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); });
