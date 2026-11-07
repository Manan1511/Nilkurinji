import Link from "next/link";
import Image from "next/image";
import { Landmark, Leaf, ShieldCheck, Truck } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { HomeReviews } from "@/components/home/home-reviews";
import { MobileContactCard } from "@/components/site-footer";
import { BotanicalEdges } from "@/components/botanical-edges";
import { BrandMark } from "@/components/brand-mark";
import { DRAFT_HOMEPAGE_CONTENT } from "@/lib/shopify/content";
import styles from "@/components/home/home.module.css";
import type { Metadata } from "next";

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

const HOME_TEA_COLLECTION = [
  { label: "Classic Tea", href: "/products/premium-tea", image: "/images/home-tea-collection/classic.webp" },
  { label: "Elaichi Tea", href: "/products/elaichi-tea", image: "/images/home-tea-collection/elaichi.webp" },
  { label: "Rose Tea", href: "/products/rose-tea", image: "/images/home-tea-collection/rose.webp" },
  { label: "Masala Tea", href: "/products/nilkurinji-premium-masala-tea", image: "/images/home-tea-collection/masala.webp", comingSoon: true },
];

function HomeCategories() {
  return <section className={styles.categories} aria-labelledby="home-categories-heading">
    <BotanicalEdges placement="categories" />
    <div className={styles.categoryHeading}>
      <BrandMark className={styles.categoryMark} />
      <div className={styles.categoryTitleRow}><span className={styles.headingRule} /><h2 id="home-categories-heading">Our Categories</h2><span className={styles.headingRule} /></div>
      <p>Nilkurinji Premium Tea Collection</p>
      <div className={styles.categoryFlourish} aria-hidden="true"><span /><BrandMark className={styles.categoryFlourishMark} /><span /></div>
    </div>
    <nav className={styles.categoryRail} aria-label="Nilkurinji Premium Tea Collection">
      {HOME_TEA_COLLECTION.map((tea) => <Link
        href={tea.href}
        className={`${styles.categoryItem}${tea.comingSoon ? ` ${styles.categoryItemComingSoon}` : ""}`}
        key={tea.label}
        aria-label={tea.comingSoon ? `${tea.label}, coming soon` : tea.label}
      >
        <span className={`${styles.categoryArt}${tea.comingSoon ? ` ${styles.categoryArtComingSoon}` : ""}`}>
          <Image src={tea.image} alt="" fill sizes="(max-width: 599px) 44vw, (max-width: 899px) 44vw, 23vw" quality={84} />
          {tea.comingSoon && <span className={styles.comingSoonLabel}>Coming Soon!</span>}
        </span>
        <span className={styles.categoryLabel}>
          <BrandMark className={styles.categoryLabelMark} />
          <span>{tea.label}</span>
        </span>
      </Link>)}
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
  return <div className={styles.home} data-homepage="true">
    <HomeHero
      eyebrow={DRAFT_HOMEPAGE_CONTENT.eyebrow}
      heading={DRAFT_HOMEPAGE_CONTENT.heading}
      description={DRAFT_HOMEPAGE_CONTENT.description}
      image={FALLBACK_HERO}
    />

    <HomeCategories />

    <HomeReviews />

    <MobileContactCard homepage />

    <DeliveryBand />
  </div>;
}
