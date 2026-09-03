import { Wrench } from "lucide-react";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TOOLS } from "@/lib/site";

export function ToolsSection() {
  return (
    <Section id="tools" className="pt-0">
      <SectionHeading
        eyebrow="08 / Tools"
        title="Tools I may build"
        description="None of these are implemented yet — each one is marked Coming Soon until it actually works."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool, index) => (
          <Reveal key={tool.name} delay={index * 60}>
            <article className="card-surface h-full p-6 opacity-90">
              <Wrench className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-5 text-base font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
              <span className="mt-5 inline-block rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.62rem] tracking-widest text-muted-foreground">
                COMING SOON
              </span>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
