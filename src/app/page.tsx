import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flower2, Landmark, Leaf, ShieldCheck, Truck } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { HomeReviews } from "@/components/home/home-reviews";
import { BotanicalEdges } from "@/components/botanical-edges";
import { BrandMark } from "@/components/brand-mark";
import { ProductCard } from "@/components/product-card";
import { getCollection, getProducts } from "@/lib/shopify/catalog";
import { DRAFT_HOMEPAGE_CONTENT, getHomepageContent } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { isTeaProduct } from "@/lib/catalog-state";
import { CATEGORIES } from "@/lib/site-config";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import styles from "@/components/home/home.module.css";
import type { Metadata } from "next";
import type { StorefrontCollection, StorefrontProduct } from "@/lib/shopify/types";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const PREVIEW_HERO = {
  url: "/images/preview-hero-home-kurinji.webp",
  altText: "Illustrative Nilkurinji tea scene with blue-violet blossoms, loose tea and a cup",
  width: 2172,
  height: 724,
};

const PREVIEW_CATEGORY_CUTOUTS: Record<string, string> = {
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

async function categoryCollections(): Promise<Map<string, StorefrontCollection | null>> {
  const results = await Promise.all(CATEGORIES.map(async ({ handle }) => [handle, await getCollection(handle)] as const));
  return new Map(results.map(([handle, result]) => [handle, result.source === "unavailable" ? null : result.data]));
}

function HomeCategories({ collections, preview }: { collections: Map<string, StorefrontCollection | null>; preview: boolean }) {
  return <section className={styles.categories} aria-labelledby="home-categories-heading">
    <div className={styles.categoryHeading}>
      <BrandMark className={styles.categoryMark} />
      <div><span className={styles.headingRule} /><h2 id="home-categories-heading">Our Categories</h2><span className={styles.headingRule} /></div>
      <p>Browse tea, tea bags, rice, snacks, and pantry foods.</p>
    </div>
    <nav className={styles.categoryRail} aria-label="Shop by category">
      {CATEGORIES.map((category) => {
        const image = collections.get(category.handle)?.image;
        const backdrop = preview ? undefined : image?.url;
        const cutout = preview ? PREVIEW_CATEGORY_CUTOUTS[category.handle] : undefined;
        const hasImage = Boolean(backdrop || cutout);
        return <Link href={category.href} className={styles.categoryItem} key={category.handle}>
          {hasImage ? <span className={styles.categoryArt}>
            <span className={styles.categoryMedallion} aria-hidden="true">
              {backdrop && <Image src={backdrop} alt="" fill sizes="(max-width: 599px) 76px, 104px" />}
            </span>
            {cutout && <Image className={styles.categoryCutout} src={cutout} alt="" width={160} height={160} sizes="(max-width: 599px) 104px, 140px" />}
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
    {items.map(({ icon: Icon, title, body }) => <div className={styles.deliveryItem} key={title}>
      <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
      <h3>{title}</h3><p>{body}</p>
    </div>)}
  </section>;
}

export default async function HomePage() {
  const [catalog, homepage] = await Promise.all([getProducts(), getHomepageContent()]);
  const preview = getStorefrontMode().mode === "preview";
  const collections = await categoryCollections();
  const content = homepage.source === "unavailable" ? null : homepage.data;
  const showDraftContent = preview;
  const products = catalog.source === "unavailable" ? [] : catalog.data;
  const heroImage = content?.heroImage ?? (showDraftContent ? PREVIEW_HERO : null);
  const shownProducts = featuredProducts(products);

  return <div className={styles.home}>
    <HomeHero
      eyebrow={content?.eyebrow || (showDraftContent ? DRAFT_HOMEPAGE_CONTENT.eyebrow : "NILKURINJI")}
      heading={content?.heading || (showDraftContent ? DRAFT_HOMEPAGE_CONTENT.heading : "Explore the Nilkurinji range.")}
      description={content?.description || (showDraftContent ? DRAFT_HOMEPAGE_CONTENT.description : "Browse tea, tea bags and pantry products from the shop.")}
      image={heroImage}
      preview={preview}
      status={!preview && !content ? "Homepage content is temporarily unavailable." : undefined}
    />

    <HomeCategories collections={collections} preview={preview} />

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
        {catalog.source === "unavailable" ? <div className={styles.empty} role="status"><p>The range is temporarily unavailable.</p><Link href="/shop">Browse the shop</Link></div> : shownProducts.length ? <div className={styles.productRail} role="region" aria-label="Featured products" tabIndex={0}>{shownProducts.map((product) => <ProductCard key={product.id} product={product} purchasingEnabled={isShopifyCheckoutEnabled()} variant="featured" />)}</div> : <div className={styles.empty}><p>The product range is being prepared.</p><Link href="/shop">Explore the shop</Link></div>}
      </div>
    </section>

    <HomeReviews products={products} preview={preview} />

    <DeliveryBand />
  </div>;
}
