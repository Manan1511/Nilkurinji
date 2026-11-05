"use client";

import { useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/shopify/types";
import styles from "./product-gallery.module.css";

export function ProductGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const active = images[activeIndex];

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (images.length < 2 || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || images.length < 2) return;

    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    setActiveIndex((index) => (index + (deltaX < 0 ? 1 : -1) + images.length) % images.length);
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
        <Image key={active.url} className={styles.mainImage} src={active.url} alt={active.altText || title} fill quality={85} sizes="(max-width: 1023px) 100vw, 55vw" preload={activeIndex === 0} />
      </div>
      {images.length > 1 && (
        <div className={styles.dots} role="group" aria-label="Product photo selection">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product photo ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
