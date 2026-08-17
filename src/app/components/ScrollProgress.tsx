"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-999 h-1 w-full origin-left bg-linear-to-r from-cyan-400 via-sky-400 to-violet-500 shadow-[0_0_18px_rgba(34,211,238,0.7)]"
    />
  );
}
