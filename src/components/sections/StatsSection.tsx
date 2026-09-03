import { Reveal } from "@/components/Reveal";

export function StatsSection({
  stats,
}: {
  stats: { projects: string; mods: string; years_building: string; current_status: string };
}) {
  const items = [
    { label: "Projects", value: stats.projects },
    { label: "Mods", value: stats.mods },
    { label: "Years Building", value: stats.years_building },
    { label: "Current Status", value: stats.current_status },
  ];

  return (
    <section className="border-y border-border bg-surface/50">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 sm:px-8 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.label} delay={index * 70}>
            <p className="label-mono">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{item.value}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
