import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./home.module.css";

export type BannerSlide = { id?: string; label?: string; eyebrow: string; heading: string; description: string; image: string | null; mobileImage?: string | null; imageAlt: string; imageCaption: string; href: string };

export function HomeHero({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return <section className={styles.hero} aria-label="Nilkurinji tea and tea bags">
    <div className={styles.heroCopy}>
      <h1>{heading}</h1>
      <p className={styles.heroDescription}>{description}</p>
      <div className={styles.heroActions}>
        <Link className="button button--dark" href="/shop?category=tea">Shop loose tea <ArrowRight aria-hidden="true" size={17} /></Link>
        <Link className="button button--outline" href="/shop?category=tea-bags">Shop tea bags</Link>
      </div>
    </div>
    <div className={styles.heroMedia}>
      <Image className={styles.heroPhoto} src="/images/tea-hero-editorial.webp" alt="A clear cup of amber tea with loose tea leaves on pale stone" fill preload sizes="(max-width: 899px) 100vw, 56vw" />
      <span className={styles.heroDisclosure}>Illustrative concept imagery</span>
    </div>
  </section>;
}
