export type Skill = {
  name: string;
  category: "frontend" | "backend" | "tools" | "design";
  description: string;
  experience: string;
  features: string[];
};

export const skillsData: Skill[] = [
  {
    name: "Next.js",
    category: "frontend",
    description:
      "A powerful React framework for building full-stack web applications with server-side rendering, static generation, and API routes. Perfect for creating performant and scalable modern web apps.",
    experience: "2+ years",
    features: [
      "Server-side rendering (SSR)",
      "Static site generation (SSG)",
      "API routes",
      "Image optimization",
      "Dynamic routing",
    ],
  },
  {
    name: "React",
    category: "frontend",
    description:
      "A JavaScript library for building user interfaces with reusable components. React makes it easy to create interactive and dynamic web applications with a declarative approach.",
    experience: "2.5+ years",
    features: [
      "Component-based architecture",
      "Hooks and state management",
      "Context API",
      "React Router",
      "Performance optimization",
    ],
  },
  {
    name: "TypeScript",
    category: "frontend",
    description:
      "A superset of JavaScript that adds static typing. TypeScript helps catch errors early, improves code quality, and makes large-scale projects more maintainable.",
    experience: "2+ years",
    features: [
      "Type safety",
      "Interfaces and types",
      "Generics",
      "Decorators",
      "Module system",
    ],
  },
  {
    name: "Tailwind CSS",
    category: "design",
    description:
      "A utility-first CSS framework that enables rapid UI development. Build responsive, modern designs without leaving your HTML with pre-built utility classes.",
    experience: "2+ years",
    features: [
      "Utility-first approach",
      "Responsive design",
      "Dark mode support",
      "Custom configuration",
      "Animation utilities",
    ],
  },
  {
    name: "Framer Motion",
    category: "frontend",
    description:
      "A powerful animation library for React that makes it simple to create smooth, delightful animations and interactions without complex keyframe logic.",
    experience: "1.5+ years",
    features: [
      "Gesture animations",
      "Layout animations",
      "Exit animations",
      "Drag gestures",
      "Smooth transitions",
    ],
  },
  {
    name: "Node.js",
    category: "backend",
    description:
      "A JavaScript runtime built on Chrome's V8 engine for building fast, scalable server-side applications. Perfect for creating APIs and real-time applications.",
    experience: "1.5+ years",
    features: [
      "Event-driven architecture",
      "Non-blocking I/O",
      "Express.js frameworks",
      "RESTful APIs",
      "Database integration",
    ],
  },
];
