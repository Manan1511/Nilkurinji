import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { WishlistButton } from "@/components/wishlist-button";
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

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const result = await getProduct(handle);
  if (result.source === "unavailable") {
    return <div className="page-header"><p className="eyebrow">Shopify catalog</p><h1 className="page-title">Product details are unavailable</h1><p className="page-header__description">{result.reason}</p></div>;
  }
  if (!result.data) notFound();
  const product = result.data;
  const category = CATEGORIES.find((item) => product.collectionHandles.includes(item.handle))
    ?? CATEGORIES.find((item) => item.label.toLowerCase() === product.productType.toLowerCase());
  const recommendations = await getRecommendations(product);
  const related = recommendations.source === "unavailable" ? [] : recommendations.data;

  return (
    <>
      <div className="product-detail">
        <ProductGallery images={product.images} title={product.title} />
        <section className="product-info" aria-labelledby="product-title">
          <div className="breadcrumb">
            <Link href="/">Home</Link><ChevronRight aria-hidden="true" />
            {category && <><Link href={category.href}>{category.label}</Link><ChevronRight aria-hidden="true" /></>}
            <span>{product.title}</span>
          </div>
          <Link href={category?.href ?? "/shop"} className="product-info__back">← Back to {category?.label ?? "the shop"}</Link>
          <p className="eyebrow product-info__category">{product.isPreview ? "Design preview" : (category?.label ?? product.productType ?? "Nilkurinji pantry")}</p>
          <h1 id="product-title">{product.title}</h1>
          <p className="product-info__description">
            {product.description || (product.isPreview ? "This visual placeholder has no approved product description." : "Product information is being prepared in Shopify.")}
          </p>
          <div className="product-info__actions">
            <WishlistButton handle={product.handle} />
          </div>
          <ProductPurchasePanel product={product} purchasingEnabled={isShopifyCheckoutEnabled()} />
        </section>
      </div>

      <section className="product-content">
        <div className="product-content__section">
          <h2>Product details</h2>
          <p>{product.details || (product.isPreview ? "Approved product details will appear here once published in Shopify." : "Product details will appear here when they are added to Shopify.")}</p>
        </div>
        <div className="product-content__section product-faq">
          <h2>Frequently asked questions</h2>
          {product.faqs.length ? product.faqs.map((faq) => (
            <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>
          )) : <p>Product-specific FAQs will be published here from Shopify.</p>}
        </div>
        <div className="product-content__section product-reviews">
          <h2>Customer reviews</h2>
          {product.approvedReviews.length ? (
            <div className="product-reviews__list">
              {product.approvedReviews.map((review, index) => (
                <article className="product-review" key={`${review.name}-${review.date ?? "undated"}-${index}`}>
                  <p className="product-review__rating"><span aria-hidden="true">{"★".repeat(review.rating)}</span><span className="sr-only">{review.rating} out of 5 stars</span></p>
                  {review.title && <h3>{review.title}</h3>}
                  <p>{review.body}</p>
                  <p className="product-review__byline">{review.name}{review.date && <> · <time dateTime={review.date}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${review.date}T00:00:00`))}</time></>}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="product-reviews__placeholder">Customer reviews will appear here after approved review content is added to Shopify.</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--wide">
          <div className="section-heading"><div><p className="eyebrow">Keep exploring</p><h2>You may also like</h2></div></div>
          <div className="product-grid">{related.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} purchasingEnabled={isShopifyCheckoutEnabled()} />)}</div>
        </section>
      )}

      {!product.isPreview && product.priceRange && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }} />
      )}
    </>
  );
}
