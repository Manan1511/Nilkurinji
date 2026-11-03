"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import styles from "./home-reviews.module.css";

export function ReviewRail({ children, count }: { children: ReactNode; count: number }) {
  const groupRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reviews = Children.toArray(children);

  useEffect(() => {
    const group = groupRef.current;
    const track = trackRef.current;
    if (!group || !track || count < 2) return;

    const setGlideDuration = () => {
      const durationSeconds = group.scrollWidth / 30;
      track.style.setProperty("--review-glide-duration", `${durationSeconds}s`);
    };

    setGlideDuration();
    const observer = new ResizeObserver(setGlideDuration);
    observer.observe(group);
    return () => observer.disconnect();
  }, [count]);

  return <div
    className={styles.grid}
    role="region"
    aria-label="Customer reviews"
    aria-roledescription="carousel"
    tabIndex={0}
  >
    <div ref={trackRef} className={styles.track} data-loop={count > 1}>
      <div ref={groupRef} className={styles.group}>
        {reviews}
      </div>
      {count > 1 && <div className={`${styles.group} ${styles.duplicate}`} aria-hidden="true" inert>
        {reviews}
      </div>}
    </div>
  </div>;
}
