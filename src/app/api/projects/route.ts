import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { projects as defaultProjects } from "@/app/data/projects";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function verifySession(token: string): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [prefix, expiry, signature] = parts;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${prefix}.${expiry}`)
    .digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b) && Number(expiry) > Date.now();
}

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get("admin_session")?.value;
  return Boolean(token && verifySession(token));
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "احراز هویت لازم است" }, { status: 401 });
  }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ projects: defaultProjects });
  }

  try {
    const response = await fetch(`${UPSTASH_URL}/get/portfolio_projects`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    const data = await response.json();
    if (data.result) {
      return NextResponse.json({ projects: JSON.parse(data.result) });
    }
  } catch (error) {
    console.error("خطا در خواندن از Redis:", error);
  }

  return NextResponse.json({ projects: defaultProjects });
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "احراز هویت لازم است" }, { status: 401 });
  }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json(
      { error: "Redis پیکربندی نشده است" },
      { status: 503 }
    );
  }

  const body = await request.json();

  if (!Array.isArray(body.projects)) {
    return NextResponse.json({ error: "دیتای نامعتبر" }, { status: 400 });
  }

  const response = await fetch(`${UPSTASH_URL}/set/portfolio_projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(body.projects),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "خطا در ذخیره" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
