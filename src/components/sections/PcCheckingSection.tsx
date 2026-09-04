import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { PC_CHECKING } from "@/lib/site";

export function PcCheckingSection() {
  return (
    <Section id="pc-checking" className="pt-0">
      <SectionHeading
        eyebrow="06 / Technical"
        title="Minecraft PC Checking"
        description="I perform Minecraft PC checking to help identify unauthorized modifications and cheats, using trusted third-party tools alongside manual investigation of files, logs, and system behavior."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PC_CHECKING.map((item, index) => (
          <Reveal key={item.title} delay={index * 60}>
            <article className="card-surface card-interactive h-full p-6">
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
