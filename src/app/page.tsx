import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { BannerCarousel } from "@/components/banner-carousel";
import { ProductGrid } from "@/components/product-grid";
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

      <nav className="category-shelf mx-auto" aria-label="Shop by category">
        {CATEGORIES.map((category, index) => (
          <Link key={category.handle} href={category.href} className="category-shelf__tile">
            <span className="category-shelf__image"><Image src={`/images/category-${category.handle}.png`} alt="" fill sizes="(max-width: 640px) 42vw, 18vw" priority={index === 0} /></span>
            <span className="category-shelf__label">{category.label}<ArrowRight aria-hidden="true" size={15} /></span>
          </Link>
        ))}
      </nav>

      <section className="section section--wide">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{preview ? "A considered selection" : "Nilkurinji catalogue"}</p>
            <h2>{preview ? "An early look" : content?.featuredProductsHeading || "Shop products"}</h2>
          </div>
          <Link href="/shop" className="text-link">View all <ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
        {productsResult.source === "unavailable" ? (
          <div className="notice-card" role="status">{productsResult.reason}</div>
        ) : products.length ? (
          <ProductGrid products={products.slice(0, 4)} emptyMessage="Nothing is on this shelf yet." allowCategoryFilter={false} showFilters={false} showToolbar={false} purchasingEnabled={isShopifyCheckoutEnabled()} />
        ) : (
          <div className="empty-state empty-state--catalog">
            <span className="eyebrow">Shopify catalog</span>
            <h2>Good things will be here soon.</h2>
            <p>Publish approved products to the Nilkurinji Headless sales channel to show them here.</p>
          </div>
        )}
      </section>

      <section className="benefits-band" aria-label="How the shop works">
        <div className="benefits-band__inner mx-auto w-full max-w-[1360px] px-5 md:px-10">
          <article className="benefit"><span className="benefit__number">01</span><h2>Explore</h2><p>Five pantry categories, ready to browse.</p></article>
          <article className="benefit"><span className="benefit__number">02</span><h2>Discover</h2><p>Product details and availability come from Shopify.</p></article>
          <article className="benefit"><span className="benefit__number">03</span><h2>Save</h2><p>Keep a wishlist on the device you are using.</p></article>
          <article className="benefit"><span className="benefit__number">04</span><h2>Checkout</h2><p>{isShopifyCheckoutEnabled() ? "Orders are completed through Shopify checkout." : "Purchases will open after Shopify setup is approved."}</p></article>
        </div>
      </section>

      {(preview || (content?.closingHeading && content.closingDescription)) && <section className="closing-note mx-auto grid max-w-[1360px] items-center gap-10 px-5 py-16 md:grid-cols-[1fr_1.15fr] md:px-10 md:py-24">
        <div className="closing-note__mark" aria-hidden="true"><Leaf /><span>n.</span></div>
        <div>
          <p className="eyebrow">{preview ? "The Nilkurinji point of view" : content?.closingEyebrow || "About Nilkurinji"}</p>
          <h2>{preview ? "A good thing can be wonderfully simple." : content?.closingHeading}</h2>
          {!preview && <p>{content?.closingDescription}</p>}
          <Link className="text-link" href="/about">A little about us <ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
      </section>}
    </>
  );
}
