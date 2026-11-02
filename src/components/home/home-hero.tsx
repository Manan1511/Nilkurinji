import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BotanicalEdges } from "@/components/botanical-edges";
import styles from "./home.module.css";
import type { ShopifyImage } from "@/lib/shopify/types";

export type BannerSlide = { id?: string; label?: string; eyebrow: string; heading: string; description: string; image: string | null; mobileImage?: string | null; imageAlt: string; imageCaption: string; href: string };

function IntegratedHero({ mobile }: { mobile: boolean }) {
  const clipId = mobile ? "mobile-hero-pack" : "desktop-hero-pack";
  const position = mobile
    ? { x: 989, y: 155, width: 364, height: 491 }
    : { x: 1129, y: 220, width: 256, height: 340 };
  return <svg className={mobile ? styles.heroArtworkMobile : styles.heroArtworkDesktop} viewBox={mobile ? "0 0 2048 768" : "0 6 2048 768"} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Nilkurinji Elaichi Tea pack beside a glass of tea in a tea landscape">
    <image href={mobile ? "/images/nilkurinji-hero-elaichi-mobile.webp" : "/images/nilkurinji-hero-elaichi-desktop.webp"} width="2048" height="768" />
    <svg {...position} viewBox="203 110 612 835" preserveAspectRatio="none" overflow="hidden" aria-hidden="true">
      <defs><clipPath id={clipId}><polygon points="203,141 752,111 815,154 815,945 207,919" /></clipPath></defs>
      <image href="/images/client-supplied/elaichi-tea-500g-pack.jpg" width="1448" height="1086" clipPath={`url(#${clipId})`} />
    </svg>
  </svg>;
}

export function HomeHero({
  eyebrow,
  heading,
  description,
  image,
  status,
  showProductPack = false,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  image: ShopifyImage | null;
  status?: string;
  showProductPack?: boolean;
}) {
  return <section className={styles.hero} data-product-hero={showProductPack ? "true" : undefined} aria-label="Nilkurinji food and beverages">
    {image && <div className={styles.heroMedia}>
      {showProductPack ? <><IntegratedHero mobile={false} /><IntegratedHero mobile /></> : <>
        <Image className={styles.heroPhoto} src={image.url} alt={image.altText ?? ""} fill preload sizes="100vw" />
        <span className={styles.heroFade} aria-hidden="true" />
      </>}
    </div>}
    <BotanicalEdges placement="home-hero" />
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
