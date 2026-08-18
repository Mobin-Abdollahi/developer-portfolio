import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
      <h1 className="mt-4 text-4xl font-bold">Page Not Found</h1>
      <p className="mt-4 max-w-md text-slate-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Back Home
      </Link>
    </main>
  );
}
