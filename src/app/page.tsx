import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BannerCarousel } from "@/components/banner-carousel";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/shopify/catalog";
import { getHomepageContent, getPublishedPage } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { buildHomepageSlides } from "@/lib/shopify/home-slides";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { sanitizeMerchantHtml } from "@/lib/shopify/sanitize";
import { CATEGORIES } from "@/lib/site-config";
import styles from "@/components/home/home.module.css";
import type { Metadata } from "next";
export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function HomePage() {
  const [catalog, homepage, about] = await Promise.all([getProducts(), getHomepageContent(), getPublishedPage("about")]);
  const preview = getStorefrontMode().mode === "preview";
  const content = homepage.source === "unavailable" ? null : homepage.data;
  const products = catalog.source === "unavailable" ? [] : catalog.data;
  const tea = products.filter((product) => product.collectionHandles.some((handle) => handle === "tea" || handle === "tea-bags") || /\btea\b/i.test(product.productType)).slice(0, 4);
  const slides = buildHomepageSlides(preview, content);
  const story = about.source === "shopify" && about.data?.body ? sanitizeMerchantHtml(about.data.body).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").slice(0, 55).join(" ") : "";
  return <div className={styles.home}>
    {slides.length ? <BannerCarousel slides={slides} /> : <section className={styles.section}><h1>The store is being prepared.</h1><p>Browse the collection, or return soon to see more.</p><Link href="/shop" className="button button--dark">Browse the shop <ArrowRight aria-hidden="true" size={17} /></Link></section>}
    <section className={styles.section} aria-labelledby="home-featured-heading">
      <div className={styles.sectionHeader}><div><h2 id="home-featured-heading">{content?.featuredProductsHeading || "Explore Nilkurinji tea"}</h2><p>{preview ? "Browse tea and tea bags in this storefront preview." : "Explore the current collection of tea and tea bags."}</p></div><Link href="/collections/tea">View all tea <ArrowRight size={17} aria-hidden="true" /></Link></div>
      {catalog.source === "unavailable" ? <div className={styles.empty} role="status"><p>Tea listings are temporarily unavailable.</p><Link href="/shop">Browse the shop</Link></div> : tea.length ? <div className={`${styles.grid} ${tea.length <= 2 ? styles.gridSmall : ""}`}>{tea.map((product) => <ProductCard key={product.id} product={product} purchasingEnabled={isShopifyCheckoutEnabled()} />)}</div> : <div className={styles.empty}><p>The tea collection is being prepared.</p><Link href="/collections/tea">View tea collection</Link></div>}
    </section>
    <section className={styles.section} aria-label="Choose your tea"><div className={styles.discovery}>
      {[{ title: "Tea", image: "/images/category-tea.png", href: "/collections/tea" }, { title: "Tea bags", image: "/images/category-tea-bags.png", href: "/collections/tea-bags" }].map((category) => <Link key={category.href} href={category.href}><span className={styles.discoveryImage}>{preview && <Image src={category.image} alt="" fill sizes="(max-width: 767px) 45vw, 26vw" />}</span><span className={styles.discoveryCopy}><strong>{category.title}</strong><span>Explore collection <ArrowRight size={17} aria-hidden="true" /></span></span></Link>)}
    </div></section>
    <section className={styles.section}><div className={styles.story}><h2>A little more about Nilkurinji.</h2><div>{story && <p>{story}</p>}<Link href="/about">Our story <ArrowRight size={17} aria-hidden="true" /></Link></div></div></section>
    <section className={styles.section}><div className={styles.pantry}><h2>More from the pantry</h2><nav aria-label="Shop other pantry categories">{CATEGORIES.filter((item) => item.handle !== "tea" && item.handle !== "tea-bags").map((category) => <Link key={category.href} href={category.href}>{category.label}<ArrowRight size={16} aria-hidden="true" /></Link>)}</nav></div></section>
  </div>;
}
