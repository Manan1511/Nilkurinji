import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DeliveryChecker } from "./delivery-checker";

describe("delivery checker", () => {
  it("offers a six-digit PIN check for live products", () => {
    const markup = renderToStaticMarkup(createElement(DeliveryChecker));
    expect(markup).toContain("Check Delivery");
    expect(markup).toContain('pattern="[0-9]{6}"');
  });

  it("explains that PIN checking is off in preview", () => {
    const markup = renderToStaticMarkup(createElement(DeliveryChecker, { preview: true }));
    expect(markup).toContain("PIN checking is not enabled in this preview.");
    expect(markup).not.toContain("<form");
  });
});
