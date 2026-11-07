type ProductIdentity = {
  handle: string;
  title: string;
  productType?: string;
  tags?: readonly string[];
  collectionHandles?: readonly string[];
};

export type ProductPresentation = { title: string; comingSoon: boolean };

function identityText(product: ProductIdentity): string {
  return [product.handle, product.title, product.productType, ...(product.tags ?? []), ...(product.collectionHandles ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

export function isComingSoonTea(product: ProductIdentity): boolean {
  const text = identityText(product);
  const isTea = /\btea\b|\bchai\b/.test(text)
    || (product.collectionHandles ?? []).some((handle) => handle === "tea" || handle === "tea-bags");
  return isTea && /\bmasala\b/.test(text);
}

export function moveComingSoonTeaLast<T extends ProductIdentity>(products: T[]): T[] {
  return [...products.filter((product) => !isComingSoonTea(product)), ...products.filter(isComingSoonTea)];
}

export function featuredProductsFirst<T extends ProductIdentity>(products: T[]): T[] {
  const ordered = moveComingSoonTeaLast(products);
  const teaOrder = (product: ProductIdentity): number => {
    const text = identityText(product);
    if (isComingSoonTea(product)) return 4;
    if (product.handle === "premium-tea" || /\bclassic\b/.test(text)) return 0;
    if (product.handle === "rose-tea" || /\brose\b/.test(text)) return 1;
    if (product.handle === "elaichi-tea" || /\belaichi\b|\bcardamom\b/.test(text)) return 2;
    return 3;
  };

  return ordered
    .map((product, index) => ({ product, index }))
    .sort((a, b) => teaOrder(a.product) - teaOrder(b.product) || a.index - b.index)
    .map(({ product }) => product);
}

export function getProductPresentation(product: ProductIdentity): ProductPresentation {
  const text = identityText(product);
  const isTea = /\btea\b|\bchai\b/.test(text)
    || (product.collectionHandles ?? []).some((handle) => handle === "tea" || handle === "tea-bags");

  if (!isTea) return { title: product.title, comingSoon: false };
  if (isComingSoonTea(product)) return { title: "Nilkurinji Premium Masala Tea", comingSoon: true };
  if (/\brose\b/.test(text)) return { title: "Nilkurinji Premium Rose Tea", comingSoon: false };
  if (/\belaichi\b|\bcardamom\b/.test(text)) return { title: "Nilkurinji Premium Elaichi Tea", comingSoon: false };
  if (/\bclassic\b/.test(text) || /\bpremium tea\b/.test(text)) return { title: "Nilkurinji Premium Classic Tea", comingSoon: false };
  return { title: product.title, comingSoon: false };
}
