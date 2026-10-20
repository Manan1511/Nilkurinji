export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 120;
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MAX_SUGGESTIONS = 6;
export function normalizeSearchQuery(value: string): string {
  return [...value.trim().replace(/\s+/gu, " ")].slice(0, SEARCH_MAX_LENGTH).join("");
}
export function isEligibleSearchQuery(value: string): boolean {
  return [...normalizeSearchQuery(value)].length >= SEARCH_MIN_LENGTH;
}
