import { Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { DevlogRow } from "@/lib/queries";

export function DevlogSection({ posts }: { posts: DevlogRow[] }) {
  return (
    <Section id="devlog">
      <SectionHeading
        eyebrow="07 / Writing"
        title="Devlog"
        description="Development notes and technical write-ups. New posts can be added any time."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.id} delay={index * 80}>
            <article className="card-surface card-interactive group flex h-full flex-col overflow-hidden">
              <div className="p-3">
                <ImagePlaceholder
                  label={post.image_key}
                  src={post.image_url}
                  alt={`${post.title} cover`}
                />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-3">
                <div className="flex items-center gap-3 font-mono text-[0.65rem] tracking-widest text-muted-foreground">
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.reading_minutes} MIN READ</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.62rem] text-muted-foreground"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/devlog/$slug"
                  params={{ slug: post.slug }}
                  className="mt-5 text-sm font-medium text-primary transition-colors hover:text-foreground"
                >
                  Read post →
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
