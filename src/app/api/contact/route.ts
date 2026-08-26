/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import {
  sanitizeInput,
  validateContactForm,
} from "@/lib/validation";

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 5;
const EXTERNAL_REQUEST_TIMEOUT_MS = 8_000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
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
  const response = NextResponse.json(body, {
    status,
    headers: extraHeaders,
  });

  addSecurityHeaders(response.headers);
  return response;
}

function getClientIp(request: NextRequest) {
  /*
   * روی Vercel، این هدر معمولاً توسط زیرساخت Vercel تنظیم می‌شود.
   * اگر روی هاست دیگری هستی، x-forwarded-for فقط زمانی معتبر است
   * که پشت reverse proxy مطمئن قرار داشته باشی.
   */
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");

  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedKey(key: string) {
  return key === "name" || key === "email" || key === "message" || key === "website";
}

function getStringField(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    return "";
  }

  return trimmed;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = EXTERNAL_REQUEST_TIMEOUT_MS
) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function rateLimitUpstash(ip: string) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  /*
   * در محیط development، اگر هنوز Upstash را تنظیم نکرده‌ای،
   * اجازه تست فرم داده می‌شود.
   *
   * در Production، بدون Upstash فرم کار نمی‌کند تا اسپم آزاد نشود.
   */
  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        status: 503,
        message: "Service unavailable.",
      };
    }

    return { ok: true };
  }

  const key = `contact:rl:${ip}`;
  const encodedKey = encodeURIComponent(key);

  try {
    const incrementResponse = await fetchWithTimeout(
      `${redisUrl}/incr/${encodedKey}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        cache: "no-store",
      }
    );

    if (!incrementResponse.ok) {
      throw new Error("Upstash increment failed");
    }

    const incrementData = (await incrementResponse.json()) as {
      result?: number;
    };

    const count =
      typeof incrementData.result === "number"
        ? incrementData.result
        : RATE_LIMIT_MAX_REQUESTS + 1;

    /*
     * وقتی اولین درخواست ثبت شد، کلید بعد از ۱۰ دقیقه پاک می‌شود.
     */
    if (count === 1) {
      const expireResponse = await fetchWithTimeout(
        `${redisUrl}/expire/${encodedKey}/${RATE_LIMIT_WINDOW_SECONDS}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${redisToken}`,
          },
          cache: "no-store",
        }
      );

      if (!expireResponse.ok) {
        throw new Error("Upstash expiration failed");
      }
    }

    if (count > RATE_LIMIT_MAX_REQUESTS) {
      return {
        ok: false,
        status: 429,
        message: "Too many requests. Please try again later.",
      };
    }

    return { ok: true };
  } catch {
    /*
     * در Production اگر Upstash قطع باشد، ارسال ایمیل را متوقف می‌کنیم
     * تا راهی برای اسپم گسترده باز نشود.
     */
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        status: 503,
        message: "Service unavailable.",
      };
    }

    return { ok: true };
  }
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
    return {
      ok: false,
      status: 503,
    };
  }

  try {
    const response = await fetchWithTimeout("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: input.email,
        subject: `New contact form message from ${input.name}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 502,
    };
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  addSecurityHeaders(response.headers);
  response.headers.set("Allow", "POST, OPTIONS");
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request.",
        },
        415
      );
    }

    const contentLengthHeader = request.headers.get("content-length");

    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);

      if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_BODY_BYTES
      ) {
        return jsonResponse(
          {
            success: false,
            error: "Request too large.",
          },
          413
        );
      }
    }

    const rawBody = await request.text();

    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return jsonResponse(
        {
          success: false,
          error: "Request too large.",
        },
        413
      );
    }

    let parsedBody: unknown;

    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request.",
        },
        400
      );
    }

    if (!isObjectLike(parsedBody)) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request.",
        },
        400
      );
    }

    for (const key of Object.keys(parsedBody)) {
      if (!isAllowedKey(key)) {
        return jsonResponse(
          {
            success: false,
            error: "Invalid request.",
          },
          400
        );
      }
    }

    const name = getStringField(parsedBody.name, 100);
    const email = getStringField(parsedBody.email, 254);
    const message = getStringField(parsedBody.message, 5000);
    const honeypot = getStringField(parsedBody.website, 100);

    /*
     * Honeypot پر شده = احتمال بسیار زیاد ربات.
     * پاسخ موفقیت می‌دهیم، ولی پیام ارسال نمی‌شود.
     */
    if (honeypot.length > 0) {
      return jsonResponse(
        {
          success: true,
          message: "Message sent successfully!",
        },
        200
      );
    }

    const validation = validateContactForm({
      name,
      email,
      message,
    });

    // مهم: در validation.ts نام پراپرتی `valid` است، نه `isValid`.
    if (!validation.valid) {
      return jsonResponse(
        {
          success: false,
          error: "Please check your submission and try again.",
          errors: validation.errors,
        },
        400
      );
    }

    const clientIp = getClientIp(request);

    const rateLimitResult = await rateLimitUpstash(clientIp);

    if (!rateLimitResult.ok) {
      return jsonResponse(
        {
          success: false,
          error: rateLimitResult.message,
        },
        rateLimitResult.status ?? 503
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
        {
          success: false,
          error: "Service unavailable. Please try again later.",
        },
        sendResult.status ?? 503

      );
    }

    return jsonResponse(
      {
        success: true,
        message: "Message sent successfully!",
      },
      200
    );
  } catch {
    return jsonResponse(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      500
    );
  }
}
