"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { ProductCardActions } from "@/components/product-card-actions";
import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./product-card.module.css";
import { cardAlternateImage } from "@/lib/catalog/card-image";
import { defaultVariant } from "@/lib/catalog/default-variant";

type CardVariant = "standard" | "featured" | "collection";

export function ProductCard({ product, cartEnabled, checkoutEnabled, purchasingEnabled = false, variant = "standard", priority = false }: { product: StorefrontProduct; cartEnabled?: boolean; checkoutEnabled?: boolean; purchasingEnabled?: boolean; variant?: CardVariant; compactQuickAdd?: boolean; revealDelayMs?: number; priority?: boolean }) {
  const initialVariant = defaultVariant(product.variants);
  const selectedVariant = initialVariant;
  const image = selectedVariant?.image ?? product.cardImage ?? product.featuredImage;
  const alternateImage = cardAlternateImage(product, image, selectedVariant);
  const imageSizes = variant === "featured"
    ? "(max-width: 359px) 78vw, (max-width: 599px) 280px, (max-width: 899px) 32vw, (max-width: 1199px) 25vw, 20vw"
    : "(max-width: 599px) 45vw, (max-width: 899px) 32vw, (max-width: 1199px) 25vw, 20vw";
  const price = product.priceRange?.minVariantPrice;
  const range = product.priceRange && product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const available = product.variants.some((item) => item.availableForSale);
  const packOptions = [...new Set(product.variants.map((item) => item.selectedOptions.find((option) => option.name.toLowerCase() === "pack size")?.value).filter((value): value is string => Boolean(value)))];
  const packText = packOptions.join(" · ");
  const canUseCart = cartEnabled ?? purchasingEnabled;
  const canUseCheckout = checkoutEnabled ?? purchasingEnabled;

  const hasComingSoonPreview = product.comingSoon && !image;

  return <article className={`${styles.card} ${variant === "featured" ? styles.featured : ""} ${hasComingSoonPreview ? styles.comingSoonCard : ""}`}>
    <Link href={`/products/${product.handle}`} className={`${styles.productLink} ${alternateImage ? styles.hasAlternate : ""}`} aria-label={`View ${product.title}`}>
      <div className={styles.frame} style={{ "--product-image-ratio": image?.width && image?.height ? `${image.width} / ${image.height}` : "4 / 3" } as CSSProperties}>
        {image ? <>
          <Image src={image.url} alt={image.altText || product.title} fill quality={95} sizes={imageSizes} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className={`${styles.image} ${styles.primaryImage}`} />
          {alternateImage && <Image src={alternateImage.url} alt="" aria-hidden="true" fill quality={95} sizes={imageSizes} loading="lazy" fetchPriority="low" className={`${styles.image} ${styles.alternateImage}`} />}
        </> : hasComingSoonPreview ? <div className={styles.ghostPreview} aria-hidden="true">
          <span className={styles.previewRule} />
          <span className={styles.previewTitle}>{product.title.replace(/^Nilkurinji\s+Premium\s+/i, "")}</span>
          <span className={styles.previewCaption}>Coming soon</span>
          <span className={styles.previewRule} />
        </div> : <span className={styles.fallback}>Image coming soon</span>}
      </div>
      <div className={styles.details}>
        <h3>{product.title}</h3>
        <p className={styles.type}>{product.productType || "\u00a0"}</p>
        <p className={styles.pack}>{packText || "\u00a0"}</p>
        {!product.comingSoon && <p className={styles.price}>{price ? <>{!product.isPreview && range ? "From " : ""}{formatMoney(price)}</> : "Price unavailable"}</p>}
        {!product.comingSoon && !product.isPreview && !available && <p className={styles.unavailable}>Currently unavailable</p>}
      </div>
    </Link>
    {product.comingSoon ? <div className={styles.chooseActions}><p className={styles.comingSoon}>Coming Soon!</p></div> : (product.variants.length > 1 ? <div className={styles.chooseActions}>
      <Link className={styles.choosePack} href={`/products/${product.handle}`}>Choose pack</Link>
    </div> : <ProductCardActions product={product} cartEnabled={canUseCart} checkoutEnabled={canUseCheckout} hideVariantSelector hideBuyNow />)}
  </article>;
}
