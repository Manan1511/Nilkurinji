import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ReviewRail } from "@/components/home/review-rail";
import styles from "./home-reviews.module.css";
import type { ApprovedProductReview, StorefrontProduct } from "@/lib/shopify/types";

type HomepageReview = {
  id: string;
  productHandle: string;
  productTitle: string;
  review: ApprovedProductReview;
  sample?: boolean;
};

const PREVIEW_REVIEW_COPY: Omit<ApprovedProductReview, "date">[] = [
  {
    name: "Mira S.",
    rating: 5,
    title: "A gentle start to the day",
    body: "An easy cup for slow mornings. I like making a little time for it before the day gets busy.",
  },
  {
    name: "Arjun R.",
    rating: 5,
    title: "A pause in the afternoon",
    body: "Comforting and easy to come back to when I want a quiet moment in the middle of the day.",
  },
  {
    name: "Neha P.",
    rating: 4,
    title: "A simple everyday cup",
    body: "A small, familiar ritual that fits just as well at my desk as it does at home.",
  },
];

const REVIEW_PHOTOS = [
  "/images/tea-hero-editorial.webp",
  "/images/leaf-to-cup/hero-cup.webp",
  "/images/category-tea-bags-kurinji.webp",
] as const;

function recentApprovedReviews(products: StorefrontProduct[]): HomepageReview[] {
  return products
    .filter((product) => !product.isPreview)
    .flatMap((product) => product.approvedReviews.map((review, index) => ({
      id: `${product.handle}-${review.date ?? "undated"}-${review.name}-${index}`,
      productHandle: product.handle,
      productTitle: product.title,
      review,
    })))
    .sort((a, b) => (b.review.date ?? "").localeCompare(a.review.date ?? ""))
    .slice(0, 3);
}

function previewSampleReviews(products: StorefrontProduct[]): HomepageReview[] {
  const previewProducts = products.slice(0, PREVIEW_REVIEW_COPY.length);
  return previewProducts.map((product, index) => ({
    id: `preview-sample-${product.handle}`,
    productHandle: product.handle,
    productTitle: product.title,
    review: { ...PREVIEW_REVIEW_COPY[index], date: null },
    sample: true,
  }));
}

export function HomeReviews({ products, preview }: { products: StorefrontProduct[]; preview: boolean }) {
  const approvedReviews = recentApprovedReviews(products);
  const reviews = approvedReviews.length ? approvedReviews : preview ? previewSampleReviews(products) : [];
  if (!preview && reviews.length === 0) return null;

  return <section className={styles.section} aria-labelledby="home-reviews-heading">
    <span className={styles.foliage} aria-hidden="true">
      <Image className={styles.leafTopLeft} src="/images/botanical/botanical-editorial-left.webp" alt="" width={1024} height={683} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
      <Image className={styles.leafTopRight} src="/images/botanical/botanical-editorial-right-kurinji.webp" alt="" width={1024} height={683} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
      <Image className={styles.leafBottomLeft} src="/images/botanical/botanical-categories-left.webp" alt="" width={683} height={1024} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
      <Image className={styles.leafBottomRight} src="/images/botanical/botanical-categories-right-kurinji.webp" alt="" width={1024} height={683} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
    </span>
    <div className={styles.inner}>
      <header className={styles.heading}>
        <span className={styles.ornament} aria-hidden="true"><BrandMark /></span>
        <h2 id="home-reviews-heading">The Nilkurinji Journal</h2>
        {reviews.length > 0 && <p>Real stories, honest experiences and love shared by our customers.</p>}
      </header>

      {reviews.length > 0 ? <ReviewRail count={reviews.length}>
        {reviews.map(({ id, productHandle, productTitle, review, sample }, index) => {
          const photo = REVIEW_PHOTOS[index % REVIEW_PHOTOS.length] ?? REVIEW_PHOTOS[0];
          return <article className={styles.review} key={id} id={`home-review-${index + 1}`}>
            <div className={styles.copy}>
            <div className={styles.rating} role="img" aria-label={`${review.rating} out of 5 stars${sample ? ", mock rating" : ""}`}>
              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < review.rating ? "currentColor" : "none"} aria-hidden="true" />)}
            </div>
            {review.title && <h3>{review.title}</h3>}
            <p className={styles.body}>{review.body}</p>
            <div className={styles.byline}>
              <span>{review.name}</span>
              <Link href={`/products/${productHandle}`}>{productTitle}</Link>
              {review.date && <time dateTime={review.date}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${review.date}T00:00:00`))}</time>}
            </div>
            </div>
            <div className={styles.photo}><Image src={photo} alt="" fill sizes="(max-width: 359px) 100px, (max-width: 599px) calc((100vw - 40px) * 0.35), 250px" /></div>
          </article>;
        })}
      </ReviewRail> : <p className={styles.empty}>Approved customer reviews will appear here when available.</p>}
    </div>
  </section>;
}
