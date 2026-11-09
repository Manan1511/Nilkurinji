import type { Metadata, Viewport } from "next";
import { Caveat, Lato, Libre_Baskerville, Playfair_Display, Space_Mono } from "next/font/google";
import "@/app/globals.css";
import "@/app/storefront-tokens.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreNotice } from "@/components/store-notice";
import { CartProvider } from "@/components/cart-provider";
import { RouteTransition } from "@/components/storefront/route-transition";
import { ScrollRevealObserver } from "@/components/storefront/scroll-reveal";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site-config";
import { getHomepageContent } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { isIndexableSite, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { getEnabledCategoryHandles } from "@/lib/shopify/shop-category";

const displayFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
  display: "swap",
});
const displayItalicFont = Libre_Baskerville({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-libre-italic", display: "swap" });
const bodyFont = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const scriptFont = Caveat({ subsets: ["latin"], weight: ["400"], variable: "--font-caveat", display: "swap" });
const logoFont = Playfair_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-playfair-display", display: "swap" });
const monoFont = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap" });

function metadataBase(): URL | undefined {
  const configured = process.env.SITE_URL ?? process.env.URL ?? "https://nilkurinjitemp.netlify.app";
  try { return new URL(configured); } catch { return undefined; }
}

export async function generateMetadata(): Promise<Metadata> {
  const base = metadataBase();
  const image = "/images/nilkurinji-social-preview.jpg";
  const imageAlt = "Nilkurinji Premium, Rare Taste of Nature, over a landscape of purple flowers and mountains.";
  return {
    ...(base ? { metadataBase: base } : {}),
    title: { default: `${SITE_NAME} Premium Tea · Rare Taste of Nature`, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    robots: { index: isIndexableSite(), follow: isIndexableSite() },
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: `${SITE_NAME} Premium Tea · Rare Taste of Nature`,
      description: DEFAULT_DESCRIPTION,
      images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} Premium Tea · Rare Taste of Nature`,
      description: DEFAULT_DESCRIPTION,
      images: [image],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3EFE3",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, enabledCategories] = await Promise.all([getHomepageContent(), getEnabledCategoryHandles()]);
  const socialLinks = settings.source === "unavailable" ? [] : settings.data.socialLinks;
  const notice = getStorefrontMode().mode !== "live" || !isShopifyCheckoutEnabled();
  return (
    <html lang="en" className={`${displayFont.variable} ${displayItalicFont.variable} ${bodyFont.variable} ${scriptFont.variable} ${logoFont.variable} ${monoFont.variable}`}>
      <body data-notice={String(notice)}>
        <CartProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <div className="site-shell"><StoreNotice /><SiteHeader enabledCategories={enabledCategories} /></div>
          <RouteTransition>{children}</RouteTransition>
          <ScrollRevealObserver />
          <SiteFooter socialLinks={socialLinks} enabledCategories={enabledCategories} />
        </CartProvider>
      </body>
    </html>
  );
}
