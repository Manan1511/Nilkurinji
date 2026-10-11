import "server-only";

import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "@/lib/shopify/queries";
import { shopifyQuery } from "@/lib/shopify/server";

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: { amount: string; currencyCode: string } };
      merchandise: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        image: { url: string; altText: string | null; width: number | null; height: number | null } | null;
        product: {
          id: string;
          title: string;
          handle: string;
          featuredImage: { url: string; altText: string | null; width: number | null; height: number | null } | null;
        };
      };
    }[];
  };
};

type MutationPayload = { cart: ShopifyCart | null; userErrors: { field: string[] | null; message: string }[] };

export class ShopifyCartError extends Error {
  constructor(message: string, readonly kind: "invalid" | "expired" | "unavailable" = "invalid") {
    super(message);
    this.name = "ShopifyCartError";
  }
}

function unwrapMutation(payload: MutationPayload): ShopifyCart {
  if (payload.userErrors.length) {
    throw new ShopifyCartError(payload.userErrors.map((error) => error.message).join(" "), "unavailable");
  }
  if (!payload.cart) throw new ShopifyCartError("Shopify did not return a cart.", "unavailable");
  return payload.cart;
}

export async function getShopifyCart(cartId: string, buyerIp?: string): Promise<ShopifyCart | null> {
  const data = await shopifyQuery<{ cart: ShopifyCart | null }>(CART_QUERY, { cartId }, { buyerIp, cache: "no-store" });
  return data.cart;
}

export async function createShopifyCart(variantId: string, quantity: number, buyerIp?: string): Promise<ShopifyCart> {
  const data = await shopifyQuery<{ cartCreate: MutationPayload }>(CART_CREATE_MUTATION, {
    input: {
      buyerIdentity: { countryCode: "IN" },
      lines: [{ merchandiseId: variantId, quantity }],
    },
  }, { buyerIp, cache: "no-store" });
  return unwrapMutation(data.cartCreate);
}

export async function addShopifyCartLine(
  cartId: string,
  variantId: string,
  quantity: number,
  buyerIp?: string,
): Promise<ShopifyCart> {
  const data = await shopifyQuery<{ cartLinesAdd: MutationPayload }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  }, { buyerIp, cache: "no-store" });
  return unwrapMutation(data.cartLinesAdd);
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  buyerIp?: string,
): Promise<ShopifyCart> {
  const data = await shopifyQuery<{ cartLinesUpdate: MutationPayload }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  }, { buyerIp, cache: "no-store" });
  return unwrapMutation(data.cartLinesUpdate);
}

export async function removeShopifyCartLine(cartId: string, lineId: string, buyerIp?: string): Promise<ShopifyCart> {
  const data = await shopifyQuery<{ cartLinesRemove: MutationPayload }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  }, { buyerIp, cache: "no-store" });
  return unwrapMutation(data.cartLinesRemove);
}
