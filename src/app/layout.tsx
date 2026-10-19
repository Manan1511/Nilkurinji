import type { Metadata, Viewport } from "next";
import { Caveat, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreNotice } from "@/components/store-notice";
import { ScrollRevealObserver } from "@/components/scroll-reveal-observer";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site-config";
import { getHomepageContent } from "@/lib/shopify/content";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});
const handwrittenFont = Caveat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-caveat",
  display: "swap",
});

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
    ? "/images/preview-hero-home-v3.png"
    : homepage.source === "shopify" ? homepage.data.heroImage?.url : undefined;
  return {
    ...(base ? { metadataBase: base } : {}),
    title: { default: `${SITE_NAME} · The everyday pantry`, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    robots: { index: isIndexableSite(), follow: isIndexableSite() },
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: `${SITE_NAME} · The everyday pantry`,
      description: DEFAULT_DESCRIPTION,
      ...(base && image ? { images: [{ url: image, alt: mode.mode === "preview" ? "Illustrative Nilkurinji pantry concept artwork" : "Nilkurinji homepage" }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${SITE_NAME} · The everyday pantry`,
      description: DEFAULT_DESCRIPTION,
      ...(base && image ? { images: [image] } : {}),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5ee",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getHomepageContent();
  const mode = getStorefrontMode();
  const socialLinks = settings.source === "unavailable" ? [] : settings.data.socialLinks;
  return (
    <html lang="en" className={`${displayFont.variable} ${handwrittenFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <StoreNotice />
        <SiteHeader />
        <main id="main-content" className="page-main">{children}</main>
        <SiteFooter socialLinks={socialLinks} preview={mode.mode === "preview"} />
        <ScrollRevealObserver />
      </body>
    </html>
  );
}
