import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { getCollection } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
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

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params;
  const result = await getCollection(handle);
  if (result.source !== "unavailable" && !result.data) notFound();
  const collection = result.source === "unavailable" ? null : result.data;
  const label = collection?.title ?? CATEGORIES.find((category) => category.handle === handle)?.label ?? "Collection";

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">The Nilkurinji pantry</p>
        <h1 className="page-title">{label}</h1>
        <p className="page-header__description">{collection?.description || `Explore the ${label.toLowerCase()} collection.`}</p>
      </header>
      {result.source === "unavailable" ? (
        <div className="notice-card" role="status">{result.reason}</div>
      ) : (
        <ProductGrid products={collection?.products ?? []} emptyMessage="There are no products in this collection yet." allowCategoryFilter={false} purchasingEnabled={isShopifyCheckoutEnabled()} />
      )}
    </>
  );
}
