export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  glowColor: string;
  demoUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "QuantumFlow: SaaS Dashboard",
    description: "A modern analytics dashboard with powerful charts, user insights, and clean UI.",
    image: "/projects/dashboard.png",
    tags: ["Next.js", "Tailwind", "Charts"],
    glowColor: "rgba(34, 211, 238, 0.35)",
    demoUrl: "https://your-demo-link.com",
    githubUrl: "https://github.com/yourname/quantumflow",
  },
  {
    id: 2,
    title: "Vertex E-Commerce: Online Store",
    description: "A fast and scalable online store interface with product cards and smooth interactions.",
    image: "/projects/ecommerce.png",
    tags: ["React", "TypeScript", "UI"],
    glowColor: "rgba(168, 85, 247, 0.35)",
    demoUrl: "https://your-demo-link.com",
    githubUrl: "https://github.com/yourname/vertex-store",
  },
  {
    id: 3,
    title: "Nevus API: Microservices",
    description: "A backend-focused project showcasing modular architecture and API integration.",
    image: "/projects/backend.png",
    tags: ["Node.js", "API", "Microservices"],
    glowColor: "rgba(59, 130, 246, 0.35)",
    demoUrl: "https://your-demo-link.com",
    githubUrl: "https://github.com/yourname/nevus-api",
  },
];
