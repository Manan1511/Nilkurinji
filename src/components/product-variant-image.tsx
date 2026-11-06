"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const VariantImageContext = createContext<{ imageUrl: string | null; setImageUrl: (url: string | null) => void; variantId: string | null; setVariantId: (id: string | null) => void }>({ imageUrl: null, setImageUrl: () => {}, variantId: null, setVariantId: () => {} });

export function ProductVariantImageProvider({ children, initialVariantId }: { children: ReactNode; initialVariantId?: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<string | null>(initialVariantId ?? null);
  return <VariantImageContext.Provider value={{ imageUrl, setImageUrl, variantId, setVariantId }}>{children}</VariantImageContext.Provider>;
}

export function useProductVariantImage() { return useContext(VariantImageContext); }
