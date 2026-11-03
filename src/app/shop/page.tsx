import type { Metadata } from "next";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { BotanicalEdges } from "@/components/botanical-edges";
import { getProducts, searchProducts } from "@/lib/shopify/catalog";
import { normalizeSearchQuery } from "@/lib/search/query";
import { isShopifyCartEnabled, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { getEnabledCategoryHandles, getShopCategoryBanner } from "@/lib/shopify/shop-category";
import type { ShopifyImage } from "@/lib/shopify/types";
import { CATEGORIES } from "@/lib/site-config";
import { getShopBannerImage } from "@/lib/shopify/shop-banner";
import styles from "./shop.module.css";

export const revalidate = 60;

type ShopProps = { searchParams: Promise<{ category?: string | string[]; q?: string | string[] }> };

export async function generateMetadata({ searchParams }: ShopProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = normalizeSearchQuery(Array.isArray(q) ? q[0] ?? "" : q ?? "");
  return {
    title: query ? `Search · ${query.slice(0, 70)}` : "Shop",
    description: "Browse tea, tea bags, rice, snacks and other foods from Nilkurinji.",
    alternates: { canonical: "/shop" },
    ...(query ? { robots: { index: false, follow: true } } : {}),
  };
}

const categoryCopy: Record<string, { heading: string; body: string }> = {
  all: { heading: "Explore the Nilkurinji pantry", body: "Browse tea, tea bags, rice, snacks and other foods from Nilkurinji." },
  tea: { heading: "Tea", body: "Browse loose tea from the Nilkurinji collection." },
  "tea-bags": { heading: "Tea bags", body: "Browse Nilkurinji tea in a tea bag format." },
  rice: { heading: "Rice", body: "Browse rice from the Nilkurinji collection." },
  snacks: { heading: "Snacks", body: "Browse snacks from the Nilkurinji collection." },
  "other-foods": { heading: "Other foods", body: "Browse other foods from the Nilkurinji collection." },
};

const productFreeShopBanner: ShopifyImage = {
  url: "/images/nilkurinji-hero-tea-landscape.webp",
  altText: "A cup of amber tea and loose tea leaves beside a green hillside.",
  width: 2048,
  height: 768,
};

function ShopBannerFoliage() {
  return <span className={styles.extraFoliage} aria-hidden="true">
    <Image className={styles.upperRightLeaf} src="/images/botanical/botanical-home-hero-right-refined.webp" alt="" width={1327} height={1186} quality={82} sizes="(max-width: 767px) 160px, (max-width: 1279px) 190px, 270px" />
    <Image className={styles.middleRightLeaf} src="/images/botanical/botanical-header-left-refined.webp" alt="" width={1433} height={1098} quality={82} sizes="(max-width: 767px) 130px, (max-width: 1279px) 170px, 220px" />
    <Image className={styles.lowerMiddleLeaf} src="/images/botanical/botanical-editorial-left.webp" alt="" width={1024} height={683} quality={82} sizes="(max-width: 1279px) 180px, 260px" />
  </span>;
}

function ShopBanner({ category, image, mobileImage, copy, preview, productFreeFallback, searchQuery }: { category: string; image: ShopifyImage | null; mobileImage: ShopifyImage | null; copy: { eyebrow?: string; heading?: string; body?: string; altText?: string } | null; preview: boolean; productFreeFallback: boolean; searchQuery: string }) {
  const alt = productFreeFallback ? image?.altText || "" : copy?.altText || image?.altText || "";
  const mobileImageProps = mobileImage ? getImageProps({
    src: mobileImage.url,
    alt,
    width: mobileImage.width ?? 1600,
    height: mobileImage.height ?? 900,
    quality: 85,
    sizes: "100vw",
  }).props : null;

  return <header className={styles.banner}>
    {image && <div className={styles.media}>
      <picture className={styles.picture}>{mobileImageProps && <source media="(max-width: 599px)" srcSet={mobileImageProps.srcSet} sizes="100vw" />}<Image src={image.url} alt={alt} fill quality={85} fetchPriority="high" loading="eager" sizes="100vw" style={productFreeFallback ? { objectPosition: "72% 86%" } : undefined} /></picture>
      <span className={styles.fade} aria-hidden="true" />
      {preview && image.url.includes("preview-") && <span className={styles.disclosure}>Illustrative concept imagery</span>}
    </div>}
    <BotanicalEdges placement="banner" />
    {!image && <ShopBannerFoliage />}
    <div className={styles.copy}>
      <p className={styles.eyebrow}>{searchQuery ? "NILKURINJI · SEARCH" : copy?.eyebrow || (category === "all" ? "NILKURINJI · SHOP" : `NILKURINJI · ${CATEGORIES.find((item) => item.handle === category)?.label.toUpperCase()}`)}</p>
      <h1>{searchQuery ? "Search results" : copy?.heading || categoryCopy[category]?.heading || categoryCopy.all.heading}</h1>
      <p>{searchQuery ? <>Showing products matching “{searchQuery}”.</> : copy?.body || categoryCopy[category]?.body || categoryCopy.all.body}</p>
    </div>
  </header>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
  const { category, q } = await searchParams;
  const requestedCategory = Array.isArray(category) ? category[0] : category;
  const searchQuery = normalizeSearchQuery(Array.isArray(q) ? q[0] ?? "" : q ?? "");
  const enabledCategories = await getEnabledCategoryHandles();
  const initialCategory = requestedCategory && enabledCategories.includes(requestedCategory) ? requestedCategory : "all";
  const [result, bannerResult] = await Promise.all([
    searchQuery ? searchProducts(searchQuery) : getProducts(),
    getShopCategoryBanner(initialCategory),
  ]);
  const preview = getStorefrontMode().mode === "preview";
  const bannerContent = bannerResult.source === "unavailable" ? null : bannerResult.data;
  const configuredBanner = getShopBannerImage(initialCategory, bannerContent?.image ?? null, false);
  const bannerImage = configuredBanner ?? productFreeShopBanner;
  const mobileBannerImage = configuredBanner ? bannerContent?.mobileImage ?? null : null;

  return <>
    <ShopBanner category={initialCategory} image={bannerImage} mobileImage={mobileBannerImage} copy={bannerContent} preview={preview} productFreeFallback={!configuredBanner} searchQuery={searchQuery} />
    {result.source === "unavailable" ? <div className={styles.notice} role="status"><p>{searchQuery ? "Search is temporarily unavailable." : "Shop listings are temporarily unavailable."}</p><Link href="/" className="button button--outline">Back to Nilkurinji home</Link></div> : <ProductGrid products={result.data} emptyMessage={searchQuery ? `No products found for “${searchQuery}”` : "The product range is being prepared."} emptyDescription={searchQuery ? "Try a different search or browse the categories above." : undefined} initialCategory={initialCategory} showCategoryNavigation cartEnabled={isShopifyCartEnabled()} checkoutEnabled={isShopifyCheckoutEnabled()} enabledCategories={enabledCategories} />}
  </>;
}
