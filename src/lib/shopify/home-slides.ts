import type { HomepageContent } from "@/lib/shopify/content";
import { DRAFT_HOMEPAGE_CONTENT } from "@/lib/shopify/content";
import type { BannerSlide } from "@/components/banner-carousel";

export function buildHomepageSlides(preview: boolean, content: HomepageContent | null): BannerSlide[] {
  if (preview) {
    return [
      { id: "leaf", label: "Leaf", eyebrow: "NILKURINJI TEA", heading: DRAFT_HOMEPAGE_CONTENT.heading, description: DRAFT_HOMEPAGE_CONTENT.description, image: "/images/leaf-to-cup/hero-leaf.webp", imageAlt: "Illustrative dry tea leaves in a ceramic dish", imageCaption: "Dry tea leaves", href: "/shop?category=tea" },
      { id: "water", label: "Water", eyebrow: "NILKURINJI TEA", heading: DRAFT_HOMEPAGE_CONTENT.heading, description: DRAFT_HOMEPAGE_CONTENT.description, image: "/images/leaf-to-cup/hero-water.webp", imageAlt: "Illustrative tea leaves steeping in a glass teapot", imageCaption: "Tea infusing", href: "/shop?category=tea" },
      { id: "cup", label: "Cup", eyebrow: "NILKURINJI TEA", heading: DRAFT_HOMEPAGE_CONTENT.heading, description: DRAFT_HOMEPAGE_CONTENT.description, image: "/images/leaf-to-cup/hero-cup.webp", imageAlt: "Illustrative amber tea being poured into a ceramic cup beside loose tea", imageCaption: "A cup, just poured", href: "/shop?category=tea" },
    ];
  }
  if (!content) return [];

  if (content.ritualChapters?.length) return content.ritualChapters.map((chapter) => ({
    id: chapter.id,
    label: chapter.label,
    eyebrow: content.eyebrow || "NILKURINJI TEA",
    heading: content.heading,
    description: content.description,
    image: chapter.image.url,
    mobileImage: chapter.mobileImage?.url ?? null,
    imageAlt: chapter.altText,
    imageCaption: chapter.label,
    href: "/shop?category=tea",
  }));

  const slides: BannerSlide[] = [{
    id: "cup",
    label: "Cup",
    eyebrow: content.eyebrow,
    heading: content.heading,
    description: content.description,
    image: content.heroImage?.url ?? null,
    imageAlt: content.heroImage?.altText || "",
    imageCaption: content.heroImage ? "Featured image" : "",
    href: "/shop?category=tea",
  }];
  if (content.secondaryHeading && content.secondaryDescription) {
    slides.push({
      eyebrow: content.secondaryEyebrow ?? "",
      heading: content.secondaryHeading,
      description: content.secondaryDescription,
      image: content.secondaryImage?.url ?? null,
      imageAlt: content.secondaryImage?.altText || "",
      imageCaption: content.secondaryImage ? "Featured image" : "",
      href: "/shop?category=tea",
    });
  }
  return slides;
}
