"use client";

import { siteConfig } from "@/config/site";
import { Mail, ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{siteConfig.name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
            Front-end developer focused on clean UI, smooth motion, and modern web experiences.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Quick Links
          </h4>
          <div className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-slate-300 transition hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Social
          </h4>
          <div className="mt-4 flex gap-4 text-slate-300">
            <a href="https://github.com/yourname" target="_blank" rel="noreferrer" className="transition hover:text-cyan-300">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com/in/yourname" target="_blank" rel="noreferrer" className="transition hover:text-cyan-300">
              <FaLinkedin size={20} />
            </a>
            <a href="mailto:you@example.com" className="transition hover:text-cyan-300">
              <Mail />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 {siteConfig.name}. All rights reserved.</p>

        <a
          href="#home"
          className="inline-flex items-center gap-2 text-cyan-300 transition hover:text-cyan-200"
        >
          Back to top <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
}
