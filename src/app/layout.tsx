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

const displayFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
  display: "swap",
});
const bodyFont = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const scriptFont = Caveat({ subsets: ["latin"], weight: ["400"], variable: "--font-caveat", display: "swap" });
const logoFont = Playfair_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-playfair-display", display: "swap" });
const monoFont = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap" });

function metadataBase(): URL | undefined {
  const configured = process.env.SITE_URL ?? process.env.URL;
  if (!configured) return undefined;
  try { return new URL(configured); } catch { return undefined; }
}

export async function generateMetadata(): Promise<Metadata> {
  const mode = getStorefrontMode();
  const base = metadataBase();
  const homepage = await getHomepageContent();
  const image = mode.mode === "preview"
    ? "/images/preview-hero-home-kurinji.webp"
    : homepage.source === "shopify" ? homepage.data.heroImage?.url : undefined;
  return {
    ...(base ? { metadataBase: base } : {}),
    title: { default: `${SITE_NAME} · Tea, tea bags and pantry`, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    robots: { index: isIndexableSite(), follow: isIndexableSite() },
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: `${SITE_NAME} · Tea, tea bags and pantry`,
      description: DEFAULT_DESCRIPTION,
      ...(base && image ? { images: [{ url: image, alt: mode.mode === "preview" ? "Illustrative Nilkurinji tea concept artwork" : "Nilkurinji homepage" }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${SITE_NAME} · Tea and tea bags`,
      description: DEFAULT_DESCRIPTION,
      ...(base && image ? { images: [image] } : {}),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3EFE3",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getHomepageContent();
  const socialLinks = settings.source === "unavailable" ? [] : settings.data.socialLinks;
  const notice = getStorefrontMode().mode !== "live" || !isShopifyCheckoutEnabled();
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable} ${logoFont.variable} ${monoFont.variable}`}>
      <body data-notice={String(notice)}>
        <CartProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <div className="site-shell"><StoreNotice /><SiteHeader /></div>
          <RouteTransition>{children}</RouteTransition>
          <ScrollRevealObserver />
          <SiteFooter socialLinks={socialLinks} />
        </CartProvider>
      </body>
    </html>
  );
}
