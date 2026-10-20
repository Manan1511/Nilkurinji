import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import "@/app/storefront-tokens.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreNotice } from "@/components/store-notice";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site-config";
import { getHomepageContent } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { isIndexableSite, isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});
const editorialFont = Newsreader({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-newsreader", display: "swap" });
const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

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
    ? "/images/preview-hero-home-v4.png"
    : homepage.source === "shopify" ? homepage.data.heroImage?.url : undefined;
  return {
    ...(base ? { metadataBase: base } : {}),
    title: { default: `${SITE_NAME} · Tea and pantry`, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    robots: { index: isIndexableSite(), follow: isIndexableSite() },
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: `${SITE_NAME} · Tea and pantry`,
      description: DEFAULT_DESCRIPTION,
      ...(base && image ? { images: [{ url: image, alt: mode.mode === "preview" ? "Illustrative Nilkurinji tea concept artwork" : "Nilkurinji homepage" }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${SITE_NAME} · Tea and pantry`,
      description: DEFAULT_DESCRIPTION,
      ...(base && image ? { images: [image] } : {}),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafbf8",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getHomepageContent();
  const socialLinks = settings.source === "unavailable" ? [] : settings.data.socialLinks;
  const notice = getStorefrontMode().mode !== "live" || !isShopifyCheckoutEnabled();
  return (
    <html lang="en" className={`${displayFont.variable} ${editorialFont.variable} ${bodyFont.variable}`}>
      <body data-notice={String(notice)}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="site-shell"><StoreNotice /><SiteHeader /></div>
        <main id="main-content" className="page-main">{children}</main>
        <SiteFooter socialLinks={socialLinks} />
      </body>
    </html>
  );
}
