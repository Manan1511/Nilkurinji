"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { postCartAction, postCheckoutSession, waitForCartMutations, type EmbeddedCheckoutSession } from "@/lib/cart-client";
import type { CartAction } from "@/lib/shopify/cart-validation";
import type { ShopifyCart } from "@/lib/shopify/cart";
import { MagicCheckoutLauncher } from "@/components/checkout/magic-checkout-launcher";

type CartState = {
  cart: ShopifyCart | null;
  pendingQuantityDelta: number;
  pendingVariantQuantityDelta: Record<string, number>;
  preview: boolean;
  expired: boolean;
  cartEnabled: boolean;
  checkoutEnabled: boolean;
  loading: boolean;
  busy: boolean;
  message: string;
  checkoutSession: EmbeddedCheckoutSession | null;
};
type CartController = CartState & {
  refresh: () => Promise<void>;
  mutate: (action: CartMutationAction) => Promise<{ checkoutUrl?: string; providerSession?: EmbeddedCheckoutSession } | null>;
  closeCheckout: () => void;
};
const CartContext = createContext<CartController | null>(null);
export type CartMutationAction = CartAction | { action: "decrement-variant"; variantId: string };
const initialState: CartState = { cart: null, pendingQuantityDelta: 0, pendingVariantQuantityDelta: {}, preview: false, expired: false, cartEnabled: false, checkoutEnabled: false, loading: true, busy: false, message: "", checkoutSession: null };
type CartApiResponse = { cart?: ShopifyCart | null; preview?: boolean; cartEnabled?: boolean; purchasingEnabled?: boolean; expired?: boolean; error?: string };

async function readCart(): Promise<CartApiResponse> {
  await waitForCartMutations();
  const response = await fetch("/api/cart", { cache: "no-store" });
  const body = await response.json() as CartApiResponse;
  if (!response.ok) throw new Error(body.error || "Your cart is temporarily unavailable. Please try again.");
  return body;
}

function confirmedState(current: CartState, body: CartApiResponse): CartState {
  return { ...current, cart: body.cart ?? null, preview: body.preview ?? false, expired: body.expired ?? false, cartEnabled: body.cartEnabled ?? false, checkoutEnabled: body.purchasingEnabled ?? false, loading: false, message: "" };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(initialState);
  const mutationTail = useRef<Promise<void>>(Promise.resolve());
  const queuedMutations = useRef(0);
  const readGeneration = useRef(0);
  const confirmedCart = useRef<ShopifyCart | null>(null);
  const refresh = useCallback(async () => {
    if (queuedMutations.current > 0) return;
    const generation = ++readGeneration.current;
    setState((current) => ({ ...current, loading: true, message: "" }));
    try {
      const body = await readCart();
      if (generation !== readGeneration.current) return;
      confirmedCart.current = body.cart ?? null;
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
        if (active && generation === readGeneration.current) {
          confirmedCart.current = body.cart ?? null;
          setState((current) => confirmedState(current, body));
        }
      } catch {
        if (active && generation === readGeneration.current) setState((current) => ({ ...current, loading: false, message: "Your cart is temporarily unavailable. Please try again." }));
      }
    };
    void initialRead();
    const sync = () => { void refresh(); };
    window.addEventListener("nilkurinji:cart-updated", sync);
    return () => { active = false; readGeneration.current += 1; window.removeEventListener("nilkurinji:cart-updated", sync); };
  }, [refresh]);

  const mutate = useCallback((action: CartMutationAction) => {
    const pendingDelta = action.action === "add" ? action.quantity : action.action === "decrement-variant" ? -1 : 0;
    const pendingVariantId = action.action === "add" || action.action === "decrement-variant" ? action.variantId : null;
    queuedMutations.current += 1;
    readGeneration.current += 1;
    setState((current) => {
      const pendingVariantQuantityDelta = { ...current.pendingVariantQuantityDelta };
      if (pendingVariantId) {
        const next = (pendingVariantQuantityDelta[pendingVariantId] ?? 0) + pendingDelta;
        if (next === 0) delete pendingVariantQuantityDelta[pendingVariantId];
        else pendingVariantQuantityDelta[pendingVariantId] = next;
      }
      return { ...current, pendingQuantityDelta: current.pendingQuantityDelta + pendingDelta, pendingVariantQuantityDelta, busy: true, message: "" };
    });

    const settlePendingDelta = (current: CartState) => {
      if (!pendingDelta || !pendingVariantId) return current;
      const pendingVariantQuantityDelta = { ...current.pendingVariantQuantityDelta };
      const next = (pendingVariantQuantityDelta[pendingVariantId] ?? 0) - pendingDelta;
      if (next === 0) delete pendingVariantQuantityDelta[pendingVariantId];
      else pendingVariantQuantityDelta[pendingVariantId] = next;
      return { ...current, pendingQuantityDelta: current.pendingQuantityDelta - pendingDelta, pendingVariantQuantityDelta };
    };

    const request = mutationTail.current.then(async () => {
      if (action.action === "checkout" || action.action === "buy-now") {
        const result = await postCheckoutSession(action);
        if (result.checkoutUrl) {
          setState((current) => ({ ...current, loading: false }));
          return { checkoutUrl: result.checkoutUrl };
        }
        if (result.session && result.provider === "razorpay") {
          window.dispatchEvent(new Event("nilkurinji:cart-close"));
          setState((current) => ({ ...current, loading: false, checkoutSession: result.session ?? null }));
          return { providerSession: result.session };
        }
        throw new Error("Checkout could not be prepared. Please try again.");
      }

      let cartAction: CartAction;
      if (action.action === "decrement-variant") {
        const matchingLines = confirmedCart.current?.lines.nodes.filter((line) => line.merchandise.id === action.variantId) ?? [];
        const line = matchingLines.find((item) => item.quantity > 1) ?? matchingLines[0];
        if (!line) {
          setState((current) => ({ ...settlePendingDelta(current), loading: false }));
          return {};
        }
        cartAction = line.quantity > 1
          ? { action: "update", lineId: line.id, quantity: line.quantity - 1 }
          : { action: "remove", lineId: line.id };
      } else cartAction = action;

      const result = await postCartAction(cartAction);
      confirmedCart.current = result.cart ?? null;
      setState((current) => ({
        ...settlePendingDelta(current),
        cart: result.cart ?? null,
        cartEnabled: result.cartEnabled ?? current.cartEnabled,
        checkoutEnabled: result.purchasingEnabled ?? current.checkoutEnabled,
        loading: false,
        message: "",
      }));
      return {};
    });
    mutationTail.current = request.then(() => undefined, () => undefined);

    return request.catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "The cart could not be updated. Please try again.";
      setState((current) => ({ ...settlePendingDelta(current), loading: false, message }));
      throw error;
    }).finally(() => {
      queuedMutations.current -= 1;
      setState((current) => ({ ...current, busy: queuedMutations.current > 0 }));
    });
  }, []);

  const closeCheckout = useCallback(() => setState((current) => ({ ...current, checkoutSession: null })), []);
  const value = useMemo(() => ({ ...state, refresh, mutate, closeCheckout }), [state, refresh, mutate, closeCheckout]);
  return <CartContext.Provider value={value}>{children}<MagicCheckoutLauncher session={state.checkoutSession} onClose={closeCheckout} /></CartContext.Provider>;
}

export function useStorefrontCart(): CartController | null {
  return useContext(CartContext);
}
