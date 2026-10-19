import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

import { SiteHeader } from "@/components/site-header";

describe("shared storefront header", () => {
  it("keeps the same header layout on home, shop, and collection pages", () => {
    const headerClasses = ["/", "/shop", "/collections/tea"].map((pathname) => {
      route.pathname = pathname;
      const markup = renderToStaticMarkup(createElement(SiteHeader));
      return markup.match(/<header class="([^"]+)"/)?.[1];
    });

    expect(headerClasses).toEqual(["site-header", "site-header", "site-header"]);
  });
});
