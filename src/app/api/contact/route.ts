import { NextRequest, NextResponse } from "next/server";
import {
  validateContactForm,
  sanitizeInput,
  validateEmail,
  validateMessage,
  validateName,
} from "@/lib/validation";

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  "cf-turnstile-response"?: unknown;
  turnstileToken?: unknown;
};

function addSecurityHeaders(headers: Headers) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  headers.set("Cache-Control", "no-store");
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  extraHeaders?: HeadersInit
) {
  const response = NextResponse.json(body, { status, headers: extraHeaders });
  addSecurityHeaders(response.headers);
  return response;
}

function isSafeHeaderValue(value: string) {
  return /^[A-Za-z0-9._:-]{1,128}$/.test(value);
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first && first.length <= 64 && isSafeHeaderValue(first.replace(/\./g, "").replace(/:/g, "").replace(/-/g, ""))) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.length <= 64) {
    return realIp.trim();
  }

  return "unknown";
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedKey(key: string) {
  return (
    key === "name" ||
    key === "email" ||
    key === "message" ||
    key === "website" ||
    key === "cf-turnstile-response" ||
    key === "turnstileToken"
  );
}

function getStringField(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length > maxLength) return "";
  return trimmed;
}

async function rateLimitUpstash(ip: string) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, message: "Service unavailable." };
    }
    return { ok: true };
  }

  const key = `contact:rl:${ip}`;
  const encodedKey = encodeURIComponent(key);

  const incrResponse = await fetch(`${redisUrl}/incr/${encodedKey}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
    cache: "no-store",
  });

  if (!incrResponse.ok) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, message: "Service unavailable." };
    }
    return { ok: true };
  }

  const incrData = (await incrResponse.json()) as { result?: number };
  const count = typeof incrData.result === "number" ? incrData.result : 1;

  if (count === 1) {
    await fetch(`${redisUrl}/expire/${encodedKey}/${RATE_LIMIT_WINDOW_SECONDS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
      cache: "no-store",
    }).catch(() => undefined);
  }

  if (count > RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false, status: 429, message: "Too many requests." };
  }

  return { ok: true };
}

async function verifyTurnstile(
  token: string,
  ip: string
): Promise<{ ok: boolean; status?: number }> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  const shouldVerify =
    process.env.NODE_ENV === "production" || Boolean(siteKey) || Boolean(secretKey);

  if (!shouldVerify) {
    return { ok: true };
  }

  if (!siteKey || !secretKey || !token) {
    return { ok: false, status: 503 };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
    remoteip: ip,
  });

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return { ok: false, status: 503 };
  }

  const data = (await response.json()) as { success?: boolean };
  return { ok: Boolean(data.success), status: data.success ? undefined : 403 };
}

async function sendResendEmail(input: {
  name: string;
  email: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return { ok: false, status: 503 };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `New contact form message from ${input.name}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
      reply_to: input.email,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false, status: 502 };
  }

  return { ok: true };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonResponse({ success: false, error: "Invalid request." }, 415);
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        return jsonResponse({ success: false, error: "Request too large." }, 413);
      }
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return jsonResponse({ success: false, error: "Request too large." }, 413);
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ success: false, error: "Invalid request." }, 400);
    }

    if (!isObjectLike(parsedBody)) {
      return jsonResponse({ success: false, error: "Invalid request." }, 400);
    }

    for (const key of Object.keys(parsedBody)) {
      if (!isAllowedKey(key)) {
        return jsonResponse({ success: false, error: "Invalid request." }, 400);
      }
    }

    const name = getStringField(parsedBody.name, 100);
    const email = getStringField(parsedBody.email, 254);
    const message = getStringField(parsedBody.message, 5000);
    const honeypot = getStringField(parsedBody.website, 100);
    const turnstileToken = getStringField(
      parsedBody["cf-turnstile-response"] ?? parsedBody.turnstileToken,
      4096
    );

    if (honeypot.length > 0) {
      return jsonResponse({ success: true, message: "Message sent successfully!" }, 200);
    }

    const validation = validateContactForm({ name, email, message });
    if (!validation.isValid) {
      return jsonResponse(
        {
          success: false,
          error: "Please check your submission and try again.",
          errors: validation.errors,
        },
        400
      );
    }

    if (!validateName(name) || !validateEmail(email) || !validateMessage(message)) {
      return jsonResponse({ success: false, error: "Please check your submission and try again." }, 400);
    }

    const rateLimitResult = await rateLimitUpstash(getClientIp(request));
    if (!rateLimitResult.ok) {
      return jsonResponse(
        { success: false, error: "Service unavailable. Please try again later." },
        rateLimitResult.status ?? 503
      );
    }

    const turnstileResult = await verifyTurnstile(turnstileToken, getClientIp(request));
    if (!turnstileResult.ok) {
      return jsonResponse(
        { success: false, error: "Verification failed. Please try again." },
        turnstileResult.status ?? 403
      );
    }

    const safeName = sanitizeInput(name);
    const safeEmail = sanitizeInput(email);
    const safeMessage = sanitizeInput(message);

    const sendResult = await sendResendEmail({
      name: safeName,
      email: safeEmail,
      message: safeMessage,
    });

    if (!sendResult.ok) {
      return jsonResponse(
        { success: false, error: "Service unavailable. Please try again later." },
        sendResult.status ?? 503
      );
    }

    return jsonResponse(
      { success: true, message: "Message sent successfully!" },
      200
    );
  } catch {
    return jsonResponse(
      { success: false, error: "Something went wrong. Please try again." },
      500
    );
  }
}
