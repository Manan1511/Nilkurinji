import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BotanicalEdges } from "@/components/botanical-edges";
import styles from "./home.module.css";
import type { ShopifyImage } from "@/lib/shopify/types";

export type BannerSlide = { id?: string; label?: string; eyebrow: string; heading: string; description: string; image: string | null; mobileImage?: string | null; imageAlt: string; imageCaption: string; href: string };

function IntegratedHeroPack({ mobile }: { mobile: boolean }) {
  const clipId = mobile ? "mobile-hero-pack" : "desktop-hero-pack";
  const position = mobile
    ? { x: 989, y: 155, width: 364, height: 491 }
    : { x: 1129, y: 220, width: 256, height: 340 };
  return <svg className={mobile ? styles.heroArtworkMobile : styles.heroArtworkDesktop} viewBox={mobile ? "0 0 2048 768" : "0 6 2048 768"} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <svg {...position} viewBox="0 0 612 835" preserveAspectRatio="none" overflow="hidden">
      <defs><clipPath id={clipId}><polygon points="0,31 549,1 612,44 612,835 4,809" /></clipPath></defs>
      <image href="/images/optimized/hero-elaichi-pack-overlay.webp" width="612" height="835" clipPath={`url(#${clipId})`} />
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
  const mobileScene = showProductPack ? getImageProps({
    src: "/images/nilkurinji-hero-elaichi-mobile.webp",
    alt: "",
    width: 2048,
    height: 768,
    quality: 85,
    sizes: "100vw",
  }).props : null;

  return <section className={styles.hero} data-product-hero={showProductPack ? "true" : undefined} aria-label="Nilkurinji food and beverages">
    {image && <div className={styles.heroMedia}>
      {showProductPack && mobileScene ? <>
        <picture className={styles.heroScene}>
          <source media="(max-width: 599px)" srcSet={mobileScene.srcSet} sizes="100vw" />
          <Image src="/images/nilkurinji-hero-elaichi-desktop.webp" alt="" width={2048} height={768} quality={85} sizes="100vw" loading="eager" fetchPriority="high" className={styles.heroSceneImage} />
        </picture>
        <IntegratedHeroPack mobile={false} />
        <IntegratedHeroPack mobile />
      </> : <>
        <Image className={styles.heroPhoto} src={image.url} alt={image.altText ?? ""} fill quality={85} preload sizes="100vw" />
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
