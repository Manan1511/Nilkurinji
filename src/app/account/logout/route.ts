import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_OAUTH_COOKIE, CUSTOMER_SESSION_COOKIE, readCustomerSession, sessionCookieOptions } from "@/lib/shopify/customer-account";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  if (!origin) return NextResponse.json({ error: "This sign-out request could not be verified." }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  try {
    const expected = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : request.nextUrl.origin;
    if (new URL(origin).origin !== expected) return NextResponse.json({ error: "This sign-out request could not be verified." }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  } catch { return NextResponse.json({ error: "This sign-out request could not be verified." }, { status: 403, headers: { "Cache-Control": "private, no-store" } }); }
  const session = readCustomerSession(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  const target = new URL("/account?signed_out=1", process.env.SITE_URL ?? request.nextUrl.origin);
  if (session?.endSessionEndpoint && session.idToken) {
    try {
      const endSession = new URL(session.endSessionEndpoint);
      endSession.searchParams.set("id_token_hint", session.idToken);
      endSession.searchParams.set("post_logout_redirect_uri", target.toString());
      endSession.searchParams.set("client_id", session.clientId);
      const response = NextResponse.redirect(endSession, 303);
      clearSessionCookies(response);
      return response;
    } catch { /* local sign-out below remains available */ }
  }
  const response = NextResponse.redirect(target, 303);
  clearSessionCookies(response);
  return response;
}

function clearSessionCookies(response: NextResponse): void {
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", sessionCookieOptions(0));
  response.cookies.set(CUSTOMER_OAUTH_COOKIE, "", sessionCookieOptions(0));
}
