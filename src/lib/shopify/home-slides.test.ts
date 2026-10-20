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

  it("uses neutral draft copy in the preview storefront", () => {
    const slides = buildHomepageSlides(true, DRAFT_HOMEPAGE_CONTENT);
    expect(slides).toHaveLength(1);
    expect(slides[0]).toMatchObject({
      eyebrow: "",
      heading: "A considered cup, every day.",
      description: "Explore Nilkurinji tea and tea bags for the moments that make a day.",
      image: "/images/preview-hero-home-v4.png",
      imageCaption: "",
      href: "/collections/tea",
    });
    expect(slides[0]?.imageAlt).toBe("Illustrative Nilkurinji tea scene with a tin and glass cup");
  });

  it("supports an approved second campaign without an unused eyebrow", () => {
    const slides = buildHomepageSlides(false, { ...DRAFT_HOMEPAGE_CONTENT, secondaryHeading: "Tea bags", secondaryDescription: "Explore the tea bag collection." });
    expect(slides).toHaveLength(2);
    expect(slides[1].heading).toBe("Tea bags");
  });
});
