import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { EXPERIENCE } from "@/lib/site";

export function ExperienceSection() {
  return (
    <Section id="experience">
      <SectionHeading eyebrow="09 / Experience" title="Timeline" />
      <ol className="mt-12 space-y-4 border-l border-border pl-6 sm:pl-8">
        {EXPERIENCE.map((item, index) => (
          <Reveal as="li" key={item.role} delay={index * 80} className="relative">
            <span
              className="absolute -left-[1.85rem] top-7 h-2 w-2 rounded-full bg-primary shadow-glow sm:-left-[2.35rem]"
              aria-hidden="true"
            />
            <div className="card-surface card-interactive p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{item.role}</h3>
                <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground">
                  {item.meta}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              {item.points.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
