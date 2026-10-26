import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import AccountPage from "@/app/account/page";

vi.mock("@/lib/shopify/customer-account-pages", () => ({ accountPageSession: vi.fn(async () => null) }));

describe("unavailable customer account page", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("explains account availability without exposing store configuration", async () => {
    vi.stubEnv("SHOPIFY_CUSTOMER_ACCOUNT_URL", "");
    const markup = renderToStaticMarkup(await AccountPage({ searchParams: Promise.resolve({}) }));

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("configured");
    expect(markup).toContain("View orders and manage your delivery addresses through your Nilkurinji account.");
    expect(markup).toContain("Continue to sign in");
    expect(markup).toContain('href="/shop"');
  });
});
