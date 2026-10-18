"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type BannerSlide = {
  eyebrow: string;
  heading: string;
  description: string;
  image: string | null;
  imageAlt: string;
  imageCaption: string;
  href: string;
};

export function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!slides.length) return null;
  const active = slides[activeIndex];
  const goTo = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return (
    <section className="hero-carousel hero-carousel--home" aria-label="Featured stories">
      <div className="hero-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${activeIndex + 1} of ${slides.length}`} aria-live="polite">
        <div key={activeIndex} className="hero-carousel__copy">
          <p className="eyebrow hero-carousel__eyebrow">{active.eyebrow}</p>
          <h1>{active.heading}</h1>
          <p className="hero-carousel__description">{active.description}</p>
          <Link href={active.href} className="button button--dark">
            Explore our range <ArrowRight aria-hidden="true" size={17} />
          </Link>
          {slides.length > 1 && <div className="hero-carousel__controls">
            <button type="button" className="carousel-arrow" aria-label="Previous banner" onClick={() => goTo(activeIndex - 1)}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <div className="carousel-dots" aria-label="Choose banner">
              {slides.map((slide, index) => (
                <button
                  key={slide.heading}
                  type="button"
                  className={index === activeIndex ? "is-active" : ""}
                  aria-label={`Show banner ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
            <button type="button" className="carousel-arrow" aria-label="Next banner" onClick={() => goTo(activeIndex + 1)}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>}
        </div>
        <div className={`hero-carousel__visual ${active.image ? "" : "hero-carousel__visual--pending"}`}>
          {active.image && <Image
            key={activeIndex}
            src={active.image}
            alt={active.imageAlt}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 767px) 100vw, 55vw"
            className="hero-carousel__image"
          />}
        </div>
      </div>
    </section>
  );
}
