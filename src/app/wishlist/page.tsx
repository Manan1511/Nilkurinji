import { permanentRedirect } from "next/navigation";

export default async function WishlistPage(): Promise<never> {
  permanentRedirect("/shop");
}
