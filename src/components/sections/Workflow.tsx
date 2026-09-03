import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { WORKFLOW } from "@/lib/site";

export function Workflow() {
  return (
    <Section id="workflow" className="pt-0">
      <SectionHeading
        eyebrow="04 / Process"
        title="Development workflow"
        description="Idea → Development → Gradle Build → Testing → Debugging → Release"
      />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKFLOW.map((step, index) => (
          <Reveal as="li" key={step.step} delay={index * 60}>
            <div className="card-surface card-interactive relative h-full overflow-hidden p-6">
              <span
                className="absolute right-5 top-4 font-mono text-4xl font-semibold text-border-strong"
                aria-hidden="true"
              >
                {step.step}
              </span>
              <span className="block h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
