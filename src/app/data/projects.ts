// src/app/data/projects.ts

export type Project = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  year: string;
  role: string;
  features: string[];
};

export const projects: Project[] = [
  {
    id: 1,
    slug: "my-digikala-site",
    title: "My Digikala Site",
    shortDescription: "A professional e-commerce platform clone built with modern web technologies.",
    fullDescription: "A comprehensive e-commerce clone featuring product listings, cart management, and responsive UI components. Built with a focus on clean state management and scalable architecture.",
    image: "/projects/ecommerce.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/Mobin-Abdollahi/my-digikala-site",
    liveUrl: "#", // Add your demo link here
    year: "2026",
    role: "Full-Stack Developer",
    features: ["Cart management", "Product filtering", "Responsive design", "State management"],
  },
  {
    id: 2,
    slug: "tecblog",
    title: "TecBlog",
    shortDescription: "A cross-platform technical blog application.",
    fullDescription: "A technical blogging platform designed for sharing tutorials and knowledge. Built with Flutter, ensuring a consistent experience across mobile (Android/iOS) and web.",
    image: "/projects/backend.png",
    tags: ["Dart", "Flutter", "Cross-Platform"],
    githubUrl: "https://github.com/Mobin-Abdollahi/tecblog",
    liveUrl: "#",
    year: "2026",
    role: "Mobile/Web Developer",
    features: ["Article management", "Clean UI", "Cross-platform support", "Responsive layout"],
  },
  {
    id: 3,
    slug: "my-first-nextproject",
    title: "My First Next Project",
    shortDescription: "Initial exploration of Next.js App Router.",
    fullDescription: "An early-stage exploration project focusing on Next.js App Router and server-side component architecture.",
    image: "/projects/dashboard.png",
    tags: ["Next.js", "React", "CSS"],
    githubUrl: "https://github.com/Mobin-Abdollahi/my-first-nextproject",
    liveUrl: "#",
    year: "2026",
    role: "Front-End Developer",
    features: ["App Router implementation", "Basic routing", "Component modularity"],
  },
  {
    id: 4,
    slug: "snake-game",
    title: "Snake Game",
    shortDescription: "A classic interactive game implementation.",
    fullDescription: "A fun implementation of the classic Snake game using JavaScript, focusing on game logic and interactive UI rendering.",
    image: "/projects/dashboard.png",
    tags: ["JavaScript", "DOM Manipulation"],
    githubUrl: "https://github.com/Mobin-Abdollahi/snake-game",
    liveUrl: "#",
    year: "2026",
    role: "Developer",
    features: ["Game logic", "Event handling", "Interactive UI"],
  },
  {
    id: 5,
    slug: "quiz-app",
    title: "Quiz App",
    shortDescription: "A C++ based quiz application.",
    fullDescription: "A terminal-based or UI-focused quiz application designed to test logic and data structure knowledge using C++.",
    image: "/projects/backend.png",
    tags: ["C++", "Logic"],
    githubUrl: "https://github.com/Mobin-Abdollahi/quiz-App-",
    liveUrl: "#",
    year: "2025",
    role: "Software Developer",
    features: ["Quiz logic", "Input validation", "Score tracking"],
  },
  {
    id: 6,
    slug: "dependencies-app",
    title: "Dependencies Application",
    shortDescription: "A C++ tool for managing application dependencies.",
    fullDescription: "A utility application for managing and analyzing software dependencies, demonstrating C++ proficiency.",
    image: "/projects/backend.png",
    tags: ["C++"],
    githubUrl: "https://github.com/Mobin-Abdollahi/dipendecies_application",
    liveUrl: "#",
    year: "2025",
    role: "Developer",
    features: ["Dependency analysis", "File processing", "Data handling"],
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
