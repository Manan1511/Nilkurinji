import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { makeProduct } from "../../test/fixtures/storefront";
vi.mock("@/lib/shopify/catalog", () => ({ getProducts: vi.fn() }));
import { getProducts } from "@/lib/shopify/catalog";
import HomePage from "./page";
afterEach(() => vi.unstubAllEnvs());
it.each([0,1,2,3,4])("renders up to three of %s tea products without pantry fillers", async (count) => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  const products = Array.from({ length: count }, (_, index) => makeProduct({ id: `tea-${index}`, handle: `tea-${index}`, title: `Fixture tea ${index}`, isPreview: true }));
  vi.mocked(getProducts).mockResolvedValue({ source: "preview", data: [...products, makeProduct({ title: "Rice filler", collectionHandles: ["rice"], productType: "Rice" })] });
  const html = renderToStaticMarkup(await HomePage()); expect((html.match(/<article /g) ?? []).length).toBe(Math.min(count, 3)); expect(html).not.toContain("Rice filler"); expect(html).not.toContain('href="/collections/rice"'); expect(html).toContain('href="/shop?category=tea-bags"'); expect(html).not.toContain("/collections/");
});

it("uses a separate hero photograph and moves transparent tea images into format choices", async () => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  vi.mocked(getProducts).mockResolvedValue({ source: "preview", data: [] });
  const html = renderToStaticMarkup(await HomePage());
  const heroStart = html.indexOf('aria-label="Nilkurinji tea and tea bags"');
  const heroEnd = html.indexOf("</section>", heroStart);
  const hero = html.slice(heroStart, heroEnd);
  const formats = html.indexOf("How do you like your tea?");

  expect(html).toContain("tea-hero-editorial.webp");
  expect(formats).toBeGreaterThan(heroStart);
  expect(hero).not.toContain("category-icon-tea");
  expect(formats).toBeLessThan(html.indexOf("category-icon-tea.png"));
  expect(formats).toBeLessThan(html.indexOf("category-icon-tea-bags.png"));
});

it("puts tea products before the format feature and avoids decorative card numbering", async () => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  vi.mocked(getProducts).mockResolvedValue({ source: "preview", data: [makeProduct({ title: "Fixture tea", isPreview: true })] });
  const html = renderToStaticMarkup(await HomePage());

  expect(html.indexOf("A few teas to begin with.")).toBeLessThan(html.indexOf("How do you like your tea?"));
  expect(html).not.toContain("01 / 02");
  expect(html).not.toContain("02 / 02");
});

it("lets the homepage headings stand without repeated uppercase kickers", async () => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  vi.mocked(getProducts).mockResolvedValue({ source: "preview", data: [] });
  const html = renderToStaticMarkup(await HomePage());

  expect(html).not.toContain("NILKURINJI TEA");
  expect(html).not.toContain("FROM THE COLLECTION");
  expect(html).not.toContain("TWO WAYS TO MAKE TEA");
  expect(html).not.toContain("A NOTE ON BREWING");
});
