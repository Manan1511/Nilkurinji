import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Coffee, Landmark, Leaf } from "lucide-react";
import { BotanicalFrame } from "@/components/botanical-frame";
import { CollectionHero } from "@/components/collection-hero";
import { ProductGrid, type ProductFilterGroup, type ProductTopFilter } from "@/components/product-grid";
import { getCollection } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { CATEGORIES } from "@/lib/site-config";

type PageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const category = CATEGORIES.find((item) => item.handle === handle);
  return {
    title: category?.label ?? "Collection",
    description: category ? `Shop ${category.label.toLowerCase()} from the Nilkurinji pantry.` : undefined,
    alternates: { canonical: `/collections/${handle}` },
  };
}

export const revalidate = 60;

const TEA_TOP_FILTERS: ProductTopFilter[] = [
  { label: "All Teas", value: "all", icon: "leaf" },
  { label: "Black Tea", value: "type:black-tea", icon: "coffee" },
  { label: "Green Tea", value: "type:green-tea", icon: "leaf" },
  { label: "Herbal Tea", value: "type:herbal-tea", icon: "flower" },
  { label: "White Tea", value: "type:white-tea", icon: "sprout" },
  { label: "Oolong Tea", value: "type:oolong-tea", icon: "wheat" },
  { label: "Fruit Infusion", value: "type:fruit-infusion", icon: "sparkles" },
];

const TEA_FILTERS: ProductFilterGroup[] = [
  { id: "type", label: "Type", options: TEA_TOP_FILTERS.slice(1).map(({ label, value }) => ({ label, value })) },
  { id: "caffeine", label: "Caffeine", options: [{ label: "Caffeinated", value: "caffeine:caffeinated" }, { label: "Decaf", value: "caffeine:decaf" }] },
  { id: "price", label: "Price", options: [{ label: "Under ₹300", value: "under-300" }, { label: "₹300–₹500", value: "300-500" }, { label: "₹500+", value: "500-plus" }] },
];

const TEA_BAG_FILTERS: ProductFilterGroup[] = [
  { id: "flavour", label: "Flavour", options: [
    { label: "Classic", value: "flavour:classic" },
    { label: "Masala", value: "flavour:masala" },
    { label: "Green", value: "flavour:green" },
    { label: "Herbal", value: "flavour:herbal" },
    { label: "Fruit Infusion", value: "flavour:fruit" },
  ] },
  { id: "caffeine", label: "Caffeine", options: [{ label: "Caffeinated", value: "caffeine:caffeinated" }, { label: "Decaf", value: "caffeine:decaf" }] },
  { id: "price", label: "Price", options: [{ label: "Under ₹300", value: "under-300" }, { label: "₹300–₹500", value: "300-500" }, { label: "₹500+", value: "500-plus" }] },
];

function TeaBenefits() {
  return (
    <section className="benefits-band home-benefits collection-benefits" aria-label="Nilkurinji tea benefits">
      <div className="benefits-band__inner mx-auto w-full max-w-[1360px] px-5 md:px-10">
        <article className="benefit"><Leaf aria-hidden="true" className="benefit__icon" /><h2>100% Natural Ingredients</h2><p>Pure. Safe. Wholesome.</p></article>
        <article className="benefit"><Landmark aria-hidden="true" className="benefit__icon" /><h2>Authentic Indian Heritage</h2><p>Tradition in every cup.</p></article>
        <article className="benefit"><BadgeCheck aria-hidden="true" className="benefit__icon" /><h2>Premium Quality</h2><p>Carefully sourced. Always.</p></article>
      </div>
    </section>
  );
}

function TeaBagPromise() {
  return (
    <aside className="collection-promise">
      <BotanicalFrame className="botanical-frame--promise" />
      <Leaf aria-hidden="true" className="collection-promise__mark" />
      <div><h2>Real Ingredients. Better Moments.</h2><p>Every tea bag is crafted with carefully sourced leaves, so you can enjoy pure flavour, anytime, anywhere.</p></div>
      <Coffee aria-hidden="true" className="collection-promise__cup" />
    </aside>
  );
}

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params;
  const [result, mode] = await Promise.all([getCollection(handle), Promise.resolve(getStorefrontMode())]);
  if (result.source !== "unavailable" && !result.data) notFound();
  const collection = result.source === "unavailable" ? null : result.data;
  const label = collection?.title ?? CATEGORIES.find((category) => category.handle === handle)?.label ?? "Collection";
  const isTea = handle === "tea";
  const isTeaBags = handle === "tea-bags";
  const isReferenceCollection = isTea || isTeaBags;
  const previewImage = isTea ? "/images/preview-hero-tea.webp" : "/images/preview-hero-tea-bags.webp";
  const image = mode.mode === "preview" && isReferenceCollection ? previewImage : collection?.image?.url ?? null;
  const description = isTeaBags
    ? "Convenience meets tradition. Our tea bags bring you the same rich flavours and pure ingredients, in every cup."
    : isTea
      ? "From classic blends to rare infusions, discover our handcrafted teas made from the finest leaves, for a truly enriching experience."
      : collection?.description || `Explore the ${label.toLowerCase()} collection.`;

  return (
    <>
      {isReferenceCollection && result.source !== "unavailable" ? (
        <CollectionHero
          eyebrow="Pure · Natural · Timeless"
          heading={label}
          description={description}
          image={image}
          imageAlt={collection?.image?.altText || `${label} collection still life in the Nilgiri hills`}
          ctaLabel={isTea ? "Explore all teas" : "Explore tea bags"}
          className={`collection-hero--${handle}`}
        />
      ) : <header className="page-header">
          <p className="eyebrow">The Nilkurinji pantry</p>
          <h1 className="page-title">{label}</h1>
          <p className="page-header__description">{description}</p>
        </header>}
      {result.source === "unavailable" ? (
        <div className="notice-card" role="status">{result.reason}</div>
      ) : (
        <section id="collection-products" className={`collection-page ${isReferenceCollection ? "collection-page--reference" : ""}`}>
          {isTeaBags && <header className="collection-heading">
            <Leaf aria-hidden="true" />
            <h2>Our Tea Bag Collection</h2>
            <p>Same great taste. Now in a simpler, everyday form.</p>
          </header>}
          <ProductGrid
            products={collection?.products ?? []}
            emptyMessage="There are no products in this collection yet."
            allowCategoryFilter={!isReferenceCollection}
            purchasingEnabled={isShopifyCheckoutEnabled()}
            showToolbar={!isReferenceCollection}
            facetGroups={isTea ? TEA_FILTERS : isTeaBags ? TEA_BAG_FILTERS : undefined}
            topFilters={isTea ? TEA_TOP_FILTERS : undefined}
            cardVariant={isReferenceCollection ? "collection" : "standard"}
          />
          {isTea && <TeaBenefits />}
          {isTeaBags && <TeaBagPromise />}
        </section>
      )}
    </>
  );
}
