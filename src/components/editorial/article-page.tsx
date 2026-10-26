import Image from "next/image";
import Link from "next/link";
import type { StorefrontArticle } from "@/lib/shopify/types";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import styles from "./editorial.module.css";

export function ArticlePage({ article, sectionTitle }: { article: StorefrontArticle; sectionTitle: string }) {
  const body = sanitizeMerchantHtml(article.contentHtml);
  return <article className={styles.article}>
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={`/${article.blogHandle}`}>{sectionTitle}</Link></nav>
    <header className={styles.articleHeader}>
      <p className={styles.eyebrow}>{article.tags[0] || sectionTitle}</p>
      <h1>{article.title}</h1>
      {article.excerpt && <p className={styles.articleExcerpt}>{article.excerpt}</p>}
      <p className={styles.byline}>{article.author && <span>{article.author}</span>}{article.author && article.publishedAt && <span aria-hidden="true"> · </span>}{article.publishedAt && <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>}</p>
    </header>
    {article.image && <figure className={styles.articleImage}><Image src={article.image.url} alt={article.image.altText || ""} fill priority sizes="(max-width: 767px) 100vw, 80vw" /></figure>}
    {body ? <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: body }} /> : <p className={styles.notice}>This article is not available yet.</p>}
    <footer className={styles.articleFooter}><Link href={`/${article.blogHandle}`} className="text-link">Back to {sectionTitle}</Link></footer>
  </article>;
}

export function ArticleUnavailable({ sectionTitle }: { sectionTitle: string }) {
  return <section className={`${styles.article} ${styles.unavailable}`} role="status">
    <p className={styles.eyebrow}>{sectionTitle}</p>
    <h1>This content is temporarily unavailable.</h1>
    <p>Please try again later or return to the {sectionTitle} collection.</p>
    <Link href={`/${sectionTitle === "Tea Guide" ? "tea-guide" : sectionTitle.toLowerCase()}`} className="text-link">Back to {sectionTitle}</Link>
  </section>;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
