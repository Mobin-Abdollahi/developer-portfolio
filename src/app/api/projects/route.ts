import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { projects as defaultProjects, Project } from "@/app/data/projects";

// کلید ذخیره‌سازی در دیتابیس
const REDIS_KEY = "portfolio_projects";

// تابع پاک‌سازی عمیق کاراکترهای مخفی، فاصله‌ها و کوتیشن‌ها
function sanitizeEnv(value?: string): string {
  if (!value) return "";
  return value
    .replace(/[\r\n\t]/g, "") // حذف شکست خط و تب مخفی
    .replace(/^["'\s]+|["'\s]+$/g, ""); // حذف کوتیشن‌ها و فاصله‌های ابتدا و انتها
}

// ایجاد اتصال امن و بهینه به Redis
function getRedisClient(): Redis | null {
  const url = sanitizeEnv(process.env.UPSTASH_REDIS_REST_URL);
  const token = sanitizeEnv(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!url || !token) {
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

// متد دریافت پروژه‌ها (GET)
export async function GET() {
  try {
    const redis = getRedisClient();

    if (!redis) {
      console.warn("تنظیمات Upstash Redis در فایل env یافت نشد. پروژه‌های پیش‌فرض بازگردانده می‌شوند.");
      return NextResponse.json({ projects: defaultProjects });
    }

    const data = await redis.get<Project[]>(REDIS_KEY);

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ projects: defaultProjects });
    }

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error("Redis GET Error (استفاده از پروژه‌های پیش‌فرض):", error);
    return NextResponse.json({ projects: defaultProjects });
  }
}

// متد ذخیره و ویرایش پروژه‌ها (PUT)
export async function PUT(request: Request) {
  try {
    const redis = getRedisClient();

    if (!redis) {
      return NextResponse.json(
        { error: "تنظیمات دیتابیس Redis در فایل محیطی یافت نشد." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const projects: Project[] = body.projects;

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: "فرمت پروژه‌های ارسالی نامعتبر است." },
        { status: 400 }
      );
    }

    // ذخیره مستقیم آرایه در دیتابیس Redis
    await redis.set(REDIS_KEY, projects);

    return NextResponse.json({ success: true, count: projects.length });
  } catch (error) {
    console.error("Redis SET Error:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره‌سازی داده‌ها در دیتابیس Redis" },
      { status: 500 }
    );
  }
}
