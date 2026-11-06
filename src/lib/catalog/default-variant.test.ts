import { describe, expect, it } from "vitest";
import { defaultVariant } from "./default-variant";
import type { StorefrontVariant } from "@/lib/shopify/types";

function variant(id: string, pack: string, availableForSale = true): StorefrontVariant {
  return { id, title: pack, availableForSale, quantityAvailable: null, price: { amount: "240", currencyCode: "INR" }, compareAtPrice: null, selectedOptions: [{ name: "Pack size", value: pack }], image: null };
}

describe("default pack selection", () => {
  const variants = [variant("gid://shopify/ProductVariant/1", "1 kg"), variant("gid://shopify/ProductVariant/2", "500 g")];
  it("prefers 500 g even when Shopify returns 1 kg first", () => expect(defaultVariant(variants)?.id).toBe(variants[1].id));
  it("honours an explicitly requested variant, even if sold out", () => expect(defaultVariant([variant(variants[0].id, "1 kg", false), variants[1]], "1")?.id).toBe(variants[0].id));
  it("falls back to an available pack when 500 g is sold out", () => expect(defaultVariant([variants[0], variant(variants[1].id, "500 g", false)])?.id).toBe(variants[0].id));
});
