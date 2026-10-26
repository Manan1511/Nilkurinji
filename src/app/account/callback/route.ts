import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_OAUTH_COOKIE, CUSTOMER_SESSION_COOKIE, encryptCustomerSession, finishCustomerLogin, sessionCookieOptions } from "@/lib/shopify/customer-account";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  if (searchParams.has("error")) return redirectToAccount(request, "cancelled");
  try {
    const result = await finishCustomerLogin(searchParams.get("code"), searchParams.get("state"), request.cookies.get(CUSTOMER_OAUTH_COOKIE)?.value);
    const destination = new URL(result.returnTo, process.env.SITE_URL ?? request.nextUrl.origin);
    const response = NextResponse.redirect(destination);
    response.cookies.set(CUSTOMER_SESSION_COOKIE, encryptCustomerSession(result.session), sessionCookieOptions());
    response.cookies.set(CUSTOMER_OAUTH_COOKIE, "", sessionCookieOptions(0));
    return response;
  } catch {
    return redirectToAccount(request, "failed");
  }
}

function redirectToAccount(request: NextRequest, reason: string): NextResponse {
  const response = NextResponse.redirect(new URL(`/account?error=${reason}`, request.nextUrl.origin));
  response.cookies.set(CUSTOMER_OAUTH_COOKIE, "", sessionCookieOptions(0));
  return response;
}
