import { headers } from "next/headers";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { getBuyerIp, shopifyQuery } from "@/lib/shopify/server";
import { checkDeliveryLocation, type DeliveryCheckResult } from "@/lib/delivery/serviceability";
import { SHIPPING_METAOBJECT_QUERY } from "@/lib/shopify/queries";

export const dynamic = "force-dynamic";

type ShippingField = {
  key: string;
  value: string | null;
  reference?: { url?: string | null; mimeType?: string | null; originalFileSize?: number | null } | null;
};

type ShippingMetaobject = { fields: ShippingField[] } | null;

function reply(result: DeliveryCheckResult, status = 200): Response {
  return Response.json(result, {
    status,
    headers: { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" },
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 1000) return reply({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null }, 413);
    body = JSON.parse(text);
  } catch {
    return reply({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null }, 400);
  }

  const pincode = body && typeof body === "object" && "pincode" in body && typeof body.pincode === "string" ? body.pincode.trim() : "";
  if (!/^\d{6}$/.test(pincode)) {
    return reply({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null }, 400);
  }
  if (getStorefrontMode().mode !== "live") {
    return reply({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null });
  }

  try {
    const data = await shopifyQuery<{ metaobject: ShippingMetaobject }>(
      SHIPPING_METAOBJECT_QUERY,
      {},
      { buyerIp: getBuyerIp(await headers()), tags: ["shopify-delivery"] },
    );
    const fields = new Map((data.metaobject?.fields ?? []).map((field) => [field.key, field]));
    const file = fields.get("serviceability_file")?.reference;
    const fileUrl = file?.url ?? "";
    const mimeType = file?.mimeType?.toLowerCase() ?? "";
    if (!fileUrl || (mimeType && !["text/csv", "text/plain", "application/octet-stream"].includes(mimeType))) {
      return reply({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null });
    }

    const result = await checkDeliveryLocation({
      pincode,
      fileUrl,
      fileSize: file?.originalFileSize ?? null,
      verifiedAt: fields.get("serviceability_verified_at")?.value ?? "",
      maxAgeDays: Number(fields.get("serviceability_max_age_days")?.value ?? 30),
    });
    return reply(result);
  } catch {
    return reply({ status: "unknown", prepaid: null, cod: null, etaMinDays: null, etaMaxDays: null });
  }
}
