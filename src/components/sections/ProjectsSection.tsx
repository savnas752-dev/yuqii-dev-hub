import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ProjectRow } from "@/lib/queries";

export function ProjectsSection({ projects }: { projects: ProjectRow[] }) {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="03 / Work"
        title="Featured Projects"
        description="Placeholder projects — descriptions, images, links and release info are all editable."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 80}>
            <article className="card-surface card-interactive group flex h-full flex-col overflow-hidden">
              <div className="p-3">
                <ImagePlaceholder
                  label={project.image_key}
                  src={project.image_url}
                  alt={`${project.name} preview`}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-3">
                <p className="label-mono">{project.category}</p>
                <h3 className="mt-2 text-xl font-semibold">{project.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.short_description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
                >
                  View project
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
