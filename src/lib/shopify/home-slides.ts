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
        image: "/images/preview-hero-home-v4.png",
        imageAlt: "Illustrative Nilkurinji tea scene with a tin and glass cup",
        imageCaption: "",
        href: "/collections/tea",
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
    href: "/collections/tea",
  }];
  if (content.secondaryHeading && content.secondaryDescription) {
    slides.push({
      eyebrow: content.secondaryEyebrow ?? "",
      heading: content.secondaryHeading,
      description: content.secondaryDescription,
      image: content.secondaryImage?.url ?? null,
      imageAlt: content.secondaryImage?.altText || "",
      imageCaption: content.secondaryImage ? "Featured image" : "",
      href: "/collections/tea",
    });
  }
  return slides;
}
