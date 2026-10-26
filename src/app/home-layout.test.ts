import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { makeProduct } from "../../test/fixtures/storefront";
vi.mock("@/lib/shopify/catalog", () => ({ getProducts: vi.fn(), getProduct: vi.fn(), getCollection: vi.fn(async (handle: string) => ({ source: "preview", data: { image: { url: `/images/category-${handle}.png`, altText: null, width: 1254, height: 1254 } } })) }));
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
  const featuredMarkup = html.slice(featuredStart, html.indexOf('aria-label="Store information"', featuredStart));

  expect(html).toContain("preview-hero-home-kurinji.webp");
  expect(html).toContain("Explore our range");
  expect(html).toContain('aria-label="Shop by category"');
  for (const category of ["Tea", "Tea Bags", "Rice", "Snacks", "Other Foods"]) expect(html).toContain(category);
  expect(html).toContain("Featured products");
  expect((html.match(/<article /g) ?? []).length).toBe(4);
  expect(categoriesMarkup).not.toContain("categoryArrow");
  expect(html).toContain("featuredEditorial");
  expect(html).toContain("Shop all");
  expect(html).toContain("Pan India Delivery");
  expect(html).not.toContain("No perfect cup required.");
  expect((categoriesMarkup.match(/categoryMedallion/g) ?? []).length).toBe(5);
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

it("does not substitute preview hero imagery or products when live content is unavailable", async () => {
  vi.stubEnv("SHOPIFY_MODE", "live");
  vi.mocked(getProducts).mockResolvedValue({ source: "unavailable", data: null, reason: "unavailable" });
  const html = renderToStaticMarkup(await HomePage());

  expect(html).not.toContain("preview-hero-home-kurinji.webp");
  expect(html).not.toContain("Preview Tea");
  expect(html).toContain("The range is temporarily unavailable.");
});
