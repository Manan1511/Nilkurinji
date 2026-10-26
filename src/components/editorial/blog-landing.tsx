import Image from "next/image";
import Link from "next/link";
import { BotanicalEdges } from "@/components/botanical-edges";
import type { StorefrontBlog, StorefrontBlogLanding, StorefrontData } from "@/lib/shopify/types";
import styles from "./editorial.module.css";

type Props = {
  title: string;
  blog: StorefrontData<StorefrontBlog | null>;
  landing: StorefrontData<StorefrontBlogLanding | null>;
  previewImage?: string;
};

export function BlogLanding({ title, blog, landing, previewImage }: Props) {
  const articles = blog.source === "unavailable" ? [] : blog.data?.articles ?? [];
  const content = landing.source === "unavailable" ? null : landing.data;
  const image = content?.heroImage?.url ?? (blog.source === "preview" ? previewImage : undefined);
  const description = content?.intro;

  return <div className={styles.page}>
    <header className={styles.hero}>
      {image && <Image src={image} alt={content?.altText || (blog.source === "preview" ? "Illustrative Nilkurinji concept imagery" : "")} fill sizes="100vw" priority className={styles.heroImage} />}
      <BotanicalEdges placement="banner" />
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>NILKURINJI / {title.toUpperCase()}</p>
        <h1>{content?.heading || title}</h1>
        {description && <p>{description}</p>}
      </div>
      {blog.source === "preview" && image && <span className={styles.imageNote}>Illustrative concept imagery</span>}
    </header>

    <section className={styles.articles} aria-labelledby="editorial-heading">
      <div className={styles.sectionHeading}>
        <span aria-hidden="true" />
        <h2 id="editorial-heading">{content?.heading ? title : "From Nilkurinji"}</h2>
        <span aria-hidden="true" />
      </div>
      {blog.source === "unavailable" || landing.source === "unavailable" ? (
        <p className={styles.notice} role="status">Editorial content is temporarily unavailable. Please try again later.</p>
      ) : articles.length ? (
        <div className={styles.grid}>
          {articles.map((article) => <article className={styles.card} key={article.id}>
            <Link className={styles.cardImage} href={`/${article.blogHandle}/${article.handle}`} aria-label={`Read ${article.title}`}>
              {article.image ? <Image src={article.image.url} alt={article.image.altText || ""} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 45vw, 30vw" /> : <span aria-hidden="true" />}
            </Link>
            <div className={styles.cardCopy}>
              <p className={styles.cardMeta}>{article.tags[0] || title}{article.publishedAt && <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>}</p>
              <h3><Link href={`/${article.blogHandle}/${article.handle}`}>{article.title}</Link></h3>
              {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
              <Link className={styles.readMore} href={`/${article.blogHandle}/${article.handle}`}>Read more <span aria-hidden="true">→</span></Link>
            </div>
          </article>)}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <p>{blog.source === "preview" ? "Articles are being prepared for this preview." : "There are no published articles here yet."}</p>
          <Link href="/shop" className="text-link">Explore the shop</Link>
        </div>
      )}
    </section>
  </div>;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
