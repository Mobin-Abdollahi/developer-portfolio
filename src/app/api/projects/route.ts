import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { projects as defaultProjects, type Project } from "@/app/data/projects";

export async function GET() {
  try {
    const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/projects`, {
      headers: {
        Authorization: `",
   process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return NextResponse.json({ projects: JSON.parse(data.result) });
      }
    }
  } catch (err) {
    console.error("Redis fetch failed, using defaults:", err);
  }
  return NextResponse.json({ projects: defaultProjects });
}
