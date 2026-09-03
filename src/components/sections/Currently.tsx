import { Hammer, BookOpen, Crosshair, Activity } from "lucide-react";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function Currently({
  building,
  learning,
  focus,
  status,
}: {
  building: string;
  learning: string;
  focus: string;
  status: string;
}) {
  const cards = [
    { icon: Hammer, label: "Currently Building", value: building },
    { icon: BookOpen, label: "Currently Learning", value: learning },
    { icon: Crosshair, label: "Current Focus", value: focus },
    { icon: Activity, label: "Status", value: `● ${status}` },
  ];

  return (
    <Section id="currently" className="pt-0">
      <SectionHeading
        eyebrow="02 / Currently"
        title="What I'm working on right now."
        description="Editable status cards — update these any time from the admin dashboard."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.label} delay={index * 70}>
            <article className="card-surface card-interactive h-full p-6">
              <card.icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              <p className="label-mono mt-5">{card.label}</p>
              <p className="mt-2 text-base font-medium leading-snug text-foreground">
                {card.value}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
