import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BotanicalEdges } from "@/components/botanical-edges";
import styles from "./home.module.css";
import type { ShopifyImage } from "@/lib/shopify/types";

export type BannerSlide = { id?: string; label?: string; eyebrow: string; heading: string; description: string; image: string | null; mobileImage?: string | null; imageAlt: string; imageCaption: string; href: string };

type HomepageHeroImage = ShopifyImage & { mobileUrl?: string; mobileWidth?: number; mobileHeight?: number };

export function HomeHero({
  eyebrow,
  heading,
  description,
  image,
  status,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  image: HomepageHeroImage | null;
  status?: string;
}) {
  const mobileScene = image?.mobileUrl ? getImageProps({
    src: image.mobileUrl,
    alt: image.altText ?? "",
    width: image.mobileWidth ?? 1200,
    height: image.mobileHeight ?? 675,
    quality: 85,
    sizes: "100vw",
  }).props : null;

  return <section className={styles.hero} aria-label="Nilkurinji food and beverages">
    {image && <div className={styles.heroMedia}>
      <picture className={styles.heroScene}>
        {mobileScene && <source media="(max-width: 599px)" srcSet={mobileScene.srcSet} sizes="100vw" />}
        <Image className={styles.heroPhoto} src={image.url} alt={image.altText ?? ""} fill quality={95} preload sizes="100vw" />
      </picture>
      <span className={styles.heroFade} aria-hidden="true" />
    </div>}
    <BotanicalEdges placement="home-hero" />
    <div className={styles.heroCopy}>
      <p className={styles.heroEyebrow}>{eyebrow}</p>
      <h1>{heading}</h1>
      <p className={styles.heroDescription}>{description}</p>
      {status && <p className={styles.heroStatus} role="status">{status}</p>}
      <div className={styles.heroActions}>
        <Link className="button button--dark" href="/shop?category=tea">Explore Our Products <ArrowRight aria-hidden="true" size={17} /></Link>
      </div>
    </div>
  </section>;
}
