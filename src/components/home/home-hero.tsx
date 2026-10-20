"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ActionLink, IconButton } from "@/components/storefront/action";
import styles from "./home.module.css";
export type BannerSlide = { eyebrow: string; heading: string; description: string; image: string | null; imageAlt: string; imageCaption: string; href: string };
export function HomeHero({ slides }: { slides: BannerSlide[] }) {
  const [index, setIndex] = useState(0);
  if (!slides.length) return null;
  const slide = slides[index] ?? slides[0];
  return <section className={styles.hero} aria-label="Nilkurinji tea" aria-roledescription={slides.length > 1 ? "carousel" : undefined}>
    <div className={styles.heroCopy}><h1>{slide.heading}</h1><p>{slide.description}</p><ActionLink href={slide.href}>Explore tea <ArrowRight aria-hidden="true" size={18} /></ActionLink>
      {slides.length > 1 && <div className={styles.controls}><IconButton aria-label="Previous banner" onClick={() => setIndex((index - 1 + slides.length) % slides.length)}><ArrowLeft aria-hidden="true" /></IconButton><span aria-live="polite">{index + 1} / {slides.length}</span><IconButton aria-label="Next banner" onClick={() => setIndex((index + 1) % slides.length)}><ArrowRight aria-hidden="true" /></IconButton></div>}
    </div>
    <div className={styles.heroMedia}>{slide.image && <Image src={slide.image} alt={slide.imageAlt} fill preload={index === 0} sizes="(max-width: 1023px) 100vw, 48vw" />}{slide.imageCaption && <span className={styles.caption}>{slide.imageCaption}</span>}</div>
  </section>;
}
