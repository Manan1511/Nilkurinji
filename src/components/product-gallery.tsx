"use client";

import { useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShopifyImage, StorefrontVariant } from "@/lib/shopify/types";
import styles from "./product-gallery.module.css";
import { useProductVariantImage } from "./product-variant-image";
import { curatedProductGallery } from "@/lib/catalog/product-gallery";

function GalleryPhoto({ image, previous, title, first, onLoaded }: { image: ShopifyImage; previous: ShopifyImage | null; title: string; first: boolean; onLoaded: (image: ShopifyImage) => void }) {
  const [loaded, setLoaded] = useState(false);
  return <>
    {previous && <Image className={styles.previousImage} src={previous.url} alt="" aria-hidden="true" fill quality={85} sizes="(max-width: 1023px) 100vw, 55vw" loading="eager" />}
    <Image className={`${styles.mainImage} ${previous ? (loaded ? styles.imageEntering : styles.imageWaiting) : ""}`} src={image.url} alt={image.altText || title} fill quality={85} sizes="(max-width: 1023px) 100vw, 55vw" preload={first} loading={first ? undefined : "eager"} onLoad={() => { setLoaded(true); onLoaded(image); }} onError={() => setLoaded(true)} />
  </>;
}

export function ProductGallery({ images, title, handle, variants = [] }: { images: ShopifyImage[]; title: string; handle?: string; variants?: StorefrontVariant[] }) {
  const { imageUrl, variantId } = useProductVariantImage();
  const selectedVariant = variants.find((variant) => variant.id === variantId) ?? variants.find((variant) => variant.availableForSale) ?? variants[0];
  const pack = selectedVariant?.selectedOptions.find((option) => /pack|size|weight/i.test(option.name))?.value.toLowerCase().replace(/\s+/g, "");
  const size = pack === "500g" || pack === "0.5kg" ? "500g" : pack === "1kg" || pack === "1000g" ? "1kg" : null;
  const curated = curatedProductGallery(handle, pack, title);
  const visibleImages = curated ?? (size ? images.filter((image) => {
    if (image.url.includes("/campaign-")) return true;
    const text = `${image.url} ${image.altText ?? ""}`.toLowerCase().replace(/\s+/g, "");
    const is500g = /500g|0\.5kg/.test(text);
    const is1kg = /1kg|1000g/.test(text);
    if (size === "500g" && is1kg && !is500g) return false;
    if (size === "1kg" && is500g && !is1kg) return false;
    return (size === "500g" ? is500g : is1kg) || selectedVariant?.image?.url === image.url;
  }) : images);
  const selectedImageUrl = imageUrl ?? selectedVariant?.image?.url ?? null;
  const selectionKey = `${variantId ?? selectedVariant?.id ?? ""}:${selectedImageUrl ?? ""}`;
  const [selection, setSelection] = useState<{ key: string; index: number; previous?: ShopifyImage | null }>({ key: "", index: 0 });
  const lastLoaded = useRef<{ key: string; image: ShopifyImage } | null>(null);
  const variantIndex = selectedImageUrl ? visibleImages.findIndex((image) => image.url === selectedImageUrl) : -1;
  const activeIndex = selection.key === selectionKey && selection.index < visibleImages.length ? selection.index : Math.max(variantIndex, 0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const active = visibleImages[activeIndex];

  const moveImage = (direction: number) => {
    setSelection((current) => {
      const index = current.key === selectionKey && current.index < visibleImages.length ? current.index : Math.max(variantIndex, 0);
      return { key: selectionKey, index: (index + direction + visibleImages.length) % visibleImages.length, previous: lastLoaded.current?.key === selectionKey ? lastLoaded.current.image : visibleImages[activeIndex] };
    });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if ((event.target instanceof Element && event.target.closest("button")) || visibleImages.length < 2 || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || visibleImages.length < 2) return;

    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    moveImage(deltaX < 0 ? 1 : -1);
  };

  if (!active) {
    return <div className={styles.empty}><span>Product image coming soon</span></div>;
  }

  return (
    <div className={styles.gallery}>
      <div
        className={styles.main}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <GalleryPhoto key={`${selectionKey}:${active.url}`} image={active} previous={selection.key === selectionKey && selection.previous?.url !== active.url ? selection.previous ?? null : null} title={title} first={activeIndex === 0} onLoaded={(image) => { lastLoaded.current = { key: selectionKey, image }; }} />
      </div>
      {visibleImages.length > 1 && (
        <div className={styles.controls}>
          <button type="button" className={styles.arrow} aria-label="Previous product image" onClick={() => moveImage(-1)}><ChevronLeft size={19} strokeWidth={1.6} aria-hidden="true" /></button>
          <div className={styles.dots} role="group" aria-label="Product photo selection">
          {visibleImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setSelection({ key: selectionKey, index, previous: lastLoaded.current?.key === selectionKey ? lastLoaded.current.image : active })}
              aria-label={`Show product photo ${index + 1} of ${visibleImages.length}`}
              aria-pressed={index === activeIndex}
            />
          ))}
          </div>
          <button type="button" className={styles.arrow} aria-label="Next product image" onClick={() => moveImage(1)}><ChevronRight size={19} strokeWidth={1.6} aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}
