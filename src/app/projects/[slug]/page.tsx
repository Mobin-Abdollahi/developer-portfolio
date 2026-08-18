import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProjectBySlug, projects } from "../../data/projects";
import { ArrowLeft, ExternalLink } from "lucide-react";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [project.image],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: [project.image],
    },
  };
}

export default function ProjectDetailsPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);

  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-cyan-300 transition hover:text-cyan-200"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
        </div>
      </nav>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Project Header */}
          <div className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-cyan-400/20 px-4 py-1 text-sm text-cyan-300">
                {project.year}
              </span>
              <span className="text-sm text-slate-400">{project.role}</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-slate-300">
              {project.fullDescription}
            </p>
          </div>

          {/* Project Image */}
          <div className="mb-16 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <div className="relative aspect-video">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="mb-16 grid gap-8 md:grid-cols-3">
            {/* Info Cards */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Project Year
              </h3>
              <p className="text-2xl font-bold text-white">{project.year}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-300">
                My Role
              </h3>
              <p className="text-lg text-slate-200">{project.role}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-cyan-400"></div>
                <p className="text-lg text-slate-200">Completed</p>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-16 glass rounded-3xl p-8">
            <h2 className="mb-6 text-2xl font-bold">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold">Key Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-200">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 hover:shadow-cyan-500/30"
            >
              <ExternalLink size={20} />
              View Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3 font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-400/10"
            >
              <ExternalLink size={20} />
              View Source Code
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
