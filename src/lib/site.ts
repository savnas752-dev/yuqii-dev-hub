/**
 * Static site content. Everything here is safe to edit by hand.
 * Editable-at-runtime content (hero, about, currently, stats, contact)
 * lives in the `site_settings` table and is managed from /admin.
 */

export const BRAND = {
  name: "Yuqii",
  tagline: "Minecraft Developer • Builder • Technical Specialist",
  discord: "ittz.ozzy",
  discordUrl: "https://discord.com/users/ittz.ozzy",
  year: 2026,
};

export const NAV_LINKS = [
  { label: "Home", href: "/", hash: "#top" },
  { label: "About", href: "/", hash: "#about" },
  { label: "Projects", href: "/", hash: "#projects" },
  { label: "Skills", href: "/", hash: "#skills" },
  { label: "Devlog", href: "/", hash: "#devlog" },
  { label: "PC Checking", href: "/", hash: "#pc-checking" },
  { label: "Reviews", href: "/", hash: "#reviews" },
  { label: "Contact", href: "/", hash: "#contact" },
] as const;

export const WORKFLOW = [
  {
    step: "01",
    title: "Idea",
    description: "Scoping the concept, deciding what the mod or tool actually needs to do.",
  },
  {
    step: "02",
    title: "Development",
    description: "Writing the Java implementation and structuring the project properly.",
  },
  {
    step: "03",
    title: "Gradle Build",
    description: "Configuring and running the Gradle build so the project compiles cleanly.",
  },
  {
    step: "04",
    title: "Testing",
    description: "Running it in-game to check the systems behave the way they should.",
  },
  {
    step: "05",
    title: "Debugging",
    description: "Reading logs and crash reports, isolating the cause and fixing it.",
  },
  {
    step: "06",
    title: "Release",
    description: "Packaging the build and documenting what changed.",
  },
];

export const SKILL_GROUPS = [
  {
    title: "Development",
    code: "DEV",
    skills: ["Java", "Minecraft Mod Development", "Gradle", "Git", "Software Development"],
  },
  {
    title: "Minecraft",
    code: "MC",
    skills: [
      "Minecraft Modding",
      "Mod Configuration",
      "Minecraft Troubleshooting",
      "Crash/Log Analysis",
      "Client/Mod Troubleshooting",
    ],
  },
  {
    title: "PC & Technical",
    code: "SYS",
    skills: [
      "PC Troubleshooting",
      "Software Troubleshooting",
      "Configuration Analysis",
      "Performance Analysis",
      "Technical Investigation",
    ],
  },
];

export const PC_CHECKING = [
  {
    title: "Minecraft Configuration",
    description: "Checking Minecraft-related configurations and setups.",
  },
  {
    title: "Mod & Client Troubleshooting",
    description: "Investigating problems involving mods, clients, and configurations.",
  },
  {
    title: "Crash & Log Analysis",
    description: "Looking through logs and crash reports to identify technical issues.",
  },
  { title: "Performance Analysis", description: "Investigating performance-related issues." },
  { title: "PC Troubleshooting", description: "General technical troubleshooting." },
  {
    title: "Technical Investigation",
    description: "Analyzing technical problems and finding their root cause.",
  },
];

export const TOOLS = [
  { name: "Minecraft Log Analyzer", description: "Potential tool for reading Minecraft logs." },
  {
    name: "Mod Compatibility Checker",
    description: "Potential tool for checking mod compatibility.",
  },
  { name: "Configuration Checker", description: "Potential tool for reviewing configurations." },
  { name: "PC Diagnostic Tools", description: "Potential tooling for technical diagnostics." },
];

export const EXPERIENCE = [
  {
    role: "Active Service",
    meta: "DATES — EDITABLE",
    description:
      "Service experience that built transferable qualities carried into development work.",
    points: [
      "Discipline",
      "Teamwork",
      "Responsibility",
      "Reliability",
      "Problem solving",
      "Working under pressure",
      "Following procedures",
    ],
  },
  {
    role: "Minecraft Development",
    meta: "DATES — EDITABLE",
    description: "PLACEHOLDER — Add development experience details here.",
    points: ["Java", "Gradle", "Minecraft mod development"],
  },
  {
    role: "Future Experience",
    meta: "PLACEHOLDER",
    description: "PLACEHOLDER — Reserved for future development experience.",
    points: [],
  },
];
