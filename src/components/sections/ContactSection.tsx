import { Section } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function ContactSection({
  discordUsername,
  discordUrl,
}: {
  discordUsername: string;
  discordUrl: string;
}) {
  return (
    <Section id="contact">
      <Reveal>
        <div className="card-surface relative overflow-hidden px-6 py-14 text-center sm:px-14 sm:py-20">
          <div
            className="grid-backdrop pointer-events-none absolute inset-0 opacity-50"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="label-mono">10 / Contact</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Let's build something.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Have a project, idea, or just want to talk Minecraft development?
            </p>

            <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md">
              <p className="label-mono">Discord</p>
              <p className="mt-2 font-mono text-lg text-primary">{discordUsername}</p>
            </div>

            <Button asChild size="lg" className="mt-8 shadow-glow">
              <a href={discordUrl} target="_blank" rel="noreferrer noopener">
                Contact on Discord
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
