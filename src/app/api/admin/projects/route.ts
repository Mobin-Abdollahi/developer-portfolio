import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  projects as defaultProjects,
  type Project,
} from "@/app/data/projects";

const COOKIE_NAME = "admin_session";
const REDIS_KEY = "portfolio_projects";

function getRequiredEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

async function verifySession(): Promise<boolean> {
  const adminSecret = getRequiredEnv("ADMIN_SECRET");

  if (!adminSecret) {
    console.error("ADMIN_SECRET is not configured");
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!session) return false;

  const parts = session.split(".");

  if (parts.length !== 3) return false;

  const [prefix, expiry, signature] = parts;
  const expiryNumber = Number(expiry);

  if (
    prefix !== "admin" ||
    !Number.isFinite(expiryNumber) ||
    expiryNumber <= Date.now() ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const payload = `${prefix}.${expiry}`;

  const expectedSignature = crypto
    .createHmac("sha256", adminSecret)
    .update(payload)
    .digest("hex");

  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

async function getProjectsFromRedis(): Promise<Project[] | null> {
  const redisUrl = getRequiredEnv("UPSTASH_REDIS_REST_URL");
  const redisToken = getRequiredEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!redisUrl || !redisToken) {
    console.error("Upstash Redis environment variables are not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${redisUrl}/get/${encodeURIComponent(REDIS_KEY)}`,
      {
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Redis GET failed:",
        response.status,
        await response.text()
      );
      return null;
    }

    const data: { result?: unknown } = await response.json();

    if (!data.result) {
      return defaultProjects;
    }

    const parsed =
      typeof data.result === "string"
        ? JSON.parse(data.result)
        : data.result;

    return Array.isArray(parsed) ? (parsed as Project[]) : null;
  } catch (error) {
    console.error("Redis fetch failed, using defaults:", error);
    return null;
  }
}

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const projects = (await getProjectsFromRedis()) ?? defaultProjects;

  return NextResponse.json({ projects });
}

export async function PUT(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const redisUrl = getRequiredEnv("UPSTASH_REDIS_REST_URL");
  const redisToken = getRequiredEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!redisUrl || !redisToken) {
    return NextResponse.json(
      { error: "Redis is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${redisUrl}/set/${encodeURIComponent(REDIS_KEY)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(body.projects),
      }
    );

    if (!response.ok) {
      console.error(
        "Redis SET failed:",
        response.status,
        await response.text()
      );

      return NextResponse.json(
        { error: "Failed to save projects to Redis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      projects: body.projects,
    });
  } catch (error) {
    console.error("Save error:", error);

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 400 }
    );
  }
}
