import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "@/app/about/page";
import { StoreNotice } from "@/components/store-notice";

describe("legacy About route", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("permanently redirects the old About URL to the approved Our Story route", () => {
    try {
      AboutPage();
      throw new Error("Expected permanentRedirect to stop rendering.");
    } catch (error) {
      expect((error as { digest?: string }).digest).toBe("NEXT_REDIRECT;replace;/our-story;308;");
    }
  });

  it("shows preview status visibly and states that purchases are disabled", () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(StoreNotice());

    expect(markup).toContain("Design preview.");
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Purchases disabled");
  });

});
