import { describe, expect, it } from "vitest";
import { featuredProductsFirst, moveComingSoonTeaLast } from "./product-presentation";

describe("catalog order", () => {
  it("moves Masala Tea to the end without changing the order of other products", () => {
    const products = [
      { handle: "masala-tea", title: "Masala Tea" },
      { handle: "rose-tea", title: "Rose Tea" },
      { handle: "classic-tea", title: "Classic Tea" },
    ];
    expect(moveComingSoonTeaLast(products).map((product) => product.handle)).toEqual(["rose-tea", "classic-tea", "masala-tea"]);
    expect(products[0].handle).toBe("masala-tea");
  });

  it("puts the Classic product first and Masala last in featured order", () => {
    const products = [
      { handle: "masala-tea", title: "Masala Tea" },
      { handle: "rose-tea", title: "Rose Tea" },
      { handle: "premium-tea", title: "Nilkurinji Premium Classic Tea" },
      { handle: "elaichi-tea", title: "Elaichi Tea" },
    ];
    expect(featuredProductsFirst(products).map((product) => product.handle)).toEqual(["premium-tea", "rose-tea", "elaichi-tea", "masala-tea"]);
    expect(featuredProductsFirst(products.slice(0, 2)).map((product) => product.handle)).toEqual(["rose-tea", "masala-tea"]);
  });
});
