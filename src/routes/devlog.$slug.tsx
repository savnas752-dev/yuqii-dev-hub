import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Section } from "@/components/SectionHeading";
import type { DevlogRow } from "@/lib/queries";

function postQuery(slug: string) {
  return queryOptions({
    queryKey: ["devlog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devlog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as DevlogRow) ?? null;
    },
  });
}

export const Route = createFileRoute("/devlog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Devlog — ${params.slug} | Yuqii` },
      {
        name: "description",
        content: "Development notes on Minecraft mod development, Gradle builds and debugging.",
      },
      { property: "og:title", content: `Devlog — ${params.slug} | Yuqii` },
      {
        property: "og:description",
        content: "Development notes on Minecraft mod development, Gradle builds and debugging.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DevlogPost,
});

function DevlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;

  return (
    <main className="pt-28">
      <Section>
        <article className="mx-auto max-w-3xl">
          <Link to="/" hash="devlog" className="label-mono text-primary hover:text-foreground">
            ← Back to devlog
          </Link>
          <div className="mt-6 flex items-center gap-3 font-mono text-[0.68rem] tracking-widest text-muted-foreground">
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.reading_minutes} MIN READ</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.62rem] text-muted-foreground"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ImagePlaceholder
              label={post.image_key}
              src={post.image_url}
              alt={`${post.title} cover`}
            />
          </div>
          <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
            {post.content}
          </div>
        </article>
      </Section>
    </main>
  );
}
