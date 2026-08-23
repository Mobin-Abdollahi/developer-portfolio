import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function createNonce() {
  return crypto.randomUUID().replace(/-/g, "");
}

function nonceToBase64Safe(nonce: string) {
  return Buffer.from(nonce).toString("base64").replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function middleware(request: NextRequest) {
  const nonce = nonceToBase64Safe(createNonce());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-nonce", nonce);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  const isProduction = process.env.NODE_ENV === "production";
  const scriptSrc = isProduction
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`
    : "script-src 'self' 'nonce-" +
      nonce +
      "' 'strict-dynamic' https://challenges.cloudflare.com 'unsafe-inline' 'unsafe-eval'";

  const styleSrc = isProduction
    ? `style-src 'self' 'nonce-${nonce}'`
    : `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`;

  const csp = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src https://challenges.cloudflare.com",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-nonce");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
