import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makeProduct } from "../../test/fixtures/storefront";
import { TeaDetails } from "./tea-details";

describe("approved tea details", () => {
  it("renders approved notes and only available brewing measurements", () => {
    const product = makeProduct({ teaProfile: {
      approved: true,
      format: "loose-tea",
      origin: "Assam",
      estate: null,
      elevationM: null,
      harvest: null,
      lot: null,
      tastingNotes: ["malt", "cocoa"],
      brewing: { dose: { amount: 2, unit: "g" }, waterMl: 220, temperatureC: null, steepSeconds: 180, infusions: null, instructions: "Steep to preference." },
    } });
    const html = renderToStaticMarkup(createElement(TeaDetails, { product }));
    expect(html).toContain("Tasting notes");
    expect(html).toContain("malt");
    expect(html).toContain("220 ml");
    expect(html).toContain("2 g");
    expect(html).not.toContain("Temperature");
    expect(html).toContain("Steep to preference.");
  });

  it("does not invent product brewing details when the profile is absent", () => {
    expect(renderToStaticMarkup(createElement(TeaDetails, { product: makeProduct() }))).toBe("");
  });
});
