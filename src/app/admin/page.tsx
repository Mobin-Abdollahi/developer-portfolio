/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect } from "react";
import { Lock, Plus, Trash2, Save, LogOut, ExternalLink, Code2 } from "lucide-react";
import type { Project } from "@/app/data/projects";

// تبدیل امن مقدار تگ (رشته یا آرایه) به آرایه تمیز
const toTagArray = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // بررسی احراز هویت در لود اولیه
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
          loadProjects();
        } else {
          setIsAuth(false);
        }
      })
      .catch(() => setIsAuth(false));
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) return;
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuth(true);
        loadProjects();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "رمز عبور اشتباه است.");
      }
    } catch {
      setError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "POST" }).catch(() => {});
    setIsAuth(false);
    setPassword("");
    setProjects([]);
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now(),
      slug: `project-${Date.now()}`,
      title: "عنوان پروژه جدید",
      shortDescription: "توضیح کوتاه پروژه",
      fullDescription: "توضیح کامل پروژه",
      githubUrl: "https://github.com/Mobin-Abdollahi",
      liveUrl: "#",
      image: "/projects/backend.png",
      tags: ["Next.js", "TypeScript"],
      year: "2026",
      role: "Frontend Developer",
      features: ["قابلیت ۱", "قابلیت ۲"],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleDeleteProject = (index: number) => {
    if (!confirm("آیا از حذف این پروژه مطمئن هستید؟")) return;
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateField = (
    index: number,
    field: keyof Project,
    value: unknown
  ) => {
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // sanitize تگ‌ها قبل از ارسال به Redis
      const sanitizedProjects = projects.map((p) => ({
        ...p,
        tags: toTagArray(p.tags),
      }));

      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: sanitizedProjects }),
      });

      if (res.ok) {
        setProjects(sanitizedProjects);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("خطا در ذخیره‌سازی");
      }
    } catch {
      alert("خطا در ذخیره‌سازی");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loader ───
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Login ───
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h1 className="text-lg font-bold">پنل مدیریت</h1>
          </div>

          {error && (
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    );
  }

  // ─── Dashboard ───
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="text-emerald-400" size={24} />
            مدیریت پروژه‌ها
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              <Plus size={16} />
              افزودن پروژه
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium shadow-lg shadow-emerald-500/20 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-neutral-400 hover:text-rose-400 bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>

        {/* Success banner */}
        {saveSuccess && (
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            ✅ تغییرات با موفقیت ذخیره شد!
          </div>
        )}

        {/* Project cards */}
        <div className="space-y-6">
          {projects.map((project, idx) => (
            <div
              key={project.id ?? idx}
              className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  #{idx + 1} — ID: {String(project.id)}
                </span>
                <button
                  onClick={() => handleDeleteProject(idx)}
                  className="text-neutral-500 hover:text-rose-400 transition-colors"
                  aria-label="حذف پروژه"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleUpdateField(idx, "title", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={project.slug}
                    onChange={(e) => handleUpdateField(idx, "slug", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={project.shortDescription}
                  onChange={(e) =>
                    handleUpdateField(idx, "shortDescription", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={project.fullDescription}
                  onChange={(e) =>
                    handleUpdateField(idx, "fullDescription", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 focus:outline-none transition-colors resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={project.githubUrl}
                    onChange={(e) =>
                      handleUpdateField(idx, "githubUrl", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={project.liveUrl ?? ""}
                    onChange={(e) =>
                      handleUpdateField(idx, "liveUrl", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Image Path
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={project.image}
                    onChange={(e) => handleUpdateField(idx, "image", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Tags — نسخه نهایی: تایپ آزاد + نرمال‌سازی هنگام blur */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={
                      Array.isArray(project.tags)
                        ? project.tags.join(", ")
                        : (project.tags as unknown as string) || ""
                    }
                    onChange={(e) =>
                      // هنگام تایپ، مقدار خام ذخیره می‌شود تا کاما و فاصله آزادانه تایپ شوند
                      handleUpdateField(idx, "tags", e.target.value)
                    }
                    onBlur={(e) =>
                      // هنگام خروج از اینپوت، تبدیل به آرایه تمیز
                      handleUpdateField(idx, "tags", toTagArray(e.target.value))
                    }
                    placeholder="Next.js, TypeScript, Tailwind"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
