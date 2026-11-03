import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";
import { ReviewRail } from "@/components/home/review-rail";
import styles from "./home-reviews.module.css";

type HomepageReview = {
  id: string;
  name: string;
  location: string;
  body: string;
  photo: string;
};

const CUSTOMER_REVIEWS: HomepageReview[] = [
  {
    id: "rituparna-bhattacharjee",
    name: "Rituparna bhattacharjee",
    location: "Guwahati, Assam",
    body: "I actually really loved it ,the aroma ,strong colour & taste - overall a very fine quality tea 😊. Being a milk tea lover ,it was really good experience.",
    photo: "/images/leaf-to-cup/hero-cup.webp",
  },
  {
    id: "preeti-sharma",
    name: "Preeti Sharma",
    location: "Jhunjhunu, Rajasthan",
    body: "I really enjoyed Nilkurinji Premium Tea. It has a pleasant aroma, a refreshing taste, and a nice colour. The overall quality is good, and I had a lovely tea experience. Thank you! 😊",
    photo: "/images/leaf-to-cup/hero-leaf.webp",
  },
  {
    id: "deepika-cherukuri",
    name: "Deepika Cherukuri",
    location: "Andhra Pradesh",
    body: "Not just saying... But I really loved your tea... Was so nice... I gave some tea powder to my mom also and she too said the same😊",
    photo: "/images/leaf-to-cup/hero-water.webp",
  },
  {
    id: "diksha-verma",
    name: "Diksha Verma",
    location: "M.P",
    body: "I really enjoyed the tea! It has a nice aroma, a rich colour, and a refreshing taste. The overall quality is good, and it makes for a lovely cup of tea. 😊☕",
    photo: "/images/leaf-to-cup/format-tea.webp",
  },
  {
    id: "vanshika-sharma",
    name: "Vanshika Sharma",
    location: "Delhi",
    body: "I like the taste, and it doesn’t leave me feeling as heavy as some other teas do. Overall, I’ve had a pleasant experience with it.",
    photo: "/images/leaf-to-cup/format-tea-bags.webp",
  },
  {
    id: "sneha-kanodia",
    name: "Sneha Kanodia",
    location: "Kanpur, UP",
    body: "I usually pay attention to how I feel after drinking tea. I’ve personally found this one comfortable to drink, without the acidity I sometimes experience with other teas.",
    photo: "/images/tea-hero-editorial.webp",
  },
  {
    id: "jagrity-varshney",
    name: "Jagrity Varshney",
    location: "Bangalore",
    body: "The tea tastes really good, and personally, I feel quite light after having it. It has become a nice part of my daily routine.",
    photo: "/images/reviews/review-window.webp",
  },
  {
    id: "himanshi",
    name: "Himanshi",
    location: "Lucknow, UP",
    body: "I liked the overall tea experience, from the aroma to the flavour. It feels like a thoughtful choice for tea lovers.",
    photo: "/images/reviews/review-veranda.webp",
  },
  {
    id: "pramita-chakraborty",
    name: "Pramita Chakraborty",
    location: "West Bengal",
    body: "The tea has a lovely flavour and a comforting aroma. I especially liked how enjoyable it was with my daily tea time.",
    photo: "/images/reviews/review-journal.webp",
  },
  {
    id: "neha-kumar",
    name: "Neha Kumar",
    location: "Pulwama ,J&K",
    body: "Absolutely loved this tea! It has a rich color, strong refreshing taste, and an amazing aroma that instantly brightens up your day. Highly recommended for all tea lovers! ⭐⭐⭐⭐⭐",
    photo: "/images/reviews/review-amber-cup.webp",
  },
  {
    id: "nisha-prasad",
    name: "Nisha prasad",
    location: "Chhattisgarh",
    body: "Thank you so much! ❤️ Nilkurinji Premium Tea has a lovely aroma, a refreshing taste, and a beautiful colour. The overall quality feels really good, making it a perfect choice for tea lovers. ☕🌿✨",
    photo: "/images/reviews/review-after-rain.webp",
  },
  {
    id: "lucky-neeti-manhas",
    name: "Lucky Neeti Manhas",
    location: "Agra",
    body: "A great option for those who enjoy strong chai, just a small amount of tea leaves delivers a rich, bold flavour!",
    photo: "/images/reviews/review-shared-tea.webp",
  },
];

export function HomeReviews() {
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
        <p>Real stories, honest experiences and love shared by our customers.</p>
      </header>

      <ReviewRail count={CUSTOMER_REVIEWS.length}>
        {CUSTOMER_REVIEWS.map((review, index) => <article
          className={styles.review}
          key={review.id}
          id={`home-review-${index + 1}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Review ${index + 1} of ${CUSTOMER_REVIEWS.length}`}
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
