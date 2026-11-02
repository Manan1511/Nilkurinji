import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { makeProduct } from "../../test/fixtures/storefront";
vi.mock("@/lib/shopify/catalog", () => ({ getProducts: vi.fn(), getProduct: vi.fn(), getCollection: vi.fn(async () => ({ source: "preview", data: { image: null } })) }));
import { getProducts } from "@/lib/shopify/catalog";
import HomePage from "./page";

afterEach(() => vi.unstubAllEnvs());

it("follows the approved banner, arrow-free categories and editorial four-product shelf", async () => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  vi.mocked(getProducts).mockResolvedValue({ source: "preview", data: [
    makeProduct({ id: "tea", handle: "tea", title: "Preview Assam Tea", productType: "Tea", collectionHandles: ["tea"], isPreview: true }),
    makeProduct({ id: "bags", handle: "bags", title: "Preview Tea Bags", productType: "Tea Bags", collectionHandles: ["tea-bags"], isPreview: true }),
    makeProduct({ id: "rice", handle: "rice", title: "Preview Rice", productType: "Rice", collectionHandles: ["rice"], isPreview: true }),
    makeProduct({ id: "snacks", handle: "snacks", title: "Preview Snacks", productType: "Snacks", collectionHandles: ["snacks"], isPreview: true }),
    makeProduct({ id: "foods", handle: "foods", title: "Preview Foods", productType: "Other Foods", collectionHandles: ["other-foods"], isPreview: true }),
  ] });
  const html = renderToStaticMarkup(await HomePage());
  const categoryStart = html.indexOf('aria-label="Shop by category"');
  const categoriesMarkup = html.slice(categoryStart, html.indexOf("</nav>", categoryStart));
  const featuredStart = html.indexOf('aria-labelledby="home-featured-heading"');
  const featuredMarkup = html.slice(featuredStart, html.indexOf('aria-labelledby="home-reviews-heading"', featuredStart));

  expect(html).toContain("nilkurinji-hero-elaichi-desktop.webp");
  expect(html).toContain("nilkurinji-hero-elaichi-mobile.webp");
  expect(html).not.toContain("Illustrative concept imagery");
  expect(html).toContain("elaichi-tea-500g-pack.jpg");
  expect(html).toContain("Explore our range");
  expect(html).toContain('aria-label="Shop by category"');
  for (const category of ["Tea", "Tea Bags"]) expect(categoriesMarkup).toContain(category);
  expect(categoriesMarkup).not.toContain("Rice");
  expect(categoriesMarkup).not.toContain("Snacks");
  expect(html).toContain("Featured products");
  expect((featuredMarkup.match(/<article /g) ?? []).length).toBe(4);
  expect(categoriesMarkup).not.toContain("categoryArrow");
  expect(html).toContain("featuredEditorial");
  expect(html).toContain("Shop all");
  expect(html).toContain("Pan India Delivery");
  expect(html).not.toContain("No perfect cup required.");
  expect((categoriesMarkup.match(/categoryMedallion/g) ?? []).length).toBe(2);
  expect(categoriesMarkup).not.toContain("botanical-categories");
  expect(categoriesMarkup).toContain("category-icon-tea-kurinji.webp");
  expect(categoriesMarkup).not.toContain("url=%2Fimages%2Fcategory-tea.png");
  expect(html).toContain("botanical-home-hero-left-refined.webp");
  expect(html).toContain("botanical-home-hero-right-refined.webp");
  expect(html).toContain("botanical-categories-left.webp");
  expect(html).toContain("botanical-categories-right-kurinji.webp");
  expect(featuredMarkup).toContain("botanical-categories-left.webp");
  expect(featuredMarkup).toContain("botanical-categories-right-kurinji.webp");
  expect(html).not.toContain("botanical-tea-spray-alt.webp");
});

it("shows the illustrative hero fallback without substituting preview products when live content is unavailable", async () => {
  vi.stubEnv("SHOPIFY_MODE", "live");
  vi.mocked(getProducts).mockResolvedValue({ source: "unavailable", data: null, reason: "unavailable" });
  const html = renderToStaticMarkup(await HomePage());

  expect(html).not.toContain("preview-hero-home-kurinji.webp");
  expect(html).toContain("nilkurinji-hero-elaichi-desktop.webp");
  expect(html).toContain("elaichi-tea-500g-pack.jpg");
  expect(html).not.toContain("Preview Tea");
  expect(html).toContain("The range is temporarily unavailable.");
});

it("keeps sample reviews visible with Shopify products when checkout is disabled", async () => {
  vi.stubEnv("SHOPIFY_MODE", "live");
  vi.stubEnv("SHOPIFY_CHECKOUT_ENABLED", "false");
  vi.mocked(getProducts).mockResolvedValue({ source: "shopify", data: [makeProduct({ title: "Nilkurinji Premium Tea", handle: "premium-tea" })] });
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain("The Nilkurinji Journal");
  expect(html).toContain("Real stories, honest experiences and love shared by our customers.");
  expect(html).toContain("mock rating");
  expect(html).not.toContain("Illustrative mock reviews");
  expect(html).toContain("/products/premium-tea");
});
