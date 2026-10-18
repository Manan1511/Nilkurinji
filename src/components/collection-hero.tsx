import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CollectionHero({
  eyebrow,
  heading,
  description,
  image,
  imageAlt,
  ctaLabel,
  ctaHref = "#collection-products",
  className = "",
}: {
  eyebrow: string;
  heading: string;
  description: string;
  image: string | null;
  imageAlt: string;
  ctaLabel: string;
  ctaHref?: string;
  className?: string;
}) {
  return (
    <section className={`collection-hero ${className}`} aria-labelledby="collection-hero-heading">
      <div className="collection-hero__visual" role={image ? "img" : undefined} aria-label={image ? imageAlt : undefined} aria-hidden={!image}>
        {image && <Image src={image} alt="" fill priority sizes="100vw" className="collection-hero__image" />}
      </div>
      <div className="collection-hero__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="collection-hero-heading">{heading}</h1>
        <p className="collection-hero__description">{description}</p>
        <Link href={ctaHref} className="button button--dark">
          {ctaLabel} <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
