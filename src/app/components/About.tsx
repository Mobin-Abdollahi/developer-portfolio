"use client";

import { motion } from "framer-motion";
import { aboutPoints } from "../data/portfolio";

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-3xl font-bold text-white"
        >
          About Me
        </motion.h3>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass glow rounded-3xl p-8"
          >
            <p className="text-lg leading-8 text-slate-300">
              I am a front-end developer who loves crafting elegant interfaces,
              smooth interactions, and modern digital experiences.
            </p>
          </motion.div>

          <div className="space-y-4">
            {aboutPoints.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-5 text-slate-200"
              >
                {point}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
