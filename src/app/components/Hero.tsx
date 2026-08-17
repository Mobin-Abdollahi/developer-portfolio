"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Front-End Developer",
  "Next.js Developer",
  "React Developer",
  "UI Focused Developer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentRole = roles[roleIndex];

  useEffect(() => {
    const typingSpeed = isDeleting ? 45 : 90;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentRole.slice(0, typedText.length + 1);
        setTypedText(nextText);

        if (nextText === currentRole) {
          setTimeout(() => setIsDeleting(true), 1400);
        }
      } else {
        const nextText = currentRole.slice(0, typedText.length - 1);
        setTypedText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setRoleIndex((previous) => (previous + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentRole]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 py-16 md:grid-cols-2">
        {/* متن سمت چپ */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-cyan-300"
          >
            Welcome to my portfolio
          </motion.p>

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-linear-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Mobin
            </span>
          </h1>

          <div className="mt-5 flex min-h-9 items-center text-xl font-medium text-slate-300 sm:text-2xl">
            <span>I&apos;m a&nbsp;</span>

            <span className="text-cyan-300">
              {typedText}
              <span className="ml-1 inline-block h-6 w-0.5 animate-pulse bg-cyan-300 align-middle" />
            </span>
          </div>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            I build fast, responsive, and modern web experiences using Next.js,
            React, TypeScript, Tailwind CSS, and thoughtful UI design.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              View My Projects
            </a>

            <a
              href="#contact"
              className="glass rounded-xl px-6 py-3 font-medium text-white transition hover:-translate-y-1 hover:border-cyan-300/60"
            >
              Contact Me
            </a>
            <a
              href="/resume.pdf"
              download
              className="glass rounded-xl px-6 py-3 font-medium text-white transition hover:-translate-y-1 hover:border-cyan-300/60"
            >
              Download CV
            </a>
          </div>
        </motion.div>

        {/* آواتار، کارت شناور و Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* نور پشت تصویر */}
          <div className="absolute -inset-10 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-violet-500/25 blur-3xl" />

          {/* کارت اصلی */}
          <div className="glass glow relative overflow-hidden rounded-4xl p-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/avatar.png"
                alt="Your Name"
                fill
                priority
                className="object-cover"
              />

              {/* گرادینت پایین عکس */}
              <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/85 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6">
                <p className="text-lg font-semibold text-white">Your Name</p>
                <p className="mt-1 text-sm text-cyan-300">
                  Next.js & React Developer
                </p>
              </div>
            </div>
          </div>

          {/* کارت شناور اول */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="glass glow absolute -left-7 top-12 rounded-2xl px-4 py-3"
          >
            <p className="text-xs text-slate-400">Main Stack</p>
            <p className="mt-1 text-sm font-semibold text-white">
              Next.js + TypeScript
            </p>
          </motion.div>

          {/* کارت شناور دوم */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="glass glow absolute -bottom-6 -right-5 rounded-2xl px-4 py-3"
          >
            <p className="text-xs text-slate-400">Focused On</p>
            <p className="mt-1 text-sm font-semibold text-cyan-300">
              Clean UI & UX
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* دکمه Scroll Down */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 transition hover:text-cyan-300"
      >
        Scroll Down

        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-9 w-6 justify-center rounded-full border border-cyan-300/50 pt-2"
        >
          <span className="h-2 w-1 rounded-full bg-cyan-300" />
        </motion.span>
      </motion.a>
    </section>
  );
}
