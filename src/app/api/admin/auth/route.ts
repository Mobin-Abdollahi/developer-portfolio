import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: Request) {
  const cookie = req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_session="))
    ?.split("=")[1];

  if (!cookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const parts = cookie.split(".");
  if (parts.length !== 3) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const [prefix, expiry, signature] = parts;
  const secret = process.env.ADMIN_SECRET || "default_fallback_secret_key_12345";
  const payload = `${prefix}.${expiry}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const isValid = signature === expectedSignature && Number(expiry) > Date.now();

  return NextResponse.json({ authenticated: isValid }, { status: isValid ? 200 : 401 });
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
