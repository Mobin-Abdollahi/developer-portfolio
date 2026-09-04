/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  LogOut, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Project } from '@/app/data/projects';

// کامپوننت SVG سفارشی برای آیکون گیت‌هاب جهت جلوگیری از خطای ایمپورت در lucide-react
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // وضعیت فرم با تمامی ۱۲ فیلد تعریف شده در Interface پروژه
  const [formData, setFormData] = useState<Project>({
    id: 0,
    slug: '',
    title: '',
    shortDescription: '',
    fullDescription: '',
    image: '',
    tags: [],
    githubUrl: '',
    liveUrl: '',
    year: new Date().getFullYear().toString(),
    role: 'Frontend Developer',
    features: []
  });

  const [tagsInput, setTagsInput] = useState<string>('');
  const [featuresInput, setFeaturesInput] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ۱. بررسی وضعیت سشن کاربر
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth', { credentials: 'include' });
      if (res.ok) {
        setIsAuthenticated(true);
        // eslint-disable-next-line react-hooks/immutability
        loadProjects();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ۲. دریافت لیست پروژه‌ها از سرور
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/projects', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data.projects || []);
      } else {
        showToast('خطا در دریافت لیست پروژه‌ها', 'error');
      }
    } catch {
      showToast('خطا در ارتباط با سرور پروژه‌ها', 'error');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // ۳. ورود ادمین
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword('');
        loadProjects();
        showToast('با موفقیت وارد شدید');
      } else {
        const data = await res.json();
        setAuthError(data.error || 'رمز عبور اشتباه است');
      }
    } catch {
      setAuthError('خطا در برقراری ارتباط با سرور ورود');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ۴. خروج
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setProjectsList([]);
      showToast('با موفقیت خارج شدید');
    } catch {
      showToast('خطا در هنگام خروج', 'error');
    }
  };

  // ۵. باز کردن مودال ایجاد پروژه
  const handleOpenCreateModal = () => {
    setFormData({
      id: Date.now(),
      slug: '',
      title: '',
      shortDescription: '',
      fullDescription: '',
      image: '/projects/dashboard.png',
      tags: [],
      githubUrl: '',
      liveUrl: '',
      year: new Date().getFullYear().toString(),
      role: 'Frontend Developer',
      features: []
    });
    setTagsInput('');
    setFeaturesInput('');
    setIsEditing(false);
    setActiveProject({} as Project);
  };

  // باز کردن مودال ویرایش پروژه
  const handleOpenEditModal = (project: Project) => {
    setFormData(project);
    setTagsInput((project.tags || []).join(', '));
    setFeaturesInput((project.features || []).join('\n'));
    setIsEditing(true);
    setActiveProject(project);
  };

  const handleCloseModal = () => {
    setActiveProject(null);
    setIsEditing(false);
  };

  // ۶. ذخیره یا ویرایش پروژه
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedTags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    const formattedFeatures = featuresInput
      .split('\n')
      .map(feat => feat.trim())
      .filter(Boolean);

    const updatedProject: Project = {
      ...formData,
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tags: formattedTags,
      features: formattedFeatures
    };

    let updatedList: Project[];

    if (isEditing) {
      updatedList = projectsList.map(item => item.id === updatedProject.id ? updatedProject : item);
    } else {
      updatedList = [updatedProject, ...projectsList];
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedList }),
        credentials: 'include'
      });

      if (res.ok) {
        setProjectsList(updatedList);
        handleCloseModal();
        showToast(isEditing ? 'پروژه با موفقیت ویرایش شد' : 'پروژه جدید با موفقیت اضافه شد');
      } else {
        const errData = await res.json();
        showToast(errData.error || 'خطا در ذخیره‌سازی پروژه', 'error');
      }
    } catch {
      showToast('خطا در ارسال درخواست به سرور', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ۷. حذف پروژه
  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این پروژه مطمئن هستید؟')) {
      return;
    }

    const updatedList = projectsList.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedList }),
        credentials: 'include'
      });

      if (res.ok) {
        setProjectsList(updatedList);
        showToast('پروژه با موفقیت حذف شد');
      } else {
        showToast('خطا در حذف پروژه از روی سرور', 'error');
      }
    } catch {
      showToast('خطای شبکه در هنگام حذف', 'error');
    }
  };

  // لودینگ احراز هویت اولیه
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 font-mono text-sm">در حال بررسی سشن...</p>
        </div>
      </main>
    );
  }

  // فرم لاگین
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-500/10 via-slate-950 to-slate-950 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">پنل مدیریت پروژه</h1>
            <p className="text-slate-400 text-sm mt-1">جهت دسترسی رمز عبور را وارد نمایید</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">رمز ورود</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-mono"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs mt-2 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ورود به پنل'}
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  // داشبورد اصلی مدیریت پروژه‌ها
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-500/5 via-slate-950 to-slate-950 pointer-events-none" />

      {/* نوتیفیکیشن تست */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl text-sm ${
              notification.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/90 border-rose-500/40 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* هدر */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">مدیریت پروژه‌ها</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">ویرایش، ایجاد و حذف پروژه‌های نمونه‌کار در دیتابیس</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProjects}
              disabled={isLoadingProjects}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-all"
              title="بروزرسانی داده‌ها"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingProjects ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>پروژه جدید</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 px-3.5 py-2.5 rounded-xl transition-all text-sm"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* لیست پروژه‌ها */}
        {isLoadingProjects ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-slate-500 text-sm font-mono">در حال واکشی پروژه‌ها از دیتابیس...</p>
          </div>
        ) : projectsList.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm mb-3">هیچ پروژه‌ای یافت نشد</p>
            <button
              onClick={handleOpenCreateModal}
              className="text-xs font-mono text-emerald-400 hover:underline"
            >
              + افزودن اولین پروژه
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsList.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      {project.year || 'N/A'} • {project.role || 'Project'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(project)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                        title="ویرایش"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(project.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono bg-slate-800/60 text-slate-300 px-2 py-0.5 rounded border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-600">ID: {project.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* مودال ایجاد و ویرایش پروژه */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">
                    {isEditing ? 'ویرایش پروژه' : 'افزودن پروژه جدید'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">عنوان پروژه (Title)</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Digikala Platform"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">نامک (Slug)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. digikala-platform"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">سال (Year)</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2025"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">نقش / جایگاه (Role)</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Full Stack Developer"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">آدرس تصویر (Image URL / Path)</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/projects/dashboard.png"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">توضیح کوتاه (Short Description)</label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="خلاصه برای نمایش در کارت پروژه"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">توضیحات کامل (Full Description)</label>
                  <textarea
                    rows={3}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="شرح معماری و جزئیات دقیق پروژه..."
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    تگ‌ها و مهارت‌ها <span className="text-slate-500 lowercase">(با ویرگول انگلیسی جدا کنید)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Next.js, TypeScript, Tailwind CSS, Framer Motion"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    امکانات و ویژگی‌ها <span className="text-slate-500 lowercase">(هر خط یک ویژگی)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Responsive UI&#10;Authentication System&#10;Redis Database"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">لینک گیت‌هاب (GitHub URL)</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">لینک دمو یا لایو (Live Demo URL)</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all text-sm"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>ذخیره پروژه</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
