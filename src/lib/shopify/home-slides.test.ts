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

  it("shows the manual Leaf, Water, Cup chapters with illustrative preview art", () => {
    const slides = buildHomepageSlides(true, DRAFT_HOMEPAGE_CONTENT);
    expect(slides).toHaveLength(3);
    expect(slides[0]).toMatchObject({
      id: "leaf",
      label: "Leaf",
      eyebrow: "NILKURINJI TEA",
      heading: "Make a little room for tea.",
      description: "Loose tea when you want to linger. Tea bags when you want to keep it simple.",
      image: "/images/leaf-to-cup/hero-leaf.webp",
      imageCaption: "Dry tea leaves",
      href: "/shop?category=tea",
    });
    expect(slides.map((slide) => slide.label)).toEqual(["Leaf", "Water", "Cup"]);
    expect(slides[0]?.imageAlt).toBe("Illustrative dry tea leaves in a ceramic dish");
    expect(slides[1]?.image).toBe("/images/leaf-to-cup/hero-water.webp");
    expect(slides[2]?.image).toBe("/images/leaf-to-cup/hero-cup.webp");
  });

  it("supports an approved second campaign without an unused eyebrow", () => {
    const slides = buildHomepageSlides(false, { ...DRAFT_HOMEPAGE_CONTENT, secondaryHeading: "Tea bags", secondaryDescription: "Explore the tea bag collection." });
    expect(slides).toHaveLength(2);
    expect(slides[1].heading).toBe("Tea bags");
  });
});
