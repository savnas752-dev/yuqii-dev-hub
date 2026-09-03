import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function About({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading eyebrow="01 / About" title="Building from the ground up." />
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 90}>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
