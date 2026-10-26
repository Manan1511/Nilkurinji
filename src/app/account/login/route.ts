import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_OAUTH_COOKIE, sessionCookieOptions, startCustomerLogin } from "@/lib/shopify/customer-account";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const result = await startCustomerLogin(request.nextUrl.searchParams.get("return_to"));
    const response = NextResponse.redirect(result.url);
    response.cookies.set(CUSTOMER_OAUTH_COOKIE, result.oauthCookie, sessionCookieOptions(60 * 10));
    return response;
  } catch {
    const destination = new URL("/account?error=unavailable", request.nextUrl.origin);
    return NextResponse.redirect(destination);
  }
}
