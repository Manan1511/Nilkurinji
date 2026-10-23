import { notFound, permanentRedirect } from "next/navigation";
import { CATEGORIES } from "@/lib/site-config";

type PageProps = { params: Promise<{ handle: string }> };

export default async function CollectionPage({ params }: PageProps): Promise<never> {
  const { handle } = await params;
  const category = CATEGORIES.find((item) => item.handle === handle);
  if (!category) notFound();

  permanentRedirect(category.href);
}
