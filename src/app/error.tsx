"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-400">Error</p>
      <h1 className="mt-4 text-4xl font-bold">Something went wrong</h1>
      <p className="mt-4 max-w-md text-slate-400">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Try Again
      </button>
    </main>
  );
}
