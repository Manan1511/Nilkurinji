import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return <section className={styles.page} aria-labelledby="not-found-heading">
    <p className={styles.eyebrow}>NILKURINJI TEA</p>
    <h1 id="not-found-heading">This page is no longer here.</h1>
    <p>Explore the tea and tea-bag collections instead.</p>
    <div className={styles.actions}>
      <Link className="button button--dark" href="/shop">Browse tea</Link>
      <Link className="button button--outline" href="/">Return home</Link>
    </div>
  </section>;
}
