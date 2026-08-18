"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { skillsData, type Skill } from "../data/skills";
import { X } from "lucide-react";

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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
          {skillsData.map((skill, index) => (
            <motion.button
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedSkill(skill)}
              className="glass glow rounded-2xl p-6 text-lg font-medium text-slate-100 text-left transition cursor-pointer hover:border-cyan-300/40"
            >
              <span>{skill.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skill Details Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="glass glow relative w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-900/90 p-8 backdrop-blur-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="mb-3 inline-block rounded-full bg-cyan-400/20 px-3 py-1 text-sm font-medium text-cyan-300">
                  {selectedSkill.category}
                </div>
                <h2 className="text-4xl font-bold text-white">
                  {selectedSkill.name}
                </h2>
                <p className="mt-2 text-sm text-cyan-300">
                  {selectedSkill.experience}
                </p>
              </div>

              {/* Description */}
              <p className="mb-8 text-lg leading-relaxed text-slate-300">
                {selectedSkill.description}
              </p>

              {/* Features */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  Key Features
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedSkill.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span className="text-sm text-slate-200">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
