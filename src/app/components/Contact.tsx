"use client";

import { motion } from "framer-motion";
import { contacts } from "../data/portfolio";
import { Mail, Send } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-3xl font-bold text-white"
        >
          Contact
        </motion.h3>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass glow rounded-3xl p-8"
          >
            <h4 className="text-2xl font-semibold text-white">
              Let’s work together
            </h4>
            <p className="mt-4 leading-8 text-slate-300">
              If you have a project, internship, or job opportunity, feel free
              to reach out. I’m always open to meaningful collaborations.
            </p>

            <div className="mt-8 space-y-4">
              {contacts.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/5"
                >
                  <p className="text-sm text-cyan-300">{item.label}</p>
                  <p className="mt-1">{item.value}</p>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass glow rounded-3xl p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Message</label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                  placeholder="Write your message..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                <Send size={18} />
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
