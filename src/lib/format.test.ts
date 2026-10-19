import { describe, expect, it } from "vitest";
import { formatMoney } from "@/lib/format";

describe("storefront currency formatting", () => {
  it("omits decimal zeros for whole-rupee prices", () => {
    expect(formatMoney({ amount: "320.00", currencyCode: "INR" })).toBe("₹320");
  });

  it("keeps both paise digits for fractional prices", () => {
    expect(formatMoney({ amount: "320.50", currencyCode: "INR" })).toBe("₹320.50");
  });
});
