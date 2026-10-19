import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Landmark, Leaf, Truck } from "lucide-react";
import { BannerCarousel } from "@/components/banner-carousel";
import { BotanicalFrame } from "@/components/botanical-frame";
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel";
import { getProducts } from "@/lib/shopify/catalog";
import { getHomepageContent } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { buildHomepageSlides } from "@/lib/shopify/home-slides";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { CATEGORIES } from "@/lib/site-config";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [productsResult, homepageResult] = await Promise.all([getProducts(), getHomepageContent()]);
  const mode = getStorefrontMode();
  const products = productsResult.source === "unavailable" ? [] : productsResult.data;
  const content = homepageResult.source === "unavailable" ? null : homepageResult.data;
  const preview = mode.mode === "preview";
  const slides = buildHomepageSlides(preview, content);

  return (
    <>
      {slides.length ? <BannerCarousel slides={slides} /> : (
        <section className="hero-carousel mx-auto w-full max-w-[1360px] px-5 md:px-10" aria-label="Store setup">
          <div className="hero-carousel__slide">
            <div className="hero-carousel__copy">
              <p className="eyebrow hero-carousel__eyebrow">Nilkurinji</p>
              <h1>The store is being prepared.</h1>
              <p className="hero-carousel__description">{homepageResult.source === "unavailable" ? homepageResult.reason : "Publish approved homepage copy in Shopify to display it here."}</p>
              <Link href="/shop" className="button button--dark">Browse the shop <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
            <div className="hero-carousel__visual hero-carousel__visual--pending" aria-hidden="true" />
          </div>
        </section>
      )}

      <section className="category-section" aria-labelledby="home-categories-heading">
        <BotanicalFrame className="botanical-frame--categories" />
        <div className="category-section__heading">
          <Leaf aria-hidden="true" className="category-section__mark" />
          <div className="category-section__title-row"><span /><h2 id="home-categories-heading">Our Categories</h2><span /></div>
          <p>A wholesome range of premium foods, inspired by nature.</p>
        </div>
        <nav className="category-shelf mx-auto" aria-label="Shop by category">
          {CATEGORIES.map((category, index) => (
            <Link key={category.handle} href={category.href} className={`category-shelf__tile category-shelf__tile--${category.handle}`} data-scroll-reveal="category" data-scroll-reveal-delay={index * 42}>
              <span className="category-shelf__image"><Image src={category.handle === "tea" ? "/images/preview-hero-tea.webp" : `/images/category-${category.handle}.png`} alt="" fill sizes="(max-width: 640px) 72px, 100px" priority={index === 0} /></span>
              <span className="category-shelf__label">{category.label}<ArrowRight aria-hidden="true" size={13} /></span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="section section--wide home-featured" aria-labelledby="home-featured-heading">
        <BotanicalFrame className="botanical-frame--featured" />
        <div className="home-featured__intro" data-scroll-reveal="rise">
          <p className="eyebrow">{preview ? "Featured products" : "Nilkurinji catalogue"}</p>
          <h2 id="home-featured-heading">{preview ? "Our Best Sellers" : content?.featuredProductsHeading || "Shop products"}</h2>
          <p className="home-featured__description">{preview ? "Timeless classics, loved by many." : "Explore the foods and beverages in our pantry."}</p>
          <Link href="/shop" className="home-featured__shop-all">Shop all <ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
        <div className="home-featured__products">
          {productsResult.source === "unavailable" ? (
            <div className="notice-card" role="status">{productsResult.reason}</div>
          ) : products.length ? (
            <FeaturedProductsCarousel products={products.slice(0, 8)} purchasingEnabled={isShopifyCheckoutEnabled()} />
          ) : (
            <div className="empty-state empty-state--catalog">
              <span className="eyebrow">Shopify catalog</span>
              <h2>Good things will be here soon.</h2>
              <p>Publish approved products to the Nilkurinji Headless sales channel to show them here.</p>
            </div>
          )}
        </div>
      </section>

      <section className="benefits-band home-benefits" aria-label="Nilkurinji benefits">
        <div className="benefits-band__inner mx-auto w-full max-w-[1360px] px-5 md:px-10">
          <article className="benefit" data-scroll-reveal="benefit" data-scroll-reveal-delay="0">
            <Leaf aria-hidden="true" className="benefit__icon" />
            <h2>{preview ? "100% Natural Ingredients" : "Ingredients"}</h2>
            <p>{preview ? "Pure, safe, wholesome." : "Find ingredients and product details on every listing."}</p>
          </article>
          <article className="benefit" data-scroll-reveal="benefit" data-scroll-reveal-delay="55">
            <Landmark aria-hidden="true" className="benefit__icon" />
            <h2>{preview ? "Authentic Indian Heritage" : "Our story"}</h2>
            <p>{preview ? "Tradition in every cup." : "Learn about Nilkurinji and the pantry we are building."}</p>
          </article>
          <article className="benefit" data-scroll-reveal="benefit" data-scroll-reveal-delay="110">
            <BadgeCheck aria-hidden="true" className="benefit__icon" />
            <h2>{preview ? "Premium Quality" : "Product details"}</h2>
            <p>{preview ? "Carefully sourced. Always." : "Review available product information before purchase."}</p>
          </article>
          <article className="benefit" data-scroll-reveal="benefit" data-scroll-reveal-delay="165">
            <Truck aria-hidden="true" className="benefit__icon" />
            <h2>{preview ? "Pan India Delivery" : "Delivery"}</h2>
            <p>{preview ? "Freshness at your doorstep." : "See delivery options for your address at checkout."}</p>
          </article>
        </div>
      </section>
    </>
  );
}
