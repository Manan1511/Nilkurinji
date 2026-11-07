"use client";

import { useRef, useState, type CSSProperties, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { ShopifyImage, StorefrontVariant } from "@/lib/shopify/types";
import styles from "./product-gallery.module.css";
import { useProductVariantImage } from "./product-variant-image";
import { curatedProductGallery } from "@/lib/catalog/product-gallery";
import { defaultVariant } from "@/lib/catalog/default-variant";

function GalleryPhoto({ image, previous, title, first, onLoaded }: { image: ShopifyImage; previous: ShopifyImage | null; title: string; first: boolean; onLoaded: (image: ShopifyImage) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  return <>
    {previous && !transitionComplete && <div className={styles.previousLayer}><Image className={styles.galleryImage} src={previous.url} alt="" aria-hidden="true" width={previous.width ?? 1086} height={previous.height ?? 1448} quality={85} sizes="(max-width: 1023px) 100vw, 55vw" loading="eager" /></div>}
    <div className={`${styles.currentLayer} ${previous ? (loaded ? styles.imageEntering : styles.imageWaiting) : ""}`} onAnimationEnd={() => setTransitionComplete(true)}>
      <Image className={styles.galleryImage} src={image.url} alt={image.altText || title} width={image.width ?? 1086} height={image.height ?? 1448} quality={85} sizes="(max-width: 1023px) 100vw, 55vw" preload={first} loading={first ? undefined : "eager"} onLoad={() => { setLoaded(true); onLoaded(image); if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setTransitionComplete(true); }} onError={() => { setLoaded(true); setTransitionComplete(true); }} />
    </div>
  </>;
}

export function ProductGallery({ images, title, handle, variants = [] }: { images: ShopifyImage[]; title: string; handle?: string; variants?: StorefrontVariant[] }) {
  const { imageUrl, variantId } = useProductVariantImage();
  const selectedVariant = defaultVariant(variants, variantId ?? undefined);
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
  const [zoomed, setZoomed] = useState(false);
  const zoomDialog = useRef<HTMLDialogElement>(null);
  const lastLoaded = useRef<{ key: string; image: ShopifyImage } | null>(null);
  // Curated galleries are ordered with the selected pack's front shot first.
  // Shopify's variant image can point at a campaign photo, so only use it to
  // choose the initial frame when the gallery is not curated.
  const variantIndex = !curated && selectedImageUrl ? visibleImages.findIndex((image) => image.url === selectedImageUrl) : -1;
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

  const openZoom = () => {
    setZoomed(false);
    zoomDialog.current?.showModal();
  };

  const closeZoom = () => {
    zoomDialog.current?.close();
    setZoomed(false);
  };

  if (!active) {
    return <div className={styles.empty}><span>Product image coming soon</span></div>;
  }

  return (
    <div className={styles.gallery}>
      <div
        className={styles.main}
        style={{ "--image-ratio": (active.width ?? 1086) / (active.height ?? 1448) } as CSSProperties}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <GalleryPhoto key={`${selectionKey}:${active.url}`} image={active} previous={selection.key === selectionKey && selection.previous?.url !== active.url ? selection.previous ?? null : null} title={title} first={activeIndex === 0} onLoaded={(image) => { lastLoaded.current = { key: selectionKey, image }; }} />
        <button type="button" className={styles.zoomTrigger} onClick={openZoom} aria-label={`View larger image of ${title}`}>
          <ZoomIn size={18} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.controls} role="group" aria-label="Product gallery controls">
        <button type="button" className={styles.arrow} aria-label="Previous product image" onClick={() => moveImage(-1)} disabled={visibleImages.length < 2}><ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" /></button>
        <span className={styles.counter} role="status" aria-live="polite" aria-atomic="true">{activeIndex + 1}<span aria-hidden="true">/</span>{visibleImages.length}</span>
        <button type="button" className={styles.arrow} aria-label="Next product image" onClick={() => moveImage(1)} disabled={visibleImages.length < 2}><ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" /></button>
      </div>

      <dialog
        ref={zoomDialog}
        className={styles.zoomDialog}
        aria-label={`${title} product image viewer`}
        onClose={() => setZoomed(false)}
        onClick={(event) => { if (event.target === event.currentTarget) closeZoom(); }}
      >
        <div className={styles.zoomPanel}>
          <div className={styles.zoomHeader}>
            <p>{title}</p>
            <button type="button" className={styles.zoomClose} onClick={closeZoom} aria-label="Close image viewer"><X size={20} strokeWidth={1.6} aria-hidden="true" /></button>
          </div>
          <div className={styles.zoomViewport} data-zoomed={zoomed} style={{ "--image-ratio": (active.width ?? 1086) / (active.height ?? 1448) } as CSSProperties}>
            <Image className={styles.zoomImage} src={active.url} alt={active.altText || title} width={active.width ?? 1086} height={active.height ?? 1448} quality={95} sizes="(max-width: 767px) 88vw, 76vh" />
          </div>
          <div className={styles.zoomFooter}>
            <span>{activeIndex + 1}/{visibleImages.length}</span>
            <button type="button" className={styles.zoomAction} onClick={() => setZoomed((current) => !current)} aria-pressed={zoomed}>
              {zoomed ? <ZoomOut size={17} strokeWidth={1.7} aria-hidden="true" /> : <ZoomIn size={17} strokeWidth={1.7} aria-hidden="true" />}
              {zoomed ? "Fit image" : "Zoom in"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
