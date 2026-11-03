import { redirect } from "next/navigation";
import { normalizeSearchQuery } from "@/lib/search/query";

type SearchProps = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: SearchProps): Promise<never> {
  const { q } = await searchParams;
  const query = normalizeSearchQuery(Array.isArray(q) ? q[0] ?? "" : q ?? "");
  redirect(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
}
