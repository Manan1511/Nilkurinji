import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_ADDRESS_CREATE, CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_UPDATE, ADDRESS_IDS_QUERY } from "@/lib/shopify/customer-queries";
import { CUSTOMER_SESSION_COOKIE, customerAccountQuery, CustomerAccountError, readCustomerSession } from "@/lib/shopify/customer-account";

type AddressInput = {
  firstName: string; lastName: string; company: string; address1: string; address2: string; city: string;
  countryCode: string; zoneCode: string; zip: string; phoneNumber: string; defaultAddress: boolean;
};
type Payload = { action?: unknown; addressId?: unknown; address?: unknown };
type AddressIds = { customer: { id: string; addresses: { nodes: { id: string }[] } } | null };
type MutationResult = { userErrors?: { field: string[] | null; message: string }[] };

const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
const CUSTOMER_ADDRESS_ID = /^gid:\/\/shopify\/CustomerAddress\/[A-Za-z0-9_-]+$/;
const TEXT_LIMITS: Record<Exclude<keyof AddressInput, "defaultAddress">, number> = { firstName: 80, lastName: 80, company: 100, address1: 160, address2: 160, city: 80, countryCode: 2, zoneCode: 80, zip: 20, phoneNumber: 20 };

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!sameOrigin(request)) return json({ error: "This request could not be verified." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return json({ error: "Invalid request format." }, 415);
  let body: Payload;
  try { body = await request.json() as Payload; }
  catch { return json({ error: "Invalid address request." }, 400); }

  const action = body.action;
  if (action !== "create" && action !== "update" && action !== "delete") return json({ error: "Choose a valid address action." }, 400);
  const addressId = typeof body.addressId === "string" ? body.addressId : "";
  if (action !== "create" && !CUSTOMER_ADDRESS_ID.test(addressId)) return json({ error: "This address could not be found." }, 400);
  const address = action === "delete" ? null : normalizeAddress(body.address);
  if (action !== "delete" && !address) return json({ error: "Check the address fields and try again." }, 400);

  const session = readCustomerSession(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return json({ error: "Please sign in again to manage addresses." }, 401);
  try {
    const data = await customerAccountQuery<AddressIds>(session, ADDRESS_IDS_QUERY);
    const customer = data.customer;
    if (!customer) return json({ error: "Please sign in again to manage addresses." }, 401);
    if (action !== "create" && !customer.addresses.nodes.some(({ id }) => id === addressId)) return json({ error: "This address does not belong to the signed-in account." }, 404);

    let query: string;
    let variables: Record<string, unknown>;
    if (action === "create") {
      query = CUSTOMER_ADDRESS_CREATE;
      variables = { address: address && omitDefault(address), defaultAddress: address!.defaultAddress };
    } else if (action === "update") {
      query = CUSTOMER_ADDRESS_UPDATE;
      variables = { address: address && omitDefault(address), addressId, defaultAddress: address!.defaultAddress };
    } else {
      query = CUSTOMER_ADDRESS_DELETE;
      variables = { addressId };
    }
    const responseData = await customerAccountQuery<{ customerAddressCreate?: MutationResult; customerAddressUpdate?: MutationResult; customerAddressDelete?: MutationResult }>(session, query, variables);
    const payload = action === "create" ? responseData.customerAddressCreate : action === "update" ? responseData.customerAddressUpdate : responseData.customerAddressDelete;
    if (!payload || payload.userErrors?.length) return json({ error: "Shopify could not save that address. Check the details and try again." }, 400);
    return json({ ok: true }, 200);
  } catch (error) {
    const status = error instanceof CustomerAccountError && error.status === 401 ? 401 : 503;
    return json({ error: status === 401 ? "Please sign in again to manage addresses." : "Addresses are temporarily unavailable. Please try again." }, status);
  }
}

function normalizeAddress(value: unknown): AddressInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const normalized = {} as Omit<AddressInput, "defaultAddress">;
  for (const [key, max] of Object.entries(TEXT_LIMITS) as [keyof Omit<AddressInput, "defaultAddress">, number][]) {
    const field = raw[key];
    if (typeof field !== "string" || field.trim().length > max) return null;
    normalized[key] = field.trim();
  }
  if (!normalized.firstName || !normalized.lastName || !normalized.address1 || !normalized.city || !normalized.zoneCode || !normalized.zip || !/^[A-Z]{2}$/.test(normalized.countryCode)) return null;
  if (normalized.phoneNumber) {
    normalized.phoneNumber = normalized.phoneNumber.replace(/[\s()-]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(normalized.phoneNumber)) return null;
  }
  if (typeof raw.defaultAddress !== "boolean") return null;
  return { ...normalized, defaultAddress: raw.defaultAddress };
}

function omitDefault(address: AddressInput): Omit<AddressInput, "defaultAddress"> {
  return Object.fromEntries(Object.entries(address).filter(([key]) => key !== "defaultAddress")) as Omit<AddressInput, "defaultAddress">;
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : request.nextUrl.origin;
    return new URL(origin).origin === expected;
  } catch { return false; }
}

function json(value: unknown, status: number): NextResponse {
  return NextResponse.json(value, { status, headers: noStore });
}
