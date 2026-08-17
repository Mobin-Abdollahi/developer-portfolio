"use client";

import { motion } from "framer-motion";

const skills = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"];

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-3xl font-bold text-white"
        >
          Skills
        </motion.h3>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="glass glow rounded-2xl p-6 text-lg font-medium text-slate-100"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
