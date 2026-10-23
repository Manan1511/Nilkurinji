import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import AccountPage from "@/app/account/page";

describe("unavailable customer account page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("explains account availability without exposing store configuration", () => {
    vi.stubEnv("SHOPIFY_CUSTOMER_ACCOUNT_URL", "");
    const markup = renderToStaticMarkup(createElement(AccountPage));

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("configured");
    expect(markup).toContain("Customer account sign-in is not available right now.");
    expect(markup).toContain('href="/shop"');
  });
});
