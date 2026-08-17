"use client";

import { useEffect, useState } from "react";

export default function AvailabilityBadge() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const tehranTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date());

      setTime(tehranTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass inline-flex flex-wrap items-center gap-3 rounded-full border border-emerald-400/20 px-4 py-2 text-sm text-slate-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
      </span>

      <span className="font-medium text-white">
        Available for freelance / collaboration
      </span>

      <span className="hidden text-slate-400 md:inline">•</span>

      <span className="text-slate-300">
        Tehran, Iran — {time}
      </span>
    </div>
  );
}
