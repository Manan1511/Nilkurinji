"use client";

import { useState } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/shopify/types";
import styles from "./product-gallery.module.css";

export function ProductGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) {
    return <div className={styles.empty}><span>Product image coming soon</span></div>;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image key={active.url} className={styles.mainImage} src={active.url} alt={active.altText || title} fill sizes="(max-width: 1023px) 100vw, 55vw" preload={activeIndex === 0} />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs} aria-label="Product photos">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product photo ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={index === activeIndex ? "is-active" : ""}
            >
              <Image src={image.url} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
