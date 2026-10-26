import { describe, expect, it, vi } from "vitest";
import { checkDeliveryLocation, evaluatePincode, isTrustedServiceabilityFileUrl, parseServiceabilityCsv } from "@/lib/delivery/serviceability";

const csv = `pincode,prepaid,cod,eta_min_days,eta_max_days\n110001,true,true,2,4\n560001,true,false,3,5\n000000,false,false,,`;

describe("India delivery serviceability", () => {
  it("parses only valid six-digit rows and keeps prepaid and COD separate", () => {
    const records = parseServiceabilityCsv(`${csv}\n12,true,true,1,2\n110002,maybe,false,1,2`);

    expect(records.get("110001")).toEqual({ prepaid: true, cod: true, etaMinDays: 2, etaMaxDays: 4 });
    expect(records.get("560001")).toEqual({ prepaid: true, cod: false, etaMinDays: 3, etaMaxDays: 5 });
    expect(records.has("12")).toBe(false);
    expect(records.has("110002")).toBe(false);
  });

  it("treats duplicate pincode rows as ambiguous instead of trusting one", () => {
    const records = parseServiceabilityCsv(`${csv}\n110001,false,false,,`);

    expect(records.has("110001")).toBe(false);
  });

  it("returns unknown when data is missing, malformed, stale, or dated in the future", () => {
    const records = parseServiceabilityCsv(csv);
    const now = Date.parse("2026-10-25T00:00:00Z");

    expect(evaluatePincode("999999", records, "2026-10-20", 30, now).status).toBe("unknown");
    expect(evaluatePincode("110001", records, "bad-date", 30, now).status).toBe("unknown");
    expect(evaluatePincode("110001", records, "2026-09-01", 30, now).status).toBe("unknown");
    expect(evaluatePincode("110001", records, "2026-10-26", 30, now).status).toBe("unknown");
  });

  it("returns separate prepaid and COD eligibility with an approved ETA", () => {
    const records = parseServiceabilityCsv(csv);
    const now = Date.parse("2026-10-25T00:00:00Z");

    expect(evaluatePincode("560001", records, "2026-10-20", 30, now)).toEqual({
      status: "serviceable", prepaid: true, cod: false, etaMinDays: 3, etaMaxDays: 5,
    });
    expect(evaluatePincode("000000", records, "2026-10-20", 30, now)).toEqual({
      status: "not-serviceable", prepaid: false, cod: false, etaMinDays: null, etaMaxDays: null,
    });
  });

  it("accepts only HTTPS files on Shopify's exact CDN host", () => {
    expect(isTrustedServiceabilityFileUrl("https://cdn.shopify.com/s/files/1/123/files/serviceability.csv")).toBe(true);
    expect(isTrustedServiceabilityFileUrl("http://cdn.shopify.com/file.csv")).toBe(false);
    expect(isTrustedServiceabilityFileUrl("https://cdn.shopify.com.attacker.example/file.csv")).toBe(false);
    expect(isTrustedServiceabilityFileUrl("https://attacker.example/cdn.shopify.com/file.csv")).toBe(false);
    expect(isTrustedServiceabilityFileUrl("https://user:pass@cdn.shopify.com/file.csv")).toBe(false);
  });

  it("fetches a fresh trusted Shopify file and returns only the requested delivery row", async () => {
    const fetcher = vi.fn(async () => new Response(csv, { headers: { "content-type": "text/csv", "content-length": String(new TextEncoder().encode(csv).byteLength) } }));
    const result = await checkDeliveryLocation({
      pincode: "110001", fileUrl: "https://cdn.shopify.com/s/files/1/123/files/serviceability.csv", fileSize: null,
      verifiedAt: "2026-10-20", maxAgeDays: 30, now: Date.parse("2026-10-25T00:00:00Z"), fetcher,
    });

    expect(result).toEqual({ status: "serviceable", prepaid: true, cod: true, etaMinDays: 2, etaMaxDays: 4 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("does not fetch untrusted, stale, or oversized sources", async () => {
    const fetcher = vi.fn();
    const base = { pincode: "110001", fileUrl: "https://cdn.shopify.com/file.csv", fileSize: null, verifiedAt: "2026-10-20", maxAgeDays: 30, now: Date.parse("2026-10-25T00:00:00Z"), fetcher };

    expect((await checkDeliveryLocation({ ...base, fileUrl: "https://attacker.example/file.csv" })).status).toBe("unknown");
    expect((await checkDeliveryLocation({ ...base, verifiedAt: "2026-08-01" })).status).toBe("unknown");
    expect((await checkDeliveryLocation({ ...base, fileSize: 1_000_001 })).status).toBe("unknown");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns unknown for an oversized downloaded file", async () => {
    const fetcher = vi.fn(async () => new Response("", { headers: { "content-length": "1000001" } }));
    const result = await checkDeliveryLocation({
      pincode: "110001", fileUrl: "https://cdn.shopify.com/file.csv", fileSize: null,
      verifiedAt: "2026-10-20", maxAgeDays: 30, now: Date.parse("2026-10-25T00:00:00Z"), fetcher,
    });
    expect(result.status).toBe("unknown");
  });
});
