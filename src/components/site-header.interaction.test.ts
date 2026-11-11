// @vitest-environment jsdom
import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/", useSearchParams: () => new URLSearchParams("") }));
vi.mock("next/form", () => ({ default: (props: ComponentProps<"form">) => createElement("form", props) }));

import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/components/cart-provider";
import { makeCart } from "../../test/fixtures/storefront";

describe("header search interaction", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { callback(0); return 1; });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ cart: makeCart(), purchasingEnabled: true }) }));
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(createElement(CartProvider, null, createElement(SiteHeader))));
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
    const trigger = element<HTMLButtonElement>('[aria-label="Open search"]');
    const panel = element<HTMLElement>("#header-search-panel");
    expect(panel.getAttribute("aria-hidden")).toBe("true");

    await act(async () => trigger.click());
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(element("#header-product-search"));

    await act(async () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(panel.getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps mobile navigation and search mutually exclusive", async () => {
    const search = element<HTMLButtonElement>('[aria-label="Open search"]');
    const menu = element<HTMLButtonElement>(".site-header__menu");
    await act(async () => menu.click());
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    expect(menu.getAttribute("aria-controls")).toBe("header-menu-panel");
    expect(element<HTMLDialogElement>("#header-menu-panel").getAttribute("data-placement")).toBe("left");
    expect(element<HTMLDialogElement>('dialog[aria-label="Menu"]').getAttribute("data-placement")).toBe("left");

    await act(async () => search.click());
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(element<HTMLElement>("#header-search-panel").getAttribute("aria-hidden")).toBe("false");

    await act(async () => menu.click());
    expect(element<HTMLElement>("#header-search-panel").getAttribute("aria-hidden")).toBe("true");
    expect(menu.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens a cart drawer from the shared cart controller", async () => {
    const trigger = element<HTMLButtonElement>('button[aria-label^="Shopping cart"]');
    expect(trigger.getAttribute("aria-label")).toContain("1 item");
    await act(async () => trigger.click());
    const drawer = element<HTMLDialogElement>("#header-cart-panel");
    expect(drawer.open).toBe(true);
    expect(drawer.textContent).toContain("Test tea");
  });

  it("preserves the submitted query and closes the disclosure on submission", async () => {
    await act(async () => element<HTMLButtonElement>('[aria-label="Open search"]').click());
    const input = element<HTMLInputElement>("#header-product-search");
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "green tea");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const form = input.form!;
    expect(form.getAttribute("action")).toBe("/shop");
    expect(new FormData(form).get("q")).toBe("green tea");
    await act(async () => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(element<HTMLElement>("#header-search-panel").getAttribute("aria-hidden")).toBe("true");
    expect(new FormData(form).get("q")).toBe("green tea");
  });

  it("dismisses on an outside pointer without stealing the visitor's focus", async () => {
    await act(async () => element<HTMLButtonElement>('[aria-label="Open search"]').click());
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    await act(async () => outside.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true })));
    expect(element<HTMLElement>("#header-search-panel").getAttribute("aria-hidden")).toBe("true");
    expect(document.activeElement).toBe(outside);
  });

  it("closes search when the visitor follows a primary navigation link", async () => {
    await act(async () => element<HTMLButtonElement>('[aria-label="Open search"]').click());
    const shop = element<HTMLAnchorElement>('nav[aria-label="Primary navigation"] a[href="/shop"]');
    shop.addEventListener("click", (event) => event.preventDefault(), { once: true });
    await act(async () => shop.click());
    expect(element<HTMLElement>("#header-search-panel").getAttribute("aria-hidden")).toBe("true");
  });

  it("returns focus to the visible search trigger when crossing to compact layout", async () => {
    await act(async () => root.unmount());
    let matches = false; const listeners = new Set<() => void>();
    vi.stubGlobal("matchMedia", () => ({ get matches() { return matches; }, addEventListener: (_: string, callback: () => void) => listeners.add(callback), removeEventListener: (_: string, callback: () => void) => listeners.delete(callback) }));
    root = createRoot(container); await act(async () => root.render(createElement(CartProvider, null, createElement(SiteHeader))));
    const trigger = element<HTMLButtonElement>('[aria-label="Open search"]');
    await act(async () => trigger.click()); expect(document.activeElement).toBe(element("#header-product-search"));
    await act(async () => { matches = true; listeners.forEach((listener) => listener()); });
    expect(document.activeElement).toBe(trigger); expect(trigger.getAttribute("aria-expanded")).toBe("false"); expect(document.body.style.overflow).not.toBe("hidden");
  });
});
