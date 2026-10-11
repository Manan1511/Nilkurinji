"use client";

import { useState } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/shopify/types";

export function ProductGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) {
    return <div className="product-gallery__empty"><span>Product imagery</span><small>Shopify photos appear here once published.</small></div>;
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image src={active.url} alt={active.altText || title} fill sizes="(max-width: 800px) 100vw, 55vw" priority className="product-gallery__image" />
      </div>
      {images.length > 1 && (
        <div className="product-gallery__thumbs" aria-label="Product photos">
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
