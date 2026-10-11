export type ProductFaq = { question: string; answer: string };
export type ApprovedProductReview = { name: string; rating: number; title: string; body: string; date: string | null };

export function parseFaqs(value: string | null | undefined): ProductFaq[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 12).flatMap((item): ProductFaq[] => {
      if (typeof item !== "object" || item === null) return [];
      const entry = item as Record<string, unknown>;
      if (typeof entry.question !== "string" || typeof entry.answer !== "string") return [];
      const question = entry.question.trim();
      const answer = entry.answer.trim();
      if (!question || !answer || question.length > 180 || answer.length > 1600) return [];
      return [{ question, answer }];
    });
  } catch {
    return [];
  }
}

export function parseApprovedReviews(value: string | null | undefined): ApprovedProductReview[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 20).flatMap((item): ApprovedProductReview[] => {
      if (typeof item !== "object" || item === null) return [];
      const entry = item as Record<string, unknown>;
      if (entry.approved !== true || typeof entry.name !== "string" || typeof entry.body !== "string") return [];
      if (typeof entry.rating !== "number" || !Number.isInteger(entry.rating) || entry.rating < 1 || entry.rating > 5) return [];
      const name = entry.name.trim();
      const body = entry.body.trim();
      const title = typeof entry.title === "string" ? entry.title.trim() : "";
      const date = typeof entry.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && !Number.isNaN(Date.parse(entry.date))
        ? entry.date
        : null;
      if (!name || !body || name.length > 80 || title.length > 120 || body.length > 2000) return [];
      return [{ name, rating: entry.rating, title, body, date }];
    });
  } catch {
    return [];
  }
}
