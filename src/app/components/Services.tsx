"use client";

import { motion } from "framer-motion";
import { Code2, Smartphone, LayoutDashboard } from "lucide-react";

const services = [
  {
    title: "Front-End Development",
    icon: Code2,
    desc: "Building responsive and performant interfaces with React and Next.js.",
  },
  {
    title: "UI Implementation",
    icon: LayoutDashboard,
    desc: "Turning Figma designs into pixel-perfect, interactive interfaces.",
  },
  {
    title: "Responsive Design",
    icon: Smartphone,
    desc: "Designing for all screen sizes with clean layouts and smooth behavior.",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-3xl font-bold text-white"
        >
          Services
        </motion.h3>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass glow rounded-3xl p-6"
              >
                <Icon className="text-cyan-300" />
                <h4 className="mt-4 text-xl font-semibold text-white">
                  {service.title}
                </h4>
                <p className="mt-3 leading-7 text-slate-300">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
