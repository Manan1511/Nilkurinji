import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BotanicalEdges } from "@/components/botanical-edges";
import { getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import styles from "./our-story.module.css";

const STORY_TITLE = "About Nilkurinji Premium";
const STORY_TAGLINE = "Rooted in Nature. Built with Vision.";
const STORY_PARAGRAPHS = [
  "Established in April 2026, Nilkurinji Premium is a growing food brand built around a long-term vision: to bring thoughtfully selected products into everyday life.",
  "Our name draws inspiration from the Neelakurinji flower, famous for its rare bloom once every twelve years. Found across the majestic hills of Munnar in Kerala’s Western Ghats, these blue-purple flowers transform the mountain slopes into breathtaking carpets of colour. This extraordinary natural spectacle represents patience, rarity and the beauty of growth — values that inspire the identity of Nilkurinji Premium.",
  "Tea marks the beginning of our journey. As we expand into more food categories, our focus remains on building a consistent brand experience, understanding our customers and earning their trust at every step.",
  "Founded by Mr. Dhyanu Baweja and Mrs. Tarushi Baweja, Nilkurinji Premium is being built with a shared commitment to quality, continuous growth and lasting value.",
  "We are at the beginning of our journey, with a vision that reaches beyond a single product.",
];

export const metadata: Metadata = { title: STORY_TITLE, description: "Established in April 2026, Nilkurinji Premium is a growing food brand inspired by the rare Neelakurinji flower.", alternates: { canonical: "/our-story" } };
export const revalidate = 60;

export default async function OurStoryPage() {
  const [result, mode] = await Promise.all([getPublishedPage("our-story"), Promise.resolve(getStorefrontMode())]);
  const page = result.source === "unavailable" ? null : result.data;
  const body = page?.body ? sanitizeMerchantHtml(page.body) : "";
  const preview = mode.mode === "preview";
  return <article className={styles.page}>
    <header className={`${styles.hero} ${styles.heroTextOnly}`}>
      <Image className={styles.heroBackground} src="/images/our-story-mountains.webp" alt="" fill preload sizes="100vw" />
      <BotanicalEdges placement="story" textOnly />
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>NILKURINJI / OUR STORY</p>
        <h1>{page?.title || STORY_TITLE}</h1>
        <p className={styles.tagline}>{STORY_TAGLINE}</p>
      </div>
    </header>
    <section className={`${styles.story} ${!preview ? styles.storyTextOnly : ""}`} id="story">
      <div className={styles.storyCopy}>
        <p className={styles.eyebrow}>THE NILKURINJI STORY</p>
        {body ? <div className={styles.body} dangerouslySetInnerHTML={{ __html: body }} /> : <div className={styles.body}>{STORY_PARAGRAPHS.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
      </div>
      {preview && <div className={styles.collage} aria-label="Illustrative Nilkurinji concept imagery">
        <Image className={styles.photoOne} src="/images/preview-about-leaves.png" alt="Illustrative tea leaf concept image" width={640} height={800} quality={85} sizes="(max-width: 767px) 48vw, 270px" />
        <Image className={styles.photoTwo} src="/images/tea-hero-editorial.webp" alt="Illustrative tea landscape concept image" width={900} height={650} quality={85} sizes="(max-width: 767px) 48vw, 260px" />
        <span className={styles.collageNote}>Concept imagery</span>
      </div>}
    </section>
    <section className={styles.closing}>
      <p>Nilkurinji Premium</p>
      <h2>Rare Taste of Nature.</h2>
      <Link href="/shop" className="button button--outline">Explore the shop <span aria-hidden="true">→</span></Link>
    </section>
  </article>;
}
