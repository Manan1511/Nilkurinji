import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("@/lib/shopify/mode", () => ({ getStorefrontMode: vi.fn() }));
vi.mock("@/lib/shopify/server", () => ({ getBuyerIp: vi.fn(() => undefined), shopifyQuery: vi.fn() }));

import { getStorefrontMode } from "@/lib/shopify/mode";
import { shopifyQuery } from "@/lib/shopify/server";
import { POST } from "./route";

const request = (pincode: string) => new Request("http://localhost/api/delivery", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pincode }),
});

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllGlobals());

describe("delivery serviceability endpoint", () => {
  it("rejects malformed PIN codes before reading Shopify", async () => {
    const response = await POST(request("123"));
    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(shopifyQuery).not.toHaveBeenCalled();
  });

  it("keeps PIN checks unavailable in preview mode", async () => {
    vi.mocked(getStorefrontMode).mockReturnValue({ mode: "preview" });
    const response = await POST(request("110001"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null });
    expect(shopifyQuery).not.toHaveBeenCalled();
  });

  it("returns unknown when the merchant has not published serviceability data", async () => {
    vi.mocked(getStorefrontMode).mockReturnValue({ mode: "live", storeDomain: "nilkurinji.myshopify.com", apiVersion: "2026-10", privateToken: "private-token-for-test" });
    vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: null });
    const response = await POST(request("110001"));
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe("unknown");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
});
