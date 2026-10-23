"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { postCartAction, waitForCartMutations } from "@/lib/cart-client";
import type { CartAction } from "@/lib/shopify/cart-validation";
import type { ShopifyCart } from "@/lib/shopify/cart";

type CartState = {
  cart: ShopifyCart | null;
  preview: boolean;
  expired: boolean;
  enabled: boolean;
  loading: boolean;
  busy: boolean;
  message: string;
};
type CartController = CartState & {
  refresh: () => Promise<void>;
  mutate: (action: CartAction) => Promise<{ checkoutUrl?: string } | null>;
};
const CartContext = createContext<CartController | null>(null);
const initialState: CartState = { cart: null, preview: false, expired: false, enabled: false, loading: true, busy: false, message: "" };
type CartApiResponse = { cart?: ShopifyCart | null; preview?: boolean; purchasingEnabled?: boolean; expired?: boolean; error?: string };

async function readCart(): Promise<CartApiResponse> {
  await waitForCartMutations();
  const response = await fetch("/api/cart", { cache: "no-store" });
  const body = await response.json() as CartApiResponse;
  if (!response.ok) throw new Error(body.error || "Your cart is temporarily unavailable. Please try again.");
  return body;
}

function confirmedState(current: CartState, body: CartApiResponse): CartState {
  return { ...current, cart: body.cart ?? null, preview: body.preview ?? false, expired: body.expired ?? false, enabled: body.purchasingEnabled ?? false, loading: false, message: "" };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(initialState);
  const lock = useRef(false);
  const readGeneration = useRef(0);
  const refresh = useCallback(async () => {
    if (lock.current) return;
    const generation = ++readGeneration.current;
    setState((current) => ({ ...current, loading: true, message: "" }));
    try {
      const body = await readCart();
      if (generation !== readGeneration.current) return;
      setState((current) => confirmedState(current, body));
    } catch {
      if (generation === readGeneration.current) setState((current) => ({ ...current, loading: false, message: "Your cart is temporarily unavailable. Please try again." }));
    }
  }, []);

  useEffect(() => {
    let active = true;
    const generation = ++readGeneration.current;
    const initialRead = async () => {
      try {
        const body = await readCart();
        if (active && generation === readGeneration.current) setState((current) => confirmedState(current, body));
      } catch {
        if (active && generation === readGeneration.current) setState((current) => ({ ...current, loading: false, message: "Your cart is temporarily unavailable. Please try again." }));
      }
    };
    void initialRead();
    const sync = () => { void refresh(); };
    window.addEventListener("nilkurinji:cart-updated", sync);
    return () => { active = false; readGeneration.current += 1; window.removeEventListener("nilkurinji:cart-updated", sync); };
  }, [refresh]);

  const mutate = useCallback(async (action: CartAction) => {
    if (lock.current) return null;
    lock.current = true;
    readGeneration.current += 1;
    setState((current) => ({ ...current, busy: true, message: "" }));
    try {
      const result = await postCartAction(action);
      if (action.action === "checkout" || action.action === "buy-now") return { checkoutUrl: result.checkoutUrl };
      setState((current) => ({ ...current, cart: result.cart ?? null, loading: false, message: "" }));
      return {};
    } catch (error) {
      const message = error instanceof Error ? error.message : "The cart could not be updated. Please try again.";
      setState((current) => ({ ...current, message }));
      throw error;
    } finally {
      lock.current = false;
      setState((current) => ({ ...current, busy: false }));
    }
  }, []);

  const value = useMemo(() => ({ ...state, refresh, mutate }), [state, refresh, mutate]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useStorefrontCart(): CartController | null {
  return useContext(CartContext);
}
