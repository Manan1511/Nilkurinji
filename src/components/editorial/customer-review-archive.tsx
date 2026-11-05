import type { CustomerReview } from "@/lib/customer-reviews";
import styles from "./editorial.module.css";

export function CustomerReviewArchive({ reviews }: { reviews: CustomerReview[] }) {
  if (reviews.length === 0) return null;

  return <section className={styles.customerReviews} aria-labelledby="customer-reviews-heading">
    <header className={styles.customerReviewsHeading}>
      <span aria-hidden="true" />
      <h2 id="customer-reviews-heading">More customer reviews</h2>
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
      </article>)}
    </div>
  </section>;
}
