import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getPublishedPage } from "@/lib/shopify/content";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import styles from "./our-story-design.module.css";

const STORY_PARAGRAPHS = [
  "Established in April 2026, Nilkurinji Premium is a growing food brand built around a long-term vision: to bring thoughtfully selected products into everyday life.",
  "Our name draws inspiration from the Neelakurinji flower, famous for its rare bloom once every twelve years. Found across the majestic hills of Munnar in Kerala’s Western Ghats, these blue-purple flowers transform the mountain slopes into breathtaking carpets of colour. This extraordinary natural spectacle represents patience, rarity and the beauty of growth — values that inspire the identity of Nilkurinji Premium.",
  "Tea marks the beginning of our journey. As we expand into more food categories, our focus remains on building a consistent brand experience, understanding our customers and earning their trust at every step.",
  "Founded by Mr. Dhyanu Baweja and Mrs. Tarushi Baweja, Nilkurinji Premium is being built with a shared commitment to quality, continuous growth and lasting value.",
  "We are at the beginning of our journey, with a vision that reaches beyond a single product.",
];

export const metadata: Metadata = { title: "About Nilkurinji Premium", description: "Established in April 2026, Nilkurinji Premium is a growing food brand inspired by the rare Neelakurinji flower.", alternates: { canonical: "/our-story" } };
export const revalidate = 60;

function Ornament() {
  return <span className={styles.ornament} aria-hidden="true"><BrandMark /></span>;
}

export default async function OurStoryPage() {
  const result = await getPublishedPage("our-story");
  const page = result.source === "unavailable" ? null : result.data;
  const body = page?.body ? sanitizeMerchantHtml(page.body) : "";

  return <article className={styles.page}>
    <header className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Our Story</p>
        <h1>The Story Behind<br />Nilkurinji Premium</h1>
        <p className={styles.heroSubtitle}>Rooted in Nature. Built with Vision.</p>
        <Ornament />
      </div>
    </header>

    <section className={styles.inspiration} aria-labelledby="inspiration-heading">
      <div className={styles.inspirationCopy}>
        <p className={styles.eyebrow}>The inspiration</p>
        <h2 id="inspiration-heading">The Nilkurinji Flower</h2>
        <p>{STORY_PARAGRAPHS[1]}</p>
      </div>
    </section>

    <section className={styles.journey} aria-labelledby="journey-heading">
      <div className={styles.sectionHeading}><span /><h2 id="journey-heading">Our Journey</h2><span /></div>
      <div className={styles.journeyContent}>
        <div className={styles.teaImage} role="img" aria-label="A cup of tea with tea leaves" />
        <ol className={styles.timeline}>
          <li><span className={styles.timelineIcon} aria-hidden="true">✦</span><div><h3>April 2026</h3><p>{STORY_PARAGRAPHS[0]}</p></div></li>
          <li><span className={styles.timelineIcon} aria-hidden="true">♧</span><div><h3>Tea</h3><p>{STORY_PARAGRAPHS[2]}</p></div></li>
          <li><span className={styles.timelineIcon} aria-hidden="true">◇</span><div><h3>Beyond Tea</h3><p>{STORY_PARAGRAPHS[4]}</p></div></li>
        </ol>
      </div>
    </section>

    <section className={styles.founders} aria-labelledby="founders-heading">
      <div className={styles.sectionHeading}><span /><h2 id="founders-heading">The People Behind Nilkurinji</h2><span /></div>
      <Ornament />
      <div className={styles.foundersContent}>
        <div className={styles.founderNames}>
          <div><h3>Dhyanu<br />Baweja</h3><p>Founder</p></div>
          <div><h3>Tarushi<br />Baweja</h3><p>Co-founder</p></div>
        </div>
        <p>{STORY_PARAGRAPHS[3]}</p>
      </div>
      {body && <div className={styles.merchantStory} dangerouslySetInnerHTML={{ __html: body }} />}
    </section>

    <section className={styles.closing}>
      <p className={styles.closingLine}>A journey that begins with tea,<br />with much more yet to unfold.</p>
      <Ornament />
      <h2>Nilkurinji Premium</h2>
      <p className={styles.closingTagline}>Rare Taste of Nature.</p>
      <Link href="/shop" className={styles.shopLink}>Explore the shop <span aria-hidden="true">→</span></Link>
    </section>
  </article>;
}
