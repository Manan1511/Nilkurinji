import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { TeaDetails } from "@/components/tea-details";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { getProduct, getRecommendations } from "@/lib/shopify/catalog";
import { CATEGORIES } from "@/lib/site-config";
import type { StorefrontProduct } from "@/lib/shopify/types";

type PageProps = { params: Promise<{ handle: string }> };

function productMetadata(product: StorefrontProduct | null, handle: string): Metadata {
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description.slice(0, 160) || `Explore ${product.title} from Nilkurinji.`,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      type: "website",
      title: product.title,
      description: product.description.slice(0, 160),
      ...(product.featuredImage ? { images: [product.featuredImage.url] } : {}),
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const result = await getProduct(handle);
  return productMetadata(result.source === "unavailable" ? null : result.data, handle);
}

function productJsonLd(product: StorefrontProduct): Record<string, unknown> {
  const price = product.priceRange?.minVariantPrice;
  const available = product.variants.some((variant) => variant.availableForSale);
  const siteUrl = process.env.SITE_URL ?? process.env.URL;
  let canonical: string | undefined;
  try { if (siteUrl) canonical = new URL(`/products/${product.handle}`, siteUrl).toString(); } catch { canonical = undefined; }
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    ...(canonical ? { url: canonical } : {}),
    ...(product.images.length ? { image: product.images.map((image) => image.url) } : {}),
    ...(price ? {
      offers: {
        "@type": "Offer",
        price: price.amount,
        priceCurrency: price.currencyCode,
        availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        ...(canonical ? { url: canonical } : {}),
      },
    } : {}),
    ...(product.approvedReviews.length ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (product.approvedReviews.reduce((sum, review) => sum + review.rating, 0) / product.approvedReviews.length).toFixed(1),
        reviewCount: product.approvedReviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  };
}

export const revalidate = 60;

import { ProductDetails } from "@/components/product-details";
import styles from "./product.module.css";
import reading from "@/app/reading.module.css";
export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params; const result = await getProduct(handle);
  if (result.source === "unavailable") return <div className={reading.heading} role="status"><h1>Product information is temporarily unavailable.</h1><p>Please browse all products instead.</p><Link href="/shop" className="text-link">Browse all products</Link></div>;
  if (!result.data) notFound();
  const product = result.data;
  const category = CATEGORIES.find((item) => product.collectionHandles.includes(item.handle));
  const recommendations = await getRecommendations(product);
  const related = recommendations.source === "unavailable" ? [] : recommendations.data.filter((item) => item.id !== product.id);
  return <div className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/shop">Shop</Link><ChevronRight size={14} aria-hidden="true" />{category && <><Link href={category.href}>{category.label}</Link><ChevronRight size={14} aria-hidden="true" /></>}<span>{product.title}</span></nav>
    <div className={styles.layout} key={product.id}><ProductGallery images={product.images} title={product.title} /><ProductDetails className={styles.detail}><h1 id="product-title">{product.title}</h1><ProductPurchasePanel product={product} purchasingEnabled={isShopifyCheckoutEnabled()} />{product.description && <p className={styles.description}>{product.description}</p>}<TeaDetails product={product} /></ProductDetails></div>
    {(product.howItsMade || product.isPreview) && <section className={styles.howItsMade} aria-labelledby="how-its-made-heading">
      <h2 id="how-its-made-heading">How it’s made</h2>
      <p>{product.howItsMade ?? "Production details for this product will appear here once Nilkurinji confirms them."}</p>
    </section>}
    {(product.details || product.faqs.length > 0 || product.approvedReviews.length > 0) && <div className={styles.content}>
      {product.details && <section><h2>Product details</h2><p>{product.details}</p></section>}
      {product.faqs.length > 0 && <section><h2>Frequently asked questions</h2>{product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
      {product.approvedReviews.length > 0 && <section><h2>Customer reviews</h2>{product.approvedReviews.map((review,index) => <article key={`${review.name}-${index}`}><div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, i) => <Star key={i} size={16} fill="currentColor" aria-hidden="true" />)}</div>{review.title && <h3>{review.title}</h3>}<p>{review.body}</p><p className={styles.byline}>{review.name}{review.date && <> · <time dateTime={review.date}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${review.date}T00:00:00`))}</time></>}</p></article>)}</section>}
    </div>}
    {related.length > 0 && <section className={styles.related}><h2>You may also like</h2><div className={styles.grid}>{related.slice(0,4).map((item) => <ProductCard key={item.id} product={item} purchasingEnabled={isShopifyCheckoutEnabled()} />)}</div></section>}
    {!product.isPreview && product.priceRange && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g,"\\u003c") }} />}
  </div>;
}
