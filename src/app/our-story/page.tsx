import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BotanicalEdges } from "@/components/botanical-edges";
import { getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import styles from "./our-story.module.css";

export const metadata: Metadata = { title: "Our Story", description: "The Nilkurinji story.", alternates: { canonical: "/our-story" } };
export const revalidate = 60;

export default async function OurStoryPage() {
  const [result, mode] = await Promise.all([getPublishedPage("our-story"), Promise.resolve(getStorefrontMode())]);
  const page = result.source === "unavailable" ? null : result.data;
  const body = page?.body ? sanitizeMerchantHtml(page.body) : "";
  const preview = mode.mode === "preview";
  return <article className={styles.page}>
    <header className={styles.hero}>
      <BotanicalEdges placement="story" />
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>NILKURINJI / OUR STORY</p>
        <h1>{page?.title || "Our Story"}</h1>
        <p>{body ? "Discover the story and values shared by Nilkurinji." : preview ? "The Nilkurinji story is being prepared for this preview." : "Brand information will appear here once it has been published."}</p>
        <a className="button button--dark" href="#story">Read our story <span aria-hidden="true">↓</span></a>
      </div>
      <figure className={styles.heroPhoto}>
        {preview && <Image src="/images/tea-hero-editorial.webp" alt="Illustrative tea and landscape concept imagery" fill priority sizes="(max-width: 767px) 100vw, 55vw" />}
        {preview && <figcaption>Illustrative concept imagery</figcaption>}
      </figure>
    </header>
    <section className={styles.story} id="story">
      <div className={styles.storyCopy}>
        <p className={styles.eyebrow}>THE NILKURINJI STORY</p>
        <h2>{page?.title || "A story told by the brand"}</h2>
        {body ? <div className={styles.body} dangerouslySetInnerHTML={{ __html: body }} /> : <p className={styles.body} role="status">{result.source === "unavailable" ? "Brand information is temporarily unavailable. Please try again later." : preview ? "Approved history, sourcing details and brand values will be added here by the Nilkurinji team." : "The brand story has not been published yet."}</p>}
        <Link href="/shop" className="text-link">Explore the shop</Link>
      </div>
      <div className={styles.collage} aria-label={preview ? "Illustrative Nilkurinji concept imagery" : undefined}>
        {preview && <Image className={styles.photoOne} src="/images/preview-about-leaves.png" alt="Illustrative tea leaf concept image" width={640} height={800} />}
        {preview && <Image className={styles.photoTwo} src="/images/tea-hero-editorial.webp" alt="Illustrative tea landscape concept image" width={900} height={650} />}
        {preview && <span className={styles.collageNote}>Concept imagery</span>}
      </div>
    </section>
    <section className={styles.closing}>
      <p>Nilkurinji</p>
      <h2>Tea and pantry, for your table.</h2>
      <Link href="/shop" className="button button--outline">Explore the shop <span aria-hidden="true">→</span></Link>
    </section>
  </article>;
}
