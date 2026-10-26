import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { QuickAddButton } from "@/components/quick-add-button";
import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./product-card.module.css";

type CardVariant = "standard" | "featured" | "collection";

export function ProductCard({ product, purchasingEnabled = false, variant = "standard", compactQuickAdd = false }: { product: StorefrontProduct; purchasingEnabled?: boolean; variant?: CardVariant; compactQuickAdd?: boolean; revealDelayMs?: number }) {
  const image = product.cardImage ?? product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const range = product.priceRange && product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const available = product.variants.some((item) => item.availableForSale);
  const packOptions = [...new Set(product.variants.map((item) => item.selectedOptions.find((option) => option.name.toLowerCase() === "pack size")?.value).filter((value): value is string => Boolean(value)))];
  const packText = packOptions.join(" · ");
  const compact = compactQuickAdd || variant === "featured";
  const canQuickAdd = !product.isPreview && purchasingEnabled && available && product.variants.length === 1;

  return <article className={`${styles.card} ${variant === "featured" ? styles.featured : ""}`}>
    <div className={styles.frame}>
      <Link href={`/products/${product.handle}`} className={styles.imageLink} aria-label={`View ${product.title}`}>
        {image ? <Image src={image.url} alt={image.altText || product.title} fill sizes={variant === "featured" ? "(max-width: 599px) 46vw, (max-width: 899px) 30vw, (max-width: 1199px) 25vw, 17vw" : "(max-width: 599px) 46vw, (max-width: 899px) 30vw, (max-width: 1199px) 23vw, 19vw"} className={styles.image} /> : <span className={styles.fallback}>Image coming soon</span>}
      </Link>
    </div>
    <div className={styles.details}>
      <h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3>
      {product.productType && <p className={styles.type}>{product.productType}</p>}
      {packText && <p className={styles.pack}>{packText}</p>}
      <p className={styles.price}>{price ? <>{product.isPreview ? "Sample price: " : range ? "From " : ""}{formatMoney(price)}</> : "Price unavailable"}</p>
      {!product.isPreview && !available && <p className={styles.unavailable}>Currently unavailable</p>}
      {!product.isPreview && purchasingEnabled && available ? product.variants.length > 1
        ? compact ? <Link href={`/products/${product.handle}`} className={styles.cardLinkIcon} aria-label={`Choose options for ${product.title}`}><ShoppingCart aria-hidden="true" /></Link> : <Link href={`/products/${product.handle}`} className={styles.link}>Choose options</Link>
        : canQuickAdd && compact ? <div className={styles.quickAdd}><QuickAddButton product={product} purchasingEnabled={purchasingEnabled} compact /></div> : <QuickAddButton product={product} purchasingEnabled={purchasingEnabled} />
        : <Link href={`/products/${product.handle}`} className={styles.link}>View details{variant === "featured" && <ArrowRight size={14} aria-hidden="true" />}</Link>}
    </div>
  </article>;
}
