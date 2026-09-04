import { createFileRoute } from "@tanstack/react-router";

type DiscordUser = {
  id: string;
  username: string;
  global_name?: string | null;
  discriminator?: string;
  avatar?: string | null;
};

function fail(origin: string, message: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/auth/callback?error=${encodeURIComponent(message)}`,
      "Set-Cookie": "yuqii_oauth_state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
    },
  });
}

export const Route = createFileRoute("/api/public/auth/discord/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const origin = url.origin;
        const clientId = process.env["1545449273053683813"];
        const clientSecret = process.env["_2fZSMWSAWxKAASxMEVmJK5RpK_Hcuze"];
        if (!clientId || !clientSecret) return fail(origin, "Discord sign-in is not configured.");

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        if (!code || !state) return fail(origin, "Sign-in was cancelled.");

        const cookieHeader = request.headers.get("cookie") ?? "";
        const raw = cookieHeader
          .split(";")
          .map((part) => part.trim())
          .find((part) => part.startsWith("yuqii_oauth_state="))
          ?.slice("yuqii_oauth_state=".length);
        if (!raw) return fail(origin, "Sign-in session expired. Please try again.");
        const [cookieState, encodedNext] = raw.split(".");
        if (!cookieState || cookieState !== state) {
          return fail(origin, "Sign-in verification failed. Please try again.");
        }
        const next = decodeURIComponent(encodedNext ?? "%2F");

        // 1. Exchange the code for a Discord access token (server-side only).
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "authorization_code",
            code,
            redirect_uri: `${origin}/api/public/auth/discord/callback`,
          }),
        });
        if (!tokenRes.ok) return fail(origin, "Discord rejected the sign-in.");
        const token = (await tokenRes.json()) as { access_token?: string };
        if (!token.access_token) return fail(origin, "Discord did not return a token.");

        // 2. Read the minimal Discord identity.
        const meRes = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${token.access_token}` },
        });
        if (!meRes.ok) return fail(origin, "Could not read your Discord profile.");
        const me = (await meRes.json()) as DiscordUser;

        const username = (me.global_name || me.username || "user").slice(0, 60);
        const avatarUrl = me.avatar
          ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=128`
          : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(me.id) % 5n)}.png`;
        const email = `discord_${me.id}@discord.local`;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 3. Find or create the matching account.
        const { data: existing } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("discord_id", me.id)
          .maybeSingle();

        let userId = existing?.id ?? null;
        if (!userId) {
          const created = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { discord_id: me.id, discord_username: username },
          });
          if (created.error || !created.data.user) {
            return fail(origin, "Could not create your account.");
          }
          userId = created.data.user.id;
        }

        await supabaseAdmin.from("profiles").upsert(
          {
            id: userId,
            discord_id: me.id,
            discord_username: username,
            avatar_url: avatarUrl,
          },
          { onConflict: "id" },
        );

        // 4. Mint a one-time link and hand only its hashed token to the browser.
        const link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });
        const hashed = link.data?.properties?.hashed_token;
        if (link.error || !hashed) return fail(origin, "Could not start your session.");

        const location = `${origin}/auth/callback?token_hash=${encodeURIComponent(hashed)}&next=${encodeURIComponent(next)}`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: location,
            "Set-Cookie": "yuqii_oauth_state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
          },
        });
      },
    },
  },
});
