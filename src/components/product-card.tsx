import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { WishlistButton } from "@/components/wishlist-button";
import { QuickAddButton } from "@/components/quick-add-button";
import type { StorefrontProduct } from "@/lib/shopify/types";

export function ProductCard({ product, purchasingEnabled = false, variant = "standard", revealDelayMs = 0 }: { product: StorefrontProduct; purchasingEnabled?: boolean; variant?: "standard" | "featured" | "collection"; revealDelayMs?: number }) {
  const featured = variant === "featured";
  const collection = variant === "collection";
  const image = product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const isRange = Boolean(
    product.priceRange && product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount,
  );

  return (
    <article className={`product-card product-card--${variant}`} data-scroll-reveal="product" data-scroll-reveal-delay={revealDelayMs || undefined}>
      <div className="product-card__image-wrap">
        <Link href={`/products/${product.handle}`} className="product-card__image-link" aria-label={`View ${product.title}`}>
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
              className="product-card__image"
            />
          ) : (
            <div className="product-card__image-empty" aria-hidden="true"><span>Nilkurinji</span></div>
          )}
        </Link>
        <WishlistButton handle={product.handle} compact />
        {product.isPreview && <span className="product-card__badge">Preview</span>}
      </div>
      <div className="product-card__details">
        <p className="eyebrow product-card__category">{product.productType || "Nilkurinji pantry"}</p>
        <h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3>
        {collection && <p className="product-card__description">{product.description}</p>}
        {price ? (
          <p className="product-card__price">{isRange ? "From " : ""}{formatMoney(price)}</p>
        ) : (
          <p className="product-card__preview-note">Product details pending</p>
        )}
        {!featured && !collection && <Link href={`/products/${product.handle}`} className="product-card__link">View details <ArrowUpRight aria-hidden="true" size={14} /></Link>}
        <QuickAddButton product={product} purchasingEnabled={purchasingEnabled} compact={featured} />
      </div>
    </article>
  );
}
