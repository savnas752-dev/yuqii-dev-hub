import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/lib/site";

export function Hero({
  name,
  headline,
  description,
  status,
  discordUsername,
  heroImage,
  profileImage,
}: {
  name: string;
  headline: string;
  description: string;
  status: string;
  discordUsername: string;
  heroImage?: string | null;
  profileImage?: string | null;
}) {
  return (
    <section id="top" className="hero-surface relative overflow-hidden pt-28 sm:pt-36">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 sm:pb-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 font-mono text-[0.68rem] tracking-widest text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {status.toUpperCase()}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              <span className="text-glow">{name}</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 font-mono text-sm text-primary sm:text-base">{headline}</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          </Reveal>

          <Reveal delay={260} className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2 shadow-glow">
              <Link to="/" hash="projects">
                View Projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2 border border-border">
              <Link to="/" hash="contact">
                Contact
              </Link>
            </Button>
            <span className="font-mono text-xs text-muted-foreground">
              Discord: <span className="text-foreground">{discordUsername || BRAND.discord}</span>
            </span>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="card-surface relative overflow-hidden p-3">
            <ImagePlaceholder
              label="HERO_IMAGE"
              src={heroImage ?? null}
              alt="Yuqii hero image"
              ratio="4 / 5"
              className="w-full"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-border bg-card/85 px-3 py-2.5 backdrop-blur-md">
              <ImagePlaceholder
                label="PROFILE"
                src={profileImage}
                alt="Yuqii profile image"
                ratio="1 / 1"
                rounded="rounded-xl"
                className="w-11"
              />
              <div className="font-mono text-[0.68rem] leading-relaxed">
                <p className="text-foreground">PROFILE_IMAGE</p>
                <p className="text-muted-foreground">Replace later</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
