import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makeProduct } from "../../test/fixtures/storefront";
import { ProductTeaGuide } from "./product-tea-guide";

describe("product tea guide", () => {
  it("shows the supplied guide for loose tea", () => {
    const html = renderToStaticMarkup(createElement(ProductTeaGuide, { product: makeProduct({ collectionHandles: ["tea"] }) }));
    expect(html).toContain("Rich Flavour");
    expect(html).toContain("1 tsp (2–3 g)");
    expect(html).toContain("150 ml");
    expect(html).toContain("3–5 minutes");
    expect(html).toContain("Strain and enjoy");
    expect(html).toContain("<details");
  });

  it("uses approved measurements when present", () => {
    const product = makeProduct({ collectionHandles: ["tea"], teaProfile: { approved: true, format: "loose-tea", origin: null, estate: null, elevationM: null, harvest: null, lot: null, tastingNotes: [], brewing: { dose: { amount: 2, unit: "g" }, waterMl: 220, temperatureC: null, steepSeconds: 180, infusions: null, instructions: "Steep to preference." } } });
    const html = renderToStaticMarkup(createElement(ProductTeaGuide, { product }));
    expect(html).toContain("220 ml");
    expect(html).toContain("Steep to preference.");
    expect(html).not.toContain("150 ml");
  });

  it("does not display tea features or instructions for other products", () => {
    expect(renderToStaticMarkup(createElement(ProductTeaGuide, { product: makeProduct({ collectionHandles: ["rice"] }) }))).toBe("");
  });

  it("shows rose preparation notes only for Rose Tea", () => {
    const rose = renderToStaticMarkup(createElement(ProductTeaGuide, { product: makeProduct({ handle: "rose-tea", collectionHandles: ["tea"] }) }));
    const classic = renderToStaticMarkup(createElement(ProductTeaGuide, { product: makeProduct({ handle: "premium-tea", collectionHandles: ["tea"] }) }));
    expect(rose).toContain("Avoid adding cardamom (elaichi).");
    expect(rose).toContain("Use less sugar.");
    expect(classic).not.toContain("Avoid adding cardamom");
  });
});
