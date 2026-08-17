"use client";

import { motion } from "framer-motion";
import { timeline } from "../data/portfolio";

export default function Timeline() {
  return (
    <section id="resume" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-3xl font-bold text-white"
        >
          Resume Timeline
        </motion.h3>

        <div className="relative border-l border-cyan-400/30 pl-6 md:pl-10">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year + item.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12 }}
              viewport={{ once: true }}
              className="relative mb-10"
            >
              <div className="absolute -left-[34px] top-2 h-4 w-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

              <div className="glass glow rounded-2xl p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                  {item.year}
                </p>
                <h4 className="mt-2 text-xl font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-slate-400">{item.company}</p>
                <p className="mt-4 leading-7 text-slate-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
