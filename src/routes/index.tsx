import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Currently } from "@/components/sections/Currently";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { Workflow } from "@/components/sections/Workflow";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { PcCheckingSection } from "@/components/sections/PcCheckingSection";
import { DevlogSection } from "@/components/sections/DevlogSection";
import { ToolsSection } from "@/components/sections/ToolsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Terminal } from "@/components/Terminal";
import {
  DEFAULT_SETTINGS,
  devlogQuery,
  projectsQuery,
  settingsQuery,
  type SettingsMap,
} from "@/lib/queries";
import { ABOUT_PARAGRAPHS } from "@/lib/site";

const TITLE = "Yuqii — Minecraft Developer, Builder & Technical Specialist";
const DESCRIPTION =
  "Yuqii builds Minecraft mods and technical projects with Java and Gradle, and works with Minecraft and PC checking and troubleshooting.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function pick<T extends Record<string, unknown>>(
  settings: SettingsMap | undefined,
  key: string,
  fallback: T,
): T {
  return { ...fallback, ...((settings?.[key] ?? {}) as Partial<T>) } as T;
}

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: projects = [] } = useQuery(projectsQuery);
  const { data: devlogs = [] } = useQuery(devlogQuery);

  const hero = pick(settings, "hero", DEFAULT_SETTINGS.hero);
  const currently = pick(settings, "currently", DEFAULT_SETTINGS.currently);
  const stats = pick(settings, "stats", DEFAULT_SETTINGS.stats);
  const contact = pick(settings, "contact", DEFAULT_SETTINGS.contact);
  const images = pick(settings, "images", DEFAULT_SETTINGS.images);

  return (
    <main>
      <Hero
        name={hero.name}
        headline={hero.headline}
        description={hero.description}
        status={hero.status}
        discordUsername={contact.discord_username}
        heroImage={images["HERO_IMAGE"] ?? null}
        profileImage={images["PROFILE_IMAGE"] ?? null}
      />
      <StatsSection stats={stats} />
      <About paragraphs={ABOUT_PARAGRAPHS} />
      <Currently
        building={currently.building}
        learning={currently.learning}
        focus={currently.focus}
        status={currently.status}
      />
      <ProjectsSection projects={projects.filter((project) => project.published)} />
      <Workflow />
      <SkillsSection />
      <PcCheckingSection />
      <DevlogSection posts={devlogs.filter((post) => post.published)} />
      <ToolsSection />
      <ExperienceSection />
      <ReviewsSection />
      <ContactSection
        discordUsername={contact.discord_username}
        discordUrl={contact.discord_url}
      />
      <Terminal />
    </main>
  );
}
