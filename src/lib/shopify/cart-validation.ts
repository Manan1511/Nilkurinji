export type CartAction =
  | { action: "add"; variantId: string; quantity: number }
  | { action: "buy-now"; variantId: string; quantity: number }
  | { action: "update"; lineId: string; quantity: number }
  | { action: "remove"; lineId: string }
  | { action: "checkout" };

export type ParseCartActionResult =
  | { ok: true; value: CartAction }
  | { ok: false; reason: string };

const VARIANT_ID = /^gid:\/\/shopify\/ProductVariant\/[A-Za-z0-9_-]+$/;
const CART_LINE_ID = /^gid:\/\/shopify\/CartLine\/[A-Za-z0-9_-]+(?:\?cart=[A-Za-z0-9._~%+/=:-]{1,512})?$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10;
}

export function parseCartAction(input: unknown): ParseCartActionResult {
  if (!isRecord(input)) return { ok: false, reason: "Invalid cart request." };
  const action = input.action;

  if (action === "checkout") return { ok: true, value: { action } };

  if (action === "add" || action === "buy-now") {
    if (typeof input.variantId !== "string" || !VARIANT_ID.test(input.variantId)) {
      return { ok: false, reason: "Choose a valid Shopify product option." };
    }
    if (!isQuantity(input.quantity)) return { ok: false, reason: "Choose a quantity between 1 and 10." };
    return {
      ok: true,
      value: action === "add"
        ? { action: "add", variantId: input.variantId, quantity: input.quantity }
        : { action: "buy-now", variantId: input.variantId, quantity: input.quantity },
    };
  }

  if (action === "update" || action === "remove") {
    if (typeof input.lineId !== "string" || !CART_LINE_ID.test(input.lineId)) {
      return { ok: false, reason: "Choose a valid Shopify cart line." };
    }
    if (action === "remove") return { ok: true, value: { action, lineId: input.lineId } };
    if (!isQuantity(input.quantity)) return { ok: false, reason: "Choose a quantity between 1 and 10." };
    return { ok: true, value: { action, lineId: input.lineId, quantity: input.quantity } };
  }

  return { ok: false, reason: "Unsupported cart action." };
}

export function canAddCartQuantity(
  lines: { quantity: number; merchandise: { id: string } }[],
  variantId: string,
  requestedQuantity: number,
): boolean {
  const currentQuantity = lines
    .filter((line) => line.merchandise.id === variantId)
    .reduce((total, line) => total + line.quantity, 0);
  return Number.isInteger(requestedQuantity) && requestedQuantity >= 1 && currentQuantity + requestedQuantity <= 10;
}
