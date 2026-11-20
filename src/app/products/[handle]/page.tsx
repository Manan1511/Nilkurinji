import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Package, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductVariantImageProvider } from "@/components/product-variant-image";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { TeaDetails } from "@/components/tea-details";
import { DeliveryChecker } from "@/components/delivery-checker";
import { ProductAccordion } from "@/components/product-accordion";
import { ProductTeaGuide } from "@/components/product-tea-guide";
import { isShopifyCartEnabled, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { getProduct, getRecommendations } from "@/lib/shopify/catalog";
import { CATEGORIES } from "@/lib/site-config";
import type { StorefrontProduct } from "@/lib/shopify/types";

type PageProps = { params: Promise<{ handle: string }>; searchParams?: Promise<{ variant?: string | string[] }> };

const CLASSIC_DESCRIPTION = [
  "Experience the rich and satisfying taste of Nilkurinji Premium Classic Tea, crafted for those who appreciate a perfect everyday cup of chai.",
  "Made with premium CTC tea leaves sourced directly from Assam, our tea brings together carefully selected BOPSM and BOP grades to create a bold flavour, refreshing aroma and rich tea experience.",
  "We focus on direct sourcing and freshness, avoiding unnecessary waiting periods in the procurement process. Every cup brings you the comforting taste of quality Assam tea, made to be enjoyed every day.",
];
const CLASSIC_DETAILS = [
  ["Product Name", "Nilkurinji Premium Classic Tea"],
  ["Product Type", "Premium CTC Tea"],
  ["Tea Grades", "BOPSM & BOP"],
  ["Tea Origin", "Assam, India"],
  ["Available Pack Sizes", "500g and 1kg"],
  ["Net Quantity", "500g / 1kg (as selected)"],
  ["Packed & Marketed By", "Sunder Dass Jawand Lal"],
  ["FSSAI", "FSSAI mark displayed on packaging"],
  ["Country of Origin", "India"],
  ["Storage Instructions", "Store in a cool, dry place in an airtight container, away from moisture and direct sunlight."],
];

function descriptionForProduct(product: StorefrontProduct): string {
  return product.handle === "premium-tea" ? CLASSIC_DESCRIPTION.join("\n\n") : product.description;
}

function teaDetailsForProduct(product: StorefrontProduct): string[][] | null {
  const flavours: Record<string, string> = { "premium-tea": "Classic", "rose-tea": "Rose", "elaichi-tea": "Elaichi" };
  const flavour = flavours[product.handle];
  if (!flavour) return null;
  return CLASSIC_DETAILS.flatMap(([label, value]) => {
    if (label === "Product Name") return [[label, product.title], ["Flavour", flavour]];
    return [[label, value]];
  });
}

function productMetadata(product: StorefrontProduct | null, handle: string): Metadata {
  if (!product) return { title: "Product" };
  const description = descriptionForProduct(product);
  return {
    title: product.title,
    description: description.slice(0, 160) || `Explore ${product.title} from Nilkurinji.`,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      type: "website",
      title: product.title,
      description: description.slice(0, 160),
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
    description: descriptionForProduct(product),
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

async function RelatedProducts({ product }: { product: StorefrontProduct }) {
  if (product.comingSoon) return null;
  const recommendations = await getRecommendations(product);
  const related = recommendations.source === "unavailable" ? [] : recommendations.data.filter((item) => item.id !== product.id);
  if (!related.length) return null;
  return <section className={styles.related}><h2>You may also like</h2><div className={styles.grid}>{related.slice(0,4).map((item) => <ProductCard key={item.id} product={item} cartEnabled={isShopifyCartEnabled()} checkoutEnabled={isShopifyCheckoutEnabled()} />)}</div></section>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { handle } = await params; const result = await getProduct(handle);
  if (result.source === "unavailable") return <div className={reading.heading} role="status"><h1>Product information is temporarily unavailable.</h1><p>Please browse all products instead.</p><Link href="/shop" className="text-link">Browse all products</Link></div>;
  if (!result.data) notFound();
  const product = result.data;
  const teaDetails = teaDetailsForProduct(product);
  const requestedVariant = (await searchParams)?.variant;
  const initialVariantId = Array.isArray(requestedVariant) ? requestedVariant[0] : requestedVariant;
  const category = CATEGORIES.find((item) => product.collectionHandles.includes(item.handle));
  return <div className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/shop">Shop</Link><ChevronRight size={14} aria-hidden="true" />{category && <><Link href={category.href}>{category.label}</Link><ChevronRight size={14} aria-hidden="true" /></>}<span>{product.title}</span></nav>
    <ProductVariantImageProvider key={product.id} initialVariantId={initialVariantId}><div className={styles.layout}><ProductGallery images={product.images} variants={product.variants} handle={product.handle} title={product.title} /><ProductDetails className={styles.detail}><h1 id="product-title">{product.title}</h1>{product.comingSoon ? <p className={styles.comingSoon} role="status">Coming Soon!</p> : <ProductPurchasePanel product={product} initialVariantId={initialVariantId} cartEnabled={isShopifyCartEnabled()} checkoutEnabled={isShopifyCheckoutEnabled()} purchasingEnabled={isShopifyCheckoutEnabled()} />}{product.description && <p className={styles.description}>{product.description}</p>}{!product.comingSoon && <TeaDetails product={product} />}</ProductDetails></div></ProductVariantImageProvider>
    <div className={styles.productInformation}><ProductTeaGuide product={product} description={product.handle === "premium-tea" ? CLASSIC_DESCRIPTION.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : product.description ? <p>{product.description}</p> : undefined} />{(teaDetails || product.details) && <ProductAccordion title="Product Details" Icon={Package}><div className={styles.detailsPanel}>{teaDetails && <table className={styles.detailsTable}><thead><tr><th scope="col">Detail</th><th scope="col">Information</th></tr></thead><tbody>{teaDetails.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table>}{product.details && <p>{product.details}</p>}</div></ProductAccordion>}{!product.comingSoon && <DeliveryChecker preview={product.isPreview} />}</div>
    {(product.howItsMade || product.isPreview) && <section className={styles.howItsMade} aria-labelledby="how-its-made-heading">
      <h2 id="how-its-made-heading">How it’s made</h2>
      <p>{product.howItsMade ?? "Production details for this product will appear here once Nilkurinji confirms them."}</p>
    </section>}
    {(product.faqs.length > 0 || product.approvedReviews.length > 0) && <div className={styles.content}>
      {product.faqs.length > 0 && <section><h2>Frequently asked questions</h2>{product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
      {product.approvedReviews.length > 0 && <section><h2>Customer reviews</h2>{product.approvedReviews.map((review,index) => <article key={`${review.name}-${index}`}><div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, i) => <Star key={i} size={16} fill="currentColor" aria-hidden="true" />)}</div>{review.title && <h3>{review.title}</h3>}<p>{review.body}</p><p className={styles.byline}>{review.name}{review.date && <> · <time dateTime={review.date}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${review.date}T00:00:00`))}</time></>}</p></article>)}</section>}
    </div>}
    <Suspense fallback={null}><RelatedProducts product={product} /></Suspense>
    {!product.isPreview && !product.comingSoon && product.priceRange && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g,"\\u003c") }} />}
  </div>;
}
