import "server-only";

import { redirect } from "next/navigation";
import { getCurrentCustomerSession, isCustomerSessionExpiring, type CustomerSession } from "@/lib/shopify/customer-account";

export async function accountPageSession(returnTo: string): Promise<CustomerSession | null> {
  const session = await getCurrentCustomerSession();
  if (!session) return null;
  if (!isCustomerSessionExpiring(session)) return session;
  if (!session.refreshToken) return null;
  const path = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/account";
  return redirect(`/api/account/refresh?return_to=${encodeURIComponent(path)}`);
}
