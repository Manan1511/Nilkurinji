import Link from "next/link";
import { Star } from "lucide-react";
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
  const previewProducts = products.filter((product) => product.isPreview).slice(0, PREVIEW_REVIEW_COPY.length);
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
  const showingSamples = reviews.some((item) => item.sample);

  return <section className={styles.section} aria-labelledby="home-reviews-heading">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <h2 id="home-reviews-heading">Customer reviews</h2>
        {reviews.length > 0 && <p>{showingSamples ? "Illustrative mock reviews for the design preview. Not customer feedback." : "Notes shared by Nilkurinji customers."}</p>}
      </header>

      {reviews.length > 0 ? <div className={styles.grid} role="region" aria-label="Customer reviews" tabIndex={0}>
        {reviews.map(({ id, productHandle, productTitle, review, sample }) => (
          <article className={styles.review} key={id}>
            {sample && <p className={styles.sampleTag}>Preview sample</p>}
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
          </article>
        ))}
      </div> : <p className={styles.empty}>Approved customer reviews will appear here when available.</p>}
    </div>
  </section>;
}
