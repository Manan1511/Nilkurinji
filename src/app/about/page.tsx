import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Heart, Leaf, Sprout } from "lucide-react";
import { CollectionHero } from "@/components/collection-hero";
import { getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";

export const metadata: Metadata = {
  title: "About Nilkurinji",
  description: "A journey rooted in nature, inspired by the Nilgiri hills.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { title: "Purity", description: "Only the finest, all-natural ingredients.", Icon: Leaf },
  { title: "Wellness", description: "Goodness in every cup and every moment.", Icon: Heart },
  { title: "Sustainability", description: "For a healthier planet and future.", Icon: Sprout },
  { title: "Authenticity", description: "True flavours, never compromised.", Icon: BadgeCheck },
];

const ABOUT_DRAFT = `<p>Inspired by the pristine landscapes of the Nilgiris, where the air is fresh, the soil is rich and nature still leads, Nilkurinji was born. What started as a passion for authentic, flavourful tea soon turned into a promise — to bring the finest, most natural tea to your cup.</p>`;

export default async function AboutPage() {
  const [result, mode] = await Promise.all([getPublishedPage("about"), Promise.resolve(getStorefrontMode())]);
  const isPreview = mode.mode === "preview";
  const page = result.source === "unavailable" ? null : result.data;
  const html = page?.body ? sanitizeMerchantHtml(page.body) : isPreview ? sanitizeMerchantHtml(ABOUT_DRAFT) : "";

  if (!isPreview) {
    return (
      <>
        <header className="page-header">
          <p className="eyebrow">A note from Nilkurinji</p>
          <h1 className="page-title">About us</h1>
        </header>
        <article className="content-page">
          {result.source === "unavailable" ? (
            <div className="notice-card" role="status">{result.reason}</div>
          ) : html ? (
            <div className="content-page__body" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="notice-card" role="status">Add the approved About page in Shopify Admin to show it here.</div>
          )}
        </article>
      </>
    );
  }

  return (
    <>
      <CollectionHero
        eyebrow="A story shaped by nature"
        heading="A Journey Rooted in Nature"
        description="At Nilkurinji, our story begins with a simple belief — that the purest flavours, the truest experiences, and the finest ingredients come from nature."
        image="/images/preview-hero-home.png"
        imageAlt="Concept tea still life overlooking the Nilgiri hills"
        ctaLabel="Our journey"
        ctaHref="#about-journey"
        className="about-hero"
      />
      <main className="about-page">
        <p className="about-page__notice">Preview story and concept imagery. Confirm brand, sourcing, wellness and sustainability claims before launch.</p>
        <section className="about-origin" id="about-journey" aria-labelledby="about-origin-title">
          <div className="about-origin__copy">
            <p className="eyebrow">Where it begins</p>
            <h2 id="about-origin-title">From the Misty Hills of Nilkurinji</h2>
            <div className="content-page__body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          <div className="about-origin__visual" aria-label="Tea leaves and an illustrative Nilkurinji tea tin">
            <div className="about-origin__image about-origin__image--leaves">
              <Image src="/images/category-tea.png" alt="Loose tea leaves in a ceramic bowl" fill sizes="(max-width: 760px) 80vw, 32vw" />
            </div>
            <div className="about-origin__image about-origin__image--tin">
              <Image src="/images/preview-product-assam-gold.png" alt="Illustrative Assam Gold Tea concept packaging" fill sizes="(max-width: 760px) 50vw, 22vw" />
            </div>
            <span className="about-origin__caption">Inspired by the Nilgiri hills</span>
          </div>
        </section>

        <section className="about-values" aria-label="Nilkurinji values">
          {VALUES.map(({ title, description, Icon }) => (
            <article className="about-value" key={title}>
              <Icon aria-hidden="true" />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="about-promise" aria-labelledby="about-promise-title">
          <Image src="/images/preview-hero-home.png" alt="" fill sizes="100vw" className="about-promise__image" />
          <div className="about-promise__veil" />
          <div className="about-promise__copy">
            <p className="eyebrow">The Nilkurinji promise</p>
            <h2 id="about-promise-title">Pure. Authentic. Timeless.</h2>
            <p>More than just a cup of tea — it’s a connection to nature, to tradition and to a better you.</p>
          </div>
        </section>
      </main>
    </>
  );
}
