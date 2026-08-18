import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { siteConfig } from "@/config/site";


export default function sitemap(): MetadataRoute.Sitemap {
 
  const projectRoutes = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
