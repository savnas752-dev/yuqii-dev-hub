import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SettingsMap = Record<string, Record<string, unknown>>;

export const DEFAULT_SETTINGS = {
  hero: {
    name: "Yuqii",
    headline: "Minecraft Developer • Builder • Technical Specialist",
    description:
      "I build Minecraft mods and technical projects with Java and Gradle, while also working with Minecraft and PC troubleshooting.",
    status: "Currently Building",
  },
  currently: {
    building: "Minecraft projects",
    learning: "PLACEHOLDER — Add what you are learning here.",
    focus: "Minecraft development",
    status: "Building",
  },
  stats: { projects: "00+", mods: "00+", years_building: "00+", current_status: "Building" },
  contact: { discord_username: "ittz.ozzy", discord_url: "https://discord.com/users/ittz.ozzy" },
  images: {} as Record<string, string | null>,
};

export type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  overview: string;
  features: string[];
  technologies: string[];
  minecraft_version: string | null;
  mod_loader: string | null;
  challenges: string | null;
  solutions: string | null;
  learnings: string | null;
  github_url: string | null;
  download_url: string | null;
  demo_url: string | null;
  release_info: string | null;
  changelog: string | null;
  image_key: string;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

export type DevlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_key: string;
  image_url: string | null;
  tags: string[];
  reading_minutes: number;
  published: boolean;
  published_at: string;
};

export type ReviewRow = {
  id: string;
  user_id: string;
  rating: number;
  body: string;
  status: "pending" | "approved" | "rejected" | "hidden";
  featured: boolean;
  created_at: string;
  updated_at: string;
  profiles?: { discord_username: string; avatar_url: string | null } | null;
};

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const map: SettingsMap = {};
    for (const row of data ?? []) {
      map[row.key as string] = (row.value ?? {}) as Record<string, unknown>;
    }
    return map;
  },
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ProjectRow[];
  },
});

export const devlogQuery = queryOptions({
  queryKey: ["devlog"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("devlog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as DevlogRow[];
  },
});

export const approvedReviewsQuery = queryOptions({
  queryKey: ["reviews", "approved"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(discord_username, avatar_url)")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ReviewRow[];
  },
});

export function myReviewQuery(userId: string | null) {
  return queryOptions({
    queryKey: ["reviews", "mine", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return (data as ReviewRow) ?? null;
    },
  });
}

/** Strips angle brackets so review text can never inject markup. */
export function sanitizeText(input: string) {
  return input.replace(/[<>]/g, "").replace(/\s{3,}/g, "  ").trim();
}
