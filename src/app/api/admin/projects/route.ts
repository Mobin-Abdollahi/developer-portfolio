import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { projects as defaultProjects, type Project } from "@/app/data/projects";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

async function verifySession(): Promise<boolean> {
  if (!ADMIN_SECRET) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return false;

  const parts = session.split(".");
  if (parts.length !== 3) return false;

  const [prefix, expiry, signature] = parts;
  const payload = `${prefix}.${expiry}`;
  const expectedSignature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
    return isValid && Number(expiry) > Date.now();
  } catch {
    return false;
  }
}

async function getProjectsFromRedis(): Promise<Project[] | null> {
  try {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/projects`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : defaultProjects;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!verifySession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = (await getProjectsFromRedis()) ?? defaultProjects;
  return NextResponse.json({ projects });
}

export async function PUT(req: NextRequest) {
  if (!verifySession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { projects } = await req.json();
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([JSON.stringify(projects)]),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
