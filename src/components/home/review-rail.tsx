"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./home-reviews.module.css";

export function ReviewRail({ children, count }: { children: ReactNode; count: number }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let scrollFrame = 0;

    const resetToFirstReview = () => {
      rail.scrollLeft = 0;
      setActiveIndex(0);
    };

    const updateActiveReview = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const railStart = rail.getBoundingClientRect().left + rail.clientLeft + parseFloat(getComputedStyle(rail).paddingLeft);
        const cards = Array.from(rail.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
        if (cards.length === 0) return;
        const nearestIndex = cards.reduce((nearest, card, index) => {
          const nearestOffset = Math.abs(cards[nearest].getBoundingClientRect().left - railStart);
          const cardOffset = Math.abs(card.getBoundingClientRect().left - railStart);
          return cardOffset < nearestOffset ? index : nearest;
        }, 0);

        setActiveIndex(nearestIndex);
      });
    };

    resetToFirstReview();
    rail.addEventListener("scroll", updateActiveReview, { passive: true });

    return () => {
      cancelAnimationFrame(scrollFrame);
      rail.removeEventListener("scroll", updateActiveReview);
    };
  }, [count]);

  const scrollToReview = (index: number) => {
    const rail = railRef.current;
    const card = rail?.children.item(index);
    if (!(rail && card instanceof HTMLElement)) return;

    const railStart = rail.getBoundingClientRect().left + rail.clientLeft + parseFloat(getComputedStyle(rail).paddingLeft);
    const cardStart = card.getBoundingClientRect().left;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    rail.scrollTo({ left: rail.scrollLeft + cardStart - railStart, behavior });
  };

  return <>
    <div ref={railRef} className={styles.grid} role="region" aria-label="Customer reviews" tabIndex={0}>
      {children}
    </div>
    {count > 1 && <nav className={styles.dots} aria-label="Choose a review">
      {Array.from({ length: count }, (_, index) => <button
        key={index}
        type="button"
        aria-label={`Review ${index + 1}`}
        aria-controls={`home-review-${index + 1}`}
        aria-current={activeIndex === index ? "true" : undefined}
        onClick={() => scrollToReview(index)}
      />)}
    </nav>}
  </>;
}
