import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { TeaFormatChoices } from "@/components/home/tea-format-choices";
import { ProductCard } from "@/components/product-card";
import { getProduct, getProducts } from "@/lib/shopify/catalog";
import { DRAFT_HOMEPAGE_CONTENT, getHomepageContent } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { isTeaProduct } from "@/lib/catalog-state";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import type { ShopifyImage, StorefrontProduct, TeaProfile } from "@/lib/shopify/types";
import styles from "@/components/home/home.module.css";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const PREVIEW_TEA_IMAGE: ShopifyImage = {
  url: "/images/category-icon-tea.png",
  altText: "Illustrative cutout of amber tea with loose tea leaves",
  width: 1254,
  height: 1254,
};
const PREVIEW_TEA_BAGS_IMAGE: ShopifyImage = {
  url: "/images/category-icon-tea-bags.png",
  altText: "Illustrative cutout of a tea bag with loose tea",
  width: 1254,
  height: 1254,
};

function BrewingNotes({ product }: { product: StorefrontProduct | null }) {
  const profile: TeaProfile | null = product?.teaProfile?.approved ? product.teaProfile : null;
  const brew = profile?.brewing;
  const measurements = brew ? [
    brew.dose ? ["Dose", `${brew.dose.amount} ${brew.dose.unit}`] : null,
    brew.waterMl ? ["Water", `${brew.waterMl} ml`] : null,
    brew.temperatureC !== null ? ["Temperature", `${brew.temperatureC}°C`] : null,
    brew.steepSeconds ? ["Steep", `${Math.floor(brew.steepSeconds / 60)}:${String(brew.steepSeconds % 60).padStart(2, "0")} min`] : null,
    brew.infusions ? ["Infusions", `${brew.infusions}`] : null,
  ].filter((item): item is string[] => item !== null) : [];

  return <section className={styles.section} data-reveal="section" aria-labelledby="brewing-heading">
    <div className={styles.ritual}>
      <div><h2 id="brewing-heading">Let the tea set the pace.</h2><p className={styles.ritualIntro}>{product && measurements.length ? <>Approved brewing details for <Link href={`/products/${product.handle}`}>{product.title}</Link>.</> : "Loose tea and tea bags each have their own directions. We will share product-specific details once they are approved."}</p></div>
      {measurements.length ? <dl className={styles.steps}>{measurements.map(([label, value]) => <div className={styles.step} key={label}><span>{label.toUpperCase()}</span><strong>{value}</strong></div>)}</dl> : <div className={styles.steps}>
        <div className={styles.step}><span>01</span><strong>Choose</strong><p>Start with the tea you would like to drink.</p></div>
        <div className={styles.step}><span>02</span><strong>Prepare</strong><p>Use the directions supplied for that tea.</p></div>
        <div className={styles.step}><span>03</span><strong>Enjoy</strong><p>Make time for the cup in front of you.</p></div>
      </div>}
    </div>
  </section>;
}

export default async function HomePage() {
  const [catalog, homepage] = await Promise.all([getProducts(), getHomepageContent()]);
  const preview = getStorefrontMode().mode === "preview";
  const content = homepage.source === "unavailable" ? null : homepage.data;
  const products = catalog.source === "unavailable" ? [] : catalog.data;
  const teaProducts = products.filter(isTeaProduct).slice(0, 3);
  const teaImage = content?.formatImages?.tea ?? content?.heroImage ?? (preview ? PREVIEW_TEA_IMAGE : null);
  const teaBagsImage = content?.formatImages?.teaBags ?? content?.secondaryImage ?? (preview ? PREVIEW_TEA_BAGS_IMAGE : null);
  const brewingHandle = content?.brewingProductHandle;
  const brewingProductResult = brewingHandle && !preview ? await getProduct(brewingHandle) : null;
  const featuredBrewingProduct = brewingProductResult?.source === "shopify" ? brewingProductResult.data : null;

  return <div className={styles.home}>
    {content ? <HomeHero heading={content.heading || DRAFT_HOMEPAGE_CONTENT.heading} description={content.description || DRAFT_HOMEPAGE_CONTENT.description} /> : <section className={`${styles.section} ${styles.empty}`}><h1>The tea collection is being prepared.</h1><p>Visit again when there is tea to explore.</p><Link href="/shop" className="button button--outline">Browse tea</Link></section>}

    <section className={styles.section} data-reveal="section" aria-labelledby="home-featured-heading">
      <div className={styles.sectionHeader}><div><h2 id="home-featured-heading">A few teas to begin with.</h2><p>Explore a small selection from Nilkurinji.</p></div><Link href="/shop">Shop all tea <ArrowRight size={16} aria-hidden="true" /></Link></div>
      {catalog.source === "unavailable" ? <div className={styles.empty} role="status"><p>Tea listings are temporarily unavailable.</p><Link href="/shop">Browse the shop</Link></div> : teaProducts.length ? <div className={`${styles.grid} ${teaProducts.length === 1 ? styles.gridSingle : teaProducts.length === 2 ? styles.gridSmall : ""}`}>{teaProducts.map((product) => <ProductCard key={product.id} product={product} purchasingEnabled={isShopifyCheckoutEnabled()} />)}</div> : <div className={styles.empty}><p>The tea collection is being prepared.</p><Link href="/shop?category=tea">View tea in the shop</Link></div>}
    </section>

    {content && <TeaFormatChoices teaImage={teaImage} teaBagsImage={teaBagsImage} />}

    <section className={`${styles.section} ${styles.brandNoteSection}`} aria-labelledby="home-brand-note-heading">
      <div className={styles.brandNote}>
        <div className={styles.brandNoteCopy}>
          <h2 id="home-brand-note-heading">No perfect cup required.</h2>
          <p>A quiet start, a quick break, one more cup after lunch. Make it with loose tea or a tea bag, and let the moment be your own.</p>
          <Link href="/shop">Find your tea <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className={styles.brandNoteArt} aria-hidden="true">
          <Image src="/images/botanical-tea-spray.webp" alt="" width={1222} height={1287} sizes="(max-width: 599px) 46vw, 300px" />
        </div>
      </div>
    </section>

    <BrewingNotes product={featuredBrewingProduct} />
  </div>;
}
