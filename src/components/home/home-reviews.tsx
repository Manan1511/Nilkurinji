import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";
import { ReviewRail } from "@/components/home/review-rail";
import { CUSTOMER_REVIEWS } from "@/lib/customer-reviews";
import styles from "./home-reviews.module.css";

const HOMEPAGE_REVIEWS = CUSTOMER_REVIEWS.slice(0, 5);

export function HomeReviews() {
  return <section className={styles.section} aria-labelledby="home-reviews-heading">
    <span className={styles.foliage} aria-hidden="true">
      <Image className={styles.leafTopLeft} src="/images/botanical/kurinji-branch-horizontal.webp" alt="" width={1200} height={800} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
      <Image className={styles.leafTopRight} src="/images/botanical/botanical-editorial-right-kurinji.webp" alt="" width={1024} height={683} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
      <Image className={styles.leafBottomLeft} src="/images/botanical/botanical-categories-left.webp" alt="" width={683} height={1024} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
      <Image className={styles.leafBottomRight} src="/images/botanical/botanical-categories-right-kurinji.webp" alt="" width={1024} height={683} quality={85} sizes="(max-width: 599px) clamp(115px, 36vw, 155px), 190px" />
    </span>
    <div className={styles.inner}>
      <header className={styles.heading}>
        <span className={styles.ornament} aria-hidden="true"><BrandMark /></span>
        <h2 id="home-reviews-heading">The Nilkurinji Journal</h2>
        <p>Real stories, honest experiences and love shared by our customers.</p>
      </header>

      <ReviewRail count={HOMEPAGE_REVIEWS.length}>
        {HOMEPAGE_REVIEWS.map((review) => <article
          className={styles.review}
          key={review.id}
        >
          <div className={styles.copy}>
            <blockquote className={styles.body}>{review.body}</blockquote>
            <footer className={styles.byline}>
              <cite>{review.name}</cite>
              <span>{review.location}</span>
            </footer>
          </div>
          <div className={styles.photo}>
            <Image src={review.photo} alt="" fill sizes="(max-width: 359px) 90px, (max-width: 599px) 31vw, 184px" />
          </div>
        </article>)}
      </ReviewRail>
    </div>
  </section>;
}
