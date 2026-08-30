/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Lock, Plus, Trash2, Save, LogOut, ExternalLink, Code2 } from "lucide-react";
import { type Project } from "@/app/data/projects";


export default function AdminPage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // بررسی وضعیت لاگین هنگام باز شدن صفحه
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
    const res = await fetch("/api/admin/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects || []);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        const data = await res.json();
        setError(data.error || "رمز عبور نادرست است.");
      }
    } catch {
      setError("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "POST" });
    setIsAuth(false);
    setPassword("");
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: Date.now(),
      slug: `project-${Date.now()}`,
      title: "عنوان پروژه جدید",
      shortDescription: "توضیح کوتاه پروژه",
      fullDescription: "توضیحات کامل پروژه",
      image: "/projects/ecommerce.png",
      tags: ["Next.js", "TypeScript"],
      githubUrl: "https://github.com/Mobin-Abdollahi",
      liveUrl: "#",
      year: "2026",
      role: "Frontend Developer",
      features: ["قابلیت ۱", "قابلیت ۲"],
    };
    setProjects([newProj, ...projects]);
  };

  const handleDeleteProject = (index: number) => {
    if (confirm("آیا از حذف این پروژه مطمئن هستید؟")) {
      const updated = [...projects];
      updated.splice(index, 1);
      setProjects(updated);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateField = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("خطا در ذخیره‌سازی");
      }
    } catch {
      alert("خطای شبکه در ذخیره");
    } finally {
      setLoading(false);
    }
  };

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // فرم لاگین
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-center">ورود به پنل مدیریت</h1>
          <p className="text-xs text-neutral-400 text-center">
            این بخش مختص مدیریت اطلاعات پورتفولیو است.
          </p>

          <div>
            <input
              type="password"
              placeholder="رمز عبور ادمین..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          {error && <p className="text-xs text-rose-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-medium rounded-xl text-black transition disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    );
  }

  // پنل مدیریت
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code2 className="text-emerald-400" />
              مدیریت پروژه‌ها و پورتفولیو
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              تغییرات را اعمال کنید و دکمه ذخیره را بزنید.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" />
              افزودن پروژه جدید
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl text-sm transition disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-neutral-400 hover:text-rose-400 bg-neutral-900 border border-neutral-800 rounded-xl transition"
              title="خروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl text-center">
            تغییرات با موفقیت ذخیره شد و در سایت اعمال گردید!
          </div>
        )}

        {/* لیست پروژه‌ها */}
        <div className="space-y-6">
          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  پروژه #{idx + 1}
                </span>
                <button
                  onClick={() => handleDeleteProject(idx)}
                  className="text-neutral-500 hover:text-rose-400 transition"
                  title="حذف پروژه"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">عنوان پروژه</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => handleUpdateField(idx, "title", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">اسلاگ (URL Slug)</label>
                  <input
                    type="text"
                    value={proj.slug}
                    onChange={(e) => handleUpdateField(idx, "slug", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">لینک مخزن گیت‌هاب</label>
                  <input
                    type="text"
                    value={proj.githubUrl || ""}
                    onChange={(e) => handleUpdateField(idx, "githubUrl", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">لینک دموی آنلاین (اختیاری)</label>
                  <input
                    type="text"
                    value={proj.liveUrl || ""}
                    onChange={(e) => handleUpdateField(idx, "liveUrl", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">آدرس عکس (مسیر در public)</label>
                  <input
                    type="text"
                    value={proj.image}
                    onChange={(e) => handleUpdateField(idx, "image", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">تگ‌ها (با کاما جدا کنید)</label>
                  <input
                    type="text"
                    value={proj.tags.join(", ")}
                    onChange={(e) =>
                      handleUpdateField(
                        idx,
                        "tags",
                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      )
                    }
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">توضیح کوتاه</label>
                <textarea
                  rows={2}
                  value={proj.shortDescription}
                  onChange={(e) => handleUpdateField(idx, "shortDescription", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
