import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { SKILL_GROUPS } from "@/lib/site";

export function SkillsSection() {
  return (
    <Section id="skills">
      <SectionHeading eyebrow="05 / Stack" title="Technical skills" />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {SKILL_GROUPS.map((group, index) => (
          <Reveal key={group.title} delay={index * 80}>
            <article className="card-surface card-interactive h-full p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{group.title}</h3>
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-primary">
                  {group.code}
                </span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2.5 font-mono text-[0.78rem] text-muted-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
