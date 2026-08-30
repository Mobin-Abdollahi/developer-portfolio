import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SECRET || "default_fallback_secret_key_12345";

    if (!expectedPassword || password !== expectedPassword) {
      return NextResponse.json({ error: "رمز عبور نادرست است." }, { status: 401 });
    }

    // ساخت توکن ۷ روزه با امضای HMAC
    const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7;
    const payload = `admin.${expiry}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const response = NextResponse.json({ success: true });
    
    response.cookies.set("admin_session", `${payload}.${signature}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
