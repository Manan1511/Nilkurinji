import { afterEach, describe, expect, it, vi } from "vitest";
import CollectionPage from "@/app/collections/[handle]/page";

describe("legacy tea collection routes", () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each([
    ["tea", "/shop?category=tea"],
    ["tea-bags", "/shop?category=tea-bags"],
  ])("forwards the retired %s page to the matching Shop filter", async (handle, destination) => {
    await expect(CollectionPage({ params: Promise.resolve({ handle }) })).rejects.toMatchObject({
      digest: expect.stringContaining(destination),
    });
  });

  it("does not serve retired non-tea collection routes", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");

    await expect(CollectionPage({ params: Promise.resolve({ handle: "rice" }) })).rejects.toThrow();
  });
});
