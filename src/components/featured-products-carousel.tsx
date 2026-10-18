"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { StorefrontProduct } from "@/lib/shopify/types";

export function FeaturedProductsCarousel({
  products,
  purchasingEnabled,
}: {
  products: StorefrontProduct[];
  purchasingEnabled: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.76, 220),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="home-product-carousel">
      <div className="home-product-carousel__controls" aria-label="Featured product carousel controls">
        <button type="button" className="carousel-arrow" aria-label="Show previous products" onClick={() => move(-1)}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className="carousel-arrow" aria-label="Show more products" onClick={() => move(1)}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div id="featured-products" ref={trackRef} className="home-product-carousel__track" aria-label="Featured products">
        {products.map((product) => (
          <div className="home-product-carousel__item" key={product.id}>
            <ProductCard product={product} purchasingEnabled={purchasingEnabled} variant="featured" />
          </div>
        ))}
      </div>
    </div>
  );
}
