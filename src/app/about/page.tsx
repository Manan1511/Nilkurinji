import type { Metadata } from "next";
import Image from "next/image";
import { Handshake, Heart, Leaf, Star } from "lucide-react";
import { BotanicalFrame } from "@/components/botanical-frame";
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
  { title: "Sustainability", description: "For a healthier planet and future.", Icon: Handshake },
  { title: "Authenticity", description: "True flavours, never compromised.", Icon: Star },
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
        eyebrow="Our story"
        heading={"A Journey\nRooted in Nature"}
        description="At Nilkurinji, our story begins with a simple belief — that the purest flavours, the truest experiences, and the finest ingredients come from nature."
        image="/images/preview-hero-tea.webp"
        imageAlt="Illustrative tea cup and loose leaves overlooking misty Nilgiri hills"
        ctaLabel="Our journey"
        ctaHref="#about-journey"
        className="about-hero"
        sideNote={"More Than\nJust Tea"}
        annotation={"Pure Leaves\nTrue Flavours\nTimeless"}
      />
      <div className="about-page">
        <section className="about-origin" id="about-journey" aria-labelledby="about-origin-title">
          <BotanicalFrame className="botanical-frame--about-origin" />
          <div className="about-origin__copy" data-scroll-reveal="rise">
            <p className="eyebrow">Where it begins</p>
            <h2 id="about-origin-title">From the Misty Hills of Nilkurinji</h2>
            <div className="content-page__body" dangerouslySetInnerHTML={{ __html: html }} />
            <p className="about-origin__script-note">Pure by Nature,<br />Crafted for You.</p>
          </div>
          <div className="about-origin__visual" aria-label="A visual story of the Nilgiri hills and tea leaves">
            <div className="about-origin__image about-origin__image--hills" data-scroll-reveal="photo-left">
              <Image src="/images/preview-hero-tea.webp" alt="Illustrative tea garden and cup in the Nilgiri hills" fill sizes="(max-width: 760px) 60vw, 28vw" />
            </div>
            <aside className="about-origin__note" data-scroll-reveal="note">
              <Leaf aria-hidden="true" />
              <h3>Born in the Nilgiris</h3>
              <p>Where every leaf carries a story and every cup feels like home.</p>
            </aside>
            <div className="about-origin__seal" aria-hidden="true">
              <span>Nilkurinji</span>
              <Leaf />
            </div>
            <div className="about-origin__image about-origin__image--harvest" data-scroll-reveal="photo-right">
              <Image src="/images/preview-about-leaves.png" alt="Concept photograph of fresh tea leaves held above a Nilgiri tea garden" fill sizes="(max-width: 760px) 60vw, 28vw" />
            </div>
          </div>
        </section>

        <section className="about-values" aria-label="Nilkurinji values">
          <div className="about-values__intro" data-scroll-reveal="rise">
            <p className="eyebrow">Our values</p>
            <h2>Rooted in What Matters</h2>
          </div>
          {VALUES.map(({ title, description, Icon }, index) => (
            <article className="about-value" key={title} data-scroll-reveal="value" data-scroll-reveal-delay={index * 55}>
              <Icon aria-hidden="true" />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
          <aside className="about-values__aside" aria-label="Good tea, better days">
            <Leaf aria-hidden="true" />
            <p>Good Tea<br />Better Days</p>
          </aside>
        </section>

        <section className="about-promise" aria-labelledby="about-promise-title">
          <Image src="/images/preview-hero-home.png" alt="" fill sizes="100vw" className="about-promise__image" />
          <div className="about-promise__veil" />
          <div className="about-promise__copy" data-scroll-reveal="rise">
            <p className="eyebrow">The Nilkurinji promise</p>
            <h2 id="about-promise-title">Pure. Authentic. Timeless.</h2>
            <p>More than just a cup of tea — it’s a connection to nature, to tradition and to a better you.</p>
          </div>
        </section>
      </div>
    </>
  );
}
