import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { BotanicalEdges } from "@/components/botanical-edges";
import { getProducts } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { getShopCategoryBanner } from "@/lib/shopify/shop-category";
import type { ShopifyImage } from "@/lib/shopify/types";
import { CATEGORIES } from "@/lib/site-config";
import { getShopBannerImage } from "@/lib/shopify/shop-banner";
import styles from "./shop.module.css";

export const metadata: Metadata = { title: "Shop", description: "Browse tea, tea bags, rice, snacks and other foods from Nilkurinji.", alternates: { canonical: "/shop" } };
export const revalidate = 60;

type ShopProps = { searchParams: Promise<{ category?: string | string[] }> };

const categoryCopy: Record<string, { heading: string; body: string }> = {
  all: { heading: "Explore the Nilkurinji pantry", body: "Browse tea, tea bags, rice, snacks and other foods from Nilkurinji." },
  tea: { heading: "Tea", body: "Browse loose tea from the Nilkurinji collection." },
  "tea-bags": { heading: "Tea bags", body: "Browse Nilkurinji tea in a tea bag format." },
  rice: { heading: "Rice", body: "Browse rice from the Nilkurinji collection." },
  snacks: { heading: "Snacks", body: "Browse snacks from the Nilkurinji collection." },
  "other-foods": { heading: "Other foods", body: "Browse other foods from the Nilkurinji collection." },
};

function ShopBanner({ category, image, mobileImage, copy, preview }: { category: string; image: ShopifyImage | null; mobileImage: ShopifyImage | null; copy: { eyebrow?: string; heading?: string; body?: string; altText?: string } | null; preview: boolean }) {
  return <header className={styles.banner}>
    {image && <div className={styles.media}>
      <picture className={styles.picture}>{mobileImage && <source media="(max-width: 599px)" srcSet={mobileImage.url} />}<Image src={image.url} alt={copy?.altText || image.altText || ""} fill priority sizes="100vw" /></picture>
      <span className={styles.fade} aria-hidden="true" />
      {preview && image.url.includes("preview-") && <span className={styles.disclosure}>Illustrative concept imagery</span>}
    </div>}
    <BotanicalEdges placement="banner" />
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{copy?.eyebrow || (category === "all" ? "NILKURINJI · SHOP" : `NILKURINJI · ${CATEGORIES.find((item) => item.handle === category)?.label.toUpperCase()}`)}</p>
      <h1>{copy?.heading || categoryCopy[category]?.heading || categoryCopy.all.heading}</h1>
      <p>{copy?.body || categoryCopy[category]?.body || categoryCopy.all.body}</p>
    </div>
  </header>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
  const { category } = await searchParams;
  const requestedCategory = Array.isArray(category) ? category[0] : category;
  const initialCategory = CATEGORIES.some((item) => item.handle === requestedCategory) ? requestedCategory! : "all";
  const [result, bannerResult] = await Promise.all([
    getProducts(),
    getShopCategoryBanner(initialCategory),
  ]);
  const preview = getStorefrontMode().mode === "preview";
  const bannerContent = bannerResult.source === "unavailable" ? null : bannerResult.data;
  const bannerImage = getShopBannerImage(initialCategory, bannerContent?.image ?? null, preview);

  return <>
    <ShopBanner category={initialCategory} image={bannerImage} mobileImage={bannerContent?.mobileImage ?? null} copy={bannerContent} preview={preview} />
    {result.source === "unavailable" ? <div className={styles.notice} role="status"><p>Shop listings are temporarily unavailable.</p><Link href="/" className="button button--outline">Back to Nilkurinji home</Link></div> : <ProductGrid products={result.data} emptyMessage="The product range is being prepared." initialCategory={initialCategory} showCategoryNavigation purchasingEnabled={isShopifyCheckoutEnabled()} />}
  </>;
}
