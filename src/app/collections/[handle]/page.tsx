import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid, type ProductFilterGroup, type ProductTopFilter } from "@/components/product-grid";
import { getCollection } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { CATEGORIES } from "@/lib/site-config";
import styles from "@/app/reading.module.css";
type PageProps = { params: Promise<{ handle: string }> };
export const revalidate = 60;
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params; const category = CATEGORIES.find((item) => item.handle === handle);
  return { title: category?.label ?? "Collection", description: category ? `Explore ${category.label.toLowerCase()} from Nilkurinji.` : undefined, alternates: { canonical: `/collections/${handle}` } };
}
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


export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params;
  const result = await getCollection(handle);
  if (result.source !== "unavailable" && !result.data) notFound();
  const collection = result.source === "unavailable" ? null : result.data;
  const title = collection?.title ?? CATEGORIES.find((item) => item.handle === handle)?.label ?? "Collection";
  return <><header className={styles.heading}><h1>{title}</h1>{collection?.description && <p>{collection.description}</p>}</header>{result.source === "unavailable" ? <div className={styles.notice} role="status"><p>Collection information is temporarily unavailable.</p><Link href="/shop" className="button button--outline">Browse all products</Link></div> : <ProductGrid products={collection?.products ?? []} emptyMessage="There are no products in this collection yet." allowCategoryFilter={false} purchasingEnabled={isShopifyCheckoutEnabled()} facetGroups={handle === "tea" ? TEA_FILTERS : handle === "tea-bags" ? TEA_BAG_FILTERS : undefined} topFilters={handle === "tea" ? TEA_TOP_FILTERS : undefined} />}</>;
}
