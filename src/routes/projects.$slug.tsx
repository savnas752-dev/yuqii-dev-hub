import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Section } from "@/components/SectionHeading";
import type { ProjectRow } from "@/lib/queries";

type ProjectImage = {
  id: string;
  image_key: string;
  image_url: string | null;
  caption: string | null;
};

function projectQuery(slug: string) {
  return queryOptions({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const project = data as ProjectRow;
      const { data: images, error: imagesError } = await supabase
        .from("project_images")
        .select("id, image_key, image_url, caption")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true });
      if (imagesError) throw imagesError;
      return { project, images: (images ?? []) as ProjectImage[] };
    },
  });
}

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!result) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Project — ${params.slug} | Yuqii` },
      {
        name: "description",
        content: "Minecraft mod and technical project details: overview, features, and downloads.",
      },
      { property: "og:title", content: `Project — ${params.slug} | Yuqii` },
      {
        property: "og:description",
        content: "Minecraft mod and technical project details: overview, features, and downloads.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetail,
});

function Block({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <div className="card-surface p-6">
      <p className="label-mono">{title}</p>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(projectQuery(slug));
  if (!data) return null;
  const { project, images } = data;

  const meta = [
    ["Category", project.category],
    ["Minecraft Version", project.minecraft_version],
    ["Mod Loader", project.mod_loader],
    ["Release", project.release_info],
  ].filter(([, value]) => Boolean(value));

  const links = [
    ["GitHub", project.github_url],
    ["Download", project.download_url],
    ["Demo", project.demo_url],
  ].filter(([, url]) => Boolean(url));

  return (
    <main className="pt-28">
      <Section id="project">
        <Link to="/" hash="projects" className="label-mono text-primary hover:text-foreground">
          ← Back to projects
        </Link>
        <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">{project.name}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {project.short_description}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <ImagePlaceholder
            label={project.image_key}
            src={project.image_url}
            alt={`${project.name} preview`}
          />
          <div className="card-surface p-6">
            <p className="label-mono">Technical Info</p>
            <dl className="mt-4 space-y-3 font-mono text-xs">
              {meta.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
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
            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {links.map(([label, url]) => (
                  <a
                    key={label}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Block title="Overview" body={project.overview} />
          {project.features.length > 0 && (
            <div className="card-surface p-6">
              <p className="label-mono">Features</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {project.features.map((feature) => (
                  <li key={feature}>· {feature}</li>
                ))}
              </ul>
            </div>
          )}
          <Block title="Technical Challenges" body={project.challenges} />
          <Block title="How It Was Solved" body={project.solutions} />
          <Block title="What Was Learned" body={project.learnings} />
          <Block title="Changelog" body={project.changelog} />
        </div>

        <div className="mt-10">
          <p className="label-mono">Screenshots</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(images.length > 0
              ? images
              : [
                  { id: "a", image_key: "PROJECT_SCREENSHOT_1", image_url: null, caption: null },
                  { id: "b", image_key: "PROJECT_SCREENSHOT_2", image_url: null, caption: null },
                  { id: "c", image_key: "PROJECT_SCREENSHOT_3", image_url: null, caption: null },
                ]
            ).map((image) => (
              <figure key={image.id}>
                <ImagePlaceholder
                  label={image.image_key}
                  src={image.image_url}
                  alt={image.caption ?? `${project.name} screenshot`}
                />
                {image.caption && (
                  <figcaption className="mt-2 font-mono text-[0.65rem] text-muted-foreground">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
