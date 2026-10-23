import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ShopifyImage } from "@/lib/shopify/types";
import styles from "./home.module.css";

type FormatChoice = {
  title: string;
  description: string;
  href: string;
  image: ShopifyImage | null;
  alt: string;
};

export function TeaFormatChoices({ teaImage, teaBagsImage }: { teaImage: ShopifyImage | null; teaBagsImage: ShopifyImage | null }) {
  const formats: FormatChoice[] = [
    {
      title: "Loose tea",
      description: "Take your time with loose tea.",
      href: "/shop?category=tea",
      image: teaImage,
      alt: "Illustrative cutout of amber tea with loose tea leaves",
    },
    {
      title: "Tea bags",
      description: "Keep tea simple with a tea bag.",
      href: "/shop?category=tea-bags",
      image: teaBagsImage,
      alt: "Illustrative cutout of a tea bag with loose tea",
    },
  ];

  return <section className={`${styles.section} ${styles.formats}`} data-reveal="section" aria-labelledby="home-formats-heading">
    <div className={styles.sectionHeader}>
      <div>
        <h2 id="home-formats-heading">How do you like your tea?</h2>
        <p>Loose tea when you feel like slowing down. Tea bags when the day needs something simple.</p>
      </div>
    </div>
    <div className={styles.formatGrid}>
      {formats.map((format) => <Link className={styles.formatCard} href={format.href} key={format.title}>
        <div className={styles.formatVisual}>
          {format.image ? <Image
            className={styles.formatCutout}
            src={format.image.url}
            alt={format.image.altText || format.alt}
            width={format.image.width ?? 1254}
            height={format.image.height ?? 1254}
            sizes="(max-width: 359px) 88vw, (max-width: 599px) 43vw, 40vw"
          /> : <span className={styles.formatFallback} aria-hidden="true">{format.title}</span>}
        </div>
        <div className={styles.formatDetails}>
          <div><h3>{format.title}</h3><p>{format.description}</p></div>
          <ArrowRight className={styles.formatArrow} size={20} aria-hidden="true" />
        </div>
      </Link>)}
    </div>
  </section>;
}
