import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { QuickAddButton } from "@/components/quick-add-button";
import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./product-card.module.css";
export function ProductCard({ product, purchasingEnabled = false }: { product: StorefrontProduct; purchasingEnabled?: boolean; variant?: "standard" | "featured" | "collection"; compactQuickAdd?: boolean; revealDelayMs?: number }) {
  const image = product.cardImage ?? product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const range = product.priceRange && product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const available = product.variants.some((variant) => variant.availableForSale);
  return <article className={styles.card}>
    <div className={styles.frame}>
      <Link href={`/products/${product.handle}`} className={styles.imageLink} aria-label={`View ${product.title}`}>
        {image ? <Image src={image.url} alt={image.altText || product.title} fill sizes="(max-width: 767px) 46vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 23vw" className={styles.image} /> : <span className={styles.fallback}>Image coming soon</span>}
      </Link>
    </div>
    <div className={styles.details}>
      <h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3>
      {product.productType && <p className={styles.type}>{product.productType}</p>}
      <p className={styles.price}>{price ? <>{product.isPreview ? "Sample price: " : range ? "From " : ""}{formatMoney(price)}</> : "Price unavailable"}</p>
      {!product.isPreview && !available && <p className={styles.unavailable}>Currently unavailable</p>}
      {!product.isPreview && purchasingEnabled && available ? (product.variants.length > 1 ? <Link href={`/products/${product.handle}`} className={styles.link}>Choose options</Link> : <QuickAddButton product={product} purchasingEnabled={purchasingEnabled} />) : <Link href={`/products/${product.handle}`} className={styles.link}>View details</Link>}
    </div>
  </article>;
}
