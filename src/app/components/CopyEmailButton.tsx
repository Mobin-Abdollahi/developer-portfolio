"use client";

import toast from "react-hot-toast";
import { Copy } from "lucide-react";

type Props = {
  email: string;
};

export default function CopyEmailButton({ email }: Props) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Failed to copy email");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
    >
      <Copy size={16} />
      Copy Email
    </button>
  );
}
