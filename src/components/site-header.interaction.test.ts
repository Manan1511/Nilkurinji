// @vitest-environment jsdom
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/form", () => ({ default: (props: ComponentProps<"form">) => createElement("form", props) }));

import { SiteHeader } from "@/components/site-header";

describe("header search interaction", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ cart: null }) }));
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(createElement(SiteHeader)));
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  const element = <T extends HTMLElement>(selector: string): T => {
    const target = container.querySelector<T>(selector);
    if (!target) throw new Error(`Missing element: ${selector}`);
    return target;
  };

  it("opens a real search field on desktop and restores focus when Escape closes it", async () => {
    const trigger = element<HTMLButtonElement>(".site-header__search-trigger");
    const panel = element<HTMLElement>("#header-search-panel");
    expect(panel.hidden).toBe(true);

    await act(async () => trigger.click());
    expect(panel.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(element("#header-product-search"));

    await act(async () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps mobile navigation and search mutually exclusive", async () => {
    const search = element<HTMLButtonElement>(".site-tools__search");
    const menu = element<HTMLButtonElement>(".site-header__menu");
    await act(async () => menu.click());
    expect(menu.getAttribute("aria-expanded")).toBe("true");

    await act(async () => search.click());
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(element<HTMLElement>("#header-search-panel").hidden).toBe(false);

    await act(async () => menu.click());
    expect(element<HTMLElement>("#header-search-panel").hidden).toBe(true);
    expect(menu.getAttribute("aria-expanded")).toBe("true");
  });

  it("preserves the submitted query and closes the disclosure on submission", async () => {
    await act(async () => element<HTMLButtonElement>(".site-header__search-trigger").click());
    const input = element<HTMLInputElement>("#header-product-search");
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "green tea");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const form = input.form!;
    expect(form.getAttribute("action")).toBe("/search");
    expect(new FormData(form).get("q")).toBe("green tea");
    await act(async () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(element<HTMLElement>("#header-search-panel").hidden).toBe(true);
    expect(new FormData(form).get("q")).toBe("green tea");
  });

  it("dismisses on an outside pointer without stealing the visitor's focus", async () => {
    await act(async () => element<HTMLButtonElement>(".site-header__search-trigger").click());
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    await act(async () => outside.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true })));
    expect(element<HTMLElement>("#header-search-panel").hidden).toBe(true);
    expect(document.activeElement).toBe(outside);
  });

  it("closes search when the visitor follows a primary navigation link", async () => {
    await act(async () => element<HTMLButtonElement>(".site-header__search-trigger").click());
    const shop = element<HTMLAnchorElement>('nav[aria-label="Primary navigation"] a[href="/shop"]');
    shop.addEventListener("click", (event) => event.preventDefault(), { once: true });
    await act(async () => shop.click());
    expect(element<HTMLElement>("#header-search-panel").hidden).toBe(true);
  });
});
