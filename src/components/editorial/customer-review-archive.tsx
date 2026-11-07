import type { CustomerReview } from "@/lib/customer-reviews";
import Image from "next/image";
import styles from "./editorial.module.css";

export function CustomerReviewArchive({ reviews, compact = false }: { reviews: CustomerReview[]; compact?: boolean }) {
  if (reviews.length === 0) return null;

  return <section className={`${styles.customerReviews} ${compact ? styles.customerReviewsCompact : ""}`} aria-labelledby="customer-reviews-heading">
    <header className={styles.customerReviewsHeading}>
      <span aria-hidden="true" />
      <h2 id="customer-reviews-heading">Customer reviews</h2>
      <span aria-hidden="true" />
    </header>
    <div className={styles.customerReviewGrid}>
      {reviews.map((review) => <article className={styles.customerReviewCard} key={review.id}>
        <div className={styles.customerReviewCopy}>
          <blockquote>{review.body}</blockquote>
          <footer>
            <cite>{review.name}</cite>
            <span>{review.location}</span>
          </footer>
        </div>
        {review.photo && <div className={`${styles.customerReviewPhoto} ${review.photo.fit === "contain" ? styles.customerReviewPhotoContain : ""}`}>
          <Image src={review.photo.src} alt={review.photo.alt} width={review.photo.width} height={review.photo.height} quality={80} sizes="100px" />
        </div>}
      </article>)}
    </div>
  </section>;
}
