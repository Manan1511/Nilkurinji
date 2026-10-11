import type { HomepageContent } from "@/lib/shopify/content";
import { DRAFT_HOMEPAGE_CONTENT } from "@/lib/shopify/content";
import type { BannerSlide } from "@/components/banner-carousel";

export function buildHomepageSlides(preview: boolean, content: HomepageContent | null): BannerSlide[] {
  if (preview) {
    return [
      {
        eyebrow: DRAFT_HOMEPAGE_CONTENT.eyebrow,
        heading: DRAFT_HOMEPAGE_CONTENT.heading,
        description: DRAFT_HOMEPAGE_CONTENT.description,
        image: "/images/hero-preview.png",
        imageAlt: "An unbranded tea tin and glass cup in a botanical still life, shown as concept artwork",
        imageCaption: "Generated concept image",
        href: "/shop",
      },
      {
        eyebrow: "Find your everyday",
        heading: "A pantry for the moments that matter.",
        description: "Explore the shelves: tea, rice, snacks and the good things in between.",
        image: "/images/category-tea-bags.png",
        imageAlt: "A cup of tea and an unbranded sachet in a sunlit still life",
        imageCaption: "Generated concept image",
        href: "/collections/other-foods",
      },
    ];
  }
  if (!content) return [];

  const slides: BannerSlide[] = [{
    eyebrow: content.eyebrow,
    heading: content.heading,
    description: content.description,
    image: content.heroImage?.url ?? null,
    imageAlt: content.heroImage?.altText || "",
    imageCaption: content.heroImage ? "Featured image" : "",
    href: "/shop",
  }];
  if (content.secondaryEyebrow && content.secondaryHeading && content.secondaryDescription) {
    slides.push({
      eyebrow: content.secondaryEyebrow,
      heading: content.secondaryHeading,
      description: content.secondaryDescription,
      image: content.secondaryImage?.url ?? null,
      imageAlt: content.secondaryImage?.altText || "",
      imageCaption: content.secondaryImage ? "Featured image" : "",
      href: "/shop",
    });
  }
  return slides;
}
