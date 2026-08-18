import { siteConfig } from "@/config/site";

export const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "UI/UX",
];

export const projects = [
  {
    title: "E-Commerce UI",
    desc: "A modern online store interface with smooth UX and modular architecture.",
    tech: ["Next.js", "Tailwind", "TypeScript"],
  },
  {
    title: "Portfolio Website",
    desc: "A glassmorphism-based personal portfolio with animated transitions.",
    tech: ["Framer Motion", "React", "CSS"],
  },
  {
    title: "Dashboard Design",
    desc: "An admin dashboard focused on clarity, hierarchy, and performance.",
    tech: ["Next.js", "Charts", "UI Design"],
  },
];

export const name = "Mobin";
export const title = "Computer Engineering Student";
export const specialization = "Frontend Development";
export const bio = "A passionate Computer Science student specializing in Frontend Development, focused on building modern web experiences.";

export const aboutPoints = [
  "Computer Engineering student focused on designing modern, responsive, and user-friendly interfaces.",
  "I love building fast, performant websites with excellent UX and smooth animations.",
  "Currently working on modern web applications with a focus on clean code and innovative designs.",
];

export const timeline = [
  {
    year: "2024 - Present",
    title: "Frontend Developer & Student",
    company: "Computer Engineering - University",
    desc: "Building modern interfaces with Next.js, Tailwind CSS, and Framer Motion while pursuing Computer Engineering degree.",
  },
  {
    year: "2023 - 2024",
    title: "Frontend Development",
    company: "Self-Learning & Projects",
    desc: "Focused on component architecture, responsive design, and advanced animation techniques.",
  },
  {
    year: "2022 - 2023",
    title: "Web Development Learning",
    company: "Self-Learning",
    desc: "Learned HTML, CSS, JavaScript, React, and modern frontend development workflows.",
  },
];

export const contacts = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    label: "LinkedIn",
    value: siteConfig.linkedin,
    href: siteConfig.linkedin,
  },
  {
    label: "GitHub",
    value: siteConfig.github,
    href: siteConfig.github,
  },
];
