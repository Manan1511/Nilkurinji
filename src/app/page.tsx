import Link from "next/link";
import Image from "next/image";
import { Flower2, Landmark, Leaf, ShieldCheck, Truck } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { HomeReviews } from "@/components/home/home-reviews";
import { MobileContactCard } from "@/components/site-footer";
import { BotanicalEdges } from "@/components/botanical-edges";
import { BrandMark } from "@/components/brand-mark";
import { DRAFT_HOMEPAGE_CONTENT, getHomepageContent } from "@/lib/shopify/content";
import { CATEGORIES } from "@/lib/site-config";
import styles from "@/components/home/home.module.css";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getEnabledCategoryHandles } from "@/lib/shopify/shop-category";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const FALLBACK_HERO = {
  url: "/images/nilkurinji-mountain-home-desktop.webp",
  mobileUrl: "/images/nilkurinji-mountain-home-mobile.webp",
  mobileWidth: 1122,
  mobileHeight: 1402,
  altText: "Blue-violet Nilkurinji flowers covering misty mountain slopes at sunrise",
  width: 1672,
  height: 941,
};

const CATEGORY_CUTOUTS: Record<string, string> = {
  tea: "/images/category-icon-tea-kurinji.webp",
  "tea-bags": "/images/category-icon-tea-bags-kurinji.webp",
  rice: "/images/category-icon-rice.png",
  snacks: "/images/category-icon-snacks.png",
  "other-foods": "/images/category-icon-other-foods.png",
};

function HomeCategories({ enabled }: { enabled: string[] }) {
  const categories = CATEGORIES.filter((category) => enabled.includes(category.handle));
  if (!categories.length) return null;
  return <section className={styles.categories} aria-labelledby="home-categories-heading">
    <BotanicalEdges placement="categories" />
    <div className={styles.categoryHeading}>
      <BrandMark className={styles.categoryMark} />
      <div><span className={styles.headingRule} /><h2 id="home-categories-heading">Our Categories</h2><span className={styles.headingRule} /></div>
      <p>Explore the Nilkurinji collection.</p>
    </div>
    <nav className={styles.categoryRail} aria-label="Shop by category" style={{ "--category-count": categories.length, "--category-rail-width": `${categories.length * 188}px`, "--category-mobile-width": `${categories.length * 128}px` } as CSSProperties}>
      {categories.map((category) => {
        const cutout = CATEGORY_CUTOUTS[category.handle];
        return <Link href={category.href} className={styles.categoryItem} key={category.handle}>
          {cutout ? <span className={styles.categoryArt}>
            <span className={styles.categoryMedallion} aria-hidden="true">
            </span>
            <Image className={styles.categoryCutout} src={cutout} alt="" width={160} height={160} quality={85} sizes="(max-width: 599px) 112px, 140px" />
          </span> : <span className={styles.categoryImageFallback}><Flower2 aria-hidden="true" /></span>}
          <span className={styles.categoryLabel}>{category.label}</span>
        </Link>;
      })}
    </nav>
  </section>;
}

function DeliveryBand() {
  const items = [
    { icon: Leaf, title: "Tea & tea bags", body: "Choose a tea format for the way you make a cup." },
    { icon: Landmark, title: "Rice & pantry", body: "Browse the wider Nilkurinji food range." },
    { icon: ShieldCheck, title: "Product details", body: "Pack, price and availability come from the product listing." },
    { icon: Truck, title: "Pan India Delivery", body: "Available delivery options are confirmed at checkout." },
  ];
  return <section className={styles.deliveryBand} aria-label="Store information">
    <BotanicalEdges placement="delivery" />
    {items.map(({ icon: Icon, title, body }, index) => <div
      className={`${styles.deliveryItem}${index === 0 ? ` ${styles.deliveryItemFirst}` : ""}${index === 0 || index === 2 ? ` ${styles.deliveryItemMobileRowStart}` : ""}`}
      key={title}
    >
      <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
      <h3>{title}</h3><p>{body}</p>
    </div>)}
  </section>;
}

export default async function HomePage() {
  const [homepage, enabledCategories] = await Promise.all([getHomepageContent(), getEnabledCategoryHandles()]);
  const content = homepage.source === "unavailable" ? null : homepage.data;

  return <div className={styles.home} data-homepage="true">
    <HomeHero
      eyebrow={content?.eyebrow || DRAFT_HOMEPAGE_CONTENT.eyebrow}
      heading={content?.heading || DRAFT_HOMEPAGE_CONTENT.heading}
      description={content?.description || DRAFT_HOMEPAGE_CONTENT.description}
      image={FALLBACK_HERO}
    />

    <HomeCategories enabled={enabledCategories} />

    <HomeReviews />

    <MobileContactCard homepage />

    <DeliveryBand />
  </div>;
}
