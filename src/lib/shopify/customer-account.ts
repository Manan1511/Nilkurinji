import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const CUSTOMER_SESSION_COOKIE = "nk_customer";
export const CUSTOMER_OAUTH_COOKIE = "nk_customer_oauth";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const OAUTH_MAX_AGE = 60 * 10;
const SHOP_DOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.myshopify\.com$/i;

type OpenIdConfiguration = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  end_session_endpoint?: string;
};

type OAuthState = { state: string; nonce: string; verifier: string; redirectUri: string; returnTo: string; expiresAt: number };
export type CustomerSession = {
  accessToken: string;
  refreshToken: string | null;
  idToken: string;
  graphqlApi: string;
  tokenEndpoint: string;
  endSessionEndpoint: string | null;
  clientId: string;
  expiresAt: number;
};

export class CustomerAccountError extends Error {
  constructor(message: string, readonly status = 503) { super(message); this.name = "CustomerAccountError"; }
}

function sessionSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET?.trim() ?? "";
  if (secret.length < 32) throw new CustomerAccountError("Customer account sessions are not configured.");
  return secret;
}

function encryptionKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

function seal(value: unknown, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64url")).join(".");
}

function unseal<T>(value: string | undefined, secret: string): T | null {
  if (!value) return null;
  try {
    const [ivPart, tagPart, ciphertextPart, extra] = value.split(".");
    if (!ivPart || !tagPart || !ciphertextPart || extra) return null;
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(secret), Buffer.from(ivPart, "base64url"));
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    const clear = Buffer.concat([decipher.update(Buffer.from(ciphertextPart, "base64url")), decipher.final()]).toString("utf8");
    return JSON.parse(clear) as T;
  } catch { return null; }
}

function configuredBaseUrl(): URL {
  try {
    const url = new URL(process.env.SITE_URL ?? "");
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error();
    return url;
  } catch {
    throw new CustomerAccountError("Customer sign-in requires a configured HTTPS SITE_URL.");
  }
}

function accountEnvironment(): { domain: string; clientId: string; clientSecret: string | null; redirectUri: string } {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim().toLowerCase() ?? "";
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim() ?? "";
  if (!SHOP_DOMAIN_PATTERN.test(domain) || !clientId) throw new CustomerAccountError("Shopify customer sign-in is not configured.");
  const base = configuredBaseUrl();
  return { domain, clientId, clientSecret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET?.trim() || null, redirectUri: new URL("/account/callback", base).toString() };
}

function secureEndpoint(value: unknown): string {
  if (typeof value !== "string") throw new CustomerAccountError("Shopify customer account discovery failed.");
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error();
    return url.toString();
  } catch {
    throw new CustomerAccountError("Shopify returned an invalid customer account endpoint.");
  }
}

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new CustomerAccountError("Shopify customer account service is unavailable.");
  try { return await response.json() as T; }
  catch { throw new CustomerAccountError("Shopify customer account service returned an invalid response."); }
}

async function discoverOpenId(domain: string): Promise<OpenIdConfiguration> {
  const origin = `https://${domain}`;
  const data = await readJson<Partial<OpenIdConfiguration>>(`${origin}/.well-known/openid-configuration`);
  if (!data.issuer) throw new CustomerAccountError("Shopify sign-in discovery is incomplete.");
  return {
    issuer: secureEndpoint(data.issuer),
    authorization_endpoint: secureEndpoint(data.authorization_endpoint),
    token_endpoint: secureEndpoint(data.token_endpoint),
    jwks_uri: secureEndpoint(data.jwks_uri),
    ...(data.end_session_endpoint ? { end_session_endpoint: secureEndpoint(data.end_session_endpoint) } : {}),
  };
}

async function discoverGraphqlApi(domain: string): Promise<string> {
  const data = await readJson<{ graphql_api?: string }>(`https://${domain}/.well-known/customer-account-api`);
  return secureEndpoint(data.graphql_api);
}

function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/account";
  try {
    const url = new URL(value, "https://nilkurinji.invalid");
    return url.origin === "https://nilkurinji.invalid" ? `${url.pathname}${url.search}${url.hash}` : "/account";
  } catch { return "/account"; }
}

export async function startCustomerLogin(returnToValue: string | null): Promise<{ url: string; oauthCookie: string }> {
  const env = accountEnvironment();
  const oidc = await discoverOpenId(env.domain);
  const state: OAuthState = {
    state: randomBytes(32).toString("base64url"),
    nonce: randomBytes(32).toString("base64url"),
    verifier: randomBytes(48).toString("base64url"),
    redirectUri: env.redirectUri,
    returnTo: safeReturnTo(returnToValue),
    expiresAt: Date.now() + OAUTH_MAX_AGE * 1000,
  };
  const challenge = createHash("sha256").update(state.verifier).digest("base64url");
  const authorization = new URL(oidc.authorization_endpoint);
  authorization.searchParams.set("scope", "openid email customer-account-api:full");
  authorization.searchParams.set("client_id", env.clientId);
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("redirect_uri", env.redirectUri);
  authorization.searchParams.set("state", state.state);
  authorization.searchParams.set("nonce", state.nonce);
  authorization.searchParams.set("code_challenge", challenge);
  authorization.searchParams.set("code_challenge_method", "S256");
  return { url: authorization.toString(), oauthCookie: seal(state, sessionSecret()) };
}

function validOAuthState(state: OAuthState | null, returnedState: string): state is OAuthState {
  if (!state || state.expiresAt <= Date.now() || !state.state || !returnedState) return false;
  const expected = Buffer.from(state.state);
  const received = Buffer.from(returnedState);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

type TokenPayload = { access_token?: string; refresh_token?: string; id_token?: string; expires_in?: number; token_type?: string };

async function tokenRequest(endpoint: string, body: URLSearchParams, clientId: string, clientSecret: string | null): Promise<TokenPayload> {
  const headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" });
  if (clientSecret) headers.set("Authorization", `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`);
  const response = await fetch(endpoint, { method: "POST", headers, body, cache: "no-store" });
  if (!response.ok) throw new CustomerAccountError("Shopify could not complete sign-in.", 401);
  try { return await response.json() as TokenPayload; }
  catch { throw new CustomerAccountError("Shopify returned an invalid sign-in response."); }
}

export async function finishCustomerLogin(code: string | null, returnedState: string | null, oauthCookie: string | undefined): Promise<{ session: CustomerSession; returnTo: string }> {
  const secret = sessionSecret();
  const state = unseal<OAuthState>(oauthCookie, secret);
  if (!code || !validOAuthState(state, returnedState ?? "")) throw new CustomerAccountError("This sign-in link has expired. Please try again.", 400);
  const env = accountEnvironment();
  if (state.redirectUri !== env.redirectUri) throw new CustomerAccountError("Customer sign-in configuration changed. Please try again.", 400);
  const oidc = await discoverOpenId(env.domain);
  const form = new URLSearchParams({ grant_type: "authorization_code", client_id: env.clientId, code, redirect_uri: state.redirectUri, code_verifier: state.verifier });
  const tokens = await tokenRequest(oidc.token_endpoint, form, env.clientId, env.clientSecret);
  if (!tokens.access_token || !tokens.id_token || !Number.isFinite(tokens.expires_in) || (tokens.expires_in ?? 0) <= 0) throw new CustomerAccountError("Shopify returned an incomplete sign-in response.");
  try {
    const keySet = createRemoteJWKSet(new URL(oidc.jwks_uri));
    const verified = await jwtVerify(tokens.id_token, keySet, { issuer: oidc.issuer, audience: env.clientId });
    if (verified.payload.nonce !== state.nonce) throw new Error("Invalid OIDC nonce.");
  } catch {
    throw new CustomerAccountError("Shopify sign-in could not be verified.", 401);
  }
  const graphqlApi = await discoverGraphqlApi(env.domain);
  const session: CustomerSession = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? null,
    idToken: tokens.id_token,
    graphqlApi,
    tokenEndpoint: oidc.token_endpoint,
    endSessionEndpoint: oidc.end_session_endpoint ?? null,
    clientId: env.clientId,
    expiresAt: Date.now() + Math.min(tokens.expires_in!, SESSION_MAX_AGE) * 1000,
  };
  return { session, returnTo: state.returnTo };
}

export function encryptCustomerSession(session: CustomerSession): string {
  const value = seal(session, sessionSecret());
  if (value.length > 3800) throw new CustomerAccountError("Customer session is too large to store safely.");
  return value;
}

export function readCustomerSession(value: string | undefined): CustomerSession | null {
  const session = unseal<CustomerSession>(value, process.env.CUSTOMER_SESSION_SECRET?.trim() ?? "");
  if (!session || typeof session.accessToken !== "string" || typeof session.graphqlApi !== "string" || typeof session.expiresAt !== "number" || session.expiresAt <= 0) return null;
  try { secureEndpoint(session.graphqlApi); secureEndpoint(session.tokenEndpoint); }
  catch { return null; }
  return session;
}

export async function getCurrentCustomerSession(): Promise<CustomerSession | null> {
  const jar = await cookies();
  return readCustomerSession(jar.get(CUSTOMER_SESSION_COOKIE)?.value);
}

export function isCustomerSessionExpiring(session: CustomerSession, graceMs = 60_000): boolean {
  return session.expiresAt <= Date.now() + graceMs;
}

export async function refreshCustomerSession(session: CustomerSession): Promise<CustomerSession> {
  if (!session.refreshToken) throw new CustomerAccountError("Your sign-in has expired. Please sign in again.", 401);
  const clientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET?.trim() || null;
  const body = new URLSearchParams({ grant_type: "refresh_token", client_id: session.clientId, refresh_token: session.refreshToken });
  const tokens = await tokenRequest(session.tokenEndpoint, body, session.clientId, clientSecret);
  if (!tokens.access_token || !Number.isFinite(tokens.expires_in) || (tokens.expires_in ?? 0) <= 0) throw new CustomerAccountError("Your sign-in has expired. Please sign in again.", 401);
  return { ...session, accessToken: tokens.access_token, refreshToken: tokens.refresh_token ?? session.refreshToken, idToken: tokens.id_token ?? session.idToken, expiresAt: Date.now() + Math.min(tokens.expires_in!, SESSION_MAX_AGE) * 1000 };
}

export async function customerAccountQuery<T>(session: CustomerSession, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(session.graphqlApi, {
    method: "POST", cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
    body: JSON.stringify({ query, variables }),
  });
  if (response.status === 401 || response.status === 403) throw new CustomerAccountError("Please sign in to continue.", 401);
  if (!response.ok) throw new CustomerAccountError("Customer account information is temporarily unavailable.");
  let payload: { data?: T | null; errors?: { message?: string }[] };
  try { payload = await response.json() as typeof payload; }
  catch { throw new CustomerAccountError("Shopify returned an invalid account response."); }
  if (payload.errors?.length || !payload.data) throw new CustomerAccountError("Customer account information is temporarily unavailable.");
  return payload.data;
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return { httpOnly: true as const, secure: true, sameSite: "lax" as const, path: "/", maxAge };
}
