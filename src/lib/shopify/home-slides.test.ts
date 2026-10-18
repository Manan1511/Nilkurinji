import { describe, expect, it } from "vitest";
import { DRAFT_HOMEPAGE_CONTENT } from "@/lib/shopify/content";
import { buildHomepageSlides } from "@/lib/shopify/home-slides";

describe("homepage carousel copy", () => {
  it("renders no marketing carousel copy when live Shopify content is unavailable", () => {
    expect(buildHomepageSlides(false, null)).toEqual([]);
  });

  it("uses only Shopify-provided live slide copy and omits an unconfigured second slide", () => {
    const slides = buildHomepageSlides(false, {
      eyebrow: "Approved eyebrow",
      heading: "Approved headline",
      description: "Approved description.",
      heroImage: null,
      secondaryImage: null,
      socialLinks: [],
    });
    expect(slides).toHaveLength(1);
    expect(slides[0]).toMatchObject({ eyebrow: "Approved eyebrow", heading: "Approved headline", description: "Approved description." });
    expect(slides[0]?.heading).not.toBe(DRAFT_HOMEPAGE_CONTENT.heading);
  });

  it("keeps the reference homepage hero as one clearly marked preview slide", () => {
    const slides = buildHomepageSlides(true, DRAFT_HOMEPAGE_CONTENT);
    expect(slides).toHaveLength(1);
    expect(slides[0]).toMatchObject({
      heading: "The Finest Flavours of India",
      image: "/images/preview-hero-home.png",
      imageCaption: "Generated concept image",
      href: "/shop",
    });
  });
});
