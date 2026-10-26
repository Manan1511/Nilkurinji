export type DeliveryCheckResult = {
  status: "serviceable" | "not-serviceable" | "unknown";
  prepaid: boolean | null;
  cod: boolean | null;
  etaMinDays: number | null;
  etaMaxDays: number | null;
};

export type ServiceabilityRecord = Omit<DeliveryCheckResult, "status">;

const UNKNOWN: DeliveryCheckResult = {
  status: "unknown",
  prepaid: null,
  cod: null,
  etaMinDays: null,
  etaMaxDays: null,
};
const MAX_CSV_BYTES = 1_000_000;
const MAX_SERVICEABILITY_AGE_DAYS = 365;

function parseBoolean(value: string | undefined): boolean | null {
  switch (value?.trim().toLowerCase()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
      return false;
    default:
      return null;
  }
}

function parseDays(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 60 ? parsed : null;
}

function splitCsvRow(row: string): string[] | null {
  const fields: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];
    if (character === '"') {
      if (quoted && row[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      fields.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }
  if (quoted) return null;
  fields.push(value.trim());
  return fields;
}

export function parseServiceabilityCsv(csv: string): Map<string, ServiceabilityRecord> {
  const records = new Map<string, ServiceabilityRecord>();
  if (!csv || new TextEncoder().encode(csv).byteLength > MAX_CSV_BYTES) return records;

  const rows = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((row) => row.trim());
  const header = rows.shift()?.split(",").map((value) => value.trim().toLowerCase()) ?? [];
  const indexes = Object.fromEntries(header.map((name, index) => [name, index]));
  if (["pincode", "prepaid", "cod", "eta_min_days", "eta_max_days"].some((name) => indexes[name] === undefined)) return records;

  const duplicates = new Set<string>();
  for (const row of rows.slice(0, 100_000)) {
    const columns = splitCsvRow(row);
    if (!columns) continue;
    const pincode = columns[indexes.pincode]?.trim() ?? "";
    const prepaid = parseBoolean(columns[indexes.prepaid]);
    const cod = parseBoolean(columns[indexes.cod]);
    if (!/^\d{6}$/.test(pincode) || prepaid === null || cod === null || duplicates.has(pincode)) continue;
    if (records.has(pincode)) {
      records.delete(pincode);
      duplicates.add(pincode);
      continue;
    }

    const etaMinDays = parseDays(columns[indexes.eta_min_days]);
    const etaMaxDays = parseDays(columns[indexes.eta_max_days]);
    const etaIsValid = etaMinDays !== null && etaMaxDays !== null && etaMinDays <= etaMaxDays;
    records.set(pincode, {
      prepaid,
      cod,
      etaMinDays: etaIsValid ? etaMinDays : null,
      etaMaxDays: etaIsValid ? etaMaxDays : null,
    });
  }
  return records;
}

function isFresh(verifiedAt: string, maxAgeDays: number, now: number): boolean {
  const timestamp = Date.parse(verifiedAt);
  if (!Number.isFinite(timestamp) || !Number.isInteger(maxAgeDays) || maxAgeDays < 1 || maxAgeDays > MAX_SERVICEABILITY_AGE_DAYS) return false;
  const age = now - timestamp;
  return age >= 0 && age <= maxAgeDays * 24 * 60 * 60 * 1000;
}

export function evaluatePincode(
  pincode: string,
  records: ReadonlyMap<string, ServiceabilityRecord>,
  verifiedAt: string,
  maxAgeDays: number,
  now = Date.now(),
): DeliveryCheckResult {
  if (!/^\d{6}$/.test(pincode) || !isFresh(verifiedAt, maxAgeDays, now)) return UNKNOWN;
  const record = records.get(pincode);
  if (!record) return UNKNOWN;
  const { prepaid, cod, etaMinDays, etaMaxDays } = record;
  return {
    status: prepaid || cod ? "serviceable" : "not-serviceable",
    prepaid,
    cod,
    etaMinDays,
    etaMaxDays,
  };
}

export function isTrustedServiceabilityFileUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "cdn.shopify.com" && !url.username && !url.password && !url.port;
  } catch {
    return false;
  }
}

export async function checkDeliveryLocation(input: {
  pincode: string;
  fileUrl: string;
  fileSize: number | null;
  verifiedAt: string;
  maxAgeDays: number;
  now?: number;
  fetcher?: typeof fetch;
}): Promise<DeliveryCheckResult> {
  const { pincode, fileUrl, fileSize, verifiedAt, maxAgeDays, now = Date.now(), fetcher = fetch } = input;
  if (!/^\d{6}$/.test(pincode) || !isFresh(verifiedAt, maxAgeDays, now) || !isTrustedServiceabilityFileUrl(fileUrl)) return UNKNOWN;
  if (fileSize !== null && (!Number.isInteger(fileSize) || fileSize < 0 || fileSize > MAX_CSV_BYTES)) return UNKNOWN;

  try {
    const response = await fetcher(fileUrl, {
      method: "GET",
      redirect: "error",
      cache: "force-cache",
      next: { revalidate: 900, tags: ["shopify-serviceability"] },
      signal: AbortSignal.timeout(5000),
      headers: { Accept: "text/csv, text/plain, application/octet-stream" },
    });
    if (!response.ok) return UNKNOWN;
    const declaredSize = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredSize) && declaredSize > MAX_CSV_BYTES) return UNKNOWN;
    const csv = await response.text();
    if (new TextEncoder().encode(csv).byteLength > MAX_CSV_BYTES) return UNKNOWN;
    return evaluatePincode(pincode, parseServiceabilityCsv(csv), verifiedAt, maxAgeDays, now);
  } catch {
    return UNKNOWN;
  }
}
