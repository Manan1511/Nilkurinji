import type { TeaProfile, TeaProfileFormat } from "./types";

const FORMATS = new Set<TeaProfileFormat>(["loose-tea", "tea-bag"]);
const HTML = /<[^>]*>/;

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function boundedText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength && !HTML.test(trimmed) ? trimmed : null;
}

function boundedNumber(value: unknown, min: number, max: number, integer = false): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) return null;
  return value;
}

function parseBrewing(value: unknown): TeaProfile["brewing"] {
  const source = record(value);
  if (!source) return null;
  const doseSource = record(source.dose);
  const doseAmount = boundedNumber(doseSource?.amount, 0.01, 1000);
  const doseUnit = doseSource?.unit === "g" || doseSource?.unit === "bag" ? doseSource.unit : null;
  return {
    dose: doseAmount !== null && doseUnit ? { amount: doseAmount, unit: doseUnit } : null,
    waterMl: boundedNumber(source.waterMl, 1, 5000),
    temperatureC: boundedNumber(source.temperatureC, 0, 100),
    steepSeconds: boundedNumber(source.steepSeconds, 1, 3600, true),
    infusions: boundedNumber(source.infusions, 1, 20, true),
    instructions: boundedText(source.instructions, 500),
  };
}

export function parseTeaProfile(value: string | null | undefined): TeaProfile | null {
  if (!value) return null;
  let parsed: unknown;
  try { parsed = JSON.parse(value) as unknown; } catch { return null; }
  const source = record(parsed);
  if (!source || source.approved !== true) return null;

  const notes = Array.isArray(source.tastingNotes)
    ? source.tastingNotes.map((note) => boundedText(note, 60)).filter((note): note is string => note !== null).slice(0, 8)
    : [];
  const format = typeof source.format === "string" && FORMATS.has(source.format as TeaProfileFormat)
    ? source.format as TeaProfileFormat
    : null;
  return {
    approved: true,
    format,
    origin: boundedText(source.origin, 100),
    estate: boundedText(source.estate, 100),
    elevationM: boundedNumber(source.elevationM, 0, 10000, true),
    harvest: boundedText(source.harvest, 80),
    lot: boundedText(source.lot, 80),
    tastingNotes: notes,
    brewing: parseBrewing(source.brewing),
  };
}
