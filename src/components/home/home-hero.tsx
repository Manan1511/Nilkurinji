import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BotanicalEdges } from "@/components/botanical-edges";
import styles from "./home.module.css";
import type { ShopifyImage } from "@/lib/shopify/types";

export type BannerSlide = { id?: string; label?: string; eyebrow: string; heading: string; description: string; image: string | null; mobileImage?: string | null; imageAlt: string; imageCaption: string; href: string };

export function HomeHero({
  eyebrow,
  heading,
  description,
  image,
  preview,
  status,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  image: ShopifyImage | null;
  preview: boolean;
  status?: string;
}) {
  return <section className={styles.hero} aria-label="Nilkurinji food and beverages">
    {image && <div className={styles.heroMedia}>
      <Image className={styles.heroPhoto} src={image.url} alt={image.altText ?? ""} fill preload sizes="100vw" />
      <span className={styles.heroFade} aria-hidden="true" />
    </div>}
    <BotanicalEdges placement="home-hero" />
    {preview && image && <span className={styles.heroDisclosure}>Illustrative concept imagery</span>}
    <div className={styles.heroCopy}>
      <p className={styles.heroEyebrow}>{eyebrow}</p>
      <h1>{heading}</h1>
      <p className={styles.heroDescription}>{description}</p>
      {status && <p className={styles.heroStatus} role="status">{status}</p>}
      <div className={styles.heroActions}>
        <Link className="button button--dark" href="/shop">Explore our range <ArrowRight aria-hidden="true" size={17} /></Link>
      </div>
    </div>
  </section>;
}
