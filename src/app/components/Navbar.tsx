"use client";

import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Resume", href: "#resume" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 z-50 w-full"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl px-6 py-4 glass glow">
        <h1 className="text-lg font-semibold tracking-wide text-cyan-300">
          MyPortfolio
        </h1>

        <nav className="hidden gap-6 text-sm text-slate-200 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
