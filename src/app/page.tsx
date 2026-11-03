import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flower2, Landmark, Leaf, ShieldCheck, Truck } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { HomeReviews } from "@/components/home/home-reviews";
import { MobileContactCard } from "@/components/site-footer";
import { BotanicalEdges } from "@/components/botanical-edges";
import { BrandMark } from "@/components/brand-mark";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/shopify/catalog";
import { DRAFT_HOMEPAGE_CONTENT, getHomepageContent } from "@/lib/shopify/content";
import { isTeaProduct } from "@/lib/catalog-state";
import { CATEGORIES } from "@/lib/site-config";
import { isShopifyCartEnabled, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import styles from "@/components/home/home.module.css";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getEnabledCategoryHandles } from "@/lib/shopify/shop-category";
import type { StorefrontProduct } from "@/lib/shopify/types";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const FALLBACK_HERO = {
  url: "/images/nilkurinji-hero-elaichi-desktop.webp",
  mobileUrl: "/images/nilkurinji-hero-elaichi-mobile.webp",
  altText: "Nilkurinji Elaichi Tea package beside amber tea and loose tea leaves, with blue-violet blossoms and green hills beyond",
  width: 2048,
  height: 768,
};

const CATEGORY_CUTOUTS: Record<string, string> = {
  tea: "/images/category-icon-tea-kurinji.webp",
  "tea-bags": "/images/category-icon-tea-bags-kurinji.webp",
  rice: "/images/category-icon-rice.png",
  snacks: "/images/category-icon-snacks.png",
  "other-foods": "/images/category-icon-other-foods.png",
};

function featuredProducts(products: StorefrontProduct[]): StorefrontProduct[] {
  const tea = products.filter((product) => isTeaProduct(product) && product.collectionHandles.includes("tea")).slice(0, 2);
  const otherCategories = ["rice", "snacks"]
    .map((category) => products.find((product) => product.collectionHandles.includes(category)))
    .filter((product): product is StorefrontProduct => product !== undefined);
  const selected = [...tea, ...otherCategories];
  for (const product of products) {
    if (selected.length >= 4) break;
    if (!selected.some((item) => item.id === product.id)) selected.push(product);
  }
  return selected.slice(0, 4);
}

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
  const [catalog, homepage, enabledCategories] = await Promise.all([getProducts(), getHomepageContent(), getEnabledCategoryHandles()]);
  const cartEnabled = isShopifyCartEnabled();
  const checkoutEnabled = isShopifyCheckoutEnabled();
  const content = homepage.source === "unavailable" ? null : homepage.data;
  const products = catalog.source === "unavailable" ? [] : catalog.data;
  const heroImage = content?.heroImage ?? FALLBACK_HERO;
  const shownProducts = featuredProducts(products);

  return <div className={styles.home} data-homepage="true">
    <HomeHero
      eyebrow={content?.eyebrow || DRAFT_HOMEPAGE_CONTENT.eyebrow}
      heading={content?.heading || DRAFT_HOMEPAGE_CONTENT.heading}
      description={content?.description || DRAFT_HOMEPAGE_CONTENT.description}
      image={heroImage}
    />

    <HomeCategories enabled={enabledCategories} />

    <section className={styles.featured} data-reveal="section" aria-labelledby="home-featured-heading">
      <BotanicalEdges placement="featured" />
      <div className={styles.featuredContent}>
        <div className={styles.featuredEditorial}>
          <div className={styles.featuredCopy}>
            <p className={styles.eyebrow}>Featured products</p>
            <h2 id="home-featured-heading">{content?.featuredProductsHeading || "Tea and pantry for every table."}</h2>
          </div>
          <div className={styles.featuredAction}>
            <p>Explore tea, tea bags and pantry foods from Nilkurinji.</p>
            <Link href="/shop">Shop all <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        {catalog.source === "unavailable" ? <div className={styles.empty} role="status"><p>The range is temporarily unavailable.</p><Link href="/shop">Browse the shop</Link></div> : shownProducts.length ? <div className={styles.productRail} role="region" aria-label="Featured products" tabIndex={0}>{shownProducts.map((product) => <ProductCard key={product.id} product={product} cartEnabled={cartEnabled} checkoutEnabled={checkoutEnabled} variant="featured" />)}</div> : <div className={styles.empty}><p>The product range is being prepared.</p><Link href="/shop">Explore the shop</Link></div>}
      </div>
    </section>

    <HomeReviews />

    <MobileContactCard homepage />

    <DeliveryBand />
  </div>;
}
